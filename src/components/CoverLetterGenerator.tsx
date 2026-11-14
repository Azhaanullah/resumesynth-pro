import React, { useState, useEffect } from 'react';
import { Mail, Sparkles, Copy, Download, Printer, Check, RefreshCw, SlidersHorizontal, Building2, User } from 'lucide-react';
import { AnalysisResult, CoverLetterTone } from '../types';
import { generateCoverLetter, extractCompanyName } from '../utils/coverLetterEngine';

interface CoverLetterGeneratorProps {
  targetRole: string;
  resumeText: string;
  jobDescription: string;
  analysis: AnalysisResult;
}

export const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({
  targetRole,
  resumeText,
  jobDescription,
  analysis,
}) => {
  const [company, setCompany] = useState(() => extractCompanyName(jobDescription));
  const [tone, setTone] = useState<CoverLetterTone>('Confident');
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Sync / generate initial letter
  useEffect(() => {
    const detectedCompany = extractCompanyName(jobDescription);
    setCompany(detectedCompany);
    const result = generateCoverLetter(targetRole, detectedCompany, resumeText, jobDescription, analysis, tone);
    setContent(result.content);
    setKeywords(result.highlightedKeywords);
  }, [targetRole, jobDescription, resumeText]);

  const handleRegenerate = (newTone?: CoverLetterTone) => {
    const selectedTone = newTone || tone;
    const result = generateCoverLetter(targetRole, company, resumeText, jobDescription, analysis, selectedTone);
    setContent(result.content);
    setKeywords(result.highlightedKeywords);
  };

  const handleToneChange = (newTone: CoverLetterTone) => {
    setTone(newTone);
    handleRegenerate(newTone);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = (format: 'txt' | 'md') => {
    const blob = new Blob([content], { type: format === 'txt' ? 'text/plain' : 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cover_Letter_${(company || 'Company').replace(/\s+/g, '_')}_${(targetRole || 'Role').replace(/\s+/g, '_')}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cover Letter - ${company}</title>
          <style>
            @page { margin: 1in; }
            body { font-family: 'Georgia', serif; font-size: 11pt; line-height: 1.6; color: #111; max-width: 750px; margin: 0 auto; white-space: pre-wrap; }
          </style>
        </head>
        <body>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <section id="cover-letter" aria-labelledby="cover-letter-heading" className="space-y-6">
      <div className="rounded-2xl border border-white/[0.12] bg-slate-900/75 p-6 backdrop-blur-xl shadow-xl space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.1]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-300">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-blue-300 font-bold">
                <span>Tailored Application Suite</span>
                <span className="text-white/20">•</span>
                <span>Job-Specific Alignment</span>
              </div>
              <h2 id="cover-letter-heading" className="text-xl font-bold text-white tracking-tight mt-0.5">
                Targeted AI Cover Letter Generator
              </h2>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 border border-white/10 text-xs font-semibold transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-lime-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Letter'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleDownload('txt')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 border border-white/10 text-xs font-semibold transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .txt</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs hover:bg-lime-300 transition cursor-pointer shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Controls: Company, Tone, and Regenerate */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl border border-white/[0.08] bg-black/40">
          <div>
            <label htmlFor="company-name-input" className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              Target Company Name
            </label>
            <input
              id="company-name-input"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Stripe, Airbnb, Google"
              className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
              Writing Tone
            </label>
            <div className="grid grid-cols-2 gap-1">
              {(['Confident', 'Professional', 'Enthusiastic', 'Executive'] as CoverLetterTone[]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleToneChange(t)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer truncate ${
                    tone === t
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold'
                      : 'text-slate-400 hover:text-white bg-black/30 border border-white/5'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <button
              type="button"
              onClick={() => handleRegenerate()}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600/30 hover:bg-blue-600/40 text-blue-200 border border-blue-500/40 text-xs font-bold transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate with Tone</span>
            </button>
          </div>
        </div>

        {/* Woven Keywords Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Keywords Weaved from JD:</span>
          {keywords.map(kw => (
            <span
              key={kw}
              className="px-2 py-0.5 rounded-md bg-blue-500/15 border border-blue-500/30 text-blue-300 font-mono text-[11px]"
            >
              {kw}
            </span>
          ))}
          <span className="ml-auto text-slate-400 font-mono text-[11px]">{wordCount} words</span>
        </div>

        {/* Editable Cover Letter Textarea */}
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            className="w-full p-4 rounded-xl bg-black/60 border border-white/10 text-xs font-sans leading-relaxed text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-400 transition"
            aria-label="Editable generated cover letter"
          />
        </div>
      </div>
    </section>
  );
};
