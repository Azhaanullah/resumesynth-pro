import React, { useState } from 'react';
import { Upload, X, FileCheck, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { countWords, countBullets } from '../utils/atsEngine';
import { parseResume, ParsedDocument } from '../utils/parser';

interface InputWorkspaceProps {
  textContent: string;
  onTextChange: (val: string) => void;
  targetRole: string;
  onTargetRoleChange: (val: string) => void;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
  onParseComplete?: (parsed: ParsedDocument) => void;
}

export const InputWorkspace: React.FC<InputWorkspaceProps> = ({
  textContent,
  onTextChange,
  onRunAnalysis,
  isAnalyzing,
  onParseComplete
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const words = countWords(textContent);
  const bullets = countBullets(textContent);

  const processFile = async (file: File) => {
    setFileError(null);
    if (!/\.(pdf|docx?|txt|md)$/i.test(file.name)) {
      setFileError('Upload a PDF, DOCX, TXT, or MD file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File exceeds the 10 MB limit.');
      return;
    }
    setCurrentFile(file);
    setIsParsing(true);

    if (/\.txt$/i.test(file.name) || /\.md$/i.test(file.name)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          onTextChange(content);
          setCurrentFile(null);
        }
      };
      reader.readAsText(file);
      setIsParsing(false);
      return;
    }

    try {
      const parsed = await parseResume(file);
      onTextChange(parsed.text);
      onParseComplete?.(parsed);
    } catch (err) {
      setFileError(err instanceof Error ? err.message : 'Failed to parse file');
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <section id="my-resume" aria-labelledby="inputs-heading" className="space-y-6 mb-10">
      <h2 id="inputs-heading" className="sr-only">Input Workspace</h2>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] shadow-sm overflow-hidden">

        {/* Header */}
        <div className="p-5 border-b border-[var(--border)] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] font-mono text-xs font-bold flex items-center justify-center border border-[var(--accent)]/20" aria-hidden="true">
              01
            </span>
            <div>
              <h3 className="font-display text-base font-bold text-[var(--text-main)] tracking-tight">Workspace</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Paste text or upload a resume PDF to fill this panel</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => document.getElementById('file-upload-input')?.click()}
              disabled={isParsing}
              className="min-h-[40px] px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4" aria-hidden="true" />
              Upload PDF
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">

          {/* Dropzone — only shown when textarea is empty */}
          {!textContent.trim() && !isParsing && (
            <div>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  processFile(e.dataTransfer.files?.[0]);
                }}
                onClick={() => document.getElementById('file-upload-input')?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer ${
                  isDragging
                    ? 'border-[var(--accent)] bg-[var(--accent)]/8'
                    : 'border-[var(--border)] hover:border-[var(--accent)]/50 bg-[var(--bg-elevated)]'
                }`}
              >
                <input
                  id="file-upload-input"
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,.md"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); e.target.value = ''; }}
                  className="sr-only"
                  aria-label="Upload resume file"
                />
                <Upload className="w-8 h-8 text-[var(--accent)] mx-auto mb-3 opacity-70" aria-hidden="true" />
                <p className="text-sm font-medium text-[var(--text-main)]">
                  Drop a PDF or DOCX here
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Content will populate this panel automatically
                </p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); document.getElementById('file-upload-input')?.click(); }}
                  className="mt-3 px-4 py-2 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] text-sm font-semibold hover:bg-[var(--accent)]/20 transition cursor-pointer"
                >
                  Browse files
                </button>
              </div>
            </div>
          )}

          {fileError && (
            <div role="alert" className="p-3 rounded-xl flex items-center gap-2" style={{ backgroundColor: 'rgba(244,63,94,0.1)', borderColor: 'rgba(244,63,94,0.3)', border: '1px solid', color: '#f43f5e' }}>
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{fileError}</span>
            </div>
          )}

          {/* Single unified textarea */}
          <textarea
            id="unified-textarea"
            value={textContent}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Paste your resume text, project details, or job description here… or upload a PDF above to populate this panel."
            className="w-full min-h-[300px] p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-main)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] resize-y rs-panel-text"
          />

          {/* Parsing indicator */}
          {isParsing && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]">
              <div className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin shrink-0" aria-hidden="true" />
              <span className="text-xs text-[var(--text-muted)]">Extracting content from {currentFile?.name ?? 'file'}…</span>
            </div>
          )}

          {/* Current file badge (while parsed content is present) */}
          {currentFile && !isParsing && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] shrink-0" aria-hidden="true">
                <FileCheck className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[var(--text-main)] truncate">{currentFile.name}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {(currentFile.size / 1024).toFixed(0)} KB &middot; content loaded
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setCurrentFile(null); onTextChange(''); }}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]/10 transition cursor-pointer shrink-0"
                aria-label="Clear uploaded content"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Footer stats */}
          <div className="flex items-center justify-between text-xs text-[var(--text-subtle)] pt-2 border-t border-[var(--border)]">
            <span>
              {words > 0 ? `${words} words &middot; ${bullets} bullets` : 'Paste requirements or bullet points for highest scoring accuracy.'}
            </span>
            <span className="text-[var(--accent)] font-semibold">Markdown supported</span>
          </div>
        </div>
      </div>

      {/* Primary action */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onRunAnalysis}
          disabled={isAnalyzing || !textContent.trim()}
          className={`w-full min-h-[52px] py-3.5 px-6 rounded-2xl font-display text-sm font-bold tracking-wide transition shadow-lg flex items-center justify-center gap-3 active:scale-[0.99] cursor-pointer ${
            !textContent.trim()
              ? 'bg-[var(--bg-secondary)] text-[var(--text-subtle)] cursor-not-allowed border border-[var(--border)]'
              : 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-md'
          }`}
          aria-label="Run match analysis"
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
              <span>Evaluating keyword density, action verbs & metrics…</span>
            </>
          ) : (
            <>
              <span>Run match analysis</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </section>
  );
};
