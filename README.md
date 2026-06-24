<<<<<<< HEAD
# DEA – Discovery & Execution Assistant

DEA is an intelligence engine built for the future of creation. It helps developers discover and execute personalized project ideas based on their specific tech stack. By leveraging multi-model AI workflows and real-time data, DEA empowers developers to overcome "coder's block" and start building meaningful projects.

## Features

- **Project Idea Generation:** Get curated, personalized project ideas instantly by inputting your preferred tech stack and theme.
- **Live GitHub Scraping:** Analyzes trending repositories on GitHub to provide up-to-date context and insights for modern software development.
- **AI-Powered Workflows:** Uses a secure, server-side multi-model LLM routing architecture (powered by NVIDIA NIM / OpenAI APIs) to parse requirements and return structured JSON responses.
- **Modern UI/UX:** A minimalist, highly aesthetic design built with Framer Motion, Next.js, and Tailwind CSS.

## Tech Stack

### Frontend
- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

### Backend
- **Express Server** (Decoupled Node.js backend running on port 5000)
- **AI Integration:** OpenAI SDK configured for external model inference (Llama 3.1 70B & Minimax).
- **Web Scraping:** Cheerio (for fetching live trending GitHub data)

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd DEA
   ```

2. Setup Backend:
   ```bash
   cd backend
   npm install
   # Create .env and .env.local with your API keys inside the backend folder
   npm start
   ```

3. Setup Frontend (in a new terminal):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `frontend/src/app` - Main application pages (App Router)
- `frontend/src/components` - Reusable UI components
- `backend/src/server.js` - Express backend entry point
- `backend/src/routes` - API route definitions
- `backend/src/controllers` - API logic and integrations

## Usage
1. Enter your tech stack (e.g., "React, Node.js, PostgreSQL").
2. Select a project theme (e.g., "Productivity", "Finance", "Social").
3. DEA's intelligence engine will analyze your inputs and present you with exactly 4 tailored, high-quality project concepts.
4. Check out the Explore and Trending pages for real-time inspiration scraped from GitHub.
=======
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
>>>>>>> 3e642ade40757e598ef5eefddd0ae27262e3804b
