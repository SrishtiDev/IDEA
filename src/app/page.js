"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, Lightbulb, Cpu, Sparkles, Rocket } from "lucide-react";
import { WordsPullUp } from "@/components/ui/prisma-hero";
import Link from "next/link";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    icon: <Lightbulb className="h-7 w-7" />,
    title: "Define Your Stack",
    description:
      "Tell us what technologies you work with — frameworks, languages, databases. We tailor every idea to what you already know.",
  },
  {
    number: "02",
    icon: <Cpu className="h-7 w-7" />,
    title: "Choose a Theme",
    description:
      "Select from curated categories like AI, Blockchain, Cybersecurity, or Cloud — or define your own custom domain.",
  },
  {
    number: "03",
    icon: <Sparkles className="h-7 w-7" />,
    title: "AI Generates Ideas",
    description:
      "Our intelligence engine powered by advanced LLMs analyzes your inputs and crafts 4 unique, buildable project concepts.",
  },
  {
    number: "04",
    icon: <Rocket className="h-7 w-7" />,
    title: "Explore & Build",
    description:
      "Dive deep into any idea — get the full tech stack breakdown, architecture overview, and a step-by-step implementation roadmap.",
  },
];

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: containerRef });

  // Parallax: hero content fades out as you scroll
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -120]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-y-auto scroll-smooth"
    >
      {/* ─── Section 1: Hero ─── */}
      <section className="relative h-screen flex items-end">
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="w-full px-4 pb-2 sm:px-6 md:px-10"
        >
          <div className="grid grid-cols-12 items-end gap-4">
            <div className="col-span-12 lg:col-span-8">
              <h1
                className="font-medium leading-[0.85] tracking-[-0.07em] text-[26vw] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw]"
                style={{ color: "#E1E0CC" }}
              >
                <WordsPullUp text="DEA" showAsterisk />
              </h1>
            </div>

            <div className="col-span-12 flex flex-col gap-5 pb-6 lg:col-span-4 lg:pb-10">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-xs text-primary/80 sm:text-sm md:text-base"
                style={{ lineHeight: 1.2 }}
              >
                Get project ideas based on your tech stack. DEA is an
                intelligence engine built for the future of creation.
              </motion.p>

              <Link href="/idea">
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group inline-flex items-center gap-2 self-start rounded-full bg-primary py-1 pl-5 pr-1 text-sm font-medium text-black transition-all hover:gap-3 sm:text-base shadow-[0_0_15px_rgba(192,193,255,0.4)]"
                >
                  Get Started
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                    <ArrowRight
                      className="h-4 w-4"
                      style={{ color: "#E1E0CC" }}
                    />
                  </span>
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-['Space_Grotesk']">
            Scroll
          </span>
          <ChevronDown className="h-4 w-4 text-gray-500 animate-bounce" />
        </motion.div>
      </section>

      {/* ─── Section 2: How It Works ─── */}
      <section className="relative min-h-screen flex items-center py-24 px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto w-full">
          {/* Section header */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16 text-center"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-primary/60 font-['Space_Grotesk'] font-semibold mb-4 block">
              The Process
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-['Space_Grotesk'] text-[#E1E0CC] tracking-tight mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 font-['Manrope'] max-w-xl mx-auto text-base md:text-lg">
              From your tech stack to a fully architected project plan — in four
              simple steps.
            </p>
          </motion.div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="glass-panel p-8 rounded-[2rem] border border-white/5 hover:border-primary/30 transition-all group relative overflow-hidden"
              >
                {/* Background number */}
                <span className="absolute -top-4 -right-2 text-[8rem] font-black font-['Space_Grotesk'] text-white/[0.02] group-hover:text-white/[0.05] transition-colors select-none leading-none">
                  {step.number}
                </span>

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary group-hover:bg-primary/20 transition-colors">
                      {step.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/50 block mb-1">
                        Step {step.number}
                      </span>
                      <h3 className="text-xl font-bold font-['Space_Grotesk'] text-[#E1E0CC] group-hover:text-primary transition-colors">
                        {step.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm md:text-base text-gray-400 font-['Manrope'] leading-relaxed group-hover:text-gray-300 transition-colors">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 flex justify-center"
          >
            <Link href="/idea">
              <button className="group inline-flex items-center gap-3 rounded-full bg-primary py-3 pl-8 pr-3 text-sm font-semibold text-black transition-all hover:gap-4 sm:text-base shadow-[0_0_25px_rgba(192,193,255,0.4)] hover:shadow-[0_0_40px_rgba(192,193,255,0.6)]">
                Try It Now
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110">
                  <ArrowRight
                    className="h-4 w-4"
                    style={{ color: "#E1E0CC" }}
                  />
                </span>
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
      {/* ─── Section 3: About Us ─── */}
      <section id="about" className="relative min-h-[80vh] flex items-center py-24 px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto w-full">
          <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
            {/* Decorative background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-xs uppercase tracking-[0.3em] text-primary/60 font-['Space_Grotesk'] font-semibold mb-4 block">
                  The Creator
                </span>
                <h2 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] text-[#E1E0CC] tracking-tight mb-6">
                  About Us
                </h2>
                <div className="space-y-4">
                  <p className="text-xl md:text-2xl font-['Space_Grotesk'] text-primary font-semibold">
                    Srishti Rawat
                  </p>
                  <p className="text-gray-300 font-['Manrope'] text-lg leading-relaxed">
                    A third-year student passionate about exploring the frontiers of technology. Currently focused on learning and building innovative AI tools that empower creators and developers.
                  </p>
                  <p className="text-gray-400 font-['Manrope']">
                    DEA is a manifestation of that passion — an attempt to bridge the gap between inspiration and implementation through intelligence.
                  </p>
                </div>

                <div className="mt-10 flex gap-4">
                  <div className="glass-panel px-4 py-2 rounded-full text-xs text-primary/80 border-primary/20">
                    AI Research
                  </div>
                  <div className="glass-panel px-4 py-2 rounded-full text-xs text-secondary/80 border-secondary/20">
                    Tool Building
                  </div>
                  <div className="glass-panel px-4 py-2 rounded-full text-xs text-tertiary/80 border-tertiary/20">
                    Third Year Student
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ x: 40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative flex justify-center"
              >
                <div className="relative h-64 w-64 md:h-80 md:w-80">
                  {/* Decorative rotating border */}
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30 animate-[spin_20s_linear_infinite]" />
                  
                  {/* Image container */}
                  <div className="absolute inset-4 rounded-full border border-white/10 bg-black/40 backdrop-blur-3xl overflow-hidden flex items-center justify-center group/img">
                    <img 
                      src="/pfp.png" 
                      alt="Srishti Rawat" 
                      className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-110 group-hover/img:scale-100"
                    />
                    {/* Subtle overlay glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
