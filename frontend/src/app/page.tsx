'use client';

import { HeroSection } from "@/components/blocks/hero-section-9";
import Link from "next/link";
import { ArrowRight, Shield, FileText, Target, BarChart3, Sparkles, CheckCircle, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Shield, title: 'Enterprise ATS Simulation', desc: 'Replicates Workday, Greenhouse, Taleo, Lever & iCIMS — the actual systems screening your resume.', colorClass: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400' },
  { icon: Target, title: 'Keyword Match Engine', desc: 'Compare your resume against any JD and see which keywords you\'re missing and how to add them.', colorClass: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' },
  { icon: BarChart3, title: 'ATS Score & Verdict', desc: 'Precise 0–100 score with PASS / BORDERLINE / REJECT verdict and the specific reasons behind it.', colorClass: 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400' },
  { icon: FileText, title: 'LaTeX Resume Generator', desc: 'One click generates a clean, ATS-friendly LaTeX resume with all recommendations already applied.', colorClass: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' },
  { icon: Sparkles, title: 'Frontier AI Analysis', desc: 'Powered by NVIDIA Nemotron Super 49B — a model that understands your resume the way a recruiter does.', colorClass: 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400' },
  { icon: ArrowRight, title: 'Instant Results', desc: 'Upload your resume and get a full ATS breakdown in under 30 seconds. No account. No card.', colorClass: 'bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' },
];

const steps = [
  { num: '01', title: 'Upload Your Resume', desc: 'Drop your PDF. Our parser extracts every section, skill, and date with precision.' },
  { num: '02', title: 'Paste the Job Description', desc: 'Add the JD for keyword analysis. We extract every required skill and flag what\'s missing.' },
  { num: '03', title: 'Get Your ATS Report', desc: 'See your score, flags, and recommendations — then download a LaTeX resume optimized to pass.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-foreground">
      {/* Hero with its own nav */}
      <HeroSection />

      {/* Inline Upload Zone */}
      <section className="relative z-10 -mt-12 mb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/analyze" className="block w-full border-2 border-dashed border-zinc-300 dark:border-zinc-700/50 bg-white/50 dark:bg-zinc-900/30 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 backdrop-blur-sm rounded-[2rem] p-12 text-center transition-all duration-300 group">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:bg-violet-500/10 transition-all duration-300">
              <UploadCloud className="w-8 h-8 text-zinc-400 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Drop your resume to get your ATS score</h3>
            <p className="text-zinc-500 text-sm font-medium">.pdf · .docx · .txt supported</p>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-6">
              Features
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">Everything to beat the algorithm</h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto text-base md:text-lg leading-relaxed">
              Not a generic resume checker. A full ATS simulation engine built on frontier AI.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="relative rounded-3xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0a0a0a] p-8 hover:border-violet-300 dark:hover:border-zinc-700 transition-colors shadow-sm">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 ${f.colorClass}`}>
                  <f.icon size={18} />
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3 text-lg tracking-tight">{f.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-6 border-t border-zinc-200 dark:border-zinc-800/50 bg-white dark:bg-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-6">
              How it works
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Three steps to ATS-proof</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative rounded-3xl border border-zinc-200 dark:border-zinc-800/80 bg-[#fafafa] dark:bg-[#0a0a0a] p-8">
                <span className="text-5xl font-semibold text-zinc-200 dark:text-zinc-800/50 font-mono block mb-6">{s.num}</span>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3 text-lg tracking-tight">{s.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 border-t border-zinc-200 dark:border-zinc-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-6">
              Pricing
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">Simple, transparent</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-base">Start free. No credit card required.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] p-10 shadow-sm">
              <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Free</p>
              <p className="text-5xl font-semibold text-zinc-900 dark:text-white mb-2">$0</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-10">Perfect to get started</p>
              <ul className="flex flex-col gap-4 mb-10">
                {['5 analyses per month', 'ATS score & verdict', 'Keyword matching', 'Formatting checks', 'Basic recommendations'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">
                    <CheckCircle size={16} className="text-zinc-900 dark:text-white shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full h-12 rounded-xl text-base" variant="outline">
                <Link href="/analyze">Get Started Free</Link>
              </Button>
            </div>
            <div className="rounded-3xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-[#0f0f13] p-10 relative overflow-hidden shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Pro</p>
                <span className="text-[10px] bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 px-2.5 py-1 rounded-full font-mono uppercase tracking-wider font-semibold">Coming Soon</span>
              </div>
              <p className="text-5xl font-semibold text-zinc-900 dark:text-white mb-2">$12<span className="text-xl text-zinc-500 dark:text-zinc-500">/mo</span></p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-10">For serious job seekers</p>
              <ul className="flex flex-col gap-4 mb-10">
                {['Unlimited analyses', 'LaTeX resume generation', 'Bullet rewrite suggestions', 'Multi-JD comparison', 'Priority AI model access'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">
                    <CheckCircle size={16} className="text-zinc-900 dark:text-white shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button disabled className="w-full h-12 rounded-xl text-base bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800">Join Waitlist</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 border-t border-zinc-200 dark:border-zinc-800/50 bg-white dark:bg-[#050505]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-6">
            Stop guessing. Start passing.
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-10 text-base md:text-lg leading-relaxed">
            Upload your resume and get a complete ATS report in seconds. Free. No sign-up required.
          </p>
          <Button asChild size="lg" className="h-14 px-8 rounded-xl text-base shadow-lg shadow-zinc-200 dark:shadow-none">
            <Link href="/analyze">Analyze My Resume Free <ArrowRight size={18} className="ml-2" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
