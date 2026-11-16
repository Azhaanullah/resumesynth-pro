import React, { useState } from 'react';
import { Upload, X, FileCheck, ArrowRight, AlertCircle, Maximize2, ExternalLink, Sparkles } from 'lucide-react';
import { countWords, countBullets } from '../utils/atsEngine';
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
  const [isDragging, setIsDragging] = useState(false);
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isJdModalOpen, setIsJdModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const jdWords = countWords(jobDescription);
  const resumeWords = countWords(resumeText);
  const resumeBullets = countBullets(resumeText);

  const handleFileUpload = (file: File | undefined) => {
    if (!file) return;
    setFileError(null);

    if (!/\.(pdf|docx?|txt|md)$/i.test(file.name)) {
      setFileError("Please upload a PDF, DOCX, TXT, or MD resume file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError("File size exceeds 10 MB limit.");
      return;
    }

    setStagedFile(file);

    // If it's a text file or markdown, read directly
    if (/\.(txt|md)$/i.test(file.name)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) onResumeChange(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <section id="my-resume" aria-labelledby="inputs-heading" className="space-y-6 mb-10">
      <h2 id="inputs-heading" className="sr-only">Resume and Job Description Input Workspace</h2>

      {/* 2-Column Input Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Step 1: Job Description */}
        <div className="rounded-2xl border border-white/[0.12] bg-slate-900/75 backdrop-blur-xl shadow-xl overflow-hidden flex flex-col justify-between group">
          <div className="p-5 border-b border-white/[0.1] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 font-mono text-xs font-bold flex items-center justify-center border border-blue-500/40"
                aria-hidden="true"
              >
                01
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-white tracking-tight">
                  Target Job Description
                </h3>
                <p id="jd-desc" className="text-xs text-slate-300">
                  Paste requirements, qualifications, and role responsibilities.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className="hidden sm:inline-flex font-mono text-xs text-slate-300 bg-black/50 px-2.5 py-1 rounded-md border border-white/[0.1]"
                aria-live="polite"
              >
                {jdWords} words
              </span>

              {/* Dedicated Interface Trigger Button */}
              <button
                type="button"
                onClick={() => setIsJdModalOpen(true)}
                className="px-3 py-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                title="Open separate full-screen Job Description Studio"
                aria-label="Open separate full-screen Job Description Studio"
              >
                <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Dedicated Studio</span>
              </button>
            </div>
          </div>

          <div className="p-5 space-y-3">
            {/* Quick Click-to-open notice */}
            <div
              onClick={() => setIsJdModalOpen(true)}
              className="px-3 py-2 rounded-xl border border-blue-500/20 bg-blue-500/[0.06] hover:bg-blue-500/[0.12] text-xs text-blue-300 flex items-center justify-between cursor-pointer transition"
              title="Click to open separate full-screen interface"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Need focused editing? Click to open full Job Description interface</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            </div>

            <label htmlFor="jd-textarea" className="sr-only">
              Job Description Text
            </label>
            <textarea
              id="jd-textarea"
              value={jobDescription}
              onChange={(e) => onJobDescriptionChange(e.target.value)}
              aria-describedby="jd-desc"
              placeholder="Paste target job posting or requirements here, or click Dedicated Studio above..."
              className="w-full min-h-[200px] p-4 rounded-xl bg-black/60 border border-white/15 text-sm sm:text-xs text-slate-100 font-mono leading-relaxed focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-y"
            />

            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>{jdWords > 0 ? `${jdWords} words analyzed` : 'Paste requirements or bullet points for highest scoring accuracy.'}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsJdModalOpen(true)}
                  className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer underline underline-offset-2"
                >
                  Full Editor
                </button>
                {jobDescription.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onJobDescriptionChange('')}
                    className="min-h-[36px] px-2 text-slate-400 hover:text-white transition font-medium cursor-pointer"
                    aria-label="Clear job description text"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Resume Evidence */}
        <div className="rounded-2xl border border-white/[0.12] bg-slate-900/75 backdrop-blur-xl shadow-xl overflow-hidden flex flex-col justify-between group">
          <div className="p-5 border-b border-white/[0.1] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className="w-7 h-7 rounded-lg bg-cyan-400/20 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center border border-cyan-400/40"
                aria-hidden="true"
              >
                02
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-white tracking-tight">
                  Your Resume Text
                </h3>
                <p id="resume-desc" className="text-xs text-slate-300">
                  Paste resume text, projects, or work achievements.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="hidden sm:flex items-center gap-2 font-mono text-xs text-slate-300 bg-black/50 px-2.5 py-1 rounded-md border border-white/[0.1]"
                aria-live="polite"
              >
                <span>{resumeBullets} bullets</span>
                <span>•</span>
                <span>{resumeWords} words</span>
              </div>

              {/* Dedicated Interface Trigger Button */}
              <button
                type="button"
                onClick={() => setIsResumeModalOpen(true)}
                className="px-3 py-1.5 rounded-xl border border-cyan-400/30 bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-300 hover:text-cyan-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                title="Open separate full-screen Resume Studio"
                aria-label="Open separate full-screen Resume Studio"
              >
                <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Dedicated Studio</span>
              </button>
            </div>
          </div>

          <div className="p-5 space-y-3">
            {/* Quick Click-to-open notice */}
            <div
              onClick={() => setIsResumeModalOpen(true)}
              className="px-3 py-2 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] hover:bg-cyan-400/[0.12] text-xs text-cyan-300 flex items-center justify-between cursor-pointer transition"
              title="Click to open separate full-screen interface"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Want section starters & STAR templates? Click to open full Resume interface</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            </div>

            <label htmlFor="resume-textarea" className="sr-only">
              Resume Evidence Text
            </label>
            <textarea
              id="resume-textarea"
              value={resumeText}
              onChange={(e) => onResumeChange(e.target.value)}
              aria-describedby="resume-desc"
              placeholder="Paste your current resume bullets or full text, or click Dedicated Studio above..."
              className="w-full min-h-[200px] p-4 rounded-xl bg-black/60 border border-white/15 text-sm sm:text-xs text-slate-100 font-mono leading-relaxed focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-y"
            />

            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="text-cyan-300 font-semibold">✓ Markdown & plain text supported</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsResumeModalOpen(true)}
                  className="text-cyan-300 hover:text-cyan-200 font-semibold cursor-pointer underline underline-offset-2"
                >
                  Full Editor
                </button>
                {resumeText.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onResumeChange('')}
                    className="min-h-[36px] px-2 text-slate-400 hover:text-white transition font-medium cursor-pointer"
                    aria-label="Clear resume text"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Document File Dropzone */}
      <div className="rounded-2xl border border-white/[0.12] bg-slate-900/75 p-6 backdrop-blur-xl shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span
              className="w-7 h-7 rounded-lg bg-violet-400/20 text-violet-300 font-mono text-xs font-bold flex items-center justify-center border border-violet-400/40"
              aria-hidden="true"
            >
              03
            </span>
            <div>
              <h3 className="font-display text-sm font-bold text-white tracking-tight">
                Upload Resume Document (PDF, DOCX, TXT)
              </h3>
              <p className="text-xs text-slate-300">
                Prefer uploading a file? Drop it here to parse into the editor.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-300 uppercase tracking-wider bg-black/50 px-3 py-1 rounded border border-white/[0.1]">
            Max 10 MB
          </span>
        </div>

        {fileError && (
          <div
            role="alert"
            className="mb-4 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" aria-hidden="true" />
            <span>{fileError}</span>
          </div>
        )}

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFileUpload(e.dataTransfer.files?.[0]);
          }}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition ${
            isDragging
              ? 'border-lime-400 bg-lime-400/[0.08]'
              : stagedFile
              ? 'border-cyan-400/50 bg-cyan-400/[0.05]'
              : 'border-white/20 hover:border-white/30 bg-black/40'
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

          {stagedFile ? (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-left">
                <div
                  className="w-10 h-10 rounded-xl bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300"
                  aria-hidden="true"
                >
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{stagedFile.name}</h4>
                  <p className="text-xs text-slate-300">
                    {(stagedFile.size / (1024 * 1024)).toFixed(2)} MB • File staged for parsing
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="file-upload-input"
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-white/[0.1] hover:bg-white/[0.2] text-xs font-semibold text-white cursor-pointer transition flex items-center"
                >
                  Change File
                </label>
                <button
                  type="button"
                  onClick={() => setStagedFile(null)}
                  className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer flex items-center justify-center"
                  aria-label="Remove uploaded file"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          ) : (
            <label htmlFor="file-upload-input" className="cursor-pointer block py-2">
              <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" aria-hidden="true" />
              <span className="text-sm font-bold text-white block">
                Click to browse or drag & drop your resume file here
              </span>
              <span className="text-xs text-slate-300 mt-1 block">
                Supports PDF, DOCX, TXT, and Markdown documents
              </span>
            </label>
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
          aria-label="Run match analysis"
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
              <span>Run match analysis</span>
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
