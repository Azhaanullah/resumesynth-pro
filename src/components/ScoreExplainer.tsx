import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnalysisResult } from '../types';

interface ScoreExplainerProps {
  analysis: AnalysisResult;
}

export const ScoreExplainer: React.FC<ScoreExplainerProps> = ({ analysis }) => {
  const [open, setOpen] = useState(false);

  const checks = [
    {
      name: 'Technical requirements',
      value: analysis.skills.score,
      note: `${analysis.skills.found} of ${analysis.skills.total} found in your resume`
    },
    {
      name: 'Action verbs',
      value: analysis.verbs.score,
      note: `${analysis.verbs.count} strong verbs detected`
    },
    {
      name: 'Quantified proof',
      value: analysis.proof.score,
      note: `${analysis.proof.count} metrics found`
    },
    {
      name: 'Format and headings',
      value: analysis.format.score,
      note: analysis.format.label
    }
  ];

  return (
    <section className="ap-card se-card" aria-label="About this score">
      <style>{CSS}</style>

      <div className="se-top">
        <span className="se-pill">Estimate</span>
        <p className="se-lead">
          How well your resume covers <strong>this job posting</strong>. It is not a score from any
          employer's hiring system.
        </p>
        <button
          type="button"
          className="se-toggle"
          aria-expanded={open}
          aria-controls="score-explainer-panel"
          onClick={() => setOpen(v => !v)}
        >
          <span>How is this calculated?</span>
          <ChevronDown size={16} aria-hidden="true" className={open ? 'se-chev is-open' : 'se-chev'} />
        </button>
      </div>

      {open && (
        <div id="score-explainer-panel" className="se-panel">
          <p className="se-intro">
            The overall score combines four checks of your resume text against the posting you
            pasted. Here is each one, live:
          </p>

          <ul className="se-checks">
            {checks.map(c => (
              <li key={c.name} className="se-check">
                <div className="se-check-head">
                  <span className="se-check-name">{c.name}</span>
                  <span className="se-check-value">{Math.round(c.value)}%</span>
                </div>
                <div className="se-bar" aria-hidden="true">
                  <span style={{ width: `${Math.max(0, Math.min(100, c.value))}%` }} />
                </div>
                <span className="se-check-note">{c.note}</span>
              </li>
            ))}
          </ul>

          <div className="se-cols">
            <div>
              <h4>What it tells you</h4>
              <ul>
                <li>Which requirements in the posting your resume doesn't evidence yet</li>
                <li>Whether your bullets show impact through strong verbs and numbers</li>
                <li>Whether your structure is simple enough to be read cleanly</li>
              </ul>
            </div>
            <div>
              <h4>What it can't tell you</h4>
              <ul>
                <li>Whether a particular employer's system will rank you highly</li>
                <li>How a recruiter will judge your overall fit</li>
                <li>Anything about jobs other than the one you pasted</li>
              </ul>
            </div>
          </div>

          <p className="se-foot">
            Only add skills you can defend in an interview. Stuffing in keywords can raise this
            number without improving your chances.
          </p>
        </div>
      )}
    </section>
  );
};

const CSS = `
.se-card { padding: 1rem 1.25rem; }
.se-top { display: flex; flex-wrap: wrap; align-items: center; gap: .6rem 1rem; }
.se-pill {
  padding: .2rem .7rem; border-radius: 999px; font-size: .72rem; font-weight: 600; letter-spacing: .06em; text-transform: uppercase;
  color: var(--ap-accent, #d8b46a);
  background: color-mix(in srgb, var(--ap-accent, #d8b46a) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--ap-accent, #d8b46a) 30%, transparent);
}
.se-lead { flex: 1 1 18rem; margin: 0; font-size: .86rem; line-height: 1.5; color: var(--ap-text-2, #9b9ba6); }
.se-lead strong { color: var(--ap-text, #f5f2ec); font-weight: 600; }
.se-toggle {
  display: inline-flex; align-items: center; gap: .35rem; min-height: 44px; padding: 0 .9rem; border-radius: 999px;
  font-size: .82rem; font-weight: 500; cursor: pointer; color: var(--ap-accent, #d8b46a); background: transparent;
  transition: background-color .25s;
}
.se-toggle:hover { background: color-mix(in srgb, var(--ap-accent, #d8b46a) 12%, transparent); }
.se-chev { transition: transform .3s cubic-bezier(.16,1,.3,1); }
.se-chev.is-open { transform: rotate(180deg); }

.se-panel { margin-top: .9rem; padding-top: 1rem; border-top: 1px solid var(--ap-hairline, rgba(255,255,255,.07)); animation: se-in .5s cubic-bezier(.16,1,.3,1) both; }
.se-intro { margin: 0 0 .9rem; font-size: .84rem; color: var(--ap-text-2, #9b9ba6); }
.se-checks { display: grid; grid-template-columns: 1fr; gap: .8rem; margin: 0 0 1.1rem; padding: 0; list-style: none; }
@media (min-width: 720px) { .se-checks { grid-template-columns: repeat(4, 1fr); } }
.se-check { display: flex; flex-direction: column; gap: .4rem; padding: .85rem 1rem; border-radius: 16px; background: rgba(255,255,255,.035); border: 1px solid var(--ap-hairline, rgba(255,255,255,.07)); }
html.light .se-check { background: #f6f3ee; border-color: transparent; }
.se-check-head { display: flex; align-items: baseline; justify-content: space-between; gap: .5rem; }
.se-check-name { font-size: .8rem; font-weight: 500; color: var(--ap-text, #f5f2ec); }
.se-check-value { font-size: .95rem; font-weight: 600; font-variant-numeric: tabular-nums; color: var(--ap-text, #f5f2ec); }
.se-bar { height: 6px; border-radius: 999px; background: rgba(255,255,255,.08); overflow: hidden; }
html.light .se-bar { background: rgba(23,21,26,.08); }
.se-bar span { display: block; height: 100%; border-radius: 999px; background: var(--ap-accent, #d8b46a); animation: se-grow .8s cubic-bezier(.16,1,.3,1) both; }
.se-check-note { font-size: .74rem; color: var(--ap-text-2, #9b9ba6); }

.se-cols { display: grid; grid-template-columns: 1fr; gap: 1rem; }
@media (min-width: 720px) { .se-cols { grid-template-columns: 1fr 1fr; gap: 1.5rem; } }
.se-cols h4 { margin: 0 0 .4rem; font-size: .82rem; font-weight: 600; color: var(--ap-text, #f5f2ec); }
.se-cols ul { margin: 0; padding-left: 1.1rem; font-size: .82rem; line-height: 1.55; color: var(--ap-text-2, #9b9ba6); list-style: disc; }
.se-foot { margin: 1rem 0 0; font-size: .8rem; line-height: 1.5; color: var(--ap-text-2, #9b9ba6); }

@keyframes se-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
@keyframes se-grow { from { width: 0; } }
`;
