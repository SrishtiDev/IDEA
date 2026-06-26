"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  Clock,
  BarChart3,
  Layers,
  Cpu,
  CheckCircle2,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);

  const title = searchParams.get("title");
  const description = searchParams.get("description");
  const techStack = searchParams.get("techStack");

  useEffect(() => {
    if (!title || !description || !techStack) {
      router.push("/idea");
      return;
    }

    const fetchBreakdown = async () => {
      try {
        const response = await fetch("/api/explore", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, techStack }),
        });
        const data = await response.json();
        if (data.error) {
          alert("Failed to load project details.");
          router.push("/idea");
        } else {
          setBreakdown(data);
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong.");
        router.push("/idea");
      } finally {
        setLoading(false);
      }
    };

    fetchBreakdown();
  }, [title, description, techStack, router]);

  if (loading) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-gray-400 font-['Manrope'] text-lg animate-pulse">
          Architecting your project...
        </p>
      </div>
    );
  }

  if (!breakdown) return null;

  return (
    <div className="absolute inset-0 overflow-y-auto pt-20 pb-16 px-4 sm:px-8 md:px-16 lg:px-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto flex flex-col gap-10"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold font-['Space_Grotesk'] text-[#E1E0CC] tracking-tight mb-3"
            >
              {breakdown.title}
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-gray-300 font-['Manrope'] text-base md:text-lg leading-relaxed max-w-3xl"
            >
              {breakdown.overview}
            </motion.p>
          </div>
          <button
            onClick={() => router.back()}
            className="shrink-0 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors glass-panel px-5 py-2.5 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        {/* Meta badges */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-3"
        >
          <span className="flex items-center gap-2 glass-panel px-4 py-2 rounded-full text-sm text-gray-300">
            <Clock className="h-4 w-4 text-primary" />
            {breakdown.estimatedTime}
          </span>
          <span className="flex items-center gap-2 glass-panel px-4 py-2 rounded-full text-sm text-gray-300">
            <BarChart3 className="h-4 w-4 text-secondary" />
            {breakdown.difficulty}
          </span>
        </motion.div>

        {/* Tech Stack */}
        <motion.section
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-[#E1E0CC] mb-5 flex items-center gap-3">
            <Cpu className="h-6 w-6 text-primary" />
            Tech Stack
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {breakdown.techStack?.map((tech, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-2xl text-primary">
                    {tech.icon || "code"}
                  </span>
                  <h3 className="font-bold font-['Space_Grotesk'] text-[#E1E0CC] group-hover:text-primary transition-colors">
                    {tech.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-400 font-['Manrope']">
                  {tech.role}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Features */}
        <motion.section
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-[#E1E0CC] mb-5 flex items-center gap-3">
            <Layers className="h-6 w-6 text-secondary" />
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {breakdown.features?.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                className="glass-panel p-5 rounded-2xl border border-white/5"
              >
                <h3 className="font-bold font-['Space_Grotesk'] text-primary mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-gray-300 font-['Manrope']">
                  {feat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Architecture */}
        <motion.section
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-[#E1E0CC] mb-5">
            Architecture Overview
          </h2>
          <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5">
            <p className="text-gray-300 font-['Manrope'] leading-relaxed text-base">
              {breakdown.architecture}
            </p>
          </div>
        </motion.section>

        {/* Implementation Steps */}
        <motion.section
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="pb-10"
        >
          <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-[#E1E0CC] mb-8">
            Implementation Roadmap
          </h2>
          <div className="relative flex flex-col gap-8">
            {/* Timeline line */}
            <div className="absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-secondary to-tertiary opacity-30" />

            {breakdown.steps?.map((step, i) => (
              <motion.div
                key={i}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="relative pl-14"
              >
                {/* Timeline dot */}
                <div className="absolute left-3 top-1 h-5 w-5 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                  <span className="text-[10px] font-bold text-primary">
                    {i + 1}
                  </span>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/60 mb-1 block">
                    {step.phase}
                  </span>
                  <h3 className="text-lg font-bold font-['Space_Grotesk'] text-[#E1E0CC] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-400 font-['Manrope'] mb-4">
                    {step.description}
                  </p>
                  <ul className="flex flex-col gap-2">
                    {step.tasks?.map((task, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-sm text-gray-300"
                      >
                        <CheckCircle2 className="h-4 w-4 text-primary/50 mt-0.5 shrink-0" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-gray-400 font-['Manrope'] text-lg">Loading...</p>
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
