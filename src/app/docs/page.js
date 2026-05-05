"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  BookOpen,
  Lightbulb,
  TrendingUp,
  Compass,
  Sparkles,
  HelpCircle,
  ChevronRight,
  Zap,
} from "lucide-react";

const sections = [
  { id: "what-is-dea", label: "What is DEA", icon: <BookOpen className="h-4 w-4" /> },
  { id: "getting-started", label: "Getting Started", icon: <Zap className="h-4 w-4" /> },
  { id: "pages-guide", label: "Pages Guide", icon: <Compass className="h-4 w-4" /> },
  { id: "tips", label: "Tips", icon: <Sparkles className="h-4 w-4" /> },
  { id: "faq", label: "FAQ", icon: <HelpCircle className="h-4 w-4" /> },
];

const faqs = [
  {
    q: "How is DEA different from ChatGPT?",
    a: "DEA is purpose-built for project discovery. Instead of open-ended conversation, it generates structured, buildable project ideas tailored to your exact tech stack, complete with architecture breakdowns and step-by-step implementation roadmaps.",
  },
  {
    q: "Can I use this for college projects?",
    a: "Absolutely. DEA is designed for students, indie hackers, and professional developers alike. It's a perfect tool for hackathons, capstone projects, or portfolio building.",
  },
  {
    q: "Is DEA free to use?",
    a: "Yes — DEA is completely free. The platform is powered by open-weight models via NVIDIA NIM, and we plan to keep the core experience free.",
  },
  {
    q: "What models power DEA?",
    a: "We use z-ai/glm4.7 for idea generation and architecture breakdowns, and minimaxai/minimax-m2.7 for explore guides. All models are served through NVIDIA's inference API.",
  },
  {
    q: "Where does the Trending data come from?",
    a: "Trending projects are scraped directly from GitHub's daily trending page in real-time, so you always see what the open-source community is most excited about right now.",
  },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("what-is-dea");
  const [openFaq, setOpenFaq] = useState(null);

  const scrollTo = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="absolute inset-0 overflow-y-auto pt-20 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex gap-8">

        {/* ── Sidebar (desktop) / Tab bar (mobile) ── */}
        <nav className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-24 space-y-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary/50 font-['Space_Grotesk'] font-bold mb-4 block px-3">
              Documentation
            </span>
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-['Space_Grotesk'] font-semibold transition-all ${
                  activeSection === s.id
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
              >
                {s.icon}
                {s.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Mobile tab bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-black/90 backdrop-blur-xl border-t border-white/5 flex overflow-x-auto gap-1 p-2 scrollbar-hide">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-['Space_Grotesk'] font-semibold transition-all ${
                activeSection === s.id
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-gray-500"
              }`}
            >
              {s.icon}
              {s.label}
            </button>
          ))}
        </div>

        {/* ── Main Content ── */}
        <div className="flex-1 min-w-0 space-y-12">

          {/* What is DEA */}
          <motion.section
            id="what-is-dea"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 md:p-10 rounded-[2rem] border border-white/5"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-['Space_Grotesk'] text-[#E1E0CC] tracking-tight mb-6">
              What is DEA?
            </h2>
            <p className="text-gray-300 font-['Manrope'] text-base md:text-lg leading-relaxed">
              DEA — the Discovery &amp; Execution Assistant — is an intelligence engine that
              transforms your tech stack into buildable project blueprints. Tell it what
              you know, and it generates unique project ideas tailored to your skills, then
              breaks each one down into a full architecture overview, technology mapping,
              and step-by-step implementation roadmap. Whether you&apos;re a student hunting for
              a capstone project, a developer building a portfolio, or a team brainstorming
              your next product — DEA turns &quot;I don&apos;t know what to build&quot; into &quot;here&apos;s how to
              build it.&quot;
            </p>
          </motion.section>

          {/* Getting Started */}
          <motion.section
            id="getting-started"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="glass-panel p-8 md:p-10 rounded-[2rem] border border-white/5"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-['Space_Grotesk'] text-[#E1E0CC] tracking-tight mb-8">
              Getting Started
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  title: "Pick Your Stack",
                  desc: "Enter the technologies you're comfortable with — React, Python, Node.js, or anything else. The more specific you are, the better the results.",
                  icon: <Lightbulb className="h-6 w-6" />,
                },
                {
                  step: "02",
                  title: "Choose a Theme",
                  desc: 'Select from curated categories like AI, Blockchain, Cybersecurity, or Cloud. You can also add a custom theme for niche ideas.',
                  icon: <Compass className="h-6 w-6" />,
                },
                {
                  step: "03",
                  title: "Generate & Explore",
                  desc: 'Hit Generate to receive 4 unique project concepts. Click "Explore Concept" on any card to get a full architectural breakdown.',
                  icon: <Sparkles className="h-6 w-6" />,
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="relative p-6 rounded-2xl bg-white/[0.03] border border-white/5 group hover:border-primary/20 transition-all"
                >
                  <span className="absolute -top-3 -right-1 text-6xl font-black font-['Space_Grotesk'] text-white/[0.03] group-hover:text-white/[0.06] transition-colors select-none">
                    {item.step}
                  </span>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 border border-primary/20">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold font-['Space_Grotesk'] text-[#E1E0CC] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 font-['Manrope'] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Pages Guide */}
          <motion.section
            id="pages-guide"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="glass-panel p-8 md:p-10 rounded-[2rem] border border-white/5"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-['Space_Grotesk'] text-[#E1E0CC] tracking-tight mb-8">
              Pages Guide
            </h2>
            <div className="space-y-8">
              {[
                {
                  route: "/idea",
                  title: "Idea Generation",
                  icon: <Lightbulb className="h-5 w-5" />,
                  content: [
                    { label: "Tech Stack", desc: "A comma-separated list of technologies you know. This is the primary input that shapes every generated idea." },
                    { label: "Theme Dropdown", desc: "Choose a broad domain — AI, Blockchain, Cybersecurity, Cloud, or Web3. This focuses the AI on a specific market vertical." },
                    { label: "Custom Theme (optional)", desc: "Add your own niche — like \"healthcare IoT\" or \"music recommendation.\" This overrides or blends with the dropdown theme for unique ideas." },
                    { label: "Generate Button", desc: "Sends your inputs to the AI. In ~10 seconds, you'll see 4 project cards with titles, descriptions, and an Explore button." },
                  ],
                },
                {
                  route: "/trending",
                  title: "Trending Repos",
                  icon: <TrendingUp className="h-5 w-5" />,
                  content: [
                    { label: "Market Pulse", desc: "Shows today's trending repositories scraped directly from GitHub in real-time. Stars, forks, and languages update daily." },
                    { label: "Repo Cards", desc: "Each card shows the owner, repo name, description, star count, fork count, and programming language." },
                    { label: "Explore Concept", desc: "Click any trending repo to generate a full AI-powered architectural guide, just like your custom ideas." },
                    { label: "GitHub Link", desc: "The external link icon takes you directly to the repository on GitHub." },
                  ],
                },
                {
                  route: "/explore",
                  title: "Architecture Explorer",
                  icon: <Compass className="h-5 w-5" />,
                  content: [
                    { label: "Architecture Overview", desc: "A high-level description of how the system components connect — databases, APIs, frontend, and services." },
                    { label: "Tech Stack Breakdown", desc: "Each technology is listed with its specific role in the project and an icon for quick scanning." },
                    { label: "Key Features", desc: "The AI identifies 4–6 core features that make the project functional and compelling." },
                    { label: "Implementation Roadmap", desc: "A vertical timeline with phased steps, each containing 2–4 specific tasks to complete. This is your build plan." },
                  ],
                },
              ].map((page) => (
                <div key={page.route} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      {page.icon}
                    </div>
                    <div>
                      <code className="text-xs text-primary/60 font-mono">{page.route}</code>
                      <h3 className="text-xl font-bold font-['Space_Grotesk'] text-[#E1E0CC]">
                        {page.title}
                      </h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {page.content.map((item) => (
                      <div key={item.label} className="flex gap-3">
                        <ChevronRight className="h-4 w-4 text-primary/40 mt-1 flex-shrink-0" />
                        <div>
                          <span className="text-sm font-bold font-['Space_Grotesk'] text-[#E1E0CC] block mb-1">
                            {item.label}
                          </span>
                          <span className="text-xs text-gray-400 font-['Manrope'] leading-relaxed block">
                            {item.desc}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Tips for Best Results */}
          <motion.section
            id="tips"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="glass-panel p-8 md:p-10 rounded-[2rem] border border-white/5"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-['Space_Grotesk'] text-[#E1E0CC] tracking-tight mb-8">
              Tips for Best Results
            </h2>
            <div className="space-y-5">
              {[
                {
                  tip: "Be specific with your tech stack",
                  detail: 'Instead of just "Python," try "Python, FastAPI, PostgreSQL, Redis." The more detail you give, the more targeted and realistic your project ideas will be.',
                },
                {
                  tip: "Combine multiple themes for niche ideas",
                  detail: 'Select "AI" from the dropdown and type "music production" in the custom field. Mixing domains produces unique, portfolio-worthy project concepts.',
                },
                {
                  tip: "Use Explore for interview prep",
                  detail: "The architecture breakdown and roadmap are great for system design practice. Study the tech stack roles and implementation phases to sharpen your understanding.",
                },
                {
                  tip: "Check Trending daily for inspiration",
                  detail: "GitHub's trending page rotates fast. Visit daily to catch emerging tools and frameworks, then generate your own spin on a trending concept.",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-base font-bold font-['Space_Grotesk'] text-[#E1E0CC] mb-1">
                      {item.tip}
                    </p>
                    <p className="text-sm text-gray-400 font-['Manrope'] leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* FAQ */}
          <motion.section
            id="faq"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="glass-panel p-8 md:p-10 rounded-[2rem] border border-white/5 mb-20 lg:mb-0"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-['Space_Grotesk'] text-[#E1E0CC] tracking-tight mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <button
                  key={i}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-base font-bold font-['Space_Grotesk'] text-[#E1E0CC]">
                      {faq.q}
                    </span>
                    <ChevronRight
                      className={`h-4 w-4 text-primary/40 flex-shrink-0 transition-transform ${
                        openFaq === i ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                  {openFaq === i && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-sm text-gray-400 font-['Manrope'] leading-relaxed mt-3 pt-3 border-t border-white/5"
                    >
                      {faq.a}
                    </motion.p>
                  )}
                </button>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
