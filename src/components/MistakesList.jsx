import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle, Filter } from 'lucide-react';

export default function MistakesList({ mistakes }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'critical' | 'warning' | 'info'

  const filteredMistakes = mistakes.filter((m) => {
    if (filter === 'all') return true;
    return m.severity === filter;
  });

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          label: 'CRITICAL BLOCKER',
          bg: 'bg-red-950/80 text-red-400 border-red-800',
          icon: AlertCircle
        };
      case 'warning':
        return {
          label: 'WARNING',
          bg: 'bg-amber-950/80 text-amber-400 border-amber-800',
          icon: AlertTriangle
        };
      case 'info':
      default:
        return {
          label: 'IMPROVEMENT',
          bg: 'bg-blue-950/80 text-blue-400 border-blue-800',
          icon: Info
        };
    }
  };

  const counts = {
    all: mistakes.length,
    critical: mistakes.filter((m) => m.severity === 'critical').length,
    warning: mistakes.filter((m) => m.severity === 'warning').length,
    info: mistakes.filter((m) => m.severity === 'info').length
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            Detected Mistakes & ATS Blockers
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {mistakes.length} issue{mistakes.length === 1 ? '' : 's'} identified by the RAG Vector Engine
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg transition-all font-medium ${
              filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({counts.all})
          </button>
          <button
            onClick={() => setFilter('critical')}
            className={`px-2.5 py-1 rounded-lg transition-all font-medium ${
              filter === 'critical' ? 'bg-red-950 text-red-400 border border-red-800' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Critical ({counts.critical})
          </button>
          <button
            onClick={() => setFilter('warning')}
            className={`px-2.5 py-1 rounded-lg transition-all font-medium ${
              filter === 'warning' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Warnings ({counts.warning})
          </button>
        </div>
      </div>

      {filteredMistakes.length === 0 ? (
        <div className="p-8 text-center bg-slate-950/50 rounded-xl border border-slate-800">
          <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-white">No issues found in this category!</p>
          <p className="text-xs text-slate-400 mt-1">Your resume passes all verified ATS checks for this filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMistakes.map((item) => {
            const badge = getSeverityBadge(item.severity);
            const BadgeIcon = badge.icon;

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${badge.bg}`}>
                      <BadgeIcon className="h-3 w-3" />
                      {badge.label}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      Category: <strong className="text-slate-300">{item.category}</strong>
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  {item.title}
                </h3>

                {item.snippet && (
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-amber-200/90">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Found Snippet:</span>
                    {item.snippet}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
                    <span className="font-bold text-red-400 block mb-1">Why it hurts ATS score:</span>
                    <p className="text-slate-300 leading-relaxed">{item.explanation}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-900/40">
                    <span className="font-bold text-emerald-400 block mb-1">Actionable Fix:</span>
                    <p className="text-emerald-200/90 leading-relaxed">{item.fix}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
