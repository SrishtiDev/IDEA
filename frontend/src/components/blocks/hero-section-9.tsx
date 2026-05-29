"use client";

import React from "react";
import { CelestialOrbHero } from "@/components/ui/quantum-grid-hero";
import { Plus, FileText } from "lucide-react";

export const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      <CelestialOrbHero>
        <div className="relative z-10 animate-fadeIn flex flex-col items-center justify-center px-4 text-center">
          <div className="mb-10 w-full max-w-5xl">
            
            <div className="px-2">
              <div className="relative mx-auto h-full w-full border border-zinc-200 dark:border-zinc-800/80 bg-white/30 dark:bg-zinc-900/30 backdrop-blur-sm p-6 [mask-image:radial-gradient(800rem_96rem_at_center,white,transparent)] md:px-12 md:py-10 rounded-3xl shadow-2xl shadow-violet-500/5">
                <h1 className="flex select-none flex-col px-3 py-2 text-center text-5xl font-semibold leading-none tracking-tight md:flex-col md:text-7xl lg:flex-col lg:text-[5.5rem]">
                  <Plus strokeWidth={3} className="text-zinc-300 dark:text-zinc-700 absolute -left-4 -top-4 h-8 w-8" />
                  <Plus strokeWidth={3} className="text-zinc-300 dark:text-zinc-700 absolute -bottom-4 -left-4 h-8 w-8" />
                  <Plus strokeWidth={3} className="text-zinc-300 dark:text-zinc-700 absolute -right-4 -top-4 h-8 w-8" />
                  <Plus strokeWidth={3} className="text-zinc-300 dark:text-zinc-700 absolute -bottom-4 -right-4 h-8 w-8" />
                  <span className="text-zinc-900 dark:text-white">HIRE ORBIT</span>
                </h1>
                <p className="mt-2 text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 font-medium tracking-tight">
                  Beat the bots. Land the interview.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
              <button
                onClick={() => window.location.href = '/analyze'}
                className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/80 text-white font-bold transition-all duration-300 hover:bg-white hover:text-black hover:border-white hover:scale-105 active:scale-95 px-[32px] py-[14px] text-lg shadow-lg shadow-violet-500/20 animate-[pulse_1.5s_ease-in-out_1]"
              >
                <FileText className="w-5 h-5" />
                Analyze Resume Free
              </button>
            </div>

            {/* Stats below CTA */}
            <div className="mt-16 pt-8 border-t border-white/10 flex justify-center gap-8 sm:gap-16 flex-wrap relative max-w-3xl mx-auto">
              {[
                { v: '94%', l: 'Pass rate improvement' },
                { v: '30s', l: 'Average analysis time' },
                { v: '5+', l: 'ATS platforms simulated' },
              ].map((s, i) => (
                <div key={s.v} className="text-center flex flex-col items-center relative">
                  <div className="text-[2.5rem] font-bold text-white mb-1 leading-none">{s.v}</div>
                  <div className="text-xs text-[#888] uppercase tracking-widest">{s.l}</div>
                  {i < 2 && (
                    <div className="hidden sm:block absolute -right-8 sm:-right-16 top-1/2 -translate-y-1/2 w-px h-10 bg-white/10" />
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      </CelestialOrbHero>
    </section>
  );
};
