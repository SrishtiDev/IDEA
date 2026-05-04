"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function IdeaPage() {
  const [techStack, setTechStack] = useState("");
  const [theme, setTheme] = useState("");
  const [customTheme, setCustomTheme] = useState("");
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!techStack || !theme) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ techStack, theme, customTheme }),
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setIdeas(data);
      } else {
        console.error("Invalid data format received:", data);
        alert("Failed to generate ideas. Please try again.");
      }
    } catch (error) {
      console.error("Error generating ideas:", error);
      alert("An error occurred. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 overflow-y-auto pt-24 pb-12">
      <AnimatePresence mode="wait">
        {!ideas ? (
          <motion.div 
            key="form"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel w-full max-w-lg rounded-2xl p-6 sm:p-8 md:p-10 text-white shadow-2xl relative overflow-hidden"
          >
            {/* Subtle glow inside the form */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-primary/20 blur-[50px] pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-2 font-['Space_Grotesk'] tracking-tight" style={{ color: "#E1E0CC" }}>
                Generate Idea
              </h2>
              <p className="text-sm text-gray-300 mb-8 font-['Manrope']">
                Tell us about your stack and preferences to get a tailored project idea.
              </p>

              <form onSubmit={handleGenerate} className="flex flex-col gap-5">
                
                {/* Tech Stack */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="tech-stack" className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                    Tech Stack
                  </label>
                  <input 
                    id="tech-stack"
                    type="text" 
                    required
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                    placeholder="e.g., React, Node.js, PostgreSQL" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-600"
                  />
                </div>

                {/* Theme Dropdown */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="theme" className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                    Theme Category
                  </label>
                  <select 
                    id="theme"
                    required
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-gray-200 appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select a theme...</option>
                    <option value="ai" className="bg-slate-900 text-white">AI / Machine Learning</option>
                    <option value="blockchain" className="bg-slate-900 text-white">Blockchain / Web3</option>
                    <option value="cyber" className="bg-slate-900 text-white">Cybersecurity</option>
                    <option value="cloud" className="bg-slate-900 text-white">Cloud / DevOps</option>
                    <option value="other" className="bg-slate-900 text-white">Other</option>
                  </select>
                </div>

                {/* Custom Theme (Optional) */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="custom-theme" className="text-xs font-semibold tracking-wider text-gray-400 uppercase flex items-center justify-between">
                    <span>Custom Theme</span>
                    <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-md">Optional</span>
                  </label>
                  <input 
                    id="custom-theme"
                    type="text" 
                    value={customTheme}
                    onChange={(e) => setCustomTheme(e.target.value)}
                    placeholder="e.g., Healthcare, EdTech, FinTech..." 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-600"
                  />
                </div>

                {/* Generate Button */}
                <button 
                  type="submit"
                  disabled={loading}
                  className="mt-4 group relative w-full inline-flex items-center justify-center gap-3 rounded-xl bg-primary py-3.5 px-6 text-sm font-semibold text-black transition-all hover:bg-primary/90 shadow-[0_0_20px_rgba(192,193,255,0.3)] hover:shadow-[0_0_30px_rgba(192,193,255,0.5)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Thinking...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Project</span>
                      <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-[92vw] flex flex-col gap-10 pointer-events-auto relative z-10 mx-auto"
          >
            {/* Background Decorative Elements for the sides */}
            <div className="absolute -inset-x-20 inset-y-0 pointer-events-none overflow-hidden z-0 opacity-10">
              <span className="material-symbols-outlined absolute top-1/4 -left-10 text-8xl text-primary animate-pulse" style={{ transform: 'rotate(-15deg)' }}>hub</span>
              <span className="material-symbols-outlined absolute top-1/3 -right-10 text-9xl text-secondary animate-pulse" style={{ transform: 'rotate(10deg)' }}>cloud_done</span>
              <span className="material-symbols-outlined absolute bottom-1/4 -left-10 text-7xl text-tertiary animate-pulse" style={{ transform: 'rotate(25deg)' }}>security</span>
              <span className="material-symbols-outlined absolute bottom-1/3 -right-10 text-8xl text-primary animate-pulse" style={{ transform: 'rotate(-5deg)' }}>psychology</span>
            </div>

            <div className="flex items-center justify-between relative z-10">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] text-[#E1E0CC] tracking-tight">Generated Ideas</h2>
                <p className="text-gray-400 font-['Manrope'] mt-2 text-lg">Based on your {techStack} stack</p>
              </div>
              <button 
                onClick={() => setIdeas(null)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors glass-panel px-6 py-3 rounded-xl border-white/5"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Form
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
              {ideas.map((idea, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="glass-panel p-8 rounded-[2rem] border border-white/10 hover:border-primary/40 transition-all group relative overflow-hidden backdrop-blur-xl"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                    <Sparkles className="h-20 w-20 text-primary" />
                  </div>
                  
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-[#E1E0CC] group-hover:text-primary transition-colors">{idea.title}</h3>
                  </div>

                  <p className="text-base leading-relaxed text-gray-300 font-['Manrope'] mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
                    {idea.description}
                  </p>
                  
                  <div className="flex justify-between items-center pt-6 border-t border-white/5">
                    <div className="flex gap-2">
                       <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] text-gray-400 uppercase tracking-widest border border-white/5">Project</span>
                    </div>
                    <button className="text-xs font-bold uppercase tracking-[0.15em] text-primary/60 hover:text-primary transition-all flex items-center gap-2 group/btn">
                      Explore Concept 
                      <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
