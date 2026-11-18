import React, { useState, useEffect } from 'react';
import { Download, Copy, Check, FileText, Printer, Code, X } from 'lucide-react';
import { AnalysisResult } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  textContent: string;
  analysis: AnalysisResult;
  role: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  textContent,
  analysis,
  role
}) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const dark = document.documentElement.classList.contains('dark');

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
    textContent: textContent
  }, null, 2);

  const cardStyle: React.CSSProperties = {
    border: '1px solid var(--border)',
    backgroundColor: dark ? 'rgba(0,0,0,0.25)' : 'rgba(53,32,20,0.04)'
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
    >
      <div className="w-full max-w-xl rounded-2xl p-6 shadow-2xl border" style={{ backgroundColor: dark ? '#201913' : '#fffdf5', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between pb-4" style={{ borderBottomColor: 'var(--border)', borderBottomWidth: 1, borderBottomStyle: 'solid' }}>
          <div className="flex items-center gap-2.5">
            <Download className="w-5 h-5" style={{ color: 'var(--accent)' }} aria-hidden="true" />
            <h3 id="export-dialog-title" className="font-display text-lg font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
              Export Tailored Resume & ATS Report
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer rounded-xl transition"
            style={{ color: 'var(--text-muted)', backgroundColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(53,32,20,0.06)' }}
            aria-label="Close export dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
          Select your preferred export format for application submissions or offline review.
        </p>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          {/* Format 1: Print / PDF */}
          <div className="p-4 rounded-xl flex flex-col justify-between" style={cardStyle}>
            <div>
              <div className="flex items-center gap-2 font-bold text-xs mb-1" style={{ color: 'var(--text-main)' }}>
                <Printer className="w-4 h-4" style={{ color: 'var(--accent)' }} aria-hidden="true" />
                <span>PDF Document (ATS Standard)</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Opens native print dialog formatted for single-column ATS scan engines.
              </p>
            </div>
            <button
              type="button"
              onClick={() => { onClose(); window.print(); }}
              className="mt-4 w-full min-h-[44px] py-2 rounded-xl font-bold text-xs transition cursor-pointer active:scale-95"
              style={{ backgroundColor: 'var(--accent)', color: '#FFFFFF' }}
            >
              Open Print / PDF
            </button>
          </div>

          {/* Format 2: Markdown File */}
          <div className="p-4 rounded-xl flex flex-col justify-between" style={cardStyle}>
            <div>
              <div className="flex items-center gap-2 font-bold text-xs mb-1" style={{ color: 'var(--text-main)' }}>
                <FileText className="w-4 h-4" style={{ color: 'var(--accent)' }} aria-hidden="true" />
                <span>Markdown (.md)</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Raw clean Markdown format with headers, bullet points, and skills.
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => handleCopy(textContent, 'md')}
                className="flex-1 min-h-[44px] py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer border"
                style={{ backgroundColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(53,32,20,0.04)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
                aria-label="Copy markdown resume"
              >
                {copiedFormat === 'md' ? <Check className="w-4 h-4" style={{ color: 'var(--accent)' }} aria-hidden="true" /> : <Copy className="w-4 h-4" style={{ color: 'var(--text-muted)' }} aria-hidden="true" />}
                <span>{copiedFormat === 'md' ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownloadFile(textContent, 'tailored-resume.md', 'text/markdown')}
                className="flex-1 min-h-[44px] py-2 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95"
                style={{ backgroundColor: 'var(--accent)', color: '#FFFFFF' }}
              >
                Download
              </button>
            </div>
          </div>

          {/* Format 3: Plain Text */}
          <div className="p-4 rounded-xl flex flex-col justify-between" style={cardStyle}>
            <div>
              <div className="flex items-center gap-2 font-bold text-xs mb-1" style={{ color: 'var(--text-main)' }}>
                <FileText className="w-4 h-4" style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
                <span>Plain Text (.txt)</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Clean text without markdown symbols for older portal paste inputs.
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => handleCopy(textContent.replace(/[#*`_]/g, ''), 'txt')}
                className="flex-1 min-h-[44px] py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer border"
                style={{ backgroundColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(53,32,20,0.04)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
                aria-label="Copy plain text resume"
              >
                {copiedFormat === 'txt' ? <Check className="w-4 h-4" style={{ color: 'var(--accent)' }} aria-hidden="true" /> : <Copy className="w-4 h-4" style={{ color: 'var(--text-muted)' }} aria-hidden="true" />}
                <span>{copiedFormat === 'txt' ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownloadFile(textContent.replace(/[#*`_]/g, ''), 'tailored-resume.txt', 'text/plain')}
                className="flex-1 min-h-[44px] py-2 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95"
                style={{ backgroundColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(53,32,20,0.08)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
              >
                Download
              </button>
            </div>
          </div>

          {/* Format 4: JSON Data */}
          <div className="p-4 rounded-xl flex flex-col justify-between" style={cardStyle}>
            <div>
              <div className="flex items-center gap-2 font-bold text-xs mb-1" style={{ color: 'var(--text-main)' }}>
                <Code className="w-4 h-4" style={{ color: 'var(--accent)' }} aria-hidden="true" />
                <span>Full JSON Analysis</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Complete match percentages, keywords, and ATS health score breakdown.
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => handleCopy(jsonReport, 'json')}
                className="flex-1 min-h-[44px] py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer border"
                style={{ backgroundColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(53,32,20,0.04)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
                aria-label="Copy JSON analysis report"
              >
                {copiedFormat === 'json' ? <Check className="w-4 h-4" style={{ color: 'var(--accent)' }} aria-hidden="true" /> : <Copy className="w-4 h-4" style={{ color: 'var(--text-muted)' }} aria-hidden="true" />}
                <span>{copiedFormat === 'json' ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownloadFile(jsonReport, 'resumesynth-analysis.json', 'application/json')}
                className="flex-1 min-h-[44px] py-2 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95"
                style={{ backgroundColor: 'var(--accent)', color: '#FFFFFF' }}
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
            className="min-h-[44px] px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
            style={{ color: 'var(--text-muted)', backgroundColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(53,32,20,0.06)' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
