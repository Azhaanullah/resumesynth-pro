import React, { useState } from 'react';
import { Upload, X, FileCheck, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { countWords, countBullets } from '../utils/atsEngine';
import { parseResume, ParsedDocument } from '../utils/parser';
import { ParserPreview } from './ParserPreview';

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
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [parsedDoc, setParsedDoc] = useState<ParsedDocument | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [showParserPreview, setShowParserPreview] = useState(false);

  const words = countWords(textContent);
  const bullets = countBullets(textContent);

  const handleFileUpload = (file: File | undefined) => {
    if (!file) return;
    setFileError(null);
    if (!/\.(pdf|docx?|txt|md)$/i.test(file.name)) {
      setFileError("Please upload a PDF, DOCX, TXT, or MD file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFileError("File size exceeds 10 MB limit.");
      return;
    }
    setStagedFile(file);
    if (/\.(txt|md)$/i.test(file.name)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) onTextChange(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <section id="my-resume" aria-labelledby="inputs-heading" className="space-y-6 mb-10">
      <h2 id="inputs-heading" className="sr-only">Input Workspace</h2>

      {/* Single Card Container */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] shadow-sm overflow-hidden">

        {/* Header */}
        <div className="p-5 border-b border-[var(--border)] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] font-mono text-xs font-bold flex items-center justify-center border border-[var(--accent)]/20" aria-hidden="true">
              01
            </span>
            <div>
              <h3 className="font-display text-base font-bold text-[var(--text-main)] tracking-tight">Workspace</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Paste your resume and job description below</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => document.getElementById('file-upload-input')?.click()}
              className="min-h-[40px] px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
            >
              <Upload className="w-4 h-4" aria-hidden="true" />
              Upload PDF
            </button>
            <button
              type="button"
              className="min-h-[40px] px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)] text-sm font-semibold hover:border-[var(--accent)] hover:text-[var(--text-main)] transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              Studio
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">

          {/* Dropzone (only when no staged file) */}
          {!stagedFile && (
            <div>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFileUpload(e.dataTransfer.files?.[0]);
                }}
                onClick={() => document.getElementById('file-upload-input')?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center transition cursor-pointer ${
                  isDragging
                    ? 'border-[var(--accent)] bg-[var(--accent)]/5'
                    : 'border-[var(--border)] hover:border-[var(--accent)]/50 bg-[var(--bg-elevated)]'
                }`}
              >
                <input
                  id="file-upload-input"
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,.md"
                  onChange={(e) => handleFileUpload(e.target.files?.[0])}
                  className="sr-only"
                  aria-label="Upload resume file"
                />
                <Upload className="w-6 h-6 text-[var(--text-muted)] mx-auto mb-2" aria-hidden="true" />
                <p className="text-sm text-[var(--text-muted)]">
                  Drop a PDF or DOCX here to extract your resume directly into this panel
                </p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); document.getElementById('file-upload-input')?.click(); }}
                  className="mt-2 text-xs text-[var(--text-subtle)] hover:text-[var(--accent)] transition cursor-pointer"
                >
                  Browse
                </button>
              </div>
            </div>
          )}

          {fileError && (
            <div role="alert" className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{fileError}</span>
            </div>
          )}

          {/* Unified Textarea */}
          <textarea
            id="unified-textarea"
            value={textContent}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Paste your resume text, project details, or paste the job description here..."
            className="w-full min-h-[280px] p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-sm text-[var(--text-main)] leading-relaxed focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] resize-y"
          />

          {/* Staged File Display */}
          {stagedFile && (
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)]" aria-hidden="true">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-main)]">{stagedFile.name}</h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    {(stagedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to parse
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    if (!stagedFile) return;
                    setIsParsing(true);
                    setFileError(null);
                    try {
                      const parsed = await parseResume(stagedFile);
                      setParsedDoc(parsed);
                      onTextChange(parsed.text);
                      onParseComplete?.(parsed);
                      setShowParserPreview(true);
                    } catch (err) {
                      setFileError(err instanceof Error ? err.message : 'Failed to parse file');
                    } finally {
                      setIsParsing(false);
                    }
                  }}
                  disabled={isParsing}
                  className="min-h-[44px] px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold hover:bg-[var(--accent-hover)] transition flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {isParsing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                      <span>Parsing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Parse & Preview</span>
                    </>
                  )}
                </button>
                <label
                  htmlFor="file-upload-input"
                  className="min-h-[44px] px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-xs font-semibold text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--text-main)] cursor-pointer transition flex items-center"
                >
                  Change File
                </label>
                <button
                  type="button"
                  onClick={() => setStagedFile(null)}
                  className="min-h-[44px] min-w-[44px] p-2 rounded-lg text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer flex items-center justify-center"
                  aria-label="Remove uploaded file"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* Footer Stats */}
          <div className="flex items-center justify-between text-xs text-[var(--text-subtle)] pt-2 border-t border-[var(--border)]">
            <span>
              {words > 0 ? `${words} words · ${bullets} bullets` : 'Paste requirements or bullet points for highest scoring accuracy.'}
            </span>
            <span className="text-[var(--accent)] font-semibold">✓ Markdown & plain text supported</span>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
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
              <span>Evaluating Keyword Density, Action Verbs & Metrics...</span>
            </>
          ) : (
            <>
              <span>Run match analysis</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </>
          )}
        </button>
      </div>

      {/* Parser Preview Modal */}
      {showParserPreview && parsedDoc && (
        <ParserPreview
          parsed={parsedDoc}
          onClose={() => setShowParserPreview(false)}
          onUseForJd={(text) => onTextChange(text)} onUseForResume={(text) => onTextChange(text)}
        />
      )}
    </section>
  );
};
