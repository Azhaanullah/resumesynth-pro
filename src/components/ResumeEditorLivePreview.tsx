import React, { useState } from 'react';
import { AnalysisResult, PreviewTemplate } from '../types';
import { FileEdit, Eye, Printer, Copy, Check, Sparkles, Layout } from 'lucide-react';

const isDark = (): boolean => document.documentElement.classList.contains('dark');

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
  const dark = isDark();

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
      return line.replace(/^(?:\*|-|\u2022)\s*/, '');
    }

    let text = line.replace(/^(?:\*|-|\u2022)\s*/, '');
    const terms = analysis.matched.map(m => m.term);

    const pattern = new RegExp(`(${terms.map(t => t.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})`, 'gi');
    const parts = text.split(pattern);

    return (
      <>
        {parts.map((part, i) => {
          const isMatch = terms.some(t => t.toLowerCase() === part.toLowerCase());
          return isMatch ? (
            <mark key={i} className="font-bold" style={{ backgroundColor: dark ? 'rgba(163,230,53,0.2)' : 'rgba(53,32,20,0.1)', color: dark ? '#a3e635' : '#166534', padding: '1px 4px', borderRadius: 3, border: `1px solid ${dark ? 'rgba(163,230,53,0.35)' : 'rgba(53,32,20,0.2)'}` }}>
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
    <section id="resume-editor" aria-labelledby="editor-preview-heading" className="rounded-2xl border p-6 shadow-2xl" style={{ borderColor: 'var(--border)', backgroundColor: dark ? 'rgba(32,25,19,0.86)' : 'rgba(255,253,245,0.95)', boxShadow: dark ? '0 18px 44px rgba(23,17,14,0.14)' : '0 14px 36px rgba(53,32,20,0.08)' }}>
      {/* Top Bar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5" style={{ borderBottomColor: 'var(--border)', borderBottomWidth: 1, borderBottomStyle: 'solid' }}>
        <div>
          <div className="flex items-center gap-2">
            <FileEdit className="w-5 h-5" style={{ color: 'var(--accent)' }} aria-hidden="true" />
            <h3 id="editor-preview-heading" className="font-display text-lg font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
              Resume Editor & Real-Time ATS Preview
            </h3>
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Full markdown editing with keyword highlighting and standard ATS render templates.
          </p>
        </div>

        {/* View Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Highlight Toggle */}
          <button
            type="button"
            onClick={() => setHighlightKeywords(!highlightKeywords)}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 border cursor-pointer`}
            style={highlightKeywords
              ? { backgroundColor: 'var(--accent-light)', borderColor: 'var(--accent-border)', color: 'var(--accent)' }
              : { backgroundColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(53,32,20,0.04)', borderColor: 'var(--border)', color: 'var(--text-muted)' }
            }
            aria-pressed={highlightKeywords}
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>Keyword Highlighting</span>
          </button>

          {/* Template Selector with Label */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: dark ? 'rgba(0,0,0,0.2)' : 'rgba(53,32,20,0.04)' }}>
            <label htmlFor="template-select" className="text-xs flex items-center gap-1.5 pl-2 font-medium" style={{ color: 'var(--text-muted)' }}>
              <Layout className="w-4 h-4" style={{ color: 'var(--text-subtle)' }} aria-hidden="true" />
              <span>Template:</span>
            </label>
            <select
              id="template-select"
              value={template}
              onChange={(e) => setTemplate(e.target.value as PreviewTemplate)}
              className="bg-transparent text-xs pr-3 py-1 font-semibold focus:outline-none cursor-pointer border-none appearance-none"
              style={{ color: 'var(--text-main)', backgroundColor: 'transparent' }}
            >
              <option value="modern" style={{ backgroundColor: dark ? '#201913' : '#fffdf5', color: 'var(--text-main)' }}>Modern Tech</option>
              <option value="minimal" style={{ backgroundColor: dark ? '#201913' : '#fffdf5', color: 'var(--text-main)' }}>Clean Minimal</option>
              <option value="ats_classic" style={{ backgroundColor: dark ? '#201913' : '#fffdf5', color: 'var(--text-main)' }}>Harvard ATS Standard</option>
              <option value="executive" style={{ backgroundColor: dark ? '#201913' : '#fffdf5', color: 'var(--text-main)' }}>Executive Serif</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border"
              style={{ backgroundColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(53,32,20,0.04)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
              aria-label="Copy resume markdown text to clipboard"
            >
              {copied ? <Check className="w-4 h-4" style={{ color: 'var(--accent)' }} aria-hidden="true" /> : <Copy className="w-4 h-4" style={{ color: 'var(--text-muted)' }} aria-hidden="true" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
              style={{ backgroundColor: 'var(--accent)', color: '#FFFFFF' }}
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
          <div className="flex items-center justify-between pb-2 mb-2 border-b text-xs" style={{ borderBottomColor: 'var(--border)', color: 'var(--text-muted)' }}>
            <label htmlFor="markdown-editor-pane" className="font-mono uppercase text-xs font-bold" style={{ color: 'var(--text-main)' }}>
              Markdown Editor
            </label>
            <div className="flex items-center gap-3 font-mono text-xs">
              <span style={{ color: 'var(--text-muted)' }}>{analysis.wordCount} words</span>
              <span style={{ color: 'var(--text-subtle)' }}>|</span>
              <span style={{ color: 'var(--text-muted)' }}>{analysis.bulletsCount} bullets</span>
            </div>
          </div>

          <textarea
            id="markdown-editor-pane"
            value={textContent}
            onChange={(e) => onResumeChange(e.target.value)}
            className="w-full flex-1 min-h-[480px] p-4 rounded-xl font-mono text-sm sm:text-xs leading-relaxed resize-y focus:outline-none border shadow-inner"
            style={{
              backgroundColor: dark ? 'rgba(0,0,0,0.3)' : 'rgba(53,32,20,0.03)',
              borderColor: 'var(--border)',
              color: 'var(--text-main)'
            }}
            placeholder="Type or edit your markdown resume here..."
          />
        </div>

        {/* Right: Rendered Resume */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between pb-2 mb-2 border-b text-xs" style={{ borderBottomColor: 'var(--border)' }}>
            <span className="font-mono uppercase text-xs font-bold flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
              <Eye className="w-4 h-4" style={{ color: 'var(--accent)' }} aria-hidden="true" />
              Live ATS Preview ({template})
            </span>
            <span className="text-xs font-mono font-bold" style={{ color: 'var(--accent)' }}>
              Match Score: {analysis.overall}%
            </span>
          </div>

          <div
            id="printable-resume"
            className={`flex-1 min-h-[480px] rounded-xl p-6 shadow-2xl overflow-y-auto`}
            tabIndex={0}
            role="region"
            aria-label="Rendered Resume Document Preview"
            style={template === 'modern'
              ? { backgroundColor: dark ? '#0d0a09' : '#0d0a09', color: '#e8e6e3', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'system-ui, sans-serif' }
              : template === 'minimal'
              ? { backgroundColor: '#ffffff', color: '#1c1917', border: '1px solid #d6d3d1', fontFamily: 'system-ui, sans-serif' }
              : template === 'ats_classic'
              ? { backgroundColor: '#ffffff', color: '#000000', border: '1px solid #a8a29e', fontFamily: 'monospace' }
              : { backgroundColor: '#faf8f5', color: '#1c1917', border: '1px solid rgba(216,180,106,0.4)', fontFamily: 'Georgia, serif' }
            }
          >
            <div className={`pb-4 mb-4 border-b`} style={{ borderColor: template === 'modern' ? 'rgba(255,255,255,0.1)' : '#d6d3d1' }}>
              <h4 className={`text-xl font-bold tracking-tight`} style={{ color: template === 'modern' ? '#ffffff' : '#1c1917' }}>
                Alex Morgan, Software Engineer
              </h4>
              <p className="text-xs mt-1.5" style={{ color: template === 'modern' ? '#a8a29e' : '#57534e' }}>
                alex.morgan@example.com | +1 (555) 234-5678 | San Francisco, CA | github.com/alexmorgan
              </p>
            </div>

            <div className="space-y-4 text-xs leading-relaxed">
              {sections.map((sec, idx) => {
                if (sec.title === 'Header') return null;
                return (
                  <section key={idx} className="space-y-1.5">
                    <h5
                      className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
                      style={{
                        color: template === 'modern' ? '#22d3ee' : template === 'minimal' ? '#1c1917' : template === 'ats_classic' ? '#000000' : '#78350f',
                        borderColor: template === 'modern' ? 'rgba(34,211,238,0.3)' : template === 'minimal' ? '#d6d3d1' : template === 'ats_classic' ? '#000000' : 'rgba(120,53,15,0.3)',
                        fontFamily: template === 'executive' ? 'Georgia, serif' : undefined
                      }}
                    >
                      {sec.title}
                    </h5>
                    <div className="space-y-1 pt-1">
                      {sec.content.map((cLine, cIdx) => {
                        const isBullet = cLine.trim().startsWith('*') || cLine.trim().startsWith('-') || cLine.trim().startsWith('\u2022');
                        return (
                          <div key={cIdx} className={isBullet ? 'flex items-start gap-2 pl-2' : ''}>
                            {isBullet && (
                              <span className="text-xs select-none" style={{ color: template === 'modern' ? '#22d3ee' : '#57534e' }} aria-hidden="true">
                                -
                              </span>
                            )}
                            <p className={template === 'modern' ? 'text-[var(--text-main)]' : undefined} style={{ color: template === 'modern' ? '#e2e8f0' : '#1c1917' }}>
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

