import React, { useState } from 'react';
import { Key, X, Check, ShieldCheck } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, apiKey, setApiKey }) {
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(keyInput.trim());
    localStorage.setItem('rag_gemini_api_key', keyInput.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setKeyInput('');
    setApiKey('');
    localStorage.removeItem('rag_gemini_api_key');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Key className="h-5 w-5 text-purple-400" />
            LLM API Key Integration (Optional)
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-300">
          <p>
            The RAG Resume Analyzer contains a complete <strong>Offline Smart Vector Core</strong> that works out of the box with zero API costs.
          </p>
          <p className="text-slate-400">
            If you wish to augment the retrieved RAG context with live Google Gemini AI synthesis, enter your API key below:
          </p>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Google Gemini API Key
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>

          <div className="p-3 bg-purple-950/30 border border-purple-800/40 rounded-xl flex items-center gap-2 text-[11px] text-purple-300">
            <ShieldCheck className="h-4 w-4 shrink-0 text-purple-400" />
            <span>Your key is stored strictly locally in your browser session and never sent to external third parties.</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          {apiKey && (
            <button
              onClick={handleClear}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-red-950 text-red-400 hover:bg-red-900 border border-red-800 transition-all"
            >
              Clear Key
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/20 hover:opacity-95 transition-all flex items-center gap-1.5"
          >
            {saved ? (
              <>
                <Check className="h-3.5 w-3.5" /> Saved!
              </>
            ) : (
              'Save Key'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
