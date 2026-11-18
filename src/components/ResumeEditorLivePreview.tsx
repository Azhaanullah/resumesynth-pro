import React, { useState } from 'react';
import { AnalysisResult, PreviewTemplate } from '../types';
import { FileEdit, Eye, Printer, Copy, Check, Sparkles, Layout } from 'lucide-react';

interface ResumeEditorLivePreviewProps {
  textContent: string;
  onResumeChange: (val: string) => void;
  analysis: AnalysisResult;
  targetRole: string;
}

export const ResumeEditorLivePreview: React.FC<ResumeEditorLivePreviewProps> = ({
  textContent,
  onResumeChange,
  analysis
}) => {
  const [template, setTemplate] = useState<PreviewTemplate>('modern');
  const [highlightKeywords, setHighlightKeywords] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const parseResumeSections = (text: string) => {
    const lines = text.split('\n');
    const sections: { title: string; content: string[] }[] = [];
    let currentSection = { title: 'Header', content: [] as string[] };

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
        if (currentSection.content.length > 0 || currentSection.title !== 'Header') {
          sections.push(currentSection);
        }
        currentSection = {
          title: trimmed.replace(/^#+\s*/, ''),
          content: []
        };
      } else if (trimmed.length > 0) {
        currentSection.content.push(line);
      }
    });

    if (currentSection.content.length > 0 || currentSection.title !== 'Header') {
      sections.push(currentSection);
    }

    return sections;
  };

  const sections = parseResumeSections(textContent);

  const renderHighlightedContent = (line: string) => {
    if (!highlightKeywords || analysis.matched.length === 0) {
      return line.replace(/^[*•-]\s*/, '');
    }

    let text = line.replace(/^[*•-]\s*/, '');
    const terms = analysis.matched.map(m => m.term);

    const pattern = new RegExp(`(${terms.map(t => t.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})`, 'gi');
    const parts = text.split(pattern);

    return (
      <>
        {parts.map((part, i) => {
          const isMatch = terms.some(t => t.toLowerCase() === part.toLowerCase());
          return isMatch ? (
            <mark key={i} className="bg-lime-400/25 text-lime-200 px-1 py-0.5 rounded font-bold border border-lime-400/40">
              {part}
            </mark>
          ) : (
            <React.Fragment key={i}>{part}</React.Fragment>
          );
        })}
      </>
    );
  };

  return (
    <section id="resume-editor" aria-labelledby="editor-preview-heading" className="rounded-2xl border border-white/[0.12] bg-slate-900/75 p-6 backdrop-blur-xl shadow-2xl">
      {/* Top Bar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/[0.1]">
        <div>
          <div className="flex items-center gap-2">
            <FileEdit className="w-5 h-5 text-cyan-300" aria-hidden="true" />
            <h3 id="editor-preview-heading" className="font-display text-lg font-bold text-white tracking-tight">
              Resume Editor & Real-Time ATS Preview
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Full markdown editing with keyword highlighting and standard ATS render templates.
          </p>
        </div>

        {/* View Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Highlight Toggle */}
          <button
            type="button"
            onClick={() => setHighlightKeywords(!highlightKeywords)}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 border cursor-pointer ${
              highlightKeywords
                ? 'bg-lime-400/20 text-lime-200 border-lime-400/40 shadow-sm'
                : 'bg-white/[0.06] text-slate-300 border-white/10 hover:text-white'
            }`}
            aria-pressed={highlightKeywords}
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>Keyword Highlighting</span>
          </button>

          {/* Template Selector with Label */}
          <div className="flex items-center gap-2 bg-black/50 p-1.5 rounded-xl border border-white/[0.1]">
            <label htmlFor="template-select" className="text-xs text-slate-300 flex items-center gap-1.5 pl-2 font-medium">
              <Layout className="w-4 h-4 text-slate-400" aria-hidden="true" />
              <span>Template:</span>
            </label>
            <select
              id="template-select"
              value={template}
              onChange={(e) => setTemplate(e.target.value as PreviewTemplate)}
              className="bg-transparent text-xs text-slate-100 pr-3 py-1 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="modern" className="bg-slate-900 text-white">Modern Tech</option>
              <option value="minimal" className="bg-slate-900 text-white">Clean Minimal</option>
              <option value="ats_classic" className="bg-slate-900 text-white">Harvard ATS Standard</option>
              <option value="executive" className="bg-slate-900 text-white">Executive Serif</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-xs font-bold text-slate-100 transition flex items-center gap-1.5 cursor-pointer"
              aria-label="Copy resume markdown text to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-lime-400" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
              aria-label="Print or save as PDF"
            >
              <Printer className="w-4 h-4" aria-hidden="true" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor & Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Left: Code Editor */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.1] text-xs text-slate-300">
            <label htmlFor="markdown-editor-pane" className="font-mono uppercase text-xs font-bold text-slate-200">
              Markdown Editor
            </label>
            <div className="flex items-center gap-3 font-mono text-xs">
              <span>{analysis.wordCount} words</span>
              <span className="text-white/20">•</span>
              <span>{analysis.bulletsCount} bullets</span>
            </div>
          </div>

          <textarea
            id="markdown-editor-pane"
            value={textContent}
            onChange={(e) => onResumeChange(e.target.value)}
            className="w-full flex-1 min-h-[480px] p-4 rounded-xl bg-black/60 border border-white/15 text-slate-100 font-mono text-sm sm:text-xs leading-relaxed resize-y focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-inner"
            placeholder="Type or edit your markdown resume here..."
          />
        </div>

        {/* Right: Rendered Resume */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.1] text-xs text-slate-300">
            <span className="font-mono uppercase text-xs font-bold text-slate-200 flex items-center gap-2">
              <Eye className="w-4 h-4 text-lime-400" aria-hidden="true" />
              Live ATS Preview ({template})
            </span>
            <span className="text-xs text-lime-300 font-mono font-bold">
              Match Score: {analysis.overall}%
            </span>
          </div>

          <div
            id="printable-resume"
            className={`flex-1 min-h-[480px] rounded-xl p-6 shadow-2xl overflow-y-auto ${
              template === 'modern'
                ? 'bg-slate-950 text-slate-100 border border-white/15 font-sans'
                : template === 'minimal'
                ? 'bg-white text-slate-950 border border-slate-300 font-sans'
                : template === 'ats_classic'
                ? 'bg-white text-black border border-slate-400 font-mono'
                : 'bg-[#faf8f5] text-slate-900 border border-amber-300/60 font-serif'
            }`}
            tabIndex={0}
            role="region"
            aria-label="Rendered Resume Document Preview"
          >
            <div className={`pb-4 mb-4 border-b ${template === 'modern' ? 'border-white/15' : 'border-slate-400'}`}>
              <h4 className={`text-xl font-bold tracking-tight ${template === 'modern' ? 'text-white' : 'text-slate-950'}`}>
                Alex Morgan, Software Engineer
              </h4>
              <p className={`text-xs mt-1.5 ${template === 'modern' ? 'text-slate-300' : 'text-slate-700'}`}>
                alex.morgan@example.com • +1 (555) 234-5678 • San Francisco, CA • github.com/alexmorgan
              </p>
            </div>

            <div className="space-y-4 text-xs leading-relaxed">
              {sections.map((sec, idx) => {
                if (sec.title === 'Header') return null;
                return (
                  <section key={idx} className="space-y-1.5">
                    <h5
                      className={`text-xs font-bold uppercase tracking-wider pb-1 border-b ${
                        template === 'modern'
                          ? 'text-cyan-300 border-cyan-400/30'
                          : template === 'minimal'
                          ? 'text-slate-900 border-slate-400'
                          : template === 'ats_classic'
                          ? 'text-black border-black font-mono'
                          : 'text-amber-950 border-amber-900/30 font-serif'
                      }`}
                    >
                      {sec.title}
                    </h5>
                    <div className="space-y-1 pt-1">
                      {sec.content.map((cLine, cIdx) => {
                        const isBullet = cLine.trim().startsWith('*') || cLine.trim().startsWith('-') || cLine.trim().startsWith('•');
                        return (
                          <div key={cIdx} className={isBullet ? 'flex items-start gap-2 pl-2' : ''}>
                            {isBullet && (
                              <span className={`text-xs select-none ${template === 'modern' ? 'text-cyan-400' : 'text-slate-700'}`} aria-hidden="true">
                                •
                              </span>
                            )}
                            <p className={`${template === 'modern' ? 'text-slate-200' : 'text-slate-900'}`}>
                              {renderHighlightedContent(cLine)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
