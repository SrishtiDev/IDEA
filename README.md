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
