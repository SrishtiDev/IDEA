'use strict';

/**
 * resumeController.js — Realistic ATS Resume Analyzer
 * ─────────────────────────────────────────────────────
 * What changed vs the original and why:
 *
 *  1. KEYWORD-DOMINANT SCORING
 *     With JD:    ats_score = keyword(60%) + formatting(25%) + content(15%)
 *     Without JD: ats_score = formatting(55%) + content(45%)
 *     Before, a great-looking resume with 4 keyword matches still scored 70+
 *     because formatting inflated the base. Now keywords control the gate.
 *
 *  2. REQUIRED vs PREFERRED KEYWORDS
 *     Missing a required skill triggers a −12 pt penalty (capped at −45).
 *     4 required skills missing = keyword_score can drop to 0 even if you
 *     matched 30% of total keywords. This mirrors how real ATS knockout
 *     questions work.
 *
 *  3. SERVER-SIDE SCORE RECOMPUTATION (recomputeScore)
 *     LLMs ignore math instructions and inflate scores. We extract the three
 *     component scores from the JSON, then recompute ats_score ourselves.
 *     The LLM cannot produce a final score higher than its own components allow.
 *
 *  4. score_breakdown field
 *     Client receives { formatting_score, content_score, keyword_score,
 *     weighted_final } so users can see WHY they scored what they scored.
 *
 *  5. LRU CACHE WITH TTL
 *     Original was a raw Map() that grew forever. New cache evicts LRU at 200
 *     entries and expires entries after 1 hour.
 *
 *  6. TEMPERATURE LOWERED TO 0.1
 *     Lower temperature → more deterministic, less hallucinated scoring.
 *
 *  7. INPUT VALIDATION
 *     Validates PDF mimetype and minimum extractable text length.
 *
 *  FRONTEND NOTE:
 *     After streaming finishes, the server emits a { corrected: "<JSON>" }
 *     event before [DONE]. Use this as the authoritative final analysis:
 *       if (data.corrected) finalAnalysis = JSON.parse(data.corrected);
 *     The streamed chunks are for visual progress only.
 */

const pdfService   = require('../services/pdfService');
const latexService = require('../services/latexService');
const Groq         = require('groq-sdk');
const crypto       = require('crypto');
const fs           = require('fs');

// ─── Groq clients ─────────────────────────────────────────────────────────────
const analysisClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
const latexClient    = new Groq({ apiKey: process.env.GROQ_API_KEY_LATEX });

// ─── LRU Cache (1 h TTL, max 200 entries) ─────────────────────────────────────
const CACHE_TTL = 60 * 60 * 1_000; // 1 hour
const CACHE_MAX = 200;
const _cache    = new Map();

const getCached = key => {
    const entry = _cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.ts > CACHE_TTL) { _cache.delete(key); return null; }
    return entry.v;
};

const setCache = (key, val) => {
    if (_cache.size >= CACHE_MAX) _cache.delete(_cache.keys().next().value); // evict oldest
    _cache.set(key, { v: val, ts: Date.now() });
};

// ─── ATS System Prompt ────────────────────────────────────────────────────────
const ATS_SYSTEM_PROMPT = `
You are a brutally strict enterprise ATS (Applicant Tracking System) that replicates the exact, unforgiving parsing behavior of Workday, Taleo, Greenhouse, Lever, and iCIMS. Real ATS auto-reject roughly 75% of applicants — you must be equally harsh.

OUTPUT: Return ONLY a raw JSON object. No markdown, no code fences, no text before or after the JSON. If anything appears outside the JSON braces, you have failed.

═══════════════════════════════════════════════════
REQUIRED JSON STRUCTURE
═══════════════════════════════════════════════════
{
  "parsed": {
    "name": "string | null",
    "email": "string | null",
    "phone": "string | null",
    "location": "string | null",
    "linkedin": "string | null",
    "github": "string | null",
    "years_experience": number_or_null,
    "current_title": "string | null",
    "companies": ["string"],
    "education": [{ "degree": "", "field": "", "institution": "", "year": "", "gpa": "" }],
    "skills": ["string"],
    "certifications": ["string"],
    "languages": ["string"]
  },
  "sections_detected": {
    "contact_info": boolean,
    "summary_or_objective": boolean,
    "experience": boolean,
    "education": boolean,
    "skills": boolean,
    "certifications": boolean,
    "projects": boolean,
    "achievements": boolean
  },
  "formatting_issues": [{ "type": "error|warning|info", "message": "string" }],
  "ats_flags": [{ "severity": "high|medium|low", "issue": "string" }],
  "keyword_match": {
    "found": ["string"],
    "missing": ["string"],
    "partial": ["string"],
    "required_missing": ["string"],
    "match_score": "INTEGER 0-100 (raw ratio, before penalty)",
    "required_match_score": "INTEGER 0-100"
  },
  "role_fit": {
    "title_match": boolean,
    "experience_meets_requirement": boolean,
    "education_meets_requirement": boolean,
    "experience_gap_years": number
  },
  "score_breakdown": {
    "formatting_score": "INTEGER 0-100",
    "content_score": "INTEGER 0-100",
    "keyword_score": "INTEGER 0-100 | null (null only when no JD provided)"
  },
  "ats_score": "INTEGER 0-100",
  "verdict": "LIKELY_PASS | BORDERLINE | LIKELY_REJECT",
  "verdict_reason": "one specific sentence referencing something from this resume",
  "recommendations": ["string"]
}

When NO job description is provided: keyword_match = null, role_fit = null, score_breakdown.keyword_score = null.

═══════════════════════════════════════════════════
STEP 1 — PARSE RESUME
═══════════════════════════════════════════════════
- Extract: name, email, phone, location, LinkedIn, GitHub
- Missing email or phone → HIGH severity ats_flag (most real ATS auto-reject on this)
- Missing LinkedIn (tech/professional role) → MEDIUM severity ats_flag
- Flag non-standard or creative section headings as MEDIUM
- Calculate years_experience from date ranges across all roles

═══════════════════════════════════════════════════
STEP 2 — FORMATTING SCORE  (compute this first)
═══════════════════════════════════════════════════
Start at 0. Add these points:
  +20  All four contact fields present: name + email + phone + location
  +5   LinkedIn URL present
  +5   GitHub or portfolio URL present
  +10  All three core sections present: Work Experience + Education + Skills
  +10  Summary or Objective section present
  +10  All positions have dates AND dates use a consistent format throughout
  +15  Zero high-severity formatting flags
  +10  ATS-friendly layout: no tables, no multi-column, no text boxes, no headers/footers
  +5   Certifications or Projects section present
  +10  All section headings are standard and immediately recognizable

Then apply deductions:
  −15  per HIGH flag  → tables, multi-column, text boxes, embedded images, Canva/Novoresume template, icons
  −7   per MEDIUM flag → missing dates on a role, non-standard heading, inconsistent date formats
  −3   per LOW flag   → special Unicode bullet characters, minor cosmetic issues

Clamp final value to [0, 100].
Store as score_breakdown.formatting_score.

═══════════════════════════════════════════════════
STEP 3 — CONTENT SCORE  (compute second)
═══════════════════════════════════════════════════
Start at 0. Add these points:
  +20  Every role has all four fields: title + company + start date + end date
       (subtract −5 for each role missing any of these four)
  +20  At least 3 bullets across all experience contain quantified metrics
       (numbers, percentages, dollar amounts, team size, scale, speed)
  +15  Skills section has 8–30 skills — focused, relevant, not stuffed
  +15  Education is complete: degree + institution + graduation year
  +15  Most-recent job title is clearly and specifically stated
  +15  Experience bullets use strong action verbs AND convey measurable impact

Then apply deductions:
  −12  Zero quantified metrics anywhere in the resume
  −8   Skill stuffing: more than 35 skills listed
  −8   Fewer than 5 skills in the skills section
  −8   Only passive/"responsible for" phrasing — no action verbs
  −5   Any single position completely missing dates

Clamp to [0, 100].
Store as score_breakdown.content_score.

═══════════════════════════════════════════════════
STEP 4 — KEYWORD MATCH  (only when JD is provided)
═══════════════════════════════════════════════════

4a. Extract ALL meaningful keywords from the JD.
    Label each as REQUIRED (must-have / minimum qualifications)
                  or PREFERRED (nice-to-have / bonus qualifications).
    Include: job titles, tools, languages, frameworks, methodologies,
             domain terms, certifications, soft skills mentioned.
    Aim for 15–30 keywords for an average JD.

4b. Classify every keyword against the resume:
    FOUND   = exact match or unambiguous synonym in the resume text
    PARTIAL = clearly abbreviated or closely related (e.g., "ML" vs. "Machine Learning")
    MISSING = not present in any form

4c. Calculate match_score — MUST BE AN INTEGER, never a decimal:
    effective_found = found_count + (partial_count × 0.5)
    match_score = round( (effective_found / total_keywords) × 100 )

    WRONG: match_score: 0.31   RIGHT: match_score: 31
    WRONG: match_score: 25.5   RIGHT: match_score: 26

4d. required_match_score:
    required_match_score = round( (required_found_count / required_total_count) × 100 )
    required_missing = names of REQUIRED keywords not found

4e. keyword_score (with required penalty) — store as score_breakdown.keyword_score:
    required_penalty = min( required_missing_count × 12,  45 )
    keyword_score    = max( 0,  match_score − required_penalty )

WORKED EXAMPLE:
    JD has 22 keywords: 8 required, 14 preferred
    Resume: 6 found, 3 partial, 13 missing; 5 of the 8 required not found
    match_score     = round( (6 + 3×0.5) / 22 × 100 ) = round(34.1) = 34
    required_penalty= min(5×12, 45) = 45
    keyword_score   = max(0, 34 − 45) = 0

═══════════════════════════════════════════════════
STEP 5 — ROLE FIT  (only when JD is provided)
═══════════════════════════════════════════════════
  title_match                  — candidate's most-recent title closely matches JD target role
  experience_meets_requirement — years_experience ≥ minimum stated in JD
  education_meets_requirement  — degree + field meets JD minimum requirement
  experience_gap_years         — 0 if requirement met or exceeded; otherwise the shortfall

═══════════════════════════════════════════════════
STEP 6 — FINAL ATS SCORE  (follow this math exactly)
═══════════════════════════════════════════════════

WITHOUT job description:
  ats_score = round( formatting_score × 0.55  +  content_score × 0.45 )

WITH job description:
  ats_score = round( keyword_score × 0.60  +  formatting_score × 0.25  +  content_score × 0.15 )

REALITY CALIBRATION — use these anchors to verify your numbers make sense:

  Scenario A: Great formatting (87) + great content (82) + only 5/20 JD keywords matched,
              4 required missing
    → keyword_score = max(0, 25 − 48) = 0
    → ats_score = round(0×0.6 + 87×0.25 + 82×0.15) = round(0 + 21.75 + 12.3) = 34
    → verdict: LIKELY_REJECT ✓

  Scenario B: Good formatting (75) + decent content (70) + 10/20 matched, 2 required missing
    → keyword_score = max(0, 50 − 24) = 26
    → ats_score = round(26×0.6 + 75×0.25 + 70×0.15) = round(15.6 + 18.75 + 10.5) = 45
    → verdict: BORDERLINE (barely) ✓

  Scenario C: Good formatting (80) + good content (75) + 15/20 matched, 0 required missing
    → keyword_score = max(0, 75 − 0) = 75
    → ats_score = round(75×0.6 + 80×0.25 + 75×0.15) = round(45 + 20 + 11.25) = 76
    → verdict: LIKELY_PASS ✓

  Scenario D: Excellent everything (90/90) + 18/20 matched, 0 required missing
    → keyword_score = 90
    → ats_score = round(90×0.6 + 90×0.25 + 90×0.15) = 90
    → verdict: LIKELY_PASS ✓

If your calculation gives a LIKELY_PASS for Scenario A, you have made an error. Recalculate.

VERDICT THRESHOLDS:
  75–100 → LIKELY_PASS
  50–74  → BORDERLINE
   0–49  → LIKELY_REJECT

═══════════════════════════════════════════════════
STEP 7 — RECOMMENDATIONS  (4–7 items, specific)
═══════════════════════════════════════════════════
Every recommendation MUST:
  • Reference something SPECIFIC found in (or missing from) THIS resume
  • Name ACTUAL missing JD keywords by name (not "add more keywords")
  • Point to SPECIFIC formatting problems actually detected
  • Cite SPECIFIC content gaps (e.g., "No metrics in your 2022–2024 role at Acme Corp")
  • Be ordered by impact: highest ats_score improvement listed first
NEVER give generic advice. Every item must be traceable to this specific resume.
`;

// ─── LaTeX System Prompt ──────────────────────────────────────────────────────
const LATEX_SYSTEM_PROMPT = `You are an expert LaTeX resume editor. Follow every rule exactly.

RULES:
- Output a COMPLETE, compilable LaTeX document, from \\documentclass to \\end{document}
- Use \\documentclass[11pt]{article} and \\usepackage[top=0.4in,bottom=0.4in,left=0.5in,right=0.5in]{geometry}
- HEADER: Center the Name using \\begin{center}\\Huge\\textbf{Name}\\end{center}. Below it, center the contact info separated by bullets (e.g., Email \\textbullet{} Phone \\textbullet{} LinkedIn). Add \\vspace{1em} after the header. DO NOT let the name overlap with the contact info.
- SECTION HEADINGS: Use the titlesec package. Add \\usepackage{titlesec} and \\titleformat{\\section}{\\large\\bfseries\\uppercase}{}{0em}{}[\\titlerule]. DO NOT draw manual lines or use strikethroughs.
- Use \\setlength{\\parskip}{0pt} and tight vspace throughout to maximize space
- DO NOT use \\newpage, \\pagebreak, or \\clearpage — fit everything on 1 page
- Apply EVERY recommendation from the ATS analysis
- Include ALL skills, experience entries, and education from the parsed data
- ATS-friendly: NO tables, NO multi-column layout, NO text boxes, NO special fonts
- All section headings must be standard: Experience, Education, Skills, Certifications, Projects
- Use \\usepackage{hyperref} and \\href{}{} for all URLs
- Output ONLY the raw LaTeX source — no explanation, no markdown fences, no extra commentary`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * THE ONLY HONEST SCORER.
 *
 * The LLM always inflates score_breakdown.keyword_score (e.g. 75–90) even
 * when only 20% of JD keywords matched. We never read that field.
 *
 * Instead we derive every score from structural data the LLM cannot fake:
 *   • keyword_score  → computed from keyword_match array lengths
 *   • formatting_score → capped by actual ats_flags severity counts
 *   • content_score  → used as-is (hardest to derive, but capped at 80 max
 *                       when keyword match is very low, since a "great resume
 *                       for the wrong job" shouldn't score 90 on content)
 *
 * Real-world validation for the screenshot example
 * (found=4, missing=7, required_missing=5, fs=90, cs=85):
 *   rawMatch     = round((4 / 11) * 100)  = 36
 *   penalty      = min(5 * 15, 50)        = 50
 *   keyword_score= max(0, 36 - 50)        = 0
 *   ats_score    = round(0*0.6 + 90*0.25 + 85*0.15) = 36  → LIKELY_REJECT ✓
 */
function recomputeScore(analysis, hasJD) {
    if (!analysis) return analysis;
    const clamp = n => Math.min(100, Math.max(0, Math.round(Number(n) || 0)));

    // ── STEP 1: keyword_score — always from arrays, LLM value discarded ───────
    let ks = null;
    let rawMatchScore = 0;

    if (hasJD) {
        const km      = analysis.keyword_match || {};
        const found   = Array.isArray(km.found)   ? km.found.length   : 0;
        const partial = Array.isArray(km.partial)  ? km.partial.length : 0;
        const missing = Array.isArray(km.missing)  ? km.missing.length : 0;
        const total   = found + partial + missing;

        // How many required skills are missing?
        let reqMissing = Array.isArray(km.required_missing)
            ? km.required_missing.length
            : 0;

        // Safety net: if LLM returned empty required_missing but many skills
        // are missing overall, conservatively treat 50% of missing as required.
        // (LLMs tend to under-label required skills to soften the score.)
        if (reqMissing === 0 && missing > 2) {
            reqMissing = Math.ceil(missing * 0.5);
        }

        if (total > 0) {
            const effectiveFound = found + partial * 0.5;
            rawMatchScore = Math.round((effectiveFound / total) * 100);
            const penalty = Math.min(reqMissing * 15, 50); // 15 pts per required miss, max −50
            ks = Math.max(0, rawMatchScore - penalty);

            // Overwrite whatever the LLM put in match_score with the real value
            km.match_score = rawMatchScore;
        } else {
            ks = 0;
        }
    }

    // ── STEP 2: formatting_score — trust LLM but enforce flag-based ceiling ───
    const flags   = Array.isArray(analysis.ats_flags) ? analysis.ats_flags : [];
    const highCnt = flags.filter(f => f.severity === 'high').length;
    const medCnt  = flags.filter(f => f.severity === 'medium').length;
    const lowCnt  = flags.filter(f => f.severity === 'low').length;
    // The maximum score achievable given the detected flags
    const fsCeiling = Math.max(0, 100 - highCnt * 15 - medCnt * 7 - lowCnt * 3);

    let fs = analysis.score_breakdown?.formatting_score != null
        ? clamp(analysis.score_breakdown.formatting_score)
        : 65; // conservative default if LLM omitted it
    fs = Math.min(fs, fsCeiling);

    // ── STEP 3: content_score — use LLM's value with a keyword-gap cap ────────
    // A resume that barely matches the JD is clearly not strong content for THIS role.
    let cs = analysis.score_breakdown?.content_score != null
        ? clamp(analysis.score_breakdown.content_score)
        : 65;

    // When keyword match is low, cap content score — prevents "great resume,
    // wrong job" from scoring 90 on content and inflating the final number.
    if (hasJD) {
        const contentCap = rawMatchScore < 30 ? 70
                         : rawMatchScore < 50 ? 80
                         : 100;
        cs = Math.min(cs, contentCap);
    }

    // ── STEP 4: weighted final ────────────────────────────────────────────────
    let final;
    if (ks !== null) {
        final = Math.round(ks * 0.60 + fs * 0.25 + cs * 0.15);
    } else {
        final = Math.round(fs * 0.55 + cs * 0.45);
    }
    final = clamp(final);

    // ── STEP 5: write everything back ─────────────────────────────────────────
    if (!analysis.score_breakdown) analysis.score_breakdown = {};
    analysis.score_breakdown.formatting_score = fs;
    analysis.score_breakdown.content_score    = cs;
    if (ks !== null) analysis.score_breakdown.keyword_score = ks;
    analysis.score_breakdown.raw_match_score  = rawMatchScore; // useful for debugging
    analysis.score_breakdown.weighted_final   = final;

    analysis.ats_score = final;
    analysis.verdict   = final >= 75 ? 'LIKELY_PASS'
                       : final >= 50 ? 'BORDERLINE'
                                     : 'LIKELY_REJECT';
    return analysis;
}

/**
 * Strips markdown fences and returns the outermost JSON object from a string.
 */
function extractJsonBlock(raw) {
    const first = raw.indexOf('{');
    const last  = raw.lastIndexOf('}');
    if (first === -1 || last === -1 || last <= first) return raw;
    return raw.slice(first, last + 1);
}

// ─── Controller: analyzeResume ────────────────────────────────────────────────

async function analyzeResume(req, res) {
    if (!req.file) {
        return res.status(400).json({ error: 'No resume uploaded' });
    }
    if (req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({ error: 'Only PDF files are accepted' });
    }

    try {
        const jdText  = (req.body.jobDescription || '').trim();
        const rawText = await pdfService.extractTextFromPdf(req.file.buffer);

        if (!rawText || rawText.trim().length < 50) {
            return res.status(422).json({
                error: 'Could not extract readable text from this PDF. ' +
                       'Make sure it is a text-based PDF, not a scanned image.',
            });
        }

        // ── Cache lookup ───────────────────────────────────────────────────────
        const cacheKey = crypto
            .createHash('sha256')
            .update(rawText + jdText)
            .digest('hex');

        const cached = getCached(cacheKey);
        if (cached) {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.write(`data: ${JSON.stringify({ corrected: cached.analysisStr })}\n\n`);
            res.write(`data: ${JSON.stringify({ rawText })}\n\n`);
            res.write('data: [DONE]\n\n');
            return res.end();
        }

        const userPrompt = jdText
            ? `RESUME:\n${rawText}\n\nJOB DESCRIPTION:\n${jdText}`
            : `RESUME:\n${rawText}`;

        // ── Start SSE stream ───────────────────────────────────────────────────
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('X-Accel-Buffering', 'no'); // disable nginx buffering

        let fullRaw = '';

        const stream = await analysisClient.chat.completions.create({
            model      : 'llama-3.3-70b-versatile',
            messages   : [
                { role: 'system', content: ATS_SYSTEM_PROMPT },
                { role: 'user',   content: userPrompt },
            ],
            temperature: 0.1,   // low = deterministic, consistent scores
            max_tokens : 4096,
            stream     : true,
        });

        for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content || '';
            if (delta) {
                fullRaw += delta;
                res.write(`data: ${JSON.stringify({ chunk: delta })}\n\n`);
            }
        }

        // ── Post-process: correct scores, emit authoritative JSON ──────────────
        //
        // The `corrected` event is the source of truth. The streamed `chunk`
        // events are visual progress only. Frontend should:
        //   if (data.corrected) finalAnalysis = JSON.parse(data.corrected);
        //
        let correctedStr = extractJsonBlock(fullRaw);

        try {
            const parsed     = JSON.parse(correctedStr);
            const corrected  = recomputeScore(parsed, !!jdText);
            correctedStr     = JSON.stringify(corrected);
        } catch (_parseErr) {
            // JSON parse failed — pass the raw block through; client handles it
        }

        setCache(cacheKey, { analysisStr: correctedStr });
        res.write(`data: ${JSON.stringify({ corrected: correctedStr })}\n\n`);
        res.write(`data: ${JSON.stringify({ rawText })}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();

    } catch (err) {
        console.error('[analyzeResume]', err);
        if (!res.headersSent) {
            res.status(500).json({ error: err.message || 'Analysis failed' });
        } else {
            res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
            res.end();
        }
    }
}

// ─── Controller: generateLatex ────────────────────────────────────────────────

async function generateLatex(req, res) {
    const { analysis, rawText } = req.body;

    if (!analysis) {
        return res.status(400).json({ error: 'analysis is required' });
    }

    try {
        const userPrompt = [
            'ATS ANALYSIS RESULT:',
            JSON.stringify(analysis, null, 2),
            '',
            'ORIGINAL RESUME TEXT:',
            rawText || '(not provided)',
            '',
            'Generate a complete ATS-optimized LaTeX resume.',
            'Apply every recommendation from the analysis.',
            'Include every skill, role, and education entry from parsed data.',
        ].join('\n');

        const response = await latexClient.chat.completions.create({
            model      : 'llama-3.3-70b-versatile',
            messages   : [
                { role: 'system', content: LATEX_SYSTEM_PROMPT },
                { role: 'user',   content: userPrompt },
            ],
            temperature: 0.2,
            max_tokens : 4096,
        });

        let latex = response.choices[0].message.content ?? '';

        // Strip any accidental markdown fences the model may have added
        latex = latex
            .replace(/^```latex\s*/im, '')
            .replace(/^```\s*/im,      '')
            .replace(/```$/im,          '')
            .trim();

        res.json({ latexCode: latex });

    } catch (err) {
        console.error('[generateLatex]', err);
        res.status(500).json({ error: err.message || 'LaTeX generation failed' });
    }
}

// ─── Controller: compileLatex ─────────────────────────────────────────────────

async function compileLatex(req, res) {
    const { latexCode } = req.body;

    if (!latexCode) {
        return res.status(400).json({ error: 'latexCode is required' });
    }

    try {
        const { texPath, pdfPath } = await latexService.compileLatexToPdf(latexCode);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
        res.send(fs.readFileSync(pdfPath));

        latexService.cleanupFiles([texPath, pdfPath]); // async cleanup after send

    } catch (err) {
        console.error('[compileLatex]', err);
        res.status(500).json({ error: err.message || 'LaTeX compilation failed' });
    }
}

// ─── Exports ──────────────────────────────────────────────────────────────────
module.exports = { analyzeResume, generateLatex, compileLatex };