import React from 'react';
import { ShieldCheck, Zap } from 'lucide-react';
import { PRESETS } from '../data/presets';

interface HeroSectionProps {
  selectedPreset: string;
  onSelectPreset: (presetId: string) => void;
  showHowItWorks: boolean;
  onToggleHowItWorks: () => void;
}

const STEPS = [
  {
    num: '01',
    title: 'Parse & Extract',
    text: 'Extracts technical requirements, cloud tools, frameworks, and power verbs from the job description.'
  },
  {
    num: '02',
    title: 'Compare Evidence',
    text: 'Evaluates keyword coverage, action verb strength, and quantified metrics to produce transparent scores.'
  },
  {
    num: '03',
    title: 'Strengthen & Export',
    text: 'Rewrites bullets using the STAR framework, flags quality issues, and renders standard ATS export templates.'
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedPreset,
  onSelectPreset,
  showHowItWorks,
  onToggleHowItWorks
}) => {
  return (
    <section aria-labelledby="hero-title" className="py-16 md:py-24">
      {/* Kicker */}
      <div className="flex items-center gap-2 mb-6 text-sm font-medium text-[var(--text-muted)]">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-xs font-semibold tracking-wide uppercase">
          <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
          Evidence over buzzwords · Honest match scoring
        </span>
      </div>

      {/* Hero Headline */}
      <h1 id="hero-title" className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-main)] leading-[1.1] tracking-tight mb-6 max-w-3xl">
        Tailor your resume
        <br />
        <span className="text-[var(--accent)]">to any job with proof.</span>
      </h1>

      {/* Subheadline */}
      <p className="text-lg md:text-xl text-[var(--text-muted)] leading-relaxed max-w-2xl mb-10">
        Paste a job description and your resume to see which requirements your resume already
        proves and which it doesn't. Fix gaps with verifiable evidence and prepare for
        high-stakes technical interviews.
      </p>

      {/* Legend */}
      <ul className="flex flex-wrap gap-6 mb-12 text-sm" aria-label="Match signal legend">
        <li className="flex items-center gap-2 text-[var(--text-muted)]">
          <ShieldCheck className="w-4 h-4" style={{ color: 'var(--score-strong)' }} aria-hidden="true" />
          <span><strong className="text-[var(--text-main)]">Verified match</strong> grounded in resume text</span>
        </li>
        <li className="flex items-center gap-2 text-[var(--text-muted)]">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--score-low)' }} aria-hidden="true" />
          <span><strong className="text-[var(--text-main)]">Missing signal</strong> job term not evidenced yet</span>
        </li>
        <li className="flex items-center gap-2 text-[var(--text-muted)]">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--score-good)' }} aria-hidden="true" />
          <span><strong className="text-[var(--text-main)]">STAR proof</strong> measurable metric verification</span>
        </li>
      </ul>

      {/* Role Presets */}
      <div className="mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-subtle)] mb-3">
          Start from a role
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby="preset-label">
          {Object.values(PRESETS).map(preset => {
            const isSelected = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer border ${
                  isSelected
                    ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--text-main)]'
                }`}
                aria-pressed={isSelected}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* How It Works Panel */}
      {showHowItWorks && (
        <div role="region" aria-label="How ResumeSynth Works Explainer" className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
              <Zap className="w-5 h-5" style={{ color: 'var(--accent)' }} aria-hidden="true" />
              How ResumeSynth works
            </h2>
            <button
              type="button"
              onClick={onToggleHowItWorks}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] transition cursor-pointer"
              aria-label="Close how it works panel"
            >
              Close
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map(step => (
              <div key={step.num} className="space-y-2">
                <span className="text-3xl font-display font-bold text-[var(--accent)]">
                  {step.num}
                </span>
                <h3 className="font-semibold text-[var(--text-main)]">
                  {step.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
