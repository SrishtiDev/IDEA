"use client";

import { useEffect } from "react";
import Link from "next/link";
import { renderCanvas } from "@/components/ui/canvas";
import { Plus, ArrowRight, Sparkles, FileText, CheckCircle2 } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";

export const HeroSection = () => {
  useEffect(() => {
    renderCanvas();
  }, []);

  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      {/* Background canvas for the cursor effect */}
      <canvas
        className="pointer-events-none absolute inset-0 z-0 mx-auto w-full h-full opacity-60 dark:opacity-40"
        id="canvas"
      ></canvas>
      <br />
     

      <div className="relative z-10 animate-fadeIn mt-28 flex flex-col items-center justify-center px-4 text-center md:mt-32">
        

        <div className="mb-10 mt-4 md:mt-6 w-full max-w-5xl">
          <div className="px-2">
            <div className="relative mx-auto h-full w-full border border-zinc-200 dark:border-zinc-800/80 bg-white/30 dark:bg-zinc-900/30 backdrop-blur-sm p-6 [mask-image:radial-gradient(800rem_96rem_at_center,white,transparent)] md:px-12 md:py-20 rounded-3xl shadow-2xl shadow-violet-500/5">
              <h1 className="flex select-none flex-col px-3 py-2 text-center text-5xl font-semibold leading-none tracking-tight md:flex-col md:text-7xl lg:flex-col lg:text-[5.5rem]">
                <Plus strokeWidth={3} className="text-zinc-300 dark:text-zinc-700 absolute -left-4 -top-4 h-8 w-8" />
                <Plus strokeWidth={3} className="text-zinc-300 dark:text-zinc-700 absolute -bottom-4 -left-4 h-8 w-8" />
                <Plus strokeWidth={3} className="text-zinc-300 dark:text-zinc-700 absolute -right-4 -top-4 h-8 w-8" />
                <Plus strokeWidth={3} className="text-zinc-300 dark:text-zinc-700 absolute -bottom-4 -right-4 h-8 w-8" />
                <span className="text-zinc-900 dark:text-white">HIRE ORBIT</span>
              </h1>
              <p className="mt-1 text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 font-medium tracking-tight">
                Beat the bots. Land the interview.
              </p>
            </div>
          </div>

         
          <br />

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <GlassButton
              size="lg"
              onClick={() => window.location.href = '/analyze'}
              contentClassName="flex items-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Analyze Resume Free
            </GlassButton>
          </div>

          {/* Stats below CTA */}
          <div className="mt-16 flex justify-center gap-8 sm:gap-16 flex-wrap">
            {[
              { v: '94%', l: 'Pass rate improvement' },
              { v: '30s', l: 'Average analysis time' },
              { v: '5+', l: 'ATS platforms simulated' },
            ].map(s => (
              <div key={s.v} className="text-center flex flex-col items-center">
                <div className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">{s.v}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
