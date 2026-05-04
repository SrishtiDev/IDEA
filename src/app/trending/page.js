"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Loader2,
  ArrowRight,
  TrendingUp,
  Flame,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const categoryColors = {
  AI: "text-violet-400 border-violet-400/20 bg-violet-400/10",
  Blockchain: "text-amber-400 border-amber-400/20 bg-amber-400/10",
  Cloud: "text-sky-400 border-sky-400/20 bg-sky-400/10",
  Cyber: "text-red-400 border-red-400/20 bg-red-400/10",
  IoT: "text-emerald-400 border-emerald-400/20 bg-emerald-400/10",
  DevOps: "text-orange-400 border-orange-400/20 bg-orange-400/10",
  Web3: "text-pink-400 border-pink-400/20 bg-pink-400/10",
  FinTech: "text-teal-400 border-teal-400/20 bg-teal-400/10",
};

export default function TrendingPage() {
  const router = useRouter();
  const [projects, setProjects] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch("/api/trending");
        const data = await response.json();
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.error("Invalid data:", data);
        }
      } catch (err) {
        console.error("Error fetching trending:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const handleExplore = (project) => {
    const params = new URLSearchParams({
      title: project.title,
      description: project.description,
      techStack: project.techStack,
    });
    router.push(`/explore?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-gray-400 font-['Manrope'] text-lg animate-pulse">
          Scanning the market...
        </p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-y-auto pt-20 pb-16 px-4 sm:px-8 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            <span className="text-xs uppercase tracking-[0.3em] text-primary/60 font-['Space_Grotesk'] font-semibold">
              Live Market Pulse
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-['Space_Grotesk'] text-[#E1E0CC] tracking-tight mb-4">
            Trending Projects
          </h1>
          <p className="text-gray-400 font-['Manrope'] text-base md:text-lg max-w-2xl">
            Real-time trending project ideas from across the tech industry.
            Click any project to get a full architecture breakdown and
            implementation guide.
          </p>
        </motion.div>

        {/* Projects Grid */}
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project, i) => {
              const colorClass =
                categoryColors[project.category] || categoryColors["AI"];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  onClick={() => handleExplore(project)}
                  className="glass-panel p-6 rounded-[1.5rem] border border-white/5 hover:border-primary/40 transition-all group relative overflow-hidden backdrop-blur-xl cursor-pointer"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.5rem]" />

                  <div className="relative z-10">
                    {/* Top row: category + trending badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${colorClass}`}
                      >
                        {project.category}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-orange-400/80">
                        <Flame className="h-3 w-3" />
                        Hot
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold font-['Space_Grotesk'] text-[#E1E0CC] group-hover:text-primary transition-colors mb-3">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-400 font-['Manrope'] leading-relaxed mb-4 group-hover:text-gray-300 transition-colors line-clamp-3">
                      {project.description}
                    </p>

                    {/* Trending reason */}
                    <p className="text-xs text-primary/50 font-['Manrope'] italic mb-5">
                      ↗ {project.trending}
                    </p>

                    {/* Tech stack tags */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.techStack?.split(",").map((tech, j) => (
                        <span
                          key={j}
                          className="px-2.5 py-1 rounded-lg bg-white/5 text-[10px] text-gray-400 font-semibold tracking-wider uppercase border border-white/5"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>

                    {/* Bottom CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-primary/40" />
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                          AI Guide Available
                        </span>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-[0.15em] text-primary/60 group-hover:text-primary transition-all flex items-center gap-2 group/btn">
                        Explore
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 font-['Manrope']">
              No trending projects found. Try refreshing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
