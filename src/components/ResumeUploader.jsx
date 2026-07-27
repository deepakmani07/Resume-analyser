import React, { useState, useRef } from 'react';
import { Upload, FileText, Clipboard, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { parsePdf, readTextFile } from '../rag/parser.js';
import { SAMPLE_RESUMES } from '../data/sampleResumes.js';

export default function ResumeUploader({
  resumeText,
  setResumeText,
  fileName,
  setFileName,
  onSelectSample,
  isAnalyzing,
  onAnalyze
}) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'paste' | 'samples'
  const [dragActive, setDragActive] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setErrorMsg('');
    setLoadingFile(true);

    try {
      if (file.name.endsWith('.pdf')) {
        const { text } = await parsePdf(file);
        setResumeText(text);
        setFileName(file.name);
      } else if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const text = await readTextFile(file);
        setResumeText(text);
        setFileName(file.name);
      } else {
        setErrorMsg('Please upload a PDF or TXT file, or paste your text directly.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Error parsing file.');
    } finally {
      setLoadingFile(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl transition-all">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-cyan-400" />
          1. Upload or Select Resume
        </h2>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'upload' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'paste' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Paste Text
          </button>
          <button
            onClick={() => setActiveTab('samples')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'samples' ? 'bg-purple-950 text-purple-300 border border-purple-800' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Try Samples
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* TAB 1: File Upload */}
      {activeTab === 'upload' && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-cyan-400 bg-cyan-950/30 shadow-lg shadow-cyan-500/10'
              : fileName
              ? 'border-emerald-500/60 bg-emerald-950/10'
              : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/70'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.md"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />

          {loadingFile ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <div className="h-8 w-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-300">Extracting text & section chunks...</p>
            </div>
          ) : fileName ? (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="h-10 w-10 text-emerald-400 animate-bounce" />
              <p className="text-sm font-semibold text-white">{fileName}</p>
              <p className="text-xs text-emerald-400">File loaded successfully ({resumeText.length} characters parsed)</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFileName('');
                  setResumeText('');
                }}
                className="mt-2 text-xs text-slate-400 hover:text-red-400 underline"
              >
                Remove File
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-slate-800/80 flex items-center justify-center text-cyan-400">
                <Upload className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">
                  Drag and drop your resume <span className="text-cyan-400">(PDF or TXT)</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports client-side PDF parsing with 100% privacy
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Direct Paste */}
      {activeTab === 'paste' && (
        <div className="space-y-3">
          <textarea
            value={resumeText}
            onChange={(e) => {
              setResumeText(e.target.value);
              setFileName('Pasted Resume');
            }}
            placeholder="Paste your raw resume text here (Header, Work Experience, Skills, Education)..."
            rows={8}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono transition-all"
          />
          {resumeText && (
            <p className="text-xs text-slate-400 text-right">
              {resumeText.length} characters parsed
            </p>
          )}
        </div>
      )}

      {/* TAB 3: Samples */}
      {activeTab === 'samples' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_RESUMES.map((sample) => (
            <div
              key={sample.id}
              onClick={() => {
                onSelectSample(sample);
                setActiveTab('upload');
              }}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/60 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {sample.role}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    sample.scoreEstimate < 60 ? 'bg-amber-950 text-amber-400' : 'bg-emerald-950 text-emerald-400'
                  }`}>
                    Est. {sample.scoreEstimate}% ATS
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white mb-1">{sample.title}</h4>
                <p className="text-[11px] text-slate-400 leading-snug">{sample.description}</p>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-cyan-400 font-medium">
                <span>Load Sample</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
