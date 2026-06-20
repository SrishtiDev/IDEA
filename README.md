# HireOrbit 🚀

> AI-powered resume optimization that thinks like an enterprise ATS.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-hire--orbit--weld.vercel.app-blue?style=for-the-badge)](https://hire-orbit-weld.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-SrishtiDev%2FHireOrbit-181717?style=for-the-badge&logo=github)](https://github.com/SrishtiDev/HireOrbit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

HireOrbit simulates the Applicant Tracking Systems (ATS) used by platforms like Workday — parsing your resume, scoring it against a job description, identifying keyword gaps, and generating a professionally formatted, ATS-optimized PDF. Powered by the Llama 3.3 70B model via Groq for ultra-fast, deterministic inference.

---

## ✨ Features

- **Enterprise ATS Simulation** — Mirrors real-world ATS workflows: resume parsing, keyword extraction, scoring, and gap analysis.
- **Lightning-Fast LLM Inference** — Powered by Groq and the Llama 3.3 70B model to instantly process resumes and provide real-time feedback.
- **Deterministic Resume Parsing** — Strict JSON schema enforcement ensures reliable extraction of skills, experience, education, projects, and keywords.
- **ATS Match Scoring** — Resume-to-job-description alignment score with missing keyword detection and actionable recommendations.
- **AI-Powered Resume Generation** — Dynamically generates ATS-optimized LaTeX resumes and exports them as polished PDFs.
- **Cloud PDF Compilation** — Uses a cloud-based LaTeX compilation API for reproducible, dependency-free document rendering.

---

## 🏗️ Architecture

```text
Resume + Job Description
            │
            ▼
 Llama 3.3 70B (via Groq)
  (Extraction & ATS Scoring)
            │
            ▼
  ATS Report + Suggestions
            │
            ▼
 Llama 3.3 70B (via Groq)
  (LaTeX Resume Generation)
            │
            ▼
  Cloud LaTeX API
    (ytotech.com)
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
| **AI Models** | Llama 3.3 70B Versatile (via Groq API) |
| **PDF Pipeline** | Cloud LaTeX API (ytotech.com) |

---

## 📈 Workflow

```
1. Upload Resume
2. Paste Job Description
3. Extract Structured Candidate Data     ← Llama 3.3 70B (Groq)
4. Calculate ATS Match Score             ← Llama 3.3 70B (Groq)
5. Identify Missing Keywords
6. Generate Optimization Suggestions
7. Create ATS-Optimized LaTeX Resume     ← Llama 3.3 70B (Groq)
8. Compile & Download Professional PDF   ← Cloud LaTeX API
```

---

## ⚡ Key Engineering Challenges Solved

**Reliable LLM Output Parsing**
LLMs frequently return malformed or inconsistent JSON. HireOrbit enforces strict output schemas and validation layers to guarantee deterministic downstream processing regardless of model variability.

**High-Speed AI Inference**
Leveraged Groq's LPU inference engine with the Llama 3.3 70B model to deliver near-instantaneous resume parsing and generation, providing a snappy user experience.

**Scalable PDF Generation**
Shifted from local LaTeX compilation to a robust cloud-based compilation API, eliminating heavy host dependencies and ensuring byte-for-byte reproducible PDF output across all environments.

**ATS Optimization Logic**
Implemented keyword matching and gap detection algorithms that compare candidate profiles against job requirements and generate specific, prioritized improvement suggestions.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and npm
- **Docker & Docker Compose** (optional)

---

### Environment Variables

Create the following `.env` files before running the project.

**`backend/.env`**
```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_API_KEY_LATEX=your_groq_api_key_here
```

Get your API keys at [console.groq.com](https://console.groq.com).

**`frontend/.env.local`**
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8040
```

---

### Running the Project

#### Option A — Docker (Recommended)

From the project root:

```bash
docker-compose up --build
```

- Frontend → [http://localhost:3000](http://localhost:3000)
- Backend → [http://localhost:8040](http://localhost:8040)

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
