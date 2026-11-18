import React from 'react';
import { AnalysisResult, QualityIssue } from '../types';
import { ShieldAlert, CheckCircle, ArrowRight, AlertTriangle, Sparkles, BookOpen, Layers } from 'lucide-react';

const isDark = (): boolean => document.documentElement.classList.contains('dark');

interface ResumeHealthSectionProps {
  analysis: AnalysisResult;
  issues: QualityIssue[];
  jobDescription: string;
  onFixIssue: (issue: QualityIssue) => void;
}

export const ResumeHealthSection: React.FC<ResumeHealthSectionProps> = ({
  analysis,
  issues,
  jobDescription,
  onFixIssue
}) => {
  const healthPenalty = issues.reduce((acc, curr) => acc + (curr.severity === 'high' ? 15 : curr.severity === 'medium' ? 8 : 4), 0);
  const healthScore = Math.max(20, Math.min(100, 100 - healthPenalty));
  const dark = isDark();

  const missingKeywords = analysis.missing.slice(0, 4).map(m => m.term);
  const suggestedProjectIdea = missingKeywords.length > 0
    ? `Build a lightweight production demo integrating ${missingKeywords.slice(0, 2).join(' and ')} to create tangible portfolio proof.`
    : "Document architectural decisions with a system design diagram & README benchmarks.";

  return (
    <section id="resume-health" aria-labelledby="health-heading" className="rounded-2xl border p-6 shadow-xl" style={{ borderColor: 'var(--border)', backgroundColor: dark ? 'rgba(32,25,19,0.86)' : 'rgba(255,253,245,0.95)', boxShadow: dark ? '0 18px 44px rgba(23,17,14,0.14)' : '0 14px 36px rgba(53,32,20,0.08)' }}>
      {/* Top Banner */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-6" style={{ borderBottomColor: 'var(--border)', borderBottomWidth: 1, borderBottomStyle: 'solid' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ backgroundColor: 'var(--accent-light)', borderColor: 'var(--accent-border)', color: 'var(--accent)' }} aria-hidden="true">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 id="health-heading" className="font-display text-lg font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
              Resume Health & Profile Enhancers
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Automated ATS heuristic checks and proactive portfolio improvement suggestions.
            </p>
          </div>
        </div>

        {/* Health Score Pill */}
        <div className="flex items-center gap-4 rounded-xl px-4 py-2 border" style={{ borderColor: 'var(--border)', backgroundColor: dark ? 'rgba(0,0,0,0.2)' : 'rgba(53,32,20,0.04)' }}>
          <div className="text-right">
            <span className="block text-[10px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>Health Rating</span>
            <span className="font-display text-2xl font-extrabold" style={{ color: 'var(--text-main)' }}>
              {healthScore}<span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>/100</span>
            </span>
          </div>
          <div className="h-8 w-px" style={{ backgroundColor: 'var(--border)' }} aria-hidden="true" />
          <div className="text-xs" style={{ color: 'var(--text-main)' }}>
            <span className="font-bold" style={{ color: dark ? '#fbbf24' : '#b45309' }}>{issues.length}</span> improvement{issues.length === 1 ? '' : 's'} recommended
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 mt-6">
        {/* Quality Check Issues List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-display text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
              <AlertTriangle className="w-4 h-4" style={{ color: dark ? '#fbbf24' : '#b45309' }} aria-hidden="true" />
              Prioritized Quality Audits
            </h4>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Actionable fixes</span>
          </div>

          <div className="space-y-3">
            {issues.length > 0 ? (
              issues.map(issue => (
                <article
                  key={issue.id}
                  className="rounded-xl border p-4 transition"
                  style={{
                    borderColor: issue.severity === 'high'
                      ? 'rgba(244,63,94,0.3)'
                      : issue.severity === 'medium'
                      ? 'rgba(251,191,36,0.3)'
                      : 'var(--border)',
                    backgroundColor: issue.severity === 'high'
                      ? 'rgba(244,63,94,0.06)'
                      : issue.severity === 'medium'
                      ? 'rgba(251,191,36,0.06)'
                      : dark ? 'rgba(0,0,0,0.15)' : 'rgba(53,32,20,0.02)'
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2 text-xs font-bold" style={{ color: 'var(--text-main)' }}>
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: issue.severity === 'high' ? '#f43f5e' : issue.severity === 'medium' ? '#fbbf24' : '#3b82f6' }}
                        aria-hidden="true"
                      />
                      {issue.title}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold" style={{ backgroundColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(53,32,20,0.06)', color: 'var(--text-muted)' }}>
                      {issue.severity} priority
                    </span>
                  </div>

                  <div className="space-y-2 text-xs mt-2" style={{ color: 'var(--text-main)' }}>
                    <div className="p-3 rounded-lg border" style={{ backgroundColor: dark ? 'rgba(0,0,0,0.2)' : 'rgba(53,32,20,0.03)', borderColor: 'var(--border)' }}>
                      <span className="text-[10px] font-mono uppercase block mb-0.5 font-bold" style={{ color: 'var(--text-muted)' }}>Found:</span>
                      <p className="font-mono text-xs">{issue.current}</p>
                    </div>

                    <div className="p-3 rounded-lg border" style={{ borderColor: dark ? 'rgba(163,230,53,0.25)' : 'rgba(53,32,20,0.15)', backgroundColor: dark ? 'rgba(163,230,53,0.06)' : 'rgba(53,32,20,0.03)' }}>
                      <span className="text-[10px] font-mono uppercase block mb-0.5 font-bold" style={{ color: 'var(--accent)' }}>Recommendation:</span>
                      <p className="text-xs font-semibold">{issue.suggested}</p>
                    </div>

                    <p className="pt-1" style={{ color: 'var(--text-muted)' }}>
                      <strong style={{ color: 'var(--text-main)' }}>Why:</strong> {issue.why}
                    </p>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onFixIssue(issue)}
                      className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 flex items-center gap-2 cursor-pointer border"
                      style={{ backgroundColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(53,32,20,0.04)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
                      aria-label={`Fix issue: ${issue.title}`}
                    >
                      <span>{issue.severity === 'high' ? 'Fix in Resume' : 'Review in Editor'}</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-xl border p-5 text-center" style={{ borderColor: dark ? 'rgba(163,230,53,0.3)' : 'rgba(53,32,20,0.2)', backgroundColor: dark ? 'rgba(163,230,53,0.05)' : 'rgba(53,32,20,0.02)' }}>
                <CheckCircle className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--accent)' }} aria-hidden="true" />
                <h5 className="text-sm font-bold" style={{ color: 'var(--text-main)' }}>No Critical Issues Detected</h5>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  Your resume satisfies all primary ATS structural and formatting guidelines!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Profile Boosters */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-display text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
              <Sparkles className="w-4 h-4" style={{ color: 'var(--accent)' }} aria-hidden="true" />
              Strategic Profile Boosters
            </h4>
          </div>

          <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: dark ? 'rgba(0,0,0,0.15)' : 'rgba(53,32,20,0.03)' }}>
            <span className="text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-1.5" style={{ color: 'var(--accent)' }}>
              <Layers className="w-4 h-4" aria-hidden="true" /> Recommended Portfolio Project
            </span>
            <p className="text-xs font-bold mt-2 leading-snug" style={{ color: 'var(--text-main)' }}>
              {suggestedProjectIdea}
            </p>
            <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Provides real, demonstrable artifacts to close job gaps without misrepresenting past experience.
            </p>
          </div>

          <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: dark ? 'rgba(0,0,0,0.15)' : 'rgba(53,32,20,0.03)' }}>
            <span className="text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-1.5" style={{ color: 'var(--accent)' }}>
              <BookOpen className="w-4 h-4" aria-hidden="true" /> Fast-Track Learning Concepts
            </span>
            <div className="flex flex-wrap gap-2 mt-2.5" role="list">
              {missingKeywords.length > 0 ? (
                missingKeywords.map(kw => (
                  <span key={kw} role="listitem" className="px-3 py-1.5 rounded-lg font-semibold text-xs" style={{ backgroundColor: 'var(--accent-light)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}>
                    {kw} Core Patterns
                  </span>
                ))
              ) : (
                <>
                  <span role="listitem" className="px-3 py-1.5 rounded-lg font-semibold text-xs" style={{ backgroundColor: 'var(--accent-light)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}>System Scalability</span>
                  <span role="listitem" className="px-3 py-1.5 rounded-lg font-semibold text-xs" style={{ backgroundColor: 'var(--accent-light)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}>Distributed Caching</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
