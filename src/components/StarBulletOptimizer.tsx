import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { Wand2, Copy, Check, PlusCircle } from 'lucide-react';

interface StarBulletOptimizerProps {
  analysis: AnalysisResult;
  onApplyBullet: (newBullet: string) => void;
}

export const StarBulletOptimizer: React.FC<StarBulletOptimizerProps> = ({ analysis, onApplyBullet }) => {
  const [copied, setCopied] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('35% throughput boost');
  const [customAction, setCustomAction] = useState('Architected');

  const actionVerbOptions = ['Architected', 'Spearheaded', 'Engineered', 'Optimized', 'Streamlined', 'Overhauled'];
  const metricOptions = [
    '35% throughput boost',
    'cutting query latency by 45%',
    'scaling to 100k+ active users',
    'saving 8 engineering hours/week',
    'reducing deployment failures by 80%'
  ];

  const dynamicRewrite = `${customAction} modular backend microservices, integrating Docker and automated CI/CD pipelines to achieve ${selectedMetric}.`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(analysis.enhanced || dynamicRewrite);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <article
      id="bullet-studio"
      aria-labelledby="star-studio-heading"
      className="rounded-2xl border border-white/[0.12] bg-slate-900/75 p-5 backdrop-blur-xl shadow-xl flex flex-col justify-between"
    >
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-3 border-b border-white/[0.1]">
          <div>
            <div className="flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-violet-300" aria-hidden="true" />
              <h3 id="star-studio-heading" className="font-display text-base font-bold text-white tracking-tight">
                STAR Bullet Rewriter & Impact Injector
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Transform passive duty descriptions into measurable, result-backed STAR achievements.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-violet-400/15 border border-violet-400/30 font-mono text-xs text-violet-200 font-bold uppercase tracking-wider">
            {analysis.improvement}
          </span>
        </div>

        {/* Interactive Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 p-3.5 rounded-xl bg-black/50 border border-white/[0.08]">
          <div>
            <label id="verb-group-label" className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2 font-semibold">
              Select Strong Action Verb
            </label>
            <div className="flex flex-wrap gap-1.5" role="group" aria-labelledby="verb-group-label">
              {actionVerbOptions.map(verb => (
                <button
                  key={verb}
                  type="button"
                  onClick={() => setCustomAction(verb)}
                  className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    customAction === verb
                      ? 'bg-violet-500 text-white shadow-md'
                      : 'bg-white/[0.08] text-slate-200 hover:bg-white/[0.15]'
                  }`}
                  aria-pressed={customAction === verb}
                >
                  {verb}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="metric-select" className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2 font-semibold">
              Inject Quantifiable Metric
            </label>
            <select
              id="metric-select"
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="w-full min-h-[40px] px-3 py-1.5 rounded-xl bg-slate-900 border border-white/20 text-xs text-slate-100 font-medium focus:outline-none focus:border-violet-400 cursor-pointer"
            >
              {metricOptions.map(m => (
                <option key={m} value={m} className="bg-slate-900">{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="space-y-3">
          <div className="rounded-xl border border-rose-400/30 bg-rose-500/[0.05] p-3.5">
            <div className="flex items-center gap-2 mb-1 text-xs font-mono font-bold text-rose-300 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-rose-400" aria-hidden="true" />
              Original Passive Bullet:
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "Helped build a microservice project in Go and made it run faster using Docker."
            </p>
          </div>

          <div className="rounded-xl border border-lime-400/35 bg-lime-400/[0.06] p-4 shadow-lg">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-lime-300 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" aria-hidden="true" />
                Suggested STAR Bullet (Fact-Anchored):
              </div>
              <span className="text-xs text-lime-200 font-mono font-bold">
                High ATS Density
              </span>
            </div>
            <p id="star-bullet-content" className="text-xs text-slate-100 font-semibold leading-relaxed">
              {dynamicRewrite}
            </p>

            <div className="mt-3 pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="text-lime-300 font-bold">✓ Strong verb</span>
                <span>•</span>
                <span className="text-cyan-300 font-bold">✓ JD keywords included</span>
                <span>•</span>
                <span className="text-amber-300 font-bold">⚠ Verify numbers</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-white/[0.1] hover:bg-white/[0.2] border border-white/15 text-xs font-bold text-slate-100 transition flex items-center gap-1.5 cursor-pointer"
                  aria-label="Copy enhanced STAR bullet"
                >
                  {copied ? <Check className="w-4 h-4 text-lime-400" aria-hidden="true" /> : <Copy className="w-4 h-4 text-slate-300" aria-hidden="true" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onApplyBullet(dynamicRewrite)}
                  className="min-h-[40px] px-4 py-1.5 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs hover:bg-lime-300 transition shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                  aria-label="Apply STAR bullet directly to resume editor"
                >
                  <PlusCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Apply to Editor</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
