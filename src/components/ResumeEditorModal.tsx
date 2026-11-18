import React, { useState, useEffect, useMemo } from 'react';
import { X, Sparkles, FileEdit, Trash2, ArrowRight, Check, Copy, Wand2, Plus, RefreshCw, LayoutTemplate } from 'lucide-react';
import { countWords, countBullets } from '../utils/atsEngine';
import { PRESETS } from '../data/presets';

interface ResumeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeText: string;
  onSave: (val: string) => void;
}

export const ResumeEditorModal: React.FC<ResumeEditorModalProps> = ({
  isOpen,
  onClose,
  resumeText,
  onSave
}) => {
  const [localText, setLocalText] = useState(resumeText);
  const [copied, setCopied] = useState(false);

  // Sync with prop when opened
  useEffect(() => {
    if (isOpen) {
      setLocalText(resumeText);
    }
  }, [isOpen, resumeText]);

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
  const bulletCount = useMemo(() => countBullets(localText), [localText]);
  const charCount = localText.length;

  const handleAppendSection = (sectionName: string) => {
    const template = `\n\n## ${sectionName}\n* `;
    setLocalText(prev => prev.trim() + template);
  };

  const handleAppendStarBullet = () => {
    const bullet = `\n* Architected scalable microservices with Docker & CI/CD pipelines, increasing system throughput by 35% and reducing latency by 45%.`;
    setLocalText(prev => prev.trim() + bullet);
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

  const handleLoadSampleResume = (presetKey: string) => {
    const preset = PRESETS[presetKey];
    if (preset) {
      setLocalText(preset.resume);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[900px] flex flex-col rounded-2xl border border-white/15 bg-[#080d1a] shadow-2xl overflow-hidden transition-all text-slate-100 resume-modal-surface">
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-xs">
              <FileEdit className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="resume-modal-title" className="font-display text-lg font-bold text-white tracking-tight">
                  Master Resume Studio & Evidence Editor
                </h3>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Focused Editor
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Structure bullets with power action verbs and measurable metrics for maximum ATS score.
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
              className="min-h-[40px] px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
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

        {/* Section Quick Starters & Formatting Toolbar */}
        <div className="px-6 py-2.5 border-b border-white/[0.08] bg-black/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Quick Insert & Tools */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePasteFromClipboard}
              className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 transition font-medium flex items-center gap-1.5 cursor-pointer"
              title="Paste from clipboard"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Paste Clipboard</span>
            </button>

            <button
              type="button"
              onClick={handleAppendStarBullet}
              className="px-3 py-1.5 rounded-lg border border-cyan-400/30 bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-300 transition font-medium flex items-center gap-1.5 cursor-pointer"
              title="Insert optimized STAR impact bullet"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>+ STAR Bullet</span>
            </button>

            {/* Section Starters */}
            <div className="flex items-center gap-1 pl-2 border-l border-white/10">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Plus className="w-3 h-3" /> Section:
              </span>
              <button
                type="button"
                onClick={() => handleAppendSection('Experience')}
                className="px-2 py-1 rounded text-[11px] hover:bg-white/10 text-slate-300 font-medium"
              >
                Experience
              </button>
              <button
                type="button"
                onClick={() => handleAppendSection('Skills')}
                className="px-2 py-1 rounded text-[11px] hover:bg-white/10 text-slate-300 font-medium"
              >
                Skills
              </button>
              <button
                type="button"
                onClick={() => handleAppendSection('Projects')}
                className="px-2 py-1 rounded text-[11px] hover:bg-white/10 text-slate-300 font-medium"
              >
                Projects
              </button>
              <button
                type="button"
                onClick={() => handleAppendSection('Education')}
                className="px-2 py-1 rounded text-[11px] hover:bg-white/10 text-slate-300 font-medium"
              >
                Education
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyText}
              className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 transition font-medium flex items-center gap-1.5 cursor-pointer ml-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Metrics Pill */}
          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-300">
            <span>{bulletCount} bullets</span>
            <span className="text-white/20">•</span>
            <span>{wordCount} words</span>
            <span className="text-white/20">•</span>
            <span>{charCount} chars</span>
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
            placeholder="Paste your markdown resume, job history, and technical achievements here..."
            className="w-full flex-1 p-5 rounded-xl bg-black/50 border border-white/15 text-slate-100 font-mono text-sm leading-relaxed resize-none focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 overflow-y-auto resume-modal-textarea"
            autoFocus
          />
        </div>

        {/* Bottom STAR Formula Guidance */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-black/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300 text-[11px]">
            <span className="font-semibold text-cyan-300">STAR Best Practice:</span>
            <span>Lead with active verb (e.g., <em>Architected</em>) + Context (<em>microservices</em>) + Quantified Outcome (<em>+35% throughput</em>).</span>
          </div>

          <div className="text-[11px] text-slate-400 shrink-0">
            Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-white text-[10px]">Ctrl+Enter</kbd> to save
          </div>
        </div>
      </div>
    </div>
  );
};
