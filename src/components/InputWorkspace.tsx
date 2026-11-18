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
      <div className="rounded-2xl border border-white/[0.12] bg-slate-900/75 backdrop-blur-xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="p-5 border-b border-white/[0.1] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-lime-400/20 text-lime-300 font-mono text-xs font-bold flex items-center justify-center border border-lime-400/40" aria-hidden="true">
              01
            </span>
            <div>
              <h3 className="font-display text-base font-bold text-white tracking-tight">Workspace</h3>
              <p className="text-xs text-slate-400 mt-0.5">Paste your resume and job description below</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => document.getElementById('file-upload-input')?.click()}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-lime-500/15 hover:bg-lime-500/25 border border-lime-400/30 text-lime-300 text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Upload className="w-4 h-4" aria-hidden="true" />
              Upload PDF
            </button>
            <button
              type="button"
              className="min-h-[40px] px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer"
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
                    ? 'border-lime-400 bg-lime-400/[0.08]'
                    : 'border-white/15 hover:border-white/25 bg-black/30'
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
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" aria-hidden="true" />
                <p className="text-sm text-slate-300">
                  Drop a PDF or DOCX here to extract your resume directly into this panel
                </p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); document.getElementById('file-upload-input')?.click(); }}
                  className="mt-2 text-xs text-slate-500 hover:text-slate-300 transition cursor-pointer"
                >
                  Browse
                </button>
              </div>
            </div>
          )}

          {fileError && (
            <div role="alert" className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" aria-hidden="true" />
              <span>{fileError}</span>
            </div>
          )}

          {/* Staged File */}
          {stagedFile && (
            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shrink-0">
                  <FileCheck className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{stagedFile.name}</p>
                  <p className="text-xs text-slate-400">{(stagedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
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
                    className="min-h-[36px] px-3 py-1.5 rounded-lg bg-lime-400/20 hover:bg-lime-400/30 border border-lime-400/30 text-lime-300 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {isParsing ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-lime-300 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                        <span>Parsing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Parse & Extract</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStagedFile(null)}
                    className="min-h-[36px] min-w-[36px] p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer flex items-center justify-center"
                    aria-label="Remove uploaded file"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Single Textarea */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="workspace-textarea" className="text-xs font-semibold text-lime-400 uppercase tracking-wider">
                Resume & Job Description
              </label>
              <span className="font-mono text-xs text-slate-500">{bullets} bullets · {words} words</span>
            </div>
            <textarea
              id="workspace-textarea"
              value={textContent}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="Paste your resume and the target job description here..."
              className="w-full min-h-[300px] p-4 rounded-xl bg-black/60 border border-white/10 text-sm text-slate-100 font-mono leading-relaxed focus:outline-none focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/30 resize-y"
            />
            <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
              <span>Markdown & plain text supported</span>
              {textContent.length > 0 && (
                <button
                  type="button"
                  onClick={() => onTextChange('')}
                  className="text-slate-400 hover:text-white transition cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Footer Action */}
        <div className="px-5 pb-5">
          <button
            type="button"
            onClick={onRunAnalysis}
            disabled={isAnalyzing || !textContent.trim()}
            className={`w-full min-h-[48px] py-3 rounded-xl font-display text-sm font-bold tracking-wide transition shadow-xl flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer ${
              !textContent.trim()
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                : 'bg-lime-400 text-slate-950 hover:bg-lime-300 shadow-[0_0_30px_rgba(163,230,53,0.25)]'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                <span>Evaluating keyword density, action verbs & metrics...</span>
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
                <span>Analyze Match</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Parser Preview Modal */}
      {showParserPreview && parsedDoc && (
        <ParserPreview
          parsed={parsedDoc}
          onClose={() => setShowParserPreview(false)}
          onUseForJd={(text) => onTextChange(textContent + '\n\n--- JOB DESCRIPTION ---\n\n' + text)}
          onUseForResume={(text) => onTextChange(text)}
        />
      )}
    </section>
  );
};
