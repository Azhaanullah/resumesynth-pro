import React, { useState, useEffect, useMemo } from 'react';
import { X, Sparkles, FileText, Trash2, ArrowRight, Check, Copy, Tag, RefreshCw, LayoutTemplate } from 'lucide-react';
import { countWords } from '../utils/atsEngine';
import { PRESETS } from '../data/presets';

interface JobDescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobDescription: string;
  onSave: (val: string) => void;
}

export const JobDescriptionModal: React.FC<JobDescriptionModalProps> = ({
  isOpen,
  onClose,
  jobDescription,
  onSave
}) => {
  const [localText, setLocalText] = useState(jobDescription);
  const [copied, setCopied] = useState(false);

  // Sync with prop when opened
  useEffect(() => {
    if (isOpen) {
      setLocalText(jobDescription);
    }
  }, [isOpen, jobDescription]);

  // Handle ESC and Ctrl+Enter keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        onSave(localText);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, localText, onSave, onClose]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const wordCount = useMemo(() => countWords(localText), [localText]);
  const charCount = localText.length;
  const readTimeMinutes = Math.max(1, Math.round(wordCount / 200));

  // Quick live extraction of prominent tech keywords in JD
  const detectedKeywords = useMemo(() => {
    if (!localText.trim()) return [];
    const techPatterns = [
      'react', 'typescript', 'javascript', 'python', 'java', 'golang', 'go', 'rust', 'c\\+\\+', 'c#',
      'node', 'express', 'django', 'fastapi', 'spring', 'graphql', 'rest', 'api', 'microservices',
      'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'terraform', 'ci/cd', 'sql', 'postgresql', 'mysql',
      'mongodb', 'redis', 'kafka', 'git', 'linux', 'testing', 'jest', 'agile', 'scrum'
    ];
    const found = new Set<string>();
    const lower = localText.toLowerCase();
    techPatterns.forEach(pattern => {
      const regex = new RegExp(`\\b${pattern}\\b`, 'i');
      if (regex.test(lower)) {
        found.add(pattern.replace('\\+\\+', '++'));
      }
    });
    return Array.from(found).slice(0, 12);
  }, [localText]);

  const handleCleanWhitespace = () => {
    const cleaned = localText
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    setLocalText(cleaned);
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setLocalText(prev => (prev.trim() ? `${prev}\n\n${text}` : text));
      }
    } catch (err) {
      console.error('Clipboard paste error:', err);
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(localText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoadTemplate = (presetKey: string) => {
    const preset = PRESETS[presetKey];
    if (preset) {
      setLocalText(preset.jd);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="jd-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[900px] flex flex-col rounded-2xl border border-white/15 bg-[#080d1a] shadow-2xl overflow-hidden transition-all text-slate-100 jd-modal-surface">
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-xs">
              <FileText className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="jd-modal-title" className="font-display text-lg font-bold text-white tracking-tight">
                  Target Job Description Studio
                </h3>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Focused Editor
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Paste or refine role requirements for precise keyword matching and ATS scoring.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onSave(localText);
                onClose();
              }}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
              title="Save and Apply (Ctrl+Enter)"
            >
              <span>Save & Apply</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="min-h-[40px] min-w-[40px] p-2 rounded-xl border border-white/10 bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white transition flex items-center justify-center cursor-pointer"
              aria-label="Close dialog (Escape)"
              title="Close (Escape)"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Toolbar & Live Statistics */}
        <div className="px-6 py-2.5 border-b border-white/[0.08] bg-black/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Quick Tools */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePasteFromClipboard}
              className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 transition font-medium flex items-center gap-1.5 cursor-pointer"
              title="Paste from clipboard"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Paste Clipboard</span>
            </button>

            <button
              type="button"
              onClick={handleCleanWhitespace}
              className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 transition font-medium flex items-center gap-1.5 cursor-pointer"
              title="Clean formatting and excessive whitespace"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Clean Whitespace</span>
            </button>

            <button
              type="button"
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 transition font-medium flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {/* Sample Templates Dropdown */}
            <div className="flex items-center gap-1 pl-2 border-l border-white/10">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <LayoutTemplate className="w-3.5 h-3.5" /> Sample:
              </span>
              <button
                type="button"
                onClick={() => handleLoadTemplate('backend')}
                className="px-2 py-1 rounded text-[11px] hover:bg-white/10 text-slate-300 font-medium"
              >
                Backend
              </button>
              <button
                type="button"
                onClick={() => handleLoadTemplate('data')}
                className="px-2 py-1 rounded text-[11px] hover:bg-white/10 text-slate-300 font-medium"
              >
                Data
              </button>
              <button
                type="button"
                onClick={() => handleLoadTemplate('fullstack')}
                className="px-2 py-1 rounded text-[11px] hover:bg-white/10 text-slate-300 font-medium"
              >
                Fullstack
              </button>
            </div>
          </div>

          {/* Metrics Pill */}
          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-300">
            <span>{wordCount} words</span>
            <span className="text-white/20">•</span>
            <span>{charCount} chars</span>
            <span className="text-white/20">•</span>
            <span>~{readTimeMinutes} min read</span>
            {localText.trim() && (
              <button
                type="button"
                onClick={() => setLocalText('')}
                className="text-rose-400 hover:text-rose-300 transition pl-2 flex items-center gap-1"
                title="Clear all text"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Central Editor Area */}
        <div className="flex-1 flex flex-col p-6 min-h-0 overflow-hidden">
          <textarea
            value={localText}
            onChange={(e) => setLocalText(e.target.value)}
            placeholder="Paste your target job description, qualifications, and role requirements here..."
            className="w-full flex-1 p-5 rounded-xl bg-black/50 border border-white/15 text-slate-100 font-mono text-sm leading-relaxed resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 overflow-y-auto jd-modal-textarea"
            autoFocus
          />
        </div>

        {/* Bottom Detected Keywords Rail */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-black/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto py-0.5">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 shrink-0">
              <Tag className="w-3.5 h-3.5 text-blue-400" />
              Detected Technologies ({detectedKeywords.length}):
            </span>
            {detectedKeywords.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1.5">
                {detectedKeywords.map(kw => (
                  <span
                    key={kw}
                    className="px-2 py-0.5 rounded-md bg-blue-500/15 border border-blue-500/30 text-blue-300 font-mono text-[11px] uppercase tracking-wider font-semibold"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-[11px] text-slate-500 italic">
                Paste a job posting above to automatically preview required technologies.
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-400 shrink-0">
            Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-white text-[10px]">Ctrl+Enter</kbd> to save
          </div>
        </div>
      </div>
    </div>
  );
};
