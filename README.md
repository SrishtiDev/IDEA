# IDEA 💡

> Tell it your stack. Get real, buildable project ideas — scraped from GitHub, powered by AI.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-idea--gamma--azure.vercel.app-blue?style=for-the-badge)](https://idea-gamma-azure.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-SrishtiDev%2FIDEA-181717?style=for-the-badge&logo=github)](https://github.com/SrishtiDev/IDEA)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

IDEA is a Discovery & Execution Assistant (DEA) intelligence engine that takes your tech stack as input and generates curated, practical project ideas — enriched with live GitHub data scraped in real time. No vague suggestions. Just real, relevant project ideas tailored to what you already know.

---

## ✨ Features

- **AI-Powered Idea Generation** — Describe your stack, get a list of project ideas scoped to your skills and interests.
- **Live GitHub Scraping** — Uses Cheerio to scrape trending and relevant GitHub repositories, grounding suggestions in what developers are actually building.
- **Secure Server-Side LLM Routing** — All AI calls go through Next.js API routes, keeping API keys out of the browser.
- **Smooth Animated UI** — Framer Motion transitions make the experience feel fast and polished.
- **Zero Backend Infrastructure** — Fully serverless; deploys instantly on Vercel with no extra setup.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js, React, Tailwind CSS, Framer Motion |
| **AI** | OpenAI SDK (via Next.js API Routes) |
| **Scraping** | Cheerio (live GitHub data) |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and npm
- An **OpenAI API key** — get one at [platform.openai.com](https://platform.openai.com)

---

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/SrishtiDev/IDEA.git
cd IDEA

# 2. Install dependencies
npm install
```

---

### Environment Variables

Create a `.env.local` file in the project root:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

> API keys are only used server-side via Next.js API routes and are never exposed to the client.

---

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```text
IDEA/
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js App Router pages & layouts
│   ├── components/       # Reusable UI components
│   └── pages/api/        # Server-side API routes (LLM + scraping logic)
├── .env.local            # Environment variables (not committed)
├── next.config.mjs
└── package.json
```

---

## 📈 How It Works

```
User inputs tech stack
        │
        ▼
  Next.js API Route
  (server-side, secure)
        │
        ├──► Cheerio scrapes live GitHub data
        │
        └──► OpenAI SDK generates tailored ideas
                    │
                    ▼
         Animated idea cards rendered
           with Framer Motion
```

---

## 🔮 Future Improvements

- [ ] Filter ideas by difficulty (beginner / intermediate / advanced)
- [ ] Save and bookmark favourite ideas
- [ ] One-click GitHub repo scaffolding
- [ ] Collaborative idea boards
- [ ] Stack similarity matching (find what others built with your stack)
- [ ] Export ideas as a project brief PDF

---

## 👩‍💻 Author

**Srishti Rawat** — Full-Stack Developer focused on scalable backend systems, AI-powered applications, and production-ready software engineering.

[![GitHub](https://img.shields.io/badge/GitHub-SrishtiDev-181717?style=flat&logo=github)](https://github.com/SrishtiDev)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
