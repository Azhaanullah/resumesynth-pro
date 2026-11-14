import React, { useState } from 'react';
import { GitCompare, TrendingUp, CheckCircle2, RefreshCw, BookmarkPlus, ArrowRight, Sparkles, FileText } from 'lucide-react';
import { AnalysisResult, BaselineSnapshot } from '../types';

interface VersionDiffViewerProps {
  currentResume: string;
  currentAnalysis: AnalysisResult;
  baseline: BaselineSnapshot | null;
  onSetBaseline: () => void;
  onRestoreBaseline: () => void;
}

export const VersionDiffViewer: React.FC<VersionDiffViewerProps> = ({
  currentResume,
  currentAnalysis,
  baseline,
  onSetBaseline,
  onRestoreBaseline,
}) => {
  const [viewMode, setViewMode] = useState<'sideBySide' | 'deltaSummary'>('deltaSummary');

  if (!baseline) {
    return (
      <section id="diff-viewer" aria-labelledby="diff-heading" className="space-y-4">
        <div className="rounded-2xl border border-white/[0.12] bg-slate-900/75 p-6 backdrop-blur-xl shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lime-400/15 border border-lime-400/30 flex items-center justify-center text-lime-300">
                <GitCompare className="w-5 h-5" />
              </div>
              <div>
                <h3 id="diff-heading" className="text-lg font-bold text-white tracking-tight">
                  Resume Version & ATS Delta Tracker
                </h3>
                <p className="text-xs text-slate-300">
                  Save a baseline snapshot of your initial draft to track score gains as you optimize.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onSetBaseline}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs hover:bg-lime-300 transition cursor-pointer shadow-lg active:scale-95"
            >
              <BookmarkPlus className="w-4 h-4" />
              <span>Capture Initial Baseline</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  const scoreDiff = currentAnalysis.overall - baseline.overallScore;
  const skillsDiff = currentAnalysis.skills.found - baseline.skillsFound;
  const verbsDiff = currentAnalysis.verbs.score - baseline.verbsScore;
  const proofDiff = currentAnalysis.proof.score - baseline.proofScore;

  // Split lines for basic text preview
  const baselineLines = baseline.resumeText.split('\n');
  const currentLines = currentResume.split('\n');

  return (
    <section id="diff-viewer" aria-labelledby="diff-heading" className="space-y-6">
      <div className="rounded-2xl border border-white/[0.12] bg-slate-900/75 p-6 backdrop-blur-xl shadow-xl space-y-6">
        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.1]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-400/15 border border-lime-400/30 flex items-center justify-center text-lime-300">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-lime-300 font-bold">
                <span>Version Optimization Diff</span>
                <span className="text-white/20">•</span>
                <span>Active Comparison</span>
              </div>
              <h2 id="diff-heading" className="text-xl font-bold text-white tracking-tight mt-0.5">
                Before vs. After ATS Growth Delta
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('deltaSummary')}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  viewMode === 'deltaSummary'
                    ? 'bg-lime-400/20 text-lime-300 border border-lime-400/30'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Metrics Delta
              </button>
              <button
                type="button"
                onClick={() => setViewMode('sideBySide')}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  viewMode === 'sideBySide'
                    ? 'bg-lime-400/20 text-lime-300 border border-lime-400/30'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Text Comparison
              </button>
            </div>

            <button
              type="button"
              onClick={onSetBaseline}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 border border-white/10 text-xs font-semibold transition cursor-pointer"
              title="Save current resume as the new baseline"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>Update Baseline</span>
            </button>

            <button
              type="button"
              onClick={onRestoreBaseline}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold transition cursor-pointer"
              title="Revert to baseline draft"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Revert to Baseline</span>
            </button>
          </div>
        </div>

        {/* Delta Stat Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Overall Match */}
          <div className="p-4 rounded-xl border border-white/[0.08] bg-black/40 space-y-1">
            <span className="text-xs text-slate-300 font-medium">Overall ATS Match</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white">{currentAnalysis.overall}%</span>
              <span className={`text-xs font-mono font-bold ${scoreDiff >= 0 ? 'text-lime-400' : 'text-rose-400'}`}>
                {scoreDiff >= 0 ? `+${scoreDiff}%` : `${scoreDiff}%`}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Baseline was {baseline.overallScore}%</div>
          </div>

          {/* Keywords Found */}
          <div className="p-4 rounded-xl border border-white/[0.08] bg-black/40 space-y-1">
            <span className="text-xs text-slate-300 font-medium">Keywords Matched</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white">{currentAnalysis.skills.found}</span>
              <span className={`text-xs font-mono font-bold ${skillsDiff >= 0 ? 'text-lime-400' : 'text-rose-400'}`}>
                {skillsDiff >= 0 ? `+${skillsDiff}` : `${skillsDiff}`}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Baseline had {baseline.skillsFound}</div>
          </div>

          {/* Power Verbs */}
          <div className="p-4 rounded-xl border border-white/[0.08] bg-black/40 space-y-1">
            <span className="text-xs text-slate-300 font-medium">Action Verbs</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white">{currentAnalysis.verbs.score}%</span>
              <span className={`text-xs font-mono font-bold ${verbsDiff >= 0 ? 'text-lime-400' : 'text-rose-400'}`}>
                {verbsDiff >= 0 ? `+${verbsDiff}%` : `${verbsDiff}%`}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Baseline was {baseline.verbsScore}%</div>
          </div>

          {/* Proof & Metrics */}
          <div className="p-4 rounded-xl border border-white/[0.08] bg-black/40 space-y-1">
            <span className="text-xs text-slate-300 font-medium">Measurable Proof</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white">{currentAnalysis.proof.score}%</span>
              <span className={`text-xs font-mono font-bold ${proofDiff >= 0 ? 'text-lime-400' : 'text-rose-400'}`}>
                {proofDiff >= 0 ? `+${proofDiff}%` : `${proofDiff}%`}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Baseline was {baseline.proofScore}%</div>
          </div>
        </div>

        {/* View Mode: Text Comparison vs Metrics Summary */}
        {viewMode === 'sideBySide' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Baseline Column */}
            <div className="p-4 rounded-xl border border-white/[0.1] bg-black/50 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 pb-2 border-b border-white/10">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Initial Baseline Draft
                </span>
                <span className="font-mono text-slate-400">{baseline.overallScore}% score</span>
              </div>
              <div className="max-h-80 overflow-y-auto font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed pr-2">
                {baseline.resumeText}
              </div>
            </div>

            {/* Current Column */}
            <div className="p-4 rounded-xl border border-lime-400/30 bg-lime-400/[0.03] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-lime-300 pb-2 border-b border-lime-400/20">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-lime-300" />
                  Current Optimized Draft
                </span>
                <span className="font-mono text-lime-300">{currentAnalysis.overall}% score</span>
              </div>
              <div className="max-h-80 overflow-y-auto font-mono text-xs text-slate-100 whitespace-pre-wrap leading-relaxed pr-2">
                {currentResume}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-white/[0.08] bg-black/30 p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Active Optimization Signals & Keywords
            </h4>
            <div className="flex flex-wrap gap-2">
              {currentAnalysis.matched.map(signal => (
                <span
                  key={signal.term}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-lime-400/15 border border-lime-400/30 text-lime-300 font-mono text-xs font-semibold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {signal.term} ({signal.count}×)
                </span>
              ))}
            </div>
            {scoreDiff > 0 && (
              <div className="flex items-center gap-2 pt-2 text-xs text-lime-300 font-medium">
                <TrendingUp className="w-4 h-4 shrink-0" />
                <span>
                  Your optimization efforts improved your ATS score by <strong>+{scoreDiff}%</strong> and unlocked {skillsDiff > 0 ? `${skillsDiff} new requirement match(es)` : 'higher phrasing precision'}.
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
