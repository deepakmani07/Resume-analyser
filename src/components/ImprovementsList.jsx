import React, { useState } from 'react';
import { Sparkles, Copy, Check, ArrowRight, Zap } from 'lucide-react';

export default function ImprovementsList({ improvements }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl transition-all">
      <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            RAG AI Actionable Bullet Rewrites
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Side-by-side Before & After high-impact bullet points powered by power-verb injection
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
          {improvements.length} Rewrites Ready
        </span>
      </div>

      {improvements.length === 0 ? (
        <div className="p-8 text-center bg-slate-950/50 rounded-xl border border-slate-800 text-slate-400 text-xs">
          No bullet point rewrites needed! Your experience section bullet points already contain strong action verbs and metrics.
        </div>
      ) : (
        <div className="space-y-4">
          {improvements.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Section: <strong className="text-white">{item.section}</strong>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {item.impactScoreBoost}
                </span>
              </div>

              {/* Side by side comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Original (Before) */}
                <div className="p-3 rounded-lg bg-red-950/20 border border-red-900/30 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-red-400 block">Original (Weak):</span>
                  <p className="text-red-200/90 font-mono line-through opacity-80 leading-relaxed">
                    "{item.originalBullet}"
                  </p>
                </div>

                {/* Rewritten (After) */}
                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/30 space-y-1 relative group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400">AI Rewritten (ATS Optimized):</span>
                    <button
                      onClick={() => handleCopy(item.rewrittenBullet, item.id)}
                      className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800 transition-all"
                      title="Copy rewritten bullet to clipboard"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="h-3 w-3" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-emerald-100 font-mono font-medium leading-relaxed">
                    "{item.rewrittenBullet}"
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                <span><strong className="text-slate-300">Optimization:</strong> {item.changesMade}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
