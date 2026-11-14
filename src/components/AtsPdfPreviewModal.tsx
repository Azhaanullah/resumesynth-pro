import React, { useState } from 'react';
import { X, Printer, Download, Check, Sparkles, FileText, Settings2 } from 'lucide-react';
import { AnalysisResult } from '../types';

interface AtsPdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeText: string;
  role: string;
  analysis: AnalysisResult;
}

export const AtsPdfPreviewModal: React.FC<AtsPdfPreviewModalProps> = ({
  isOpen,
  onClose,
  resumeText,
  role,
  analysis,
}) => {
  const [fontStyle, setFontStyle] = useState<'serif' | 'sans'>('sans');
  const [fontSize, setFontSize] = useState<'compact' | 'normal'>('normal');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resumeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ats-preview-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-white/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Toolbar (hidden during print) */}
        <div className="p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-slate-950/80 no-print">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-lime-400/20 border border-lime-400/30 flex items-center justify-center text-lime-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 id="ats-preview-modal-title" className="text-sm font-bold text-white tracking-tight">
                ATS-Optimized Printable Document Preview
              </h3>
              <p className="text-xs text-slate-400">
                Single-column, machine-readable standard format compliant with all major ATS scanners.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Font Style Toggle */}
            <div className="flex p-0.5 rounded-lg bg-white/5 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setFontStyle('sans')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer font-sans ${
                  fontStyle === 'sans' ? 'bg-lime-400/20 text-lime-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Modern Sans
              </button>
              <button
                type="button"
                onClick={() => setFontStyle('serif')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer font-serif ${
                  fontStyle === 'serif' ? 'bg-lime-400/20 text-lime-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Classic Serif
              </button>
            </div>

            {/* Print / PDF Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-400 text-slate-950 font-bold text-xs hover:bg-lime-300 transition cursor-pointer shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            {/* Copy Text */}
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-lime-400" /> : <Download className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Document Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950 flex justify-center">
          <div
            id="ats-printable-document"
            className={`w-full max-w-[800px] min-h-[1050px] p-8 sm:p-12 bg-white text-slate-900 rounded-lg shadow-2xl transition-all ${
              fontStyle === 'serif' ? 'font-serif' : 'font-sans'
            } ${fontSize === 'compact' ? 'text-xs' : 'text-[13px] leading-relaxed'}`}
          >
            {/* Notice header for screen preview */}
            <div className="no-print mb-6 pb-3 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-sans">
              <span>ATS Score for this draft: <strong>{analysis.overall}%</strong></span>
              <span>Matched Keywords: {analysis.skills.found} / {analysis.skills.total}</span>
            </div>

            {/* Resume Content rendered cleanly */}
            <div className="whitespace-pre-wrap font-inherit text-slate-900">
              {resumeText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
