"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Loader2,
  ArrowRight,
  TrendingUp,
  Star,
  GitFork,
  ExternalLink,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TrendingPage() {
  const router = useRouter();
  const [repos, setRepos] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch("/api/trending");
        const data = await response.json();
        if (Array.isArray(data)) {
          setRepos(data);
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

  const handleExplore = (repo) => {
    const params = new URLSearchParams({
      title: repo.fullName,
      description: repo.description,
      techStack: repo.language,
    });
    router.push(`/explore?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-gray-400 font-['Manrope'] text-lg animate-pulse">
          Scraping GitHub Trending...
        </p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-y-auto pt-24 pb-16 px-4 sm:px-8 md:px-12 lg:px-20">
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
              GitHub Market Pulse
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-['Space_Grotesk'] text-[#E1E0CC] tracking-tight mb-4">
            Today&apos;s Trending Repos
          </h1>
          <p className="text-gray-400 font-['Manrope'] text-base md:text-lg max-w-2xl">
            Real-time trending repositories from GitHub. Click any project to generate a 
            comprehensive architectural breakdown and implementation roadmap using AI.
          </p>
        </motion.div>

        {/* Repos Grid */}
        {repos && repos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="glass-panel p-6 rounded-[1.5rem] border border-white/5 hover:border-primary/40 transition-all group relative overflow-hidden backdrop-blur-xl flex flex-col h-full"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.5rem]" />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Top row: language + today's stars */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 text-gray-400 bg-white/5">
                      {repo.language}
                    </span>
                    <span className="text-[10px] text-primary/80 font-bold tracking-wider">
                      {repo.starsToday}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="mb-3">
                    <span className="text-xs text-gray-500 block mb-1 font-['Manrope']">{repo.owner} /</span>
                    <h3 className="text-xl font-bold font-['Space_Grotesk'] text-[#E1E0CC] group-hover:text-primary transition-colors line-clamp-1">
                      {repo.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-400 font-['Manrope'] leading-relaxed mb-6 group-hover:text-gray-300 transition-colors line-clamp-3 flex-grow">
                    {repo.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Star className="h-3.5 w-3.5 text-amber-400/60" />
                      {repo.stars.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <GitFork className="h-3.5 w-3.5 text-blue-400/60" />
                      {repo.forks.toLocaleString()}
                    </div>
                    <a 
                      href={repo.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-auto text-gray-500 hover:text-primary transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>

                  {/* Bottom CTA */}
                  <div className="pt-4 border-t border-white/5 mt-auto flex items-center justify-between">
                     <div className="flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-primary/40" />
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">AI Architect</span>
                      </div>
                    <button
                      onClick={() => handleExplore(repo)}
                      className="text-xs font-bold uppercase tracking-[0.15em] text-primary/60 group-hover:text-primary transition-all flex items-center gap-2"
                    >
                      Explore Concept
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 font-['Manrope'] text-lg">
              No trending repos found at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
