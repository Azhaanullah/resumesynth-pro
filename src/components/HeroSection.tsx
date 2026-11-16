import React from 'react';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { PRESETS } from '../data/presets';

interface HeroSectionProps {
  selectedPreset: string;
  onSelectPreset: (presetId: string) => void;
  showHowItWorks: boolean;
  onToggleHowItWorks: () => void;
}

const STEPS = [
  {
    num: '01 · Parse & extract',
    color: 'var(--ap-c1)',
    text: 'Extracts technical requirements, cloud tools, frameworks, and power verbs from the job description.'
  },
  {
    num: '02 · Compare evidence',
    color: 'var(--ap-c2)',
    text: 'Evaluates keyword coverage, action verb strength, and quantified metrics to produce transparent scores.'
  },
  {
    num: '03 · Strengthen & export',
    color: 'var(--ap-c3)',
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
    <section aria-labelledby="hero-title" className="ap-hero">
      <div className="ap-kicker ap-intro">
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        <span>Evidence over buzzwords · Honest match scoring</span>
      </div>

      <h1 id="hero-title" className="ap-hero-title">
        <span className="ap-line ap-intro" style={{ animationDelay: '80ms' }}>
          Tailor your resume
        </span>
        <span className="ap-line ap-gradient-text ap-intro" style={{ animationDelay: '200ms' }}>
          to any job with proof.
        </span>
      </h1>

      <p className="ap-hero-sub ap-intro">
        Paste a job description and your resume to see which requirements your resume already
        proves and which it doesn't. Fix gaps with verifiable evidence and prepare for
        high-stakes technical interviews.
      </p>

      <ul className="ap-legend ap-intro" aria-label="ATS signal legend">
        <li>
          <ShieldCheck className="h-4 w-4" style={{ color: 'var(--score-strong)' }} aria-hidden="true" />
          <span>
            <strong>Verified match</strong> grounded in resume text
          </span>
        </li>
        <li>
          <span className="ap-dot" style={{ background: 'var(--score-low)' }} aria-hidden="true" />
          <span>
            <strong>Missing signal</strong> job term not evidenced yet
          </span>
        </li>
        <li>
          <span className="ap-dot" style={{ background: 'var(--score-good)' }} aria-hidden="true" />
          <span>
            <strong>STAR proof</strong> measurable metric verification
          </span>
        </li>
      </ul>

      <div className="ap-presets ap-intro">
        <p id="preset-label" className="ap-presets-label">
          Start from a role
        </p>
        <div className="ap-chip-row" role="group" aria-labelledby="preset-label">
          {Object.values(PRESETS).map(preset => {
            const isSelected = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset.id)}
                className="ap-chip"
                aria-pressed={isSelected}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {showHowItWorks && (
        <div role="region" aria-label="How ResumeSynth Works Explainer" className="ap-card ap-how">
          <div className="ap-how-head">
            <h2 className="ap-how-title">
              <Zap className="h-4 w-4" style={{ color: 'var(--ap-accent)' }} aria-hidden="true" />
              How ResumeSynth works
            </h2>
            <button
              type="button"
              onClick={onToggleHowItWorks}
              className="ap-how-close"
              aria-label="Close how it works panel"
            >
              Close
            </button>
          </div>

          <div className="ap-how-grid">
            {STEPS.map(step => (
              <div key={step.num} className="ap-step">
                <span className="ap-step-num" style={{ color: step.color }}>
                  {step.num}
                </span>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
