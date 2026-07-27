import React from 'react';
import { Eye, Layers, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function ResumeHeatmap({ sections, bulletChunks }) {
  const bulletMap = new Map();
  bulletChunks.forEach((b) => {
    bulletMap.set(b.cleanText.toLowerCase(), b);
  });

  const getBulletStatus = (cleanText) => {
    const text = cleanText.toLowerCase();
    const hasMetric = /\b(\d+(\.\d+)?%|\$\d+|\d+\+|\d+x|\d+\s*(users|clients|percent|million|billion|k|ms|s|hours|days|teams|projects))\b/i.test(text) || /\b\d+\b/.test(text);
    const hasWeakVerb = /\b(worked on|responsible for|helped with|handled|assisted|did|involved in)\b/i.test(text);

    if (hasMetric && !hasWeakVerb) {
      return {
        badge: 'Strong Impact',
        color: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-200',
        icon: CheckCircle2,
        iconColor: 'text-emerald-400'
      };
    } else if (hasWeakVerb) {
      return {
        badge: 'Weak Lead-in',
        color: 'border-amber-500/50 bg-amber-950/20 text-amber-200',
        icon: AlertTriangle,
        iconColor: 'text-amber-400'
      };
    } else {
      return {
        badge: 'Needs Quantification',
        color: 'border-cyan-500/30 bg-cyan-950/10 text-cyan-200',
        icon: ShieldAlert,
        iconColor: 'text-cyan-400'
      };
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl transition-all">
      <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Eye className="h-5 w-5 text-indigo-400" />
            Interactive Resume Heatmap & Structure
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Parsed structural sections with ATS strength highlighting
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
            Strong Impact
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
            Weak Lead-in
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((sec, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="h-4 w-4 text-indigo-400" />
                {sec.title}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                {sec.standardType}
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {sec.lines.map((line, lineIdx) => {
                const cleanLine = line.replace(/^[\•\-\*\–\d\.\)\s]+/, '').trim();
                const matchedBullet = bulletMap.get(cleanLine.toLowerCase());

                if (matchedBullet) {
                  const status = getBulletStatus(matchedBullet.cleanText);
                  const StatusIcon = status.icon;

                  return (
                    <div
                      key={lineIdx}
                      className={`p-2.5 rounded-lg border flex items-start gap-2.5 transition-all ${status.color}`}
                    >
                      <StatusIcon className={`h-4 w-4 shrink-0 mt-0.5 ${status.iconColor}`} />
                      <div className="flex-1">
                        <p className="leading-relaxed">{line}</p>
                        <span className="text-[9px] font-sans font-bold uppercase tracking-wider opacity-75 mt-1 block">
                          Status: {status.badge}
                        </span>
                      </div>
                    </div>
                  );
                }

                return (
                  <p key={lineIdx} className="text-slate-300 px-2 py-1">
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
