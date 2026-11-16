import React, { useState } from 'react';
import {
  Upload,
  X,
  FileCheck,
  ArrowRight,
  AlertCircle,
  Maximize2,
  ExternalLink,
  Sparkles,
  Loader2,
  CheckCircle2,
  FileText,
  Target
} from 'lucide-react';
import { countWords, countBullets } from '../utils/atsEngine';
import { parseResumeFile } from '../utils/documentParser';
import { JobDescriptionModal } from './JobDescriptionModal';
import { ResumeEditorModal } from './ResumeEditorModal';

interface InputWorkspaceProps {
  jobDescription: string;
  onJobDescriptionChange: (val: string) => void;
  resumeText: string;
  onResumeChange: (val: string) => void;
  targetRole: string;
  onTargetRoleChange: (val: string) => void;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
}

export const InputWorkspace: React.FC<InputWorkspaceProps> = ({
  jobDescription,
  onJobDescriptionChange,
  resumeText,
  onResumeChange,
  onRunAnalysis,
  isAnalyzing
}) => {
  const [activeTab, setActiveTab] = useState<'resume' | 'jd'>('resume');
  const [isDragging, setIsDragging] = useState(false);
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [parseSuccessMsg, setParseSuccessMsg] = useState<string | null>(null);
  const [isJdModalOpen, setIsJdModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const jdWords = countWords(jobDescription);
  const resumeWords = countWords(resumeText);
  const resumeBullets = countBullets(resumeText);

  const handleFileUpload = async (file: File | undefined) => {
    if (!file) return;
    setFileError(null);
    setParseSuccessMsg(null);

    if (!/\.(pdf|docx?|txt|md)$/i.test(file.name)) {
      setFileError("Please upload a PDF, DOCX, TXT, or MD resume file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError("File size exceeds 10 MB limit.");
      return;
    }

    setStagedFile(file);
    setIsParsingFile(true);
    setActiveTab('resume'); // Switch directly to resume panel to show extracted text

    try {
      const parsed = await parseResumeFile(file);
      onResumeChange(parsed.text);
      setParseSuccessMsg(`Extracted ${parsed.wordCount} words from ${file.name}`);
    } catch (err: any) {
      setFileError(err.message || 'Failed to parse file. You can paste raw text directly into the editor.');
    } finally {
      setIsParsingFile(false);
    }
  };

  return (
    <section id="my-resume" aria-labelledby="inputs-heading" className="space-y-6 mb-10">
      <h2 id="inputs-heading" className="sr-only">Resume and Job Description Input Workspace</h2>

      {/* Single Consolidated Input Panel */}
      <div className="rounded-2xl border border-white/[0.12] bg-slate-900/75 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col justify-between group">
        {/* Navigation Tabs Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.1] flex flex-wrap items-center justify-between gap-4 bg-black/40">
          {/* Tab Switcher */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-black/60 border border-white/10" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'resume'}
              aria-controls="resume-tab-panel"
              onClick={() => setActiveTab('resume')}
              className={`min-h-[42px] px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'resume'
                  ? 'bg-cyan-400/20 text-cyan-200 border border-cyan-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-4 h-4 text-cyan-300" />
              <span>Resume Document</span>
              {stagedFile && (
                <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-lime-400" title="PDF Loaded" />
              )}
              <span className="font-mono text-[11px] opacity-80 hidden md:inline">
                ({resumeWords} words)
              </span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'jd'}
              aria-controls="jd-tab-panel"
              onClick={() => setActiveTab('jd')}
              className={`min-h-[42px] px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'jd'
                  ? 'bg-blue-500/25 text-blue-200 border border-blue-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Target className="w-4 h-4 text-blue-400" />
              <span>Target Job Description</span>
              <span className="font-mono text-[11px] opacity-80 hidden md:inline">
                ({jdWords} words)
              </span>
            </button>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            {/* Hidden file input */}
            <input
              id="header-file-upload-input"
              type="file"
              accept=".pdf,.docx,.doc,.txt,.md"
              onChange={(e) => handleFileUpload(e.target.files?.[0])}
              className="sr-only"
              aria-label="Upload resume PDF or document"
            />

            {/* Quick Upload Button */}
            <label
              htmlFor="header-file-upload-input"
              className="min-h-[38px] px-3.5 py-1.5 rounded-xl border border-lime-400/30 bg-lime-400/10 hover:bg-lime-400/20 text-lime-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              title="Upload PDF, DOCX, or TXT"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload PDF</span>
            </label>

            {/* Dedicated Interface Trigger Button */}
            <button
              type="button"
              onClick={() => activeTab === 'resume' ? setIsResumeModalOpen(true) : setIsJdModalOpen(true)}
              className="min-h-[38px] px-3.5 py-1.5 rounded-xl border border-white/15 bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              title="Open full-screen modal"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Studio</span>
            </button>
          </div>
        </div>

        {/* Panel Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Error Notification */}
          {fileError && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" aria-hidden="true" />
              <span>{fileError}</span>
            </div>
          )}

          {/* Success Notification */}
          {parseSuccessMsg && (
            <div
              role="status"
              className="p-3.5 rounded-xl bg-lime-400/15 border border-lime-400/30 text-lime-200 text-xs flex items-center justify-between gap-2 animate-in fade-in"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" aria-hidden="true" />
                <span>{parseSuccessMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setParseSuccessMsg(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* TAB 1: RESUME DOCUMENT PANEL */}
          {activeTab === 'resume' && (
            <div id="resume-tab-panel" role="tabpanel" aria-labelledby="resume-tab" className="space-y-4">
              {/* Compact Drag & Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFileUpload(e.dataTransfer.files?.[0]);
                }}
                className={`border-2 border-dashed rounded-xl p-4 text-center transition ${
                  isDragging
                    ? 'border-lime-400 bg-lime-400/[0.08]'
                    : stagedFile
                    ? 'border-cyan-400/40 bg-cyan-400/[0.04]'
                    : 'border-white/15 hover:border-white/30 bg-black/30'
                }`}
              >
                {isParsingFile ? (
                  <div className="flex items-center justify-center gap-2.5 py-1 text-cyan-300">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-xs font-bold">Extracting resume text from document...</span>
                  </div>
                ) : stagedFile ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 text-left">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-cyan-400/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">{stagedFile.name}</span>
                        <span className="text-[11px] text-slate-400">
                          {(stagedFile.size / (1024 * 1024)).toFixed(2)} MB • Content displayed below in editor
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="header-file-upload-input"
                        className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white cursor-pointer transition"
                      >
                        Upload Another
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setStagedFile(null);
                          setParseSuccessMsg(null);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition cursor-pointer"
                        title="Remove file label"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label htmlFor="header-file-upload-input" className="cursor-pointer flex items-center justify-center gap-3 py-1">
                    <Upload className="w-4 h-4 text-slate-300" />
                    <span className="text-xs font-semibold text-slate-200">
                      Drop a PDF or DOCX file here to extract your resume directly into this panel
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 bg-white/10 px-2 py-0.5 rounded">
                      Browse
                    </span>
                  </label>
                )}
              </div>

              {/* Textarea for Resume */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-semibold text-cyan-300">
                    {stagedFile ? `Content from ${stagedFile.name}` : 'Resume Text & Bullet Points'}
                  </span>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span>{resumeBullets} bullets</span>
                    <span>•</span>
                    <span>{resumeWords} words</span>
                  </div>
                </div>

                <label htmlFor="resume-textarea" className="sr-only">
                  Resume Evidence Text
                </label>
                <textarea
                  id="resume-textarea"
                  value={resumeText}
                  onChange={(e) => onResumeChange(e.target.value)}
                  placeholder="Drop a PDF resume above or paste your resume bullet points and achievements here..."
                  className="w-full min-h-[260px] p-4 rounded-xl bg-black/60 border border-white/15 text-sm sm:text-xs text-slate-100 font-mono leading-relaxed focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-y"
                />

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Markdown & plain text supported</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsResumeModalOpen(true)}
                      className="text-cyan-300 hover:text-cyan-200 font-semibold cursor-pointer underline underline-offset-2"
                    >
                      Open Full Studio
                    </button>
                    {resumeText.length > 0 && (
                      <button
                        type="button"
                        onClick={() => onResumeChange('')}
                        className="text-slate-400 hover:text-white transition font-medium cursor-pointer"
                        aria-label="Clear resume text"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TARGET JOB DESCRIPTION PANEL */}
          {activeTab === 'jd' && (
            <div id="jd-tab-panel" role="tabpanel" aria-labelledby="jd-tab" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-semibold text-blue-400">
                    Target Job Description & Role Requirements
                  </span>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span>{jdWords} words</span>
                  </div>
                </div>

                <label htmlFor="jd-textarea" className="sr-only">
                  Job Description Text
                </label>
                <textarea
                  id="jd-textarea"
                  value={jobDescription}
                  onChange={(e) => onJobDescriptionChange(e.target.value)}
                  placeholder="Paste the target job posting, qualifications, tech stack requirements, and responsibilities here..."
                  className="w-full min-h-[280px] p-4 rounded-xl bg-black/60 border border-white/15 text-sm sm:text-xs text-slate-100 font-mono leading-relaxed focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-y"
                />

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Used by ATS engine to compute keyword signals & gap map</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsJdModalOpen(true)}
                      className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer underline underline-offset-2"
                    >
                      Open Full Studio
                    </button>
                    {jobDescription.length > 0 && (
                      <button
                        type="button"
                        onClick={() => onJobDescriptionChange('')}
                        className="text-slate-400 hover:text-white transition font-medium cursor-pointer"
                        aria-label="Clear job description text"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Primary Action Button: Run ATS Analysis */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onRunAnalysis}
          disabled={isAnalyzing || !jobDescription.trim() || !resumeText.trim()}
          className={`analyze-primary-btn w-full min-h-[52px] py-3.5 px-6 rounded-2xl font-display text-sm font-bold tracking-wide transition shadow-xl flex items-center justify-center gap-3 active:scale-[0.99] cursor-pointer ${
            !jobDescription.trim() || !resumeText.trim()
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-white/10'
              : 'bg-lime-400 text-slate-950 hover:bg-lime-300 shadow-[0_0_30px_rgba(163,230,53,0.3)]'
          }`}
          aria-label="Run clear ATS and compatibility analysis"
        >
          {isAnalyzing ? (
            <>
              <div
                className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"
                aria-hidden="true"
              />
              <span>Evaluating Keyword Density, Action Verbs & Metrics...</span>
            </>
          ) : (
            <>
              <span>Run Clear ATS & Compatibility Analysis</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </>
          )}
        </button>
      </div>

      {/* Dedicated Separate Interface for Job Description */}
      <JobDescriptionModal
        isOpen={isJdModalOpen}
        onClose={() => setIsJdModalOpen(false)}
        jobDescription={jobDescription}
        onSave={(val) => onJobDescriptionChange(val)}
      />

      {/* Dedicated Separate Interface for Resume Text */}
      <ResumeEditorModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        resumeText={resumeText}
        onSave={(val) => onResumeChange(val)}
      />
    </section>
  );
};
