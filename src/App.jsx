import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import ResumeUploader from './components/ResumeUploader';
import JobDescriptionInput from './components/JobDescriptionInput';
import ScoreGauge from './components/ScoreGauge';
import MistakesList from './components/MistakesList';
import ImprovementsList from './components/ImprovementsList';
import KeywordAnalysis from './components/KeywordAnalysis';
import ResumeHeatmap from './components/ResumeHeatmap';
import ApiKeyModal from './components/ApiKeyModal';
import ExportModal from './components/ExportModal';
import { analyzeResume } from './rag/analyzer';
import { SAMPLE_RESUMES } from './data/sampleResumes';
import { Sparkles, ArrowRight, CheckCircle, RefreshCw, Cpu } from 'lucide-react';

export default function App() {
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const [apiKey, setApiKey] = useState(() => localStorage.getItem('rag_gemini_api_key') || '');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Auto-select initial sample for instant wow factor
  useEffect(() => {
    const defaultSample = SAMPLE_RESUMES[0];
    setResumeText(defaultSample.resumeText);
    setFileName(defaultSample.title);
    setJobDescription(defaultSample.jobDescription);
    setTargetRole(defaultSample.role);
  }, []);

  const handleSelectSample = (sample) => {
    setResumeText(sample.resumeText);
    setFileName(sample.title);
    setJobDescription(sample.jobDescription);
    setTargetRole(sample.role);
    setAnalysisResult(null);
  };

  const handleAnalyze = () => {
    if (!resumeText.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      const result = analyzeResume(resumeText, jobDescription, targetRole);
      setAnalysisResult(result);
      setIsAnalyzing(false);

      if (result.overallScore >= 80) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      // Scroll smoothly down to analysis results
      setTimeout(() => {
        const resultsEl = document.getElementById('analysis-results-section');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }, 600);
  };

  const handleReset = () => {
    const defaultSample = SAMPLE_RESUMES[0];
    setResumeText(defaultSample.resumeText);
    setFileName(defaultSample.title);
    setJobDescription(defaultSample.jobDescription);
    setTargetRole(defaultSample.role);
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-slate-950">
      {/* Header */}
      <Header
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onReset={handleReset}
        hasAnalysis={!!analysisResult}
        onExportReport={() => setIsExportModalOpen(true)}
        hasCustomKey={!!apiKey}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-xs font-semibold text-cyan-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Client-Side RAG Vector Matching Engine</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Supercharge Your Resume with{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              RAG AI Precision
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Instantly detect ATS blockers, quantify your bullet points, identify missing job description keywords, and receive side-by-side action-verb rewrites.
          </p>
        </div>

        {/* Input Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResumeUploader
            resumeText={resumeText}
            setResumeText={setResumeText}
            fileName={fileName}
            setFileName={setFileName}
            onSelectSample={handleSelectSample}
            isAnalyzing={isAnalyzing}
            onAnalyze={handleAnalyze}
          />

          <JobDescriptionInput
            targetRole={targetRole}
            setTargetRole={setTargetRole}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
          />
        </div>

        {/* Analyze CTA */}
        <div className="flex justify-center pt-2">
          <button
            onClick={handleAnalyze}
            disabled={!resumeText.trim() || isAnalyzing}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white font-bold text-base shadow-xl shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running Vector RAG Analysis...</span>
              </>
            ) : (
              <>
                <Cpu className="h-5 w-5" />
                <span>Analyze Resume & Generate ATS Score</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

        {/* ANALYSIS RESULTS DASHBOARD */}
        {analysisResult && (
          <div id="analysis-results-section" className="pt-8 border-t border-slate-800/80 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 p-6 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                  Analysis Complete
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Evaluated against 50+ ATS standards and target role profile: <strong className="text-cyan-400">{targetRole}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all"
                >
                  Download Report (PDF/JSON)
                </button>
              </div>
            </div>

            {/* Score Gauge & Keyword Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ScoreGauge
                  overallScore={analysisResult.overallScore}
                  pillars={analysisResult.pillars}
                />
              </div>

              <div className="lg:col-span-2">
                <KeywordAnalysis
                  keywordAnalysis={analysisResult.keywordAnalysis}
                  targetRole={targetRole}
                />
              </div>
            </div>

            {/* Mistakes & Blockers List */}
            <MistakesList mistakes={analysisResult.mistakes} />

            {/* Actionable AI Bullet Point Rewrites */}
            <ImprovementsList improvements={analysisResult.improvements} />

            {/* Parsed Section Heatmap */}
            <ResumeHeatmap
              sections={analysisResult.sections}
              bulletChunks={analysisResult.bulletChunks}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 RAG Resume AI — Advanced Retrieval-Augmented ATS Analyzer.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer" onClick={() => setIsApiKeyModalOpen(true)}>
              LLM API Key Settings
            </span>
            <span className="hover:text-slate-400 cursor-pointer" onClick={handleReset}>
              Reset Session
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        analysisResult={analysisResult}
        targetRole={targetRole}
      />
    </div>
  );
}
