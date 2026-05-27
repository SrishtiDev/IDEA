package com.hireorbit.resumeanalyzer.controller;

import com.hireorbit.resumeanalyzer.service.LatexCompilerService;
import com.hireorbit.resumeanalyzer.service.PdfExtractService;
import com.hireorbit.resumeanalyzer.service.ResumeAnalysisService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allow frontend to communicate
public class AnalyzeController {

    private final ResumeAnalysisService resumeAnalysisService;
    private final PdfExtractService pdfExtractService;
    private final LatexCompilerService latexCompilerService;

    public AnalyzeController(ResumeAnalysisService resumeAnalysisService, 
                             PdfExtractService pdfExtractService, 
                             LatexCompilerService latexCompilerService) {
        this.resumeAnalysisService = resumeAnalysisService;
        this.pdfExtractService = pdfExtractService;
        this.latexCompilerService = latexCompilerService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<Map<String, String>> analyze(@RequestParam("resume") MultipartFile resume, 
                                                       @RequestParam("jd") String jd) {
        try {
            // 1. Extract text from PDF
            String rawText = pdfExtractService.extractText(resume);
            
            // 2. Parse into structured JSON
            String structuredJson = resumeAnalysisService.parseResumeText(rawText);
            
            // 3. Analyze against JD
            String analysisJson = resumeAnalysisService.analyzeAts(jd, structuredJson);
            
            return ResponseEntity.ok(Map.of(
                    "structuredResume", structuredJson,
                    "analysis", analysisJson
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/enhance")
    public ResponseEntity<Map<String, String>> enhance(@RequestBody Map<String, String> request) {
        try {
            String originalLatex = request.get("originalLatex");
            String analysisJson = request.get("analysisJson");
            
            String enhancedLatex = resumeAnalysisService.enhanceLatex(originalLatex, analysisJson);
            return ResponseEntity.ok(Map.of("enhancedLatex", enhancedLatex));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping(value = "/compile", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> compile(@RequestBody Map<String, String> request) {
        try {
            String latexCode = request.get("latexCode");
            byte[] pdfBytes = latexCompilerService.compileLatexToPdf(latexCode);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "enhanced_resume.pdf");
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
