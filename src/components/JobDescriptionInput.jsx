import React from 'react';
import { Target, Briefcase, FileCode } from 'lucide-react';
import { ROLE_KEYWORD_PROFILES } from '../rag/knowledgeBase.js';

export default function JobDescriptionInput({
  targetRole,
  setTargetRole,
  jobDescription,
  setJobDescription
}) {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl transition-all">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Target className="h-5 w-5 text-indigo-400" />
          2. Target Role & Job Description (Optional)
        </h2>
        <span className="text-xs text-slate-400">Refines RAG Keyword Indexing</span>
      </div>

      <div className="space-y-4">
        {/* Role Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-indigo-400" />
            Target Industry Profile
          </label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all"
          >
            {Object.keys(ROLE_KEYWORD_PROFILES).map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* Job Description Textarea */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <FileCode className="h-3.5 w-3.5 text-indigo-400" />
            Paste Target Job Description (JD)
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job post responsibilities, required technical stack, and qualifications here..."
            rows={4}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono transition-all"
          />
        </div>
      </div>
    </div>
  );
}
