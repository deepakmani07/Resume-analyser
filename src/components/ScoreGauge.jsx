import React from 'react';
import { Award, ShieldAlert, ShieldCheck, Zap, Info } from 'lucide-react';

export default function ScoreGauge({ overallScore, pillars }) {
  // Score verdict helper
  const getVerdict = (score) => {
    if (score >= 85) {
      return {
        label: 'ATS READY - TOP TIER',
        color: 'text-emerald-400',
        bg: 'bg-emerald-950/80 border-emerald-800',
        icon: ShieldCheck,
        badge: 'High Interview Likelihood'
      };
    } else if (score >= 70) {
      return {
        label: 'ATS PASSING - STRONG',
        color: 'text-cyan-400',
        bg: 'bg-cyan-950/80 border-cyan-800',
        icon: ShieldCheck,
        badge: 'Competitive Resume'
      };
    } else if (score >= 50) {
      return {
        label: 'NEEDS IMPROVEMENT',
        color: 'text-amber-400',
        bg: 'bg-amber-950/80 border-amber-800',
        icon: ShieldAlert,
        badge: 'Risk of ATS Filtering'
      };
    } else {
      return {
        label: 'POOR ATS COMPLIANCE',
        color: 'text-red-400',
        bg: 'bg-red-950/80 border-red-800',
        icon: ShieldAlert,
        badge: 'High Rejection Risk'
      };
    }
  };

  const verdict = getVerdict(overallScore);
  const VerdictIcon = verdict.icon;

  // SVG Gauge calculations
  const strokeWidth = 10;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-cyan-400" />
            Overall ATS Score
          </h2>
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${verdict.bg} ${verdict.color}`}>
            {verdict.badge}
          </span>
        </div>

        {/* Circular Gauge */}
        <div className="flex flex-col items-center justify-center my-4">
          <div className="relative flex items-center justify-center">
            <svg className="transform -rotate-90 w-44 h-44">
              {/* Background Circle */}
              <circle
                cx="88"
                cy="88"
                r={radius}
                className="stroke-slate-800"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Progress Circle */}
              <circle
                cx="88"
                cy="88"
                r={radius}
                className={`transition-all duration-1000 ease-out ${
                  overallScore >= 80 ? 'stroke-emerald-400' : overallScore >= 60 ? 'stroke-cyan-400' : overallScore >= 40 ? 'stroke-amber-400' : 'stroke-red-500'
                }`}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-extrabold text-white font-mono tracking-tight">
                {overallScore}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                out of 100
              </span>
            </div>
          </div>

          <div className={`mt-3 flex items-center gap-2 text-xs font-bold ${verdict.color}`}>
            <VerdictIcon className="h-4 w-4" />
            <span>{verdict.label}</span>
          </div>
        </div>
      </div>

      {/* 5 Pillars Breakdown */}
      <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          5 Score Pillars Breakdown
        </h3>

        {pillars.map((pillar) => (
          <div key={pillar.name} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                {pillar.name}
                <span className="text-[10px] text-slate-500 font-normal">({pillar.weight})</span>
              </span>
              <span className="font-mono font-bold text-white">{pillar.score}%</span>
            </div>

            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  pillar.score >= 75 ? 'bg-emerald-400' : pillar.score >= 50 ? 'bg-amber-400' : 'bg-red-400'
                }`}
                style={{ width: `${pillar.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
