import React from 'react';
import { Sparkles, FileText, Key, Download, RefreshCw, Cpu } from 'lucide-react';

export default function Header({
  onOpenApiKeyModal,
  onReset,
  hasAnalysis,
  onExportReport,
  hasCustomKey
}) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/80 border-b border-slate-800 px-6 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onReset}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                RAG Resume AI
              </h1>
              <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                PRO RAG CORE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Retrieval-Augmented ATS Analyzer & Actionable Optimizer
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            <span>Vector Engine: <strong className="text-emerald-400">Active</strong></span>
          </div>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-2 text-xs font-medium px-3.5 py-2 rounded-lg border transition-all ${
              hasCustomKey
                ? 'bg-purple-950/60 text-purple-300 border-purple-700 hover:bg-purple-900/80'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750 hover:text-white'
            }`}
            title="Optional LLM Key Integration"
          >
            <Key className="h-3.5 w-3.5" />
            <span>{hasCustomKey ? 'Gemini Key Linked' : 'LLM API Key (Optional)'}</span>
          </button>

          {hasAnalysis && (
            <>
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>New Analysis</span>
              </button>

              <button
                onClick={onExportReport}
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/25 hover:opacity-95 transition-all"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Report</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
