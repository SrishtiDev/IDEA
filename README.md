# HireOrbit — AI Resume Analyzer & Enhancer

HireOrbit analyzes your resume against any job description using a 
3-model AI pipeline and gives you a job-ready, ATS-optimized resume 
as a downloadable PDF.

## What it does
- Upload your resume (PDF) + paste a job description
- Get an ATS score (0-100) with detailed reasoning
- See exactly which keywords are missing from your resume
- Identify every section that could cause rejection and how to fix it
- Download a fully enhanced resume with all improvements applied

## Tech Stack
- Frontend: Next.js 14
- Backend: Java Spring Boot
- AI Pipeline: NVIDIA NIM APIs
  - nemotron-parse → extracts resume structure
  - Llama Nemotron Super 49B → ATS analysis & feedback
  - MiniMax M2.7 → generates enhanced resume as LaTeX
- PDF Generation: Tectonic (LaTeX compiler)

## Built by
Srishti Rawat — Semester VI, ABES Engineering College
