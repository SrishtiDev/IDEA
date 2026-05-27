"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResultUrl(null);
      setError(null);
      setStatus("");
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResultUrl(null);
    setStatus("Uploading resume...");

    try {
      const formData = new FormData();
      formData.append("resume", file);
      
      // Assume job description is optional for now or hardcoded
      formData.append("jobDescription", "Senior Software Engineer");

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

      const response = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      setStatus("Processing complete!");
      
      // Assuming the backend returns a PDF directly as a blob
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      setResultUrl(downloadUrl);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-20 px-6">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Analyzer</h1>
        <p className="text-gray-600 mb-8">Upload your resume to get an AI-powered ATS analysis and enhanced LaTeX version.</p>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Resume (PDF)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100 cursor-pointer border border-gray-300 rounded-md p-2"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>

          {status && !error && (
            <div className="p-4 bg-blue-50 text-blue-700 rounded-md border border-blue-100 text-sm">
              {status}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-100 text-sm">
              {error}
            </div>
          )}

          {resultUrl && (
            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Results Ready</h3>
              <a 
                href={resultUrl} 
                download={`enhanced_${file?.name || 'resume.pdf'}`}
                className="inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
              >
                Download Enhanced Resume
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
