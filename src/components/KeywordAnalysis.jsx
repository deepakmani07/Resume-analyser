import React, { useState } from 'react';
import { Key, CheckCircle, XCircle, Copy, Check } from 'lucide-react';

export default function KeywordAnalysis({ keywordAnalysis, targetRole }) {
  const { matchPercentage, presentKeywords, missingKeywords } = keywordAnalysis;
  const [copiedKw, setCopiedKw] = useState(false);

  const handleCopyMissing = () => {
    navigator.clipboard.writeText(missingKeywords.join(', '));
    setCopiedKw(true);
    setTimeout(() => setCopiedKw(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Key className="h-5 w-5 text-cyan-400" />
            Job Description & Role Keyword Match
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Keywords extracted vs target role profile (<strong className="text-slate-200">{targetRole}</strong>)
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Keyword Match</span>
            <span className="text-lg font-extrabold font-mono text-cyan-400">{matchPercentage}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Present Keywords */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4" />
              Found Keywords ({presentKeywords.length})
            </h3>
          </div>

          <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800 min-h-[120px] items-start">
            {presentKeywords.length === 0 ? (
              <span className="text-xs text-slate-500 italic p-2">No target keywords matched.</span>
            ) : (
              presentKeywords.map((kw) => (
                <span
                  key={kw}
                  className="text-xs font-medium px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 flex items-center gap-1"
                >
                  <CheckCircle className="h-3 w-3 text-emerald-400" />
                  {kw}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <XCircle className="h-4 w-4" />
              Missing Keywords Gap ({missingKeywords.length})
            </h3>

            {missingKeywords.length > 0 && (
              <button
                onClick={handleCopyMissing}
                className="flex items-center gap-1 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 transition-all"
              >
                {copiedKw ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" /> Copied All
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> Copy Missing
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800 min-h-[120px] items-start">
            {missingKeywords.length === 0 ? (
              <span className="text-xs text-emerald-400 p-2 font-medium">
                Awesome! You have matched all primary industry keywords for this role.
              </span>
            ) : (
              missingKeywords.map((kw) => (
                <span
                  key={kw}
                  className="text-xs font-medium px-2.5 py-1 rounded-lg bg-red-950/60 text-red-300 border border-red-800/80 flex items-center gap-1"
                >
                  <XCircle className="h-3 w-3 text-red-400" />
                  {kw}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
