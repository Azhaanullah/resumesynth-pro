import React from 'react';
import { AnalysisResult, QualityIssue } from '../types';
import { ShieldAlert, CheckCircle, ArrowRight, AlertTriangle, Sparkles, BookOpen, Layers } from 'lucide-react';

interface ResumeHealthSectionProps {
  analysis: AnalysisResult;
  issues: QualityIssue[];
  jobDescription: string;
  onFixIssue: (issue: QualityIssue) => void;
}

export const ResumeHealthSection: React.FC<ResumeHealthSectionProps> = ({
  analysis,
  issues,
  onFixIssue
}) => {
  const healthPenalty = issues.reduce((acc, curr) => acc + (curr.severity === 'high' ? 15 : curr.severity === 'medium' ? 8 : 4), 0);
  const healthScore = Math.max(20, Math.min(100, 100 - healthPenalty));

  const missingKeywords = analysis.missing.slice(0, 4).map(m => m.term);
  const suggestedProjectIdea = missingKeywords.length > 0
    ? `Build a lightweight production demo integrating ${missingKeywords.slice(0, 2).join(' and ')} to create tangible portfolio proof.`
    : "Document architectural decisions with a system design diagram & README benchmarks.";

  return (
    <section id="resume-health" aria-labelledby="health-heading" className="rounded-2xl border border-white/[0.12] bg-slate-900/75 p-6 backdrop-blur-xl shadow-xl">
      {/* Top Banner */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-white/[0.1]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-300" aria-hidden="true">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 id="health-heading" className="font-display text-lg font-bold text-white tracking-tight">
              Resume Health & Profile Enhancers
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Automated ATS heuristic checks and proactive portfolio improvement suggestions.
            </p>
          </div>
        </div>

        {/* Health Score Pill */}
        <div className="flex items-center gap-4 bg-black/50 border border-white/[0.1] rounded-xl px-4 py-2">
          <div className="text-right">
            <span className="block text-[10px] font-mono uppercase text-slate-400">Health Rating</span>
            <span className="font-display text-2xl font-extrabold text-white">
              {healthScore}<span className="text-xs text-slate-400 font-normal">/100</span>
            </span>
          </div>
          <div className="h-8 w-px bg-white/15" aria-hidden="true" />
          <div className="text-xs text-slate-200">
            <span className="font-bold text-amber-300">{issues.length}</span> improvement{issues.length === 1 ? '' : 's'} recommended
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 mt-6">
        {/* Quality Check Issues List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-display text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-300" aria-hidden="true" />
              Prioritized Quality Audits
            </h4>
            <span className="text-xs text-slate-400">Actionable fixes</span>
          </div>

          <div className="space-y-3">
            {issues.length > 0 ? (
              issues.map(issue => (
                <article
                  key={issue.id}
                  className={`rounded-xl border p-4 transition ${
                    issue.severity === 'high'
                      ? 'border-rose-400/30 bg-rose-500/[0.04]'
                      : issue.severity === 'medium'
                      ? 'border-amber-400/30 bg-amber-500/[0.04]'
                      : 'border-white/[0.1] bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2 text-xs font-bold text-white">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          issue.severity === 'high'
                            ? 'bg-rose-400'
                            : issue.severity === 'medium'
                            ? 'bg-amber-400'
                            : 'bg-blue-400'
                        }`}
                        aria-hidden="true"
                      />
                      {issue.title}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-white/[0.1] text-slate-200">
                      {issue.severity} priority
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-200 mt-2">
                    <div className="bg-black/40 p-3 rounded-lg border border-white/[0.06]">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5 font-bold">Found:</span>
                      <p className="text-slate-200 font-mono text-xs">{issue.current}</p>
                    </div>

                    <div className="bg-lime-400/[0.06] p-3 rounded-lg border border-lime-400/20">
                      <span className="text-[10px] font-mono uppercase text-lime-400 block mb-0.5 font-bold">Recommendation:</span>
                      <p className="text-lime-200 text-xs font-semibold">{issue.suggested}</p>
                    </div>

                    <p className="text-xs text-slate-300 pt-1">
                      <strong className="text-slate-200">Why:</strong> {issue.why}
                    </p>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onFixIssue(issue)}
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-white/[0.1] hover:bg-white/[0.2] border border-white/15 text-xs font-bold text-white transition active:scale-95 flex items-center gap-2 cursor-pointer"
                      aria-label={`Fix issue: ${issue.title}`}
                    >
                      <span>{issue.severity === 'high' ? 'Fix in Resume' : 'Review in Editor'}</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-xl border border-lime-400/30 bg-lime-400/[0.05] p-5 text-center">
                <CheckCircle className="w-8 h-8 text-lime-400 mx-auto mb-2" aria-hidden="true" />
                <h5 className="text-sm font-bold text-white">No Critical Issues Detected</h5>
                <p className="text-xs text-slate-300 mt-1">
                  Your resume satisfies all primary ATS structural and formatting guidelines!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Profile Boosters */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-display text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-300" aria-hidden="true" />
              Strategic Profile Boosters
            </h4>
          </div>

          <div className="rounded-xl border border-white/[0.1] bg-black/50 p-4">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-1.5">
              <Layers className="w-4 h-4" aria-hidden="true" /> Recommended Portfolio Project
            </span>
            <p className="text-xs font-bold text-slate-100 mt-2 leading-snug">
              {suggestedProjectIdea}
            </p>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Provides real, demonstrable artifacts to close job gaps without misrepresenting past experience.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.1] bg-black/50 p-4">
            <span className="text-xs font-mono uppercase tracking-wider text-violet-300 font-bold flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" aria-hidden="true" /> Fast-Track Learning Concepts
            </span>
            <div className="flex flex-wrap gap-2 mt-2.5" role="list">
              {missingKeywords.length > 0 ? (
                missingKeywords.map(kw => (
                  <span key={kw} role="listitem" className="px-3 py-1.5 rounded-lg bg-violet-500/15 border border-violet-500/30 text-xs font-semibold text-violet-200">
                    {kw} Core Patterns
                  </span>
                ))
              ) : (
                <>
                  <span role="listitem" className="px-3 py-1.5 rounded-lg bg-violet-500/15 border border-violet-500/30 text-xs font-semibold text-violet-200">System Scalability</span>
                  <span role="listitem" className="px-3 py-1.5 rounded-lg bg-violet-500/15 border border-violet-500/30 text-xs font-semibold text-violet-200">Distributed Caching</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
