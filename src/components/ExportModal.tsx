import React, { useState, useEffect } from 'react';
import { Download, Copy, Check, FileText, Printer, Code, X } from 'lucide-react';
import { AnalysisResult } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeText: string;
  analysis: AnalysisResult;
  role: string;
  onOpenAtsPreview?: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  resumeText,
  analysis,
  role,
  onOpenAtsPreview
}) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = async (content: string, formatName: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedFormat(formatName);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const jsonReport = JSON.stringify({
    timestamp: new Date().toISOString(),
    targetRole: role,
    atsOverallScore: analysis.overall,
    breakdown: {
      technicalSkillsScore: analysis.skills.score,
      actionVerbsScore: analysis.verbs.score,
      quantifiableProofScore: analysis.proof.score,
      formatHygieneScore: analysis.format.score
    },
    matchedKeywords: analysis.matched,
    missingKeywords: analysis.missing,
    resumeText: resumeText
  }, null, 2);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-dialog-title"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div className="w-full max-w-xl bg-slate-900 border border-white/20 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Download className="w-5 h-5 text-lime-300" aria-hidden="true" />
            <h3 id="export-dialog-title" className="font-display text-lg font-bold text-white tracking-tight">
              Export Tailored Resume & ATS Report
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
            aria-label="Close export dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <p className="text-xs text-slate-300 mt-3">
          Select your preferred export format for application submissions or offline review.
        </p>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          {/* Format 1: Print / PDF */}
          <div className="p-4 rounded-xl border border-white/15 bg-black/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-bold text-white text-xs mb-1">
                <Printer className="w-4 h-4 text-cyan-300" aria-hidden="true" />
                <span>PDF Document (ATS Standard)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Opens native print dialog formatted for single-column ATS scan engines.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenAtsPreview) {
                  onOpenAtsPreview();
                } else {
                  window.print();
                }
              }}
              className="mt-4 w-full min-h-[44px] py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition cursor-pointer"
            >
              Open Print / PDF Preview
            </button>
          </div>

          {/* Format 2: Markdown File */}
          <div className="p-4 rounded-xl border border-white/15 bg-black/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-bold text-white text-xs mb-1">
                <FileText className="w-4 h-4 text-lime-300" aria-hidden="true" />
                <span>Markdown (.md)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Raw clean Markdown format with headers, bullet points, and skills.
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => handleCopy(resumeText, 'md')}
                className="flex-1 min-h-[44px] py-2 rounded-xl bg-white/[0.1] hover:bg-white/[0.2] text-xs font-semibold text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
                aria-label="Copy markdown resume"
              >
                {copiedFormat === 'md' ? <Check className="w-4 h-4 text-lime-400" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
                <span>{copiedFormat === 'md' ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownloadFile(resumeText, 'tailored-resume.md', 'text/markdown')}
                className="flex-1 min-h-[44px] py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs transition cursor-pointer"
              >
                Download
              </button>
            </div>
          </div>

          {/* Format 3: Plain Text */}
          <div className="p-4 rounded-xl border border-white/15 bg-black/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-bold text-white text-xs mb-1">
                <FileText className="w-4 h-4 text-slate-300" aria-hidden="true" />
                <span>Plain Text (.txt)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Clean text without markdown symbols for older portal paste inputs.
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => handleCopy(resumeText.replace(/[#*`_]/g, ''), 'txt')}
                className="flex-1 min-h-[44px] py-2 rounded-xl bg-white/[0.1] hover:bg-white/[0.2] text-xs font-semibold text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
                aria-label="Copy plain text resume"
              >
                {copiedFormat === 'txt' ? <Check className="w-4 h-4 text-lime-400" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
                <span>{copiedFormat === 'txt' ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownloadFile(resumeText.replace(/[#*`_]/g, ''), 'tailored-resume.txt', 'text/plain')}
                className="flex-1 min-h-[44px] py-2 rounded-xl bg-white/[0.2] hover:bg-white/[0.3] text-white font-bold text-xs transition cursor-pointer"
              >
                Download
              </button>
            </div>
          </div>

          {/* Format 4: JSON Data */}
          <div className="p-4 rounded-xl border border-white/15 bg-black/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-bold text-white text-xs mb-1">
                <Code className="w-4 h-4 text-violet-300" aria-hidden="true" />
                <span>Full JSON Analysis</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Complete match percentages, keywords, and ATS health score breakdown.
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => handleCopy(jsonReport, 'json')}
                className="flex-1 min-h-[44px] py-2 rounded-xl bg-white/[0.1] hover:bg-white/[0.2] text-xs font-semibold text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
                aria-label="Copy JSON analysis report"
              >
                {copiedFormat === 'json' ? <Check className="w-4 h-4 text-lime-400" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
                <span>{copiedFormat === 'json' ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownloadFile(jsonReport, 'resumesynth-analysis.json', 'application/json')}
                className="flex-1 min-h-[44px] py-2 rounded-xl bg-violet-400 hover:bg-violet-300 text-slate-950 font-bold text-xs transition cursor-pointer"
              >
                Download
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
