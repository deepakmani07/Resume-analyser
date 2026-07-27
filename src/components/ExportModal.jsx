import React from 'react';
import { Download, FileText, Code, X, CheckCircle2 } from 'lucide-react';
import jsPDF from 'jspdf';

export default function ExportModal({ isOpen, onClose, analysisResult, targetRole }) {
  if (!isOpen || !analysisResult) return null;

  const { overallScore, pillars, mistakes, improvements, keywordAnalysis } = analysisResult;

  const exportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title & Header
    doc.setFillColor(15, 23, 42); // dark slate
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('RAG AI Resume Analysis Audit Report', 14, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(`Target Role: ${targetRole} | Generated: ${new Date().toLocaleDateString()}`, 14, 30);

    let yPos = 50;

    // Overall Score
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, yPos, pageWidth - 28, 25, 3, 3, 'F');

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`Overall ATS Score: ${overallScore} / 100`, 20, yPos + 16);

    yPos += 35;

    // 5 Pillars
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('5 Score Pillars Breakdown:', 14, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    pillars.forEach((p) => {
      doc.text(`• ${p.name}: ${p.score}% (${p.weight})`, 20, yPos);
      yPos += 6;
    });

    yPos += 8;

    // Mistakes Summary
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Detected ATS Blockers & Mistakes (${mistakes.length}):`, 14, yPos);
    yPos += 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    mistakes.slice(0, 5).forEach((m, idx) => {
      doc.setTextColor(220, 38, 38);
      doc.text(`[${m.severity.toUpperCase()}] ${m.title}`, 20, yPos);
      yPos += 5;
      doc.setTextColor(71, 85, 105);
      doc.text(`Fix: ${m.fix.slice(0, 90)}`, 24, yPos);
      yPos += 7;
    });

    yPos += 8;

    // Actionable Rewrites
    if (improvements.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Sample Actionable AI Bullet Point Rewrites:', 14, yPos);
      yPos += 8;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      improvements.slice(0, 3).forEach((imp) => {
        doc.setTextColor(100, 116, 139);
        doc.text(`Original: "${imp.originalBullet.slice(0, 80)}"`, 20, yPos);
        yPos += 5;
        doc.setTextColor(16, 185, 129);
        doc.text(`Rewritten: "${imp.rewrittenBullet.slice(0, 85)}"`, 20, yPos);
        yPos += 8;
      });
    }

    doc.save(`RAG_Resume_Analysis_${targetRole.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
    onClose();
  };

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(analysisResult, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `RAG_Resume_Analysis_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Download className="h-5 w-5 text-cyan-400" />
            Export Analysis Report
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300">
          Download your complete RAG vector analysis report containing ATS score breakdown, detected mistakes, and actionable rewrites.
        </p>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={exportPDF}
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500 flex flex-col items-center gap-2 text-center transition-all group"
          >
            <div className="h-10 w-10 rounded-full bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-all">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Download PDF</span>
              <span className="text-[10px] text-slate-400">Formatted Audit Document</span>
            </div>
          </button>

          <button
            onClick={exportJSON}
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500 flex flex-col items-center gap-2 text-center transition-all group"
          >
            <div className="h-10 w-10 rounded-full bg-purple-950/80 border border-purple-800 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-all">
              <Code className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Download JSON</span>
              <span className="text-[10px] text-slate-400">Raw Data & Chunks</span>
            </div>
          </button>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
