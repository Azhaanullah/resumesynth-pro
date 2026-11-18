import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, ChevronDown, ChevronRight, FileText, Calendar, Briefcase, GraduationCap, Wrench, FolderOpen, Eye, EyeOff } from 'lucide-react';
import { ParsedDocument, ParsedSection, ParsedDate, ParsedTitle } from '../utils/parser';

interface ParserPreviewProps {
  parsed: ParsedDocument;
  onClose: () => void;
  onUseForJd: (text: string) => void;
  onUseForResume: (text: string) => void;
}

const SECTION_ICONS: Record<ParsedSection['type'], typeof FileText> = {
  header: FileText,
  experience: Briefcase,
  education: GraduationCap,
  skills: Wrench,
  projects: FolderOpen,
  summary: FileText,
  other: FileText,
};

export const ParserPreview: React.FC<ParserPreviewProps> = ({ parsed, onClose, onUseForJd, onUseForResume }) => {
  const [showRaw, setShowRaw] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(parsed.sections.map(s => s.heading));

  const toggleSection = (heading: string) => {
    setExpandedSections(prev =>
      prev.includes(heading) ? prev.filter(h => h !== heading) : [...prev, heading]
    );
  };

  const isExpanded = (heading: string) => expandedSections.includes(heading);

  return (
    <div className="pp-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="pp-title">
      <div className="pp-modal" onClick={e => e.stopPropagation()}>
        <style>{CSS}</style>

        {/* Header */}
        <div className="pp-header">
          <div>
            <h2 id="pp-title" className="pp-title">What the parser sees</h2>
            <p className="pp-subtitle">{parsed.pages} page{parsed.pages !== 1 ? 's' : ''} - {parsed.text.split(/\s+/).length} words - {parsed.sections.length} sections - {parsed.dates.length} dates - {parsed.titles.length} titles</p>
          </div>
          <div className="pp-header-actions">
            <button
              type="button"
              className="pp-btn pp-btn-ghost"
              onClick={() => setShowRaw(!showRaw)}
              aria-pressed={showRaw}
            >
              {showRaw ? <EyeOff size={16} /> : <Eye size={16} />}
              <span>{showRaw ? 'Hide raw text' : 'Show raw text'}</span>
            </button>
            <button
              type="button"
              className="pp-btn pp-btn-jd"
              onClick={() => {
                onUseForJd(parsed.jdText ?? parsed.text);
                onClose();
              }}
            >
              <CheckCircle2 size={16} />
              <span>Fill JD panel (left) - {parsed.jdText ? 'requirements extracted' : 'full text'}</span>
            </button>
            <button
              type="button"
              className="pp-btn pp-btn-resume"
              onClick={() => {
                onUseForResume(parsed.resumeText ?? parsed.text);
                onClose();
              }}
            >
              <CheckCircle2 size={16} />
              <span>Fill Resume panel (right) - {parsed.resumeText ? 'resume sections only' : 'full text'}</span>
            </button>
            <button type="button" className="pp-btn pp-btn-icon" onClick={onClose} aria-label="Close parser preview">
              <span className="pp-close-x" aria-hidden="true">X</span>
            </button>
          </div>
        </div>

        {/* Warnings */}
        {parsed.warnings.length > 0 && (
          <div className="pp-warnings" role="alert">
            {parsed.warnings.map((w, i) => (
              <div key={i} className="pp-warning">
                <AlertCircle className="w-4 h-4 text-[var(--text-main)] shrink-0" aria-hidden="true" />
                <span>{w}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="pp-tabs" role="tablist" aria-label="Parser view">
          <button
            type="button"
            role="tab"
            aria-selected={!showRaw}
            aria-controls="pp-sections-panel"
            onClick={() => setShowRaw(false)}
            className={`pp-tab${!showRaw ? ' is-active' : ''}`}
          >
            <FileText size={14} aria-hidden="true" />
            <span>Sections</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={showRaw}
            aria-controls="pp-raw-panel"
            onClick={() => setShowRaw(true)}
            className={`pp-tab${showRaw ? ' is-active' : ''}`}
          >
            <span className="font-mono text-xs">Raw</span>
            <span>Text</span>
          </button>
        </div>

        {/* Sections View */}
        {!showRaw && (
          <div id="pp-sections-panel" role="tabpanel" className="pp-panel">
            {parsed.sections.length === 0 ? (
              <div className="pp-empty">
                <FileText className="w-12 h-12 text-[var(--text-main)]" aria-hidden="true" />
                <p>No sections detected. The parser couldn't identify standard resume headings.</p>
              </div>
            ) : (
              <div className="pp-sections">
                {parsed.sections.map((section, idx) => (
                  <SectionCard
                    key={`${section.heading}-${idx}`}
                    section={section}
                    index={idx}
                    isExpanded={isExpanded(section.heading)}
                    onToggle={() => toggleSection(section.heading)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Raw Text View */}
        {showRaw && (
          <div id="pp-raw-panel" role="tabpanel" className="pp-panel pp-raw-panel">
            <pre className="pp-raw-text" aria-label="Raw extracted text">{parsed.text || '(empty)'}</pre>
          </div>
        )}

        {/* Metadata Summary */}
        <div className="pp-meta">
          <div className="pp-meta-grid">
            <MetaCard icon={Calendar} label="Dates found" value={parsed.dates.length} >
              {parsed.dates.slice(0, 5).map((d, i) => (
                <div key={i} className="pp-meta-item">{d.raw} - {d.context}</div>
              ))}
              {parsed.dates.length > 5 && <div className="pp-meta-more">+{parsed.dates.length - 5} more</div>}
            </MetaCard>
            <MetaCard icon={Briefcase} label="Job titles" value={parsed.titles.length} >
              {parsed.titles.slice(0, 5).map((t, i) => (
                <div key={i} className="pp-meta-item">{t.title}{t.company && ` at ${t.company}`}{t.isCurrent && ' (current)'}</div>
              ))}
              {parsed.titles.length > 5 && <div className="pp-meta-more">+{parsed.titles.length - 5} more</div>}
            </MetaCard>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SectionCardProps {
  section: ParsedSection;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

const SectionCard: React.FC<SectionCardProps> = ({ section, index, isExpanded, onToggle }) => {
  const Icon = SECTION_ICONS[section.type] || FileText;
  const lines = section.content.trim().split('\n').filter(l => l.trim());

  return (
    <div className="pp-section-card">
      <button
        type="button"
        className="pp-section-header"
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <span className="pp-section-icon" aria-hidden="true">
          <Icon size={18} />
        </span>
        <span className="pp-section-type">{section.type}</span>
        <span className="pp-section-heading">{section.heading}</span>
        <span className="pp-section-meta">
          {lines.length} line{lines.length !== 1 ? 's' : ''} - lines {section.lineStart}-{section.lineEnd}
        </span>
        <ChevronDown size={16} className={`pp-chevron${isExpanded ? ' is-open' : ''}`} aria-hidden="true" />
      </button>

      {isExpanded && (
        <div className="pp-section-content">
          <pre className="pp-section-text">{section.content.trim() || '(empty)'}</pre>
          <div className="pp-section-actions">
            <span className="pp-section-lines">Lines {section.lineStart}-{section.lineEnd} of source</span>
          </div>
        </div>
      )}
    </div>
  );
};

interface MetaCardProps {
  icon: typeof Calendar;
  label: string;
  value: number;
  children: React.ReactNode;
}

const MetaCard: React.FC<MetaCardProps> = ({ icon: Icon, label, value, children }) => (
  <div className="pp-meta-card">
    <div className="pp-meta-header">
      <span className="pp-meta-icon" aria-hidden="true"><Icon size={18} /></span>
      <div>
        <span className="pp-meta-label">{label}</span>
        <span className="pp-meta-value">{value}</span>
      </div>
    </div>
    <div className="pp-meta-list">{children}</div>
  </div>
);

const CSS = `
.pp-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0,0,0,.75); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; padding: 1rem;
  animation: pp-fadeIn .25s ease-out;
}
.pp-modal {
  width: 100%; max-width: 900px; max-height: 90vh;
  background: var(--ap-bg, #07080c);
  border: 1px solid var(--ap-hairline, rgba(255,255,255,.07));
  border-radius: 20px;
  overflow: hidden;
  display: flex; flex-direction: column;
  animation: pp-slideUp .35s cubic-bezier(.16,1,.3,1);
  box-shadow: 0 25px 80px rgba(0,0,0,.5);
}
html.light .pp-modal { background: #fff; border-color: rgba(23,21,26,.1); }

.pp-header {
  display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between;
  gap: 1rem; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--ap-hairline, rgba(255,255,255,.07));
}
.pp-title { margin: 0; font-size: 1.1rem; font-weight: 600; color: var(--ap-text, #f5f2ec); }
.pp-subtitle { margin: .2rem 0 0; font-size: .78rem; color: var(--ap-text-2, #9b9ba6); }
.pp-header-actions { display: flex; gap: .5rem; flex-wrap: wrap; }
.pp-btn {
  display: inline-flex; align-items: center; gap: .4rem; min-height: 38px; padding: 0 1rem;
  border-radius: 10px; font-size: .8rem; font-weight: 500; cursor: pointer;
  transition: background-color .2s, color .2s;
}
.pp-btn-primary { background: var(--ap-accent, #d8b46a); color: var(--ap-on-text, #1a1405); border: none; }
.pp-btn-primary:hover { filter: brightness(1.05); }
.pp-btn-ghost { background: transparent; color: var(--ap-text-2, #9b9ba6); border: 1px solid var(--ap-hairline, rgba(255,255,255,.07)); }
.pp-btn-ghost:hover { background: rgba(255,255,255,.04); color: var(--ap-text, #f5f2ec); }
.pp-btn-jd { background: rgba(99,102,241,.2); color: #818cf8; border: 1px solid rgba(99,102,241,.4); }
.pp-btn-jd:hover { background: rgba(99,102,241,.3); color: #a5b4fc; }
.pp-btn-resume { background: rgba(34,197,94,.15); color: #4ade80; border: 1px solid rgba(34,197,94,.35); }
.pp-btn-resume:hover { background: rgba(34,197,94,.25); color: #22c55e; }
.pp-btn-icon { width: 38px; height: 38px; padding: 0; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.pp-close-x { font-size: 1.5rem; line-height: 1; color: var(--ap-text-2, #9b9ba6); }
.pp-btn-icon:hover .pp-close-x { color: var(--ap-text, #f5f2ec); }

.pp-warnings { padding: .75rem 1.5rem; border-bottom: 1px solid var(--ap-hairline, rgba(255,255,255,.07)); background: rgba(232,183,93,.08); }
.pp-warning { display: flex; gap: .5rem; font-size: .78rem; color: var(--ap-text-2, #9b9ba6); padding: .25rem 0; }
.pp-warning:first-child { padding-top: 0; }
.pp-warning:last-child { padding-bottom: 0; }

.pp-tabs { display: flex; border-bottom: 1px solid var(--ap-hairline, rgba(255,255,255,.07)); overflow-x: auto; }
.pp-tab {
  display: inline-flex; align-items: center; gap: .4rem; padding: .7rem 1rem; min-height: 44px;
  font-size: .82rem; font-weight: 500; color: var(--ap-text-2, #9b9ba6);
  background: transparent; border: none; cursor: pointer; white-space: nowrap;
  border-bottom: 2px solid transparent; margin-bottom: -1px;
  transition: color .2s, border-color .2s;
}
.pp-tab:hover { color: var(--ap-text, #f5f2ec); }
.pp-tab.is-active { color: var(--ap-accent, #d8b46a); border-bottom-color: var(--ap-accent, #d8b46a); }

.pp-panel { flex: 1; overflow: auto; padding: 1rem 1.5rem; }

.pp-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 200px; text-align: center; color: var(--ap-text-2, #9b9ba6); gap: .75rem; }

.pp-sections { display: flex; flex-direction: column; gap: .5rem; }
.pp-section-card { border: 1px solid var(--ap-hairline, rgba(255,255,255,.07)); border-radius: 12px; overflow: hidden; background: rgba(255,255,255,.02); }
html.light .pp-section-card { background: #faf9f6; }
.pp-section-header {
  width: 100%; display: flex; align-items: center; gap: .75rem; padding: .85rem 1rem;
  background: transparent; border: none; text-align: left; cursor: pointer;
  color: var(--ap-text, #f5f2ec); font-size: .85rem;
  transition: background-color .2s;
}
.pp-section-header:hover { background: rgba(255,255,255,.03); }
html.light .pp-section-header:hover { background: rgba(23,21,26,.03); }
.pp-section-icon { width: 36px; height: 36px; flex: none; display: flex; align-items: center; justify-content: center; border-radius: 10px; background: rgba(216,180,106,.15); color: var(--ap-accent, #d8b46a); }
.pp-section-type { font-size: .65rem; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: var(--ap-accent, #d8b46a); background: color-mix(in srgb, var(--ap-accent, #d8b46a) 14%, transparent); padding: .15rem .5rem; border-radius: 999px; }
.pp-section-heading { flex: 1; font-weight: 500; min-width: 0; }
.pp-section-meta { font-size: .7rem; color: var(--ap-text-2, #9b9ba6); font-variant-numeric: tabular-nums; }
.pp-chevron { flex: none; color: var(--ap-text-2, #9b9ba6); transition: transform .25s; }
.pp-chevron.is-open { transform: rotate(180deg); }

.pp-section-content { padding: 0 1rem 1rem; border-top: 1px solid var(--ap-hairline, rgba(255,255,255,.07)); animation: pp-expand .3s ease-out; }
.pp-section-text {
  margin: .75rem 0 0; padding: .75rem; background: rgba(0,0,0,.25); border-radius: 8px;
  font-size: .75rem; line-height: 1.6; color: var(--ap-text, #f5f2ec); white-space: pre-wrap; word-wrap: break-word;
  font-family: inherit; max-height: 300px; overflow: auto;
}
html.light .pp-section-text { background: rgba(23,21,26,.05); }
.pp-section-actions { margin-top: .75rem; font-size: .7rem; color: var(--ap-text-2, #9b9ba6); }

.pp-raw-panel { min-height: 300px; }
.pp-raw-text {
  margin: 0; padding: 1rem; background: rgba(0,0,0,.35); border-radius: 8px;
  font-size: .7rem; line-height: 1.55; color: var(--ap-text, #f5f2ec); white-space: pre-wrap; word-wrap: break-word;
  font-family: inherit; max-height: 60vh; overflow: auto;
}
html.light .pp-raw-text { background: rgba(23,21,26,.05); }

.pp-meta { padding: 1rem 1.5rem; border-top: 1px solid var(--ap-hairline, rgba(255,255,255,.07)); }
.pp-meta-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
@media (min-width: 640px) { .pp-meta-grid { grid-template-columns: 1fr 1fr; } }
.pp-meta-card { background: rgba(255,255,255,.02); border: 1px solid var(--ap-hairline, rgba(255,255,255,.07)); border-radius: 12px; padding: 1rem; }
html.light .pp-meta-card { background: #faf9f6; }
.pp-meta-header { display: flex; align-items: center; gap: .75rem; margin-bottom: .75rem; }
.pp-meta-icon { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 10px; background: rgba(216,180,106,.15); color: var(--ap-accent, #d8b46a); }
.pp-meta-label { font-size: .7rem; text-transform: uppercase; letter-spacing: .08em; color: var(--ap-text-2, #9b9ba6); display: block; }
.pp-meta-value { font-size: 1.5rem; font-weight: 700; color: var(--ap-text, #f5f2ec); font-variant-numeric: tabular-nums; line-height: 1; }
.pp-meta-list { display: flex; flex-direction: column; gap: .35rem; }
.pp-meta-item { font-size: .72rem; color: var(--ap-text-2, #9b9ba6); padding: .2rem .5rem; background: rgba(255,255,255,.02); border-radius: 6px; }
html.light .pp-meta-item { background: rgba(23,21,26,.03); }
.pp-meta-more { font-size: .7rem; color: var(--ap-accent, #d8b46a); margin-top: .25rem; }

@keyframes pp-fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes pp-slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
@keyframes pp-expand { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
`;

export default ParserPreview;
