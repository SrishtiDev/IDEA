'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Cpu, AlertTriangle, FileText } from 'lucide-react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8040';

export default function CompilePage() {
  const [latexCode, setLatexCode] = useState('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('hireorbit_latex');
    if (stored) {
      setLatexCode(stored);
    }
  }, []);

  const handleCompile = async () => {
    if (!latexCode.trim()) return;
    setIsCompiling(true);
    setError(null);
    setPdfUrl(null);
    setPdfBlob(null);

    try {
      const res = await fetch(`${API}/api/analyze/compile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latexCode }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Compilation failed');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setPdfBlob(blob);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Compilation failed');
    } finally {
      setIsCompiling(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] pt-28 pb-12 px-6">
      {/* Ambient */}
      <div className="orb w-[500px] h-[500px] bg-violet-600/10 top-0 left-[-100px]" />
      <div className="orb w-[400px] h-[400px] bg-blue-600/10 bottom-0 right-[-100px]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/analyze" className="text-xs text-[#555] hover:text-white transition-colors flex items-center gap-1.5 mb-3">
              <ArrowLeft size={12} /> Back to analyzer
            </Link>
            <h1 className="text-2xl font-semibold text-white tracking-tight">LaTeX Compiler</h1>
            <p className="text-sm text-[#555] mt-1">Edit your LaTeX code and compile it to a downloadable PDF</p>
          </div>
        </div>

        <div className="w-full h-px bg-white/10 mb-6" />

        {/* Action bar */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={handleCompile}
            disabled={!latexCode.trim() || isCompiling}
            className="bg-white text-black font-mono text-sm font-bold px-6 py-3 rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            {isCompiling
              ? <><Cpu size={16} className="animate-spin" /> COMPILING...</>
              : <><FileText size={16} /> COMPILE TO PDF</>}
          </button>

          {pdfBlob && (
            <button
              onClick={handleDownload}
              className="glass-strong border border-green-500/30 text-green-400 font-mono text-sm font-bold px-6 py-3 rounded-xl hover:bg-green-500/10 transition-all flex items-center gap-2"
            >
              <Download size={16} /> DOWNLOAD PDF
            </button>
          )}
        </div>

        {error && (
          <div className="glass rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400 font-mono mb-6 flex items-center gap-2">
            <AlertTriangle size={12} /> {error}
          </div>
        )}

        {/* Split view */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[70vh]">
          {/* Left: LaTeX Editor */}
          <div className="glass rounded-2xl p-5 flex flex-col">
            <p className="text-xs text-[#888] font-mono uppercase tracking-widest mb-4">LaTeX Source</p>
            <textarea
              value={latexCode}
              onChange={(e) => setLatexCode(e.target.value)}
              className="flex-1 w-full bg-black/40 border border-white/5 rounded-xl p-4 text-xs font-mono text-[#ccc] focus:outline-none focus:border-violet-500/50 transition-colors resize-none placeholder:text-[#444] leading-relaxed"
              placeholder="Paste or edit your LaTeX code here..."
              spellCheck={false}
            />
          </div>

          {/* Right: PDF Preview */}
          <div className="glass rounded-2xl p-5 flex flex-col">
            <p className="text-xs text-[#888] font-mono uppercase tracking-widest mb-4">PDF Preview</p>
            <div className="flex-1 bg-black/40 border border-white/5 rounded-xl overflow-hidden flex items-center justify-center min-h-[500px]">
              {pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  className="w-full h-full min-h-[500px] rounded-xl"
                  title="PDF Preview"
                />
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <FileText size={28} className="text-[#444]" />
                  </div>
                  <p className="text-sm text-[#555] font-mono">
                    {isCompiling ? 'Compiling...' : 'Compiled PDF will appear here'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
