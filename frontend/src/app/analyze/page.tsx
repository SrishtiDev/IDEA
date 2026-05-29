'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud, Cpu, Code, CheckCircle, AlertTriangle,
  Check, XCircle, Info, ChevronDown, ChevronUp, ArrowLeft, Sparkles
} from 'lucide-react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8040';

type Severity = 'high' | 'medium' | 'low';
type IssueType = 'error' | 'warning' | 'ok';
interface AtsFlag { severity: Severity; issue: string; }
interface FormattingIssue { type: IssueType; message: string; }
interface Analysis {
  parsed: Record<string, unknown>;
  sections_detected: Record<string, boolean>;
  ats_score: number;
  verdict: 'LIKELY_PASS' | 'BORDERLINE' | 'LIKELY_REJECT';
  verdict_reason: string;
  formatting_issues: FormattingIssue[];
  ats_flags: AtsFlag[];
  keyword_match: { found: string[]; missing: string[]; partial: string[]; match_score: number; } | null;
  recommendations: string[];
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 70 ? '#22c55e' : score >= 45 ? '#eab308' : '#ef4444';
  const r = 52, circ = 2 * Math.PI * r, dash = (score / 100) * circ;
  return (
    <div className="relative flex items-center justify-center w-32 h-32">
      <svg className="absolute" width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
        <circle cx="64" cy="64" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 64 64)"
          style={{ filter: `drop-shadow(0 0 8px ${color}66)`, transition: 'stroke-dasharray 1s ease' }} />
      </svg>
      <div className="flex flex-col items-center">
        <span className="text-3xl font-light" style={{ color }}>{score}</span>
        <span className="text-[10px] text-[#444] uppercase tracking-widest font-mono">/ 100</span>
      </div>
    </div>
  );
}

function Chip({ label, color }: { label: string; color: string }) {
  return <span className={`px-2 py-0.5 text-xs font-mono border rounded-full ${color}`}>{label}</span>;
}

function Collapsible({ title, children, defaultOpen = false }: { title: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex justify-between items-center px-5 py-4 text-xs uppercase tracking-widest text-[#666] font-mono hover:text-white transition-colors">
        <span className="flex items-center gap-2">{title}</span>
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>
      {open && <div className="border-t border-white/5 px-5 pb-5 pt-4">{children}</div>}
    </div>
  );
}

const verdictStyle = {
  LIKELY_PASS: { color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' },
  BORDERLINE: { color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' },
  LIKELY_REJECT: { color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' },
};

const severityStyle: Record<Severity, string> = {
  high: 'text-red-400 border-red-400/20 bg-red-400/5',
  medium: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5',
  low: 'text-[#666] border-white/5 bg-white/2',
};

const issueIcon: Record<IssueType, React.ReactNode> = {
  error: <XCircle size={12} className="text-red-400 shrink-0 mt-0.5" />,
  warning: <AlertTriangle size={12} className="text-yellow-400 shrink-0 mt-0.5" />,
  ok: <CheckCircle size={12} className="text-green-400 shrink-0 mt-0.5" />,
};

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [rawText, setRawText] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [latexCode, setLatexCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setIsAnalyzing(true); setAnalysis(null); setLatexCode(null); setError(null);
    const form = new FormData();
    form.append('resume', file);
    if (jd.trim()) form.append('jobDescription', jd);
    try {
      const res = await fetch(`${API}/api/analyze`, { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setAnalysis(data.analysis);
      setRawText(data.rawText || '');
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Analysis failed'); }
    finally { setIsAnalyzing(false); }
  };

  const handleGenerateLatex = async () => {
    if (!analysis) return;
    setIsGenerating(true); setError(null);
    try {
      const res = await fetch(`${API}/api/analyze/latex`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis, rawText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'LaTeX generation failed');
      setLatexCode(data.latexCode);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'LaTeX generation failed'); }
    finally { setIsGenerating(false); }
  };

  return (
    <div className="relative min-h-screen pt-28 pb-12 px-6">
      {/* Ambient */}
      <div className="orb w-[500px] h-[500px] bg-violet-600/10 top-0 left-[-100px]" />
      <div className="orb w-[400px] h-[400px] bg-blue-600/10 bottom-0 right-[-100px]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/" className="text-xs text-[#555] hover:text-white transition-colors flex items-center gap-1.5 mb-3">
              <ArrowLeft size={12} /> Back to home
            </Link>
            <h1 className="text-2xl font-semibold text-white tracking-tight">ATS Analyzer</h1>
            <p className="text-sm text-[#555] mt-1">Upload your resume and get an enterprise ATS simulation report</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 border border-white/5 bg-white/2 rounded-full px-3 py-1">
            {/* <span className="text-[10px] text-[#555] font-mono tracking-widest uppercase">Powered by Claude AI</span> */}
          </div>
        </div>
        
        <div className="w-full h-px bg-white/10 mb-8" />

        <div className="flex flex-col gap-6">

          {/* ── TOP: Input panels ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Upload Zone */}
            <div className="glass rounded-2xl p-6 h-[280px] flex flex-col">
              <p className="text-xs text-[#888] font-mono uppercase tracking-widest mb-4">Resume Upload</p>
              <div
                onClick={() => fileRef.current?.click()}
                className="flex-1 border-2 border-dashed border-zinc-700/50 bg-black/20 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-violet-500/50 hover:bg-violet-500/5 transition-all group"
              >
                <input ref={fileRef} type="file" accept=".pdf" className="hidden"
                  onChange={e => setFile(e.target.files?.[0] || null)} />
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud size={24} className="text-[#666] group-hover:text-white transition-colors" />
                </div>
                <p className="text-sm font-mono text-[#aaa] group-hover:text-white transition-colors px-4 truncate max-w-full">
                  {file ? file.name : 'Drop your PDF or click to browse'}
                </p>
              </div>
            </div>

            {/* Right: Job Description */}
            <div className="glass rounded-2xl p-6 h-[280px] flex flex-col">
              <p className="text-xs text-[#888] font-mono uppercase tracking-widest mb-4 flex items-center gap-2">
                Job Description — <span className="text-[#555]">optional</span>
              </p>
              <textarea
                value={jd}
                onChange={e => setJd(e.target.value)}
                className="flex-1 w-full bg-black/20 border-2 border-dashed border-zinc-700/50 rounded-xl p-5 text-sm text-[#ccc] font-mono focus:outline-none focus:border-violet-500/50 focus:bg-violet-500/5 transition-colors resize-none placeholder:text-[#444]"
                placeholder="Paste the target job description here..."
              />
            </div>
          </div>

          {error && (
            <div className="glass rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400 font-mono text-center">
              ⚠ {error}
            </div>
          )}

          {/* ── MIDDLE: Action Button ── */}
          <button 
            onClick={handleAnalyze}
            disabled={!file || isAnalyzing}
            className="w-full bg-white text-black font-mono text-[16px] font-bold py-[18px] rounded-2xl hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            {isAnalyzing
              ? <><Cpu size={18} className="animate-spin" /> RUNNING ANALYSIS...</>
              : 'RUN ATS ANALYSIS →'}
          </button>

          {/* ── BOTTOM: Results ── */}
          <main className="flex flex-col gap-4 pb-12 mt-4 bg-zinc-900/40 rounded-3xl p-6 min-h-[500px] border border-white/5 relative">
            {!analysis && !isAnalyzing && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-sm bg-black/20 rounded-3xl">
                <div className="px-6 py-3 rounded-full bg-white text-black font-semibold text-sm shadow-xl flex items-center gap-2">
                  <Sparkles size={16} />
                  Run analysis to reveal your results
                </div>
              </div>
            )}

            {!analysis && !isAnalyzing && (
              <div className="opacity-30 blur-[2px] pointer-events-none flex flex-col gap-6">
                <div className="h-40 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
                <div className="h-32 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
                <div className="h-48 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
              </div>
            )}

            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                <Cpu size={32} className="animate-spin text-violet-400 mb-6" />
                <p className="text-sm text-white font-mono uppercase tracking-widest mb-2">
                  Parsing & Scoring Resume...
                </p>
                <p className="text-xs text-[#666]">Comparing against enterprise ATS rulesets</p>
              </div>
            )}

            {analysis && (
              <>
                {/* Score card */}
                <div className="glass-strong rounded-3xl p-6 border border-white/8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <ScoreRing score={analysis.ats_score} />
                  <div className="flex-1">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono mb-2 ${verdictStyle[analysis.verdict].bg} ${verdictStyle[analysis.verdict].color}`}>
                      {analysis.verdict.replace(/_/g, ' ')}
                    </div>
                    <p className="text-sm text-[#888] leading-relaxed max-w-sm">{analysis.verdict_reason}</p>
                  </div>
                  {/* Section detections */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 shrink-0">
                    {Object.entries(analysis.sections_detected).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-1.5">
                        {v ? <CheckCircle size={10} className="text-green-400" /> : <XCircle size={10} className="text-[#333]" />}
                        <span className="text-[10px] font-mono capitalize" style={{ color: v ? '#aaa' : '#444' }}>
                          {k.replace(/_/g, ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ATS Flags */}
                {analysis.ats_flags?.length > 0 && (
                  <Collapsible
                    title={<><AlertTriangle size={10} className="text-yellow-400" /> ATS Flags ({analysis.ats_flags.length})</>}
                    defaultOpen>
                    <div className="flex flex-col gap-2">
                      {analysis.ats_flags.map((f, i) => (
                        <div key={i} className={`flex items-start gap-3 border rounded-xl px-4 py-3 text-xs font-mono ${severityStyle[f.severity]}`}>
                          <span className="uppercase text-[10px] shrink-0 mt-0.5 opacity-60">[{f.severity}]</span>
                          <span>{f.issue}</span>
                        </div>
                      ))}
                    </div>
                  </Collapsible>
                )}

                {/* Formatting Issues */}
                {analysis.formatting_issues?.length > 0 && (
                  <Collapsible title={<><Info size={10} /> Formatting Issues ({analysis.formatting_issues.length})</>}>
                    <div className="flex flex-col gap-2">
                      {analysis.formatting_issues.map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-[#888]">
                          {issueIcon[f.type]}
                          <span>{f.message}</span>
                        </div>
                      ))}
                    </div>
                  </Collapsible>
                )}

                {/* Keyword Match */}
                {analysis.keyword_match && (
                  <Collapsible
                    title={<>Keyword Match — <span className="text-white ml-1">{analysis.keyword_match.match_score}%</span></>}
                    defaultOpen>
                    <div className="flex flex-col gap-5">
                      {analysis.keyword_match.missing.length > 0 && (
                        <div>
                          <p className="text-[10px] text-red-400 font-mono uppercase mb-2">Missing ({analysis.keyword_match.missing.length})</p>
                          <div className="flex flex-wrap gap-2">{analysis.keyword_match.missing.map((kw, i) => <Chip key={i} label={kw} color="text-red-400 border-red-400/30 bg-red-400/5" />)}</div>
                        </div>
                      )}
                      {analysis.keyword_match.found.length > 0 && (
                        <div>
                          <p className="text-[10px] text-green-400 font-mono uppercase mb-2">Found ({analysis.keyword_match.found.length})</p>
                          <div className="flex flex-wrap gap-2">{analysis.keyword_match.found.map((kw, i) => <Chip key={i} label={kw} color="text-green-400 border-green-400/30 bg-green-400/5" />)}</div>
                        </div>
                      )}
                      {analysis.keyword_match.partial.length > 0 && (
                        <div>
                          <p className="text-[10px] text-yellow-400 font-mono uppercase mb-2">Partial ({analysis.keyword_match.partial.length})</p>
                          <div className="flex flex-wrap gap-2">{analysis.keyword_match.partial.map((kw, i) => <Chip key={i} label={kw} color="text-yellow-400 border-yellow-400/30 bg-yellow-400/5" />)}</div>
                        </div>
                      )}
                    </div>
                  </Collapsible>
                )}

                {/* Recommendations */}
                {analysis.recommendations?.length > 0 && (
                  <Collapsible title="Recommendations" defaultOpen>
                    <ol className="flex flex-col gap-4">
                      {analysis.recommendations.map((r, i) => (
                        <li key={i} className="flex gap-4">
                          <span className="text-[10px] font-mono text-[#444] shrink-0 mt-1 w-5">{String(i + 1).padStart(2, '0')}</span>
                          <p className="text-sm text-[#aaa] leading-relaxed">{r}</p>
                        </li>
                      ))}
                    </ol>
                  </Collapsible>
                )}

                {/* Generate LaTeX */}
                <button onClick={handleGenerateLatex} disabled={isGenerating}
                  className="w-full glass-strong rounded-2xl border border-violet-500/30 text-white text-xs font-semibold py-4 uppercase tracking-widest hover:bg-violet-500/10 transition-all disabled:opacity-40 flex justify-center items-center gap-2">
                  {isGenerating
                    ? <><Cpu size={13} className="animate-spin" /> Generating LaTeX...</>
                    : <><Code size={13} className="text-violet-400" /> Generate ATS-Optimized LaTeX</>}
                </button>

                {/* LaTeX output */}
                {latexCode && (
                  <div className="glass rounded-2xl p-5">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-[10px] text-[#555] font-mono uppercase tracking-widest flex items-center gap-2">
                        <Code size={10} className="text-violet-400" /> LaTeX Output
                      </p>
                      <button
                        onClick={() => { navigator.clipboard.writeText(latexCode); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                        className="text-[10px] font-mono glass px-3 py-1.5 rounded-lg text-white hover:bg-white/10 transition-colors flex items-center gap-1.5">
                        {copied ? <><Check size={10} className="text-green-400" /> COPIED</> : 'COPY'}
                      </button>
                    </div>
                    <pre className="bg-black/50 border border-white/5 rounded-xl p-4 text-xs font-mono text-[#888] overflow-auto max-h-[500px]">
                      <code>{latexCode}</code>
                    </pre>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
