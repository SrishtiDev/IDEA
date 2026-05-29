const pdfService = require('../services/pdfService');
const aiService = require('../services/aiService');
const latexService = require('../services/latexService');

const ATS_SYSTEM_PROMPT = `You are a strict ATS (Applicant Tracking System) parser that replicates the exact parsing behavior of enterprise ATS platforms: Workday, Greenhouse, Taleo, Lever, and iCIMS.

When given a resume (and optionally a job description), you must analyze and return a JSON object only. No markdown, no backticks, no explanation. Raw JSON only.

Return this exact structure:

{
  "parsed": {
    "name": "extracted full name or null",
    "email": "extracted email or null",
    "phone": "extracted phone number or null",
    "location": "city, state/country or null",
    "linkedin": "LinkedIn URL or null",
    "github": "GitHub URL or null",
    "years_experience": null,
    "current_title": "most recent job title or null",
    "companies": ["company1", "company2"],
    "education": [
      { "degree": "", "field": "", "institution": "", "year": "", "gpa": "" }
    ],
    "skills": ["skill1", "skill2"],
    "certifications": ["cert1"],
    "languages": ["language1"]
  },
  "sections_detected": {
    "contact_info": true,
    "summary_or_objective": true,
    "experience": true,
    "education": true,
    "skills": true,
    "certifications": true,
    "projects": true,
    "achievements": false
  },
  "ats_score": 0,
  "verdict": "LIKELY_PASS",
  "verdict_reason": "one sentence explanation",
  "formatting_issues": [
    { "type": "error", "message": "specific issue description" }
  ],
  "ats_flags": [
    { "severity": "high", "issue": "description of ATS parsing problem" }
  ],
  "keyword_match": {
    "found": [],
    "missing": [],
    "partial": [],
    "match_score": 0
  },
  "recommendations": ["actionable fix 1", "actionable fix 2"]
}

If no job description is provided, set keyword_match to null.

PARSING RULES:

CONTACT & IDENTITY
- Extract name, email, phone, LinkedIn, GitHub, location from the top section
- Flag missing email or phone as high-severity ATS flags (auto-rejection risk)
- Flag missing LinkedIn as medium severity for tech/professional roles

SECTION DETECTION
- Detect standard ATS-recognized headings: Experience, Work Experience, Education, Skills, Certifications, Projects, Summary, Objective, Achievements
- Flag non-standard or creative headings as medium-severity
- Flag any section that is missing but expected for the role type

EXPERIENCE PARSING
- Extract company names, job titles, start/end dates for each role
- Calculate total years of experience from date ranges
- Flag inconsistent date formats as medium severity
- Flag missing dates entirely as high severity
- Flag experience descriptions with zero quantified metrics as a medium warning

EDUCATION PARSING
- Extract degree type, field of study, institution name, graduation year, GPA if present
- For candidates with less than 2 years of experience, flag missing GPA as a warning

SKILLS PARSING
- Extract all technical skills, tools, frameworks, languages, platforms
- Flag keyword stuffing (more than 40 skills) as medium severity

FORMATTING & STRUCTURE FLAGS
- Multi-column layout → high severity
- Tables used for layout → high severity
- Text inside headers/footers → high severity
- Text boxes or shapes → high severity
- Embedded images, logos, or icons → medium severity
- Non-standard Unicode symbols as bullet points → low severity
- Fancy templates (Canva, Novoresume) → high severity flag

ATS SCORE CALCULATION (0-100)
- Contact info complete: +15
- All core sections present: +15
- Standard section headings used: +10
- Dates consistent and present: +10
- Quantified achievements present: +10
- Skills section exists and populated: +10
- No formatting flags: +15
- ATS-parseable format: +10
- LinkedIn present: +5
Deduct: high flag (-10), medium flag (-5), low flag (-2). Cap 0-100.

VERDICT THRESHOLDS
- 70-100 → LIKELY_PASS
- 45-69 → BORDERLINE
- 0-44 → LIKELY_REJECT

KEYWORD MATCH (only if job description is provided)
- Extract all role-specific keywords from JD
- match_score = (found + 0.5 * partial) / total JD keywords * 100

RECOMMENDATIONS
- Always give 3-6 specific, actionable fixes based on what was actually found
- Do not give generic advice — every recommendation must reference something specific from this resume
- Prioritize fixes that will most improve ATS score`;

async function analyzeResume(req, res) {
    if (!req.file) {
        return res.status(400).json({ error: 'No resume uploaded' });
    }

    try {
        const jdText = req.body.jobDescription || null;

        // 1. Extract text from PDF
        const rawText = await pdfService.extractTextFromPdf(req.file.buffer);

        // 2. Single comprehensive ATS analysis call
        const userPrompt = jdText
            ? `RESUME:\n${rawText}\n\nJOB DESCRIPTION:\n${jdText}`
            : `RESUME:\n${rawText}`;

        const rawResult = await aiService.callNimApi(
            "nvidia/llama-3.3-nemotron-super-49b-v1",
            ATS_SYSTEM_PROMPT,
            userPrompt,
            process.env.NVIDIA_API_KEY_ANALYZE
        );

        // Clean any markdown fences just in case
        const cleaned = rawResult
            .replace(/^```json\s*/i, '')
            .replace(/^```\s*/i, '')
            .replace(/```$/i, '')
            .trim();

        // Validate it's parseable JSON before sending
        const parsed = JSON.parse(cleaned);

        res.json({ analysis: parsed, rawText });

    } catch (err) {
        console.error("Analysis Error:", err.message);
        res.status(500).json({ error: err.message || "An error occurred during analysis" });
    }
}

async function generateLatex(req, res) {
    try {
        const { analysis, rawText } = req.body;

        if (!analysis) {
            return res.status(400).json({ error: "Analysis data is required" });
        }

        const latexSystemPrompt = `You are an expert LaTeX resume editor. Follow rules strictly.
RULES:
- Output a complete, compilable LaTeX resume document
- Use the \\documentclass{article} with appropriate geometry and font packages
- Structure it with standard resume sections matching what was detected in the analysis
- Apply ALL recommendations from the ATS analysis
- Include ALL skills, experience, education from the parsed data
- Use clean, ATS-friendly formatting (no tables, no columns, no text boxes)
- Output ONLY the complete LaTeX source code, no explanation, no markdown fences`;

        const latexUserPrompt = `ATS ANALYSIS RESULT:\n${JSON.stringify(analysis, null, 2)}\n\nORIGINAL RESUME TEXT:\n${rawText || ''}\n\nGenerate a complete, ATS-optimized LaTeX resume based on the parsed data and applying all recommendations.`;

        let newLatex = await aiService.callNimApi(
            "minimaxai/minimax-m2.7",
            latexSystemPrompt,
            latexUserPrompt,
            process.env.MINIMAX_API_KEY
        );

        // Clean markdown fences
        newLatex = newLatex
            .replace(/^```latex\s*/i, '')
            .replace(/^```\s*/i, '')
            .replace(/```$/i, '')
            .trim();

        res.json({ latexCode: newLatex });

    } catch (err) {
        console.error("LaTeX Generation Error:", err.message);
        res.status(500).json({ error: err.message || "An error occurred while generating LaTeX" });
    }
}

async function compileLatex(req, res) {
    try {
        const { latexCode } = req.body;
        if (!latexCode) {
            return res.status(400).json({ error: 'LaTeX code is required' });
        }

        const { texPath, pdfPath } = await latexService.compileLatexToPdf(latexCode);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
        
        const fs = require('fs');
        const pdfBuffer = fs.readFileSync(pdfPath);
        res.send(pdfBuffer);

        // Cleanup after sending
        latexService.cleanupFiles([texPath, pdfPath]);

    } catch (err) {
        console.error('LaTeX Compile Error:', err.message);
        res.status(500).json({ error: err.message || 'Failed to compile LaTeX' });
    }
}

module.exports = {
    analyzeResume,
    generateLatex,
    compileLatex
};
