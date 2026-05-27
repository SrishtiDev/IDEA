package com.hireorbit.resumeanalyzer.service;

import org.springframework.stereotype.Service;

@Service
public class ResumeAnalysisService {

    private final NimApiService nimApiService;
    private final PdfExtractService pdfExtractService;

    public ResumeAnalysisService(NimApiService nimApiService, PdfExtractService pdfExtractService) {
        this.nimApiService = nimApiService;
        this.pdfExtractService = pdfExtractService;
    }

    public String parseResumeText(String rawText) {
        String systemPrompt = "Extract the resume into structured JSON with these fields:\n" +
                "{ name, email, phone, summary, experience: [{company, role, duration, bullets[]}], education: [{institution, degree, year}], skills: [], projects: [{name, description, bullets[]}], certifications: [] }\n" +
                "Return ONLY valid JSON, no explanation.";
        
        return nimApiService.callModel("nemotron-parse", systemPrompt, rawText);
    }

    public String analyzeAts(String jdText, String structuredResumeJson) {
        String systemPrompt = "You are a professional ATS resume analyst. Be precise and ruthless.";
        String userPrompt = "JOB DESCRIPTION:\n" + jdText + "\n\nSTRUCTURED RESUME (JSON):\n" + structuredResumeJson +
                "\n\nReturn ONLY this JSON, nothing else:\n" +
                "{\n" +
                "  \"ats_score\": <0-100>,\n" +
                "  \"ats_score_reason\": \"<2 sentence explanation>\",\n" +
                "  \"missing_keywords\": [\"keyword1\", \"keyword2\"],\n" +
                "  \"rejection_risks\": [\n" +
                "    { \"section\": \"<section name>\", \"issue\": \"<what will cause rejection>\", \"fix\": \"<exact fix>\" }\n" +
                "  ],\n" +
                "  \"bullet_rewrites\": [\n" +
                "    { \"original\": \"<original bullet>\", \"improved\": \"<improved bullet with metrics/impact>\" }\n" +
                "  ],\n" +
                "  \"overall_summary\": \"<3-4 sentence overall assessment>\"\n" +
                "}";

        return nimApiService.callModel("nvidia/llama-3.3-nemotron-super-49b-v1", systemPrompt, userPrompt);
    }

    public String enhanceLatex(String originalLatex, String analysisJson) {
        String systemPrompt = "You are a LaTeX resume editor. Follow rules strictly.\n" +
                "RULES:\n" +
                "- DO NOT change any LaTeX commands, packages, environments or formatting\n" +
                "- DO NOT add or remove sections\n" +
                "- DO NOT reorder anything\n" +
                "- ONLY modify text content inside existing fields based on the changes provided\n" +
                "- Preserve all spacing, alignment, \\begin{}, \\end{}, \\section{}, \\item exactly\n" +
                "- Output ONLY the complete corrected LaTeX source code, no explanation, no markdown fences";

        String userPrompt = "ORIGINAL LATEX:\n" + originalLatex + "\n\nCHANGES TO APPLY:\n" + analysisJson + "\n\nOUTPUT: full corrected LaTeX only.";

        String response = nimApiService.callModel("minimaxai/minimax-m2.7", systemPrompt, userPrompt);
        
        // Clean up markdown fences if the model ignores the prompt
        if (response.startsWith("```latex")) {
            response = response.substring(8);
        }
        if (response.startsWith("```")) {
            response = response.substring(3);
        }
        if (response.endsWith("```")) {
            response = response.substring(0, response.length() - 3);
        }
        return response.trim();
    }
}
