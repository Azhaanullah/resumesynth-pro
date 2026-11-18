import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { Wand2, Copy, Check, PlusCircle } from 'lucide-react';

const isDark = (): boolean => document.documentElement.classList.contains('dark');

interface StarBulletOptimizerProps {
  analysis: AnalysisResult;
  onApplyBullet: (newBullet: string) => void;
}

export const StarBulletOptimizer: React.FC<StarBulletOptimizerProps> = ({ analysis, onApplyBullet }) => {
  const [copied, setCopied] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('35% throughput boost');
  const [customAction, setCustomAction] = useState('Architected');
  const dark = isDark();

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
      className="rounded-2xl border p-5 shadow-xl flex flex-col justify-between"
      style={{ borderColor: 'var(--border)', backgroundColor: dark ? 'rgba(32,25,19,0.86)' : 'rgba(255,253,245,0.95)', boxShadow: dark ? '0 18px 44px rgba(23,17,14,0.14)' : '0 14px 36px rgba(53,32,20,0.08)' }}
    >
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-3" style={{ borderBottomColor: 'var(--border)', borderBottomWidth: 1, borderBottomStyle: 'solid' }}>
          <div>
            <div className="flex items-center gap-2">
              <Wand2 className="w-4 h-4" style={{ color: 'var(--accent)' }} aria-hidden="true" />
              <h3 id="star-studio-heading" className="font-display text-base font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
                STAR Bullet Rewriter & Impact Injector
              </h3>
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Transform passive duty descriptions into measurable, result-backed STAR achievements.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full font-mono text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: 'var(--accent-light)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}>
            {analysis.improvement}
          </span>
        </div>

        {/* Interactive Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 p-3.5 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: dark ? 'rgba(0,0,0,0.2)' : 'rgba(53,32,20,0.03)' }}>
          <div>
            <label id="verb-group-label" className="block text-xs font-mono uppercase tracking-wider mb-2 font-semibold" style={{ color: 'var(--text-muted)' }}>
              Select Strong Action Verb
            </label>
            <div className="flex flex-wrap gap-1.5" role="group" aria-labelledby="verb-group-label">
              {actionVerbOptions.map(verb => (
                <button
                  key={verb}
                  type="button"
                  onClick={() => setCustomAction(verb)}
                  className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                    customAction === verb ? 'shadow-md' : ''
                  }`}
                  style={customAction === verb
                    ? { backgroundColor: 'var(--accent)', color: '#FFFFFF', borderColor: 'var(--accent)' }
                    : { backgroundColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(53,32,20,0.04)', borderColor: 'var(--border)', color: 'var(--text-main)' }
                  }
                  aria-pressed={customAction === verb}
                >
                  {verb}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="metric-select" className="block text-xs font-mono uppercase tracking-wider mb-2 font-semibold" style={{ color: 'var(--text-muted)' }}>
              Inject Quantifiable Metric
            </label>
            <select
              id="metric-select"
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="w-full min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-medium focus:outline-none focus:border-[var(--accent)] cursor-pointer border"
              style={{ backgroundColor: dark ? 'rgba(0,0,0,0.2)' : 'rgba(53,32,20,0.03)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
            >
              {metricOptions.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="space-y-3">
          <div className="rounded-xl border p-3.5" style={{ borderColor: 'rgba(244,63,94,0.25)', backgroundColor: 'rgba(244,63,94,0.05)' }}>
            <div className="flex items-center gap-2 mb-1 text-xs font-mono font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-rose-400" aria-hidden="true" />
              <span style={{ color: '#f43f5e' }}>Original Passive Bullet:</span>
            </div>
            <p className="text-xs leading-relaxed italic" style={{ color: 'var(--text-muted)' }}>
              "Helped build a microservice project in Go and made it run faster using Docker."
            </p>
          </div>

          <div className="rounded-xl border p-4 shadow-lg" style={{ borderColor: dark ? 'rgba(163,230,53,0.3)' : 'rgba(53,32,20,0.2)', backgroundColor: dark ? 'rgba(163,230,53,0.06)' : 'rgba(53,32,20,0.03)' }}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }} aria-hidden="true" />
                <span style={{ color: 'var(--accent)' }}>Suggested STAR Bullet (Fact-Anchored):</span>
              </div>
              <span className="text-xs font-mono font-bold" style={{ color: 'var(--accent)' }}>
                High ATS Density
              </span>
            </div>
            <p id="star-bullet-content" className="text-xs font-semibold leading-relaxed" style={{ color: 'var(--text-main)' }}>
              {dynamicRewrite}
            </p>

            <div className="mt-3 pt-3 flex flex-wrap items-center justify-between gap-2" style={{ borderTopColor: 'var(--border)', borderTopWidth: 1, borderTopStyle: 'solid' }}>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span className="font-bold" style={{ color: 'var(--accent)' }}>✓ Strong verb</span>
                <span>•</span>
                <span className="font-bold" style={{ color: 'var(--accent)' }}>✓ JD keywords included</span>
                <span>•</span>
                <span className="font-bold" style={{ color: dark ? '#fbbf24' : '#b45309' }}>⚠ Verify numbers</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border"
                  style={{ backgroundColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(53,32,20,0.04)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
                  aria-label="Copy enhanced STAR bullet"
                >
                  {copied ? <Check className="w-4 h-4" style={{ color: 'var(--accent)' }} aria-hidden="true" /> : <Copy className="w-4 h-4" style={{ color: 'var(--text-muted)' }} aria-hidden="true" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onApplyBullet(dynamicRewrite)}
                  className="min-h-[40px] px-4 py-1.5 rounded-xl text-xs font-bold transition shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                  style={{ backgroundColor: 'var(--accent)', color: '#FFFFFF' }}
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
