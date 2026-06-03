# HireOrbit 🚀

> AI-powered resume optimization that thinks like an enterprise ATS.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-hire--orbit--weld.vercel.app-blue?style=for-the-badge)](https://hire-orbit-weld.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-SrishtiDev%2FHireOrbit-181717?style=for-the-badge&logo=github)](https://github.com/SrishtiDev/HireOrbit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

HireOrbit simulates the Applicant Tracking Systems (ATS) used by platforms like Workday — parsing your resume, scoring it against a job description, identifying keyword gaps, and generating a professionally formatted, ATS-optimized PDF. Powered by a chained multi-model LLM pipeline.

---

## ✨ Features

- **Enterprise ATS Simulation** — Mirrors real-world ATS workflows: resume parsing, keyword extraction, scoring, and gap analysis.
- **Multi-Model AI Pipeline** — Three specialized models, each handling a distinct stage of the pipeline.
- **Deterministic Resume Parsing** — Strict JSON schema enforcement ensures reliable extraction of skills, experience, education, projects, and keywords.
- **ATS Match Scoring** — Resume-to-job-description alignment score with missing keyword detection and actionable recommendations.
- **AI-Powered Resume Generation** — Dynamically generates ATS-optimized LaTeX resumes and exports them as polished PDFs.
- **Dockerized PDF Compilation** — Tectonic LaTeX compiler containerized via Docker for reproducible, dependency-free document rendering.

---

## 🏗️ Architecture

```text
Resume + Job Description
            │
            ▼
    Llama 3.1 8B
  (Information Extraction)
            │
            ▼
  Structured JSON Output
            │
            ▼
 Llama 3.3 Nemotron 49B
  (ATS Analysis & Scoring)
            │
            ▼
  ATS Report + Suggestions
            │
            ▼
      MiniMax M2.7
  (LaTeX Resume Generation)
            │
            ▼
    Tectonic Compiler
         (Docker)
            │
            ▼
       Optimized PDF
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 14, React, TypeScript, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **AI Models** | Llama 3.1 8B, Llama 3.3 Nemotron 49B, MiniMax M2.7 (via NVIDIA NIM) |
| **PDF Pipeline** | Docker, Tectonic LaTeX Compiler, Node.js Child Processes |

---

## 📈 Workflow

```
1. Upload Resume
2. Paste Job Description
3. Extract Structured Candidate Data     ← Llama 3.1 8B
4. Calculate ATS Match Score             ← Llama 3.3 Nemotron 49B
5. Identify Missing Keywords
6. Generate Optimization Suggestions
7. Create ATS-Optimized LaTeX Resume     ← MiniMax M2.7
8. Compile & Download Professional PDF   ← Tectonic (Docker)
```

---

## ⚡ Key Engineering Challenges Solved

**Reliable LLM Output Parsing**
LLMs frequently return malformed or inconsistent JSON. HireOrbit enforces strict output schemas and validation layers to guarantee deterministic downstream processing regardless of model variability.

**Multi-Model Orchestration**
Designed a chained inference pipeline where the structured output of each model becomes the typed input of the next — enabling specialization (extraction → analysis → generation) without losing context between stages.

**Scalable PDF Generation**
Containerized the entire LaTeX compilation environment using Docker and Tectonic, eliminating host dependency issues and ensuring byte-for-byte reproducible PDF output across all deployments.

**ATS Optimization Logic**
Implemented keyword matching and gap detection algorithms that compare candidate profiles against job requirements and generate specific, prioritized improvement suggestions.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and npm
- **Docker & Docker Compose** (recommended)
- **Tectonic LaTeX engine** — only needed if running the backend locally without Docker (the Dockerfile handles this automatically)

---

### Environment Variables

Create the following `.env` files before running the project.

**`backend/.env`**
```env
NVIDIA_API_KEY_PARSE=your_nvapi_key_here
NVIDIA_API_KEY_ANALYZE=your_nvapi_key_here
MINIMAX_API_KEY=your_minimax_api_key_here
```

Get your NVIDIA NIM API keys at [build.nvidia.com](https://build.nvidia.com) and your MiniMax key at [minimaxi.com](https://www.minimaxi.com).

**`frontend/.env.local`**
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

---

### Running the Project

#### Option A — Docker (Recommended)

From the project root:

```bash
docker-compose up --build
```

- Frontend → [http://localhost:3000](http://localhost:3000)
- Backend → [http://localhost:8080](http://localhost:8080)

#### Option B — Local (Manual)

Make sure `tectonic` is installed on your system, then:

```bash
# Backend
cd backend
npm install
npm start

# Frontend (in a separate terminal)
cd frontend
npm install
npm run dev
```

---

## 🔮 Future Improvements

- [ ] Multiple resume templates
- [ ] Cover letter generation
- [ ] Recruiter feedback simulation
- [ ] Resume version tracking
- [ ] Interview question generation
- [ ] RAG-based company-specific ATS optimization

---

## 👩‍💻 Author

**Srishti Rawat** — Full-Stack Developer focused on scalable backend systems, AI-powered applications, and production-ready software engineering.

[![GitHub](https://img.shields.io/badge/GitHub-SrishtiDev-181717?style=flat&logo=github)](https://github.com/SrishtiDev)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
