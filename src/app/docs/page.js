"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Upload,
  Sparkles,
  Loader2,
  ArrowRight,
  AlertCircle,
  FileCheck,
  CheckCircle2,
} from "lucide-react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function DocsPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    setError("");
    if (!selectedFile) return;

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Please upload a PDF or .docx file.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError("");
    setResults(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/docs", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process document");
      }

      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExplore = (idea) => {
    const params = new URLSearchParams({
      title: idea.title,
      description: idea.description,
      techStack: idea.techStack.join(", "),
    });
    router.push(`/explore?${params.toString()}`);
  };

  return (
    <div className="absolute inset-0 overflow-y-auto pt-24 pb-16 px-4 sm:px-8 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-xs uppercase tracking-[0.3em] text-primary/60 font-['Space_Grotesk'] font-semibold">
              Document Intelligence
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-['Space_Grotesk'] text-[#E1E0CC] tracking-tight mb-4">
            Upload Your Specs
          </h1>
          <p className="text-gray-400 font-['Manrope'] text-base md:text-lg max-w-2xl mx-auto">
            Transform your PRDs, project briefs, or requirement docs into buildable project ideas and architectural blueprints.
          </p>
        </motion.div>

        {/* Upload Zone */}
        {!results && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current.click()}
              className={`glass-panel p-12 rounded-[2.5rem] border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-6 group ${
                file ? "border-primary/50 bg-primary/5" : "border-white/10 hover:border-primary/30 hover:bg-white/5"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.docx"
                className="hidden"
              />
              
              <div className={`h-20 w-20 rounded-full flex items-center justify-center transition-all ${
                file ? "bg-primary/20 text-primary" : "bg-white/5 text-gray-500 group-hover:scale-110 group-hover:text-primary/50"
              }`}>
                {file ? <FileCheck className="h-10 w-10" /> : <Upload className="h-10 w-10" />}
              </div>

              <div className="text-center">
                <p className="text-xl font-['Space_Grotesk'] text-[#E1E0CC] mb-2">
                  {file ? file.name : "Drop your requirement doc here"}
                </p>
                <p className="text-sm text-gray-500 font-['Manrope']">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Supports PDF and .docx up to 5MB"}
                </p>
              </div>

              {file && !loading && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubmit();
                  }}
                  className="mt-4 group inline-flex items-center gap-3 rounded-full bg-primary py-3 px-8 text-sm font-semibold text-black transition-all shadow-[0_0_20px_rgba(192,193,255,0.3)] hover:shadow-[0_0_30px_rgba(192,193,255,0.5)]"
                >
                  Analyze Document
                  <Sparkles className="h-4 w-4" />
                </button>
              )}

              {loading && (
                <div className="mt-4 flex items-center gap-3 text-primary font-semibold">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </div>
              )}
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-6 flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              {/* Result Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                <div>
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Analysis Complete</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold font-['Space_Grotesk'] text-[#E1E0CC] mb-2">
                    {results.projectTitle}
                  </h2>
                  <p className="text-gray-400 font-['Manrope'] text-lg">
                    {results.summary}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setResults(null);
                    setFile(null);
                  }}
                  className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-primary transition-colors"
                >
                  Upload New Doc
                </button>
              </div>

              {/* Ideas Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {results.ideas.map((idea, i) => (
                  <motion.div
                    key={idea.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-panel p-8 rounded-[2rem] border border-white/5 hover:border-primary/30 transition-all group relative overflow-hidden flex flex-col h-full"
                  >
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />

                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 text-gray-400">
                          {idea.difficulty}
                        </span>
                        <Sparkles className="h-4 w-4 text-primary/40" />
                      </div>

                      <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-[#E1E0CC] group-hover:text-primary transition-colors mb-4">
                        {idea.title}
                      </h3>

                      <p className="text-gray-400 font-['Manrope'] leading-relaxed mb-6 group-hover:text-gray-300 transition-colors flex-grow">
                        {idea.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-8">
                        {idea.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 rounded-lg bg-white/5 text-[10px] text-gray-400 font-semibold tracking-wider uppercase border border-white/5"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => handleExplore(idea)}
                        className="w-full group/btn inline-flex items-center justify-between rounded-2xl bg-white/5 py-4 px-6 text-sm font-bold uppercase tracking-[0.15em] text-[#E1E0CC] transition-all hover:bg-primary hover:text-black"
                      >
                        Explore Architecture
                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
