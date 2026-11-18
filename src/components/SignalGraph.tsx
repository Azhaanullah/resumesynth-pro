import React, { useMemo, useState } from 'react';
import { AnalysisResult } from '../types';
import {
  ShieldCheck,
  Zap,
  Hash,
  FileCode2,
  BookOpen,
  Award,
  Compass,
  BarChart3,
  ChevronRight
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SignalGraphProps {
  analysis: AnalysisResult;
}

type ViewMode = 'bars' | 'radar';

interface Vector {
  id: string;
  label: string;
  value: number | null;
  icon: LucideIcon;
  detail: string;
  diagnostic: string;
  action: string;
}

const BENCHMARK_SCORE = 85; // Our own target guideline, not an employer's threshold

// Radar geometry
const R_CENTER = { x: 190, y: 135 };
const R_RADIUS = 88;
const R_LEVELS = [25, 50, 75, 100];

const radarPoint = (index: number, total: number, value: number, radius = R_RADIUS) => {
  const angle = (index * (360 / total) - 90) * (Math.PI / 180);
  const r = (value / 100) * radius;
  return {
    x: R_CENTER.x + r * Math.cos(angle),
    y: R_CENTER.y + r * Math.sin(angle),
    cos: Math.cos(angle)
  };
};

const formatDelta = (delta: number) => (delta >= 0 ? `+${delta}` : `\u2212${Math.abs(delta)}`);

export const SignalGraph: React.FC<SignalGraphProps> = ({ analysis }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('bars');
  const [activeId, setActiveId] = useState<string | null>(null);

  const allVectors = useMemo<Vector[]>(() => [
    {
      id: 'skills',
      label: 'Core Skills',
      value: analysis.skills.score,
      icon: ShieldCheck,
      detail: `${analysis.skills.found}/${analysis.skills.total} matched`,
      diagnostic: analysis.skills.score >= BENCHMARK_SCORE
        ? 'Excellent technical coverage. Critical languages, frameworks, and tools are verified.'
        : `Deficit of ${analysis.skills.total - analysis.skills.found} technical requirements. Add verified bullets referencing missing stack tools.`,
      action: 'Check Vocabulary Gap Matrix below to add missing keywords directly.'
    },
    {
      id: 'verbs',
      label: 'Power Verbs',
      value: analysis.verbs.score,
      icon: Zap,
      detail: `${analysis.verbs.count} active verbs`,
      diagnostic: analysis.verbs.score >= BENCHMARK_SCORE
        ? 'Strong active leadership voice. High frequency of decisive verbs like Architected, Led, Optimized.'
        : 'Passive duty phrasing detected (e.g., "Responsible for"). Upgrade to high-impact STAR verbs.',
      action: 'Use the STAR Bullet Rewriter Studio to transform passive duties into achievements.'
    },
    {
      id: 'proof',
      label: 'Quantified Proof',
      value: analysis.proof.score,
      icon: Hash,
      detail: `${analysis.proof.count} metrics logged`,
      diagnostic: analysis.proof.score >= BENCHMARK_SCORE
        ? 'High evidential credibility. Bullets are backed by tangible %, $, latency, or scale figures.'
        : 'Resume lacks numerical evidence. Recruiters and ATS bots heavily favor quantified outcomes.',
      action: 'Inject percentages, team scale, or latency cuts into experience bullets.'
    },
    {
      id: 'format',
      label: 'ATS Structure',
      value: analysis.format.score,
      icon: FileCode2,
      detail: analysis.format.label,
      diagnostic: analysis.format.score >= 80
        ? 'Clean standard hierarchy. Standard headers (Experience, Education, Skills) are compliant.'
        : 'Complex table formatting or non-standard headers may cause ATS parsing truncation.',
      action: 'Keep headers simple: Experience, Skills, Education, Projects.'
    },
    {
      id: 'readability',
      label: 'Parsing Flow',
      value: analysis.readability?.score ?? null,
      icon: BookOpen,
      detail: analysis.readability?.label ?? 'Not measured',
      diagnostic: (analysis.readability?.score ?? 0) >= 80
        ? 'Optimal reading cadence. Bullet lengths fall within the recommended 15-25 word sweet spot.'
        : 'Dense or multi-paragraph blocks detected. Break into concise single-achievement bullets.',
      action: 'Aim for 1-2 lines per bullet with clear scannability.'
    },
    {
      id: 'seniority',
      label: 'Role Scope',
      value: analysis.seniority?.score ?? null,
      icon: Award,
      detail: analysis.seniority?.label ?? 'Not measured',
      diagnostic: (analysis.seniority?.score ?? 0) >= 80
        ? 'Scope alignment matches target job responsibility level and architectural autonomy.'
        : 'Evidence reads execution-focused. Demonstrate cross-functional leadership and decision-making.',
      action: 'Highlight system design, code reviews, and stakeholder collaboration.'
    }
  ], [analysis]);

  const vectors = useMemo(
    () => allVectors.filter((v): v is Vector & { value: number } => v.value !== null),
    [allVectors]
  );
  const unmeasured = allVectors.filter(v => v.value === null);

  // Weakest first, so the thing to fix is always at the top
  const ranked = useMemo(() => [...vectors].sort((a, b) => a.value - b.value), [vectors]);
  const activeVector = vectors.find(v => v.id === activeId) ?? ranked[0];
  const aboveCount = vectors.filter(v => v.value >= BENCHMARK_SCORE).length;

  if (!activeVector) {
    return (
      <div className="ap-card sg-card">
        <style>{CSS}</style>
        <h3 className="sg-title">Signal balance</h3>
        <p className="sg-sub">No signals could be measured for this resume yet.</p>
      </div>
    );
  }

  // Radar polygons
  const radarPolygon = vectors
    .map((v, i) => {
      const p = radarPoint(i, vectors.length, v.value);
      return `${p.x},${p.y}`;
    })
    .join(' ');
  const benchPolygon = vectors
    .map((_, i) => {
      const p = radarPoint(i, vectors.length, BENCHMARK_SCORE);
      return `${p.x},${p.y}`;
    })
    .join(' ');

  const activeDelta = Math.round(activeVector.value) - BENCHMARK_SCORE;
  const ActiveIcon = activeVector.icon;

  const renderRow = (v: (typeof vectors)[number]) => {
    const value = Math.round(v.value);
    const pass = value >= BENCHMARK_SCORE;
    const Icon = v.icon;
    const isActive = activeVector.id === v.id;
    return (
      <button
        key={v.id}
        type="button"
        onClick={() => setActiveId(v.id)}
        aria-pressed={isActive}
        className={`sg-row${isActive ? ' is-active' : ''}`}
      >
        <span className="sg-label">
          <span className="sg-icon" aria-hidden="true">
            <Icon size={16} />
          </span>
          <span className="sg-label-text">
            <span className="sg-name">{v.label}</span>
            <span className="sg-detail">{v.detail}</span>
          </span>
        </span>

        <span className="sg-track-wrap" aria-hidden="true">
          <span className="sg-track">
            <span
              className={`sg-fill ${pass ? 'is-pass' : 'is-low'}`}
              style={{ width: `${Math.min(100, value)}%` }}
            />
            <span className="sg-tick" />
          </span>
        </span>

        <span className="sg-value">{value}%</span>
        <span className={`sg-chip ${pass ? 'is-pass' : 'is-low'}`}>{formatDelta(value - BENCHMARK_SCORE)}</span>
      </button>
    );
  };

  return (
    <div className="ap-card sg-card">
      <style>{CSS}</style>

      {/* Header */}
      <div className="sg-head">
        <div>
          <h3 className="sg-title">Signal balance</h3>
          <p className="sg-sub">
            {aboveCount} of {vectors.length} measured signals at or above the {BENCHMARK_SCORE}% target
            {unmeasured.length > 0 && ` · ${unmeasured.length} not measured`}
          </p>
        </div>

        <div className="sg-seg" role="tablist" aria-label="Chart view">
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'bars'}
            onClick={() => setViewMode('bars')}
          >
            <BarChart3 size={14} aria-hidden="true" />
            <span>Bars</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'radar'}
            onClick={() => setViewMode('radar')}
          >
            <Compass size={14} aria-hidden="true" />
            <span>Radar</span>
          </button>
        </div>
      </div>

      {/* Views */}
      {viewMode === 'bars' ? (
        <div>
          <div className="sg-legend">
            <span><i className="sg-dot is-pass" />Above target</span>
            <span><i className="sg-dot is-low" />Below target</span>
            <span><i className="sg-key-tick" />Target {BENCHMARK_SCORE}%</span>
          </div>
          <div className="sg-rows">{ranked.map(renderRow)}</div>
        </div>
      ) : (
        <div className="sg-radar">
          <div>
            <svg
              viewBox="0 0 380 270"
              className="sg-radar-svg"
              role="img"
              aria-label="Radar chart of the measured signals compared with the target"
            >
              {R_LEVELS.map(level => (
                <polygon
                  key={level}
                  className="sg-r-ring"
                  points={vectors
                    .map((_, i) => {
                      const p = radarPoint(i, vectors.length, level);
                      return `${p.x},${p.y}`;
                    })
                    .join(' ')}
                />
              ))}

              {vectors.map((_, i) => {
                const p = radarPoint(i, vectors.length, 100);
                return (
                  <line key={i} className="sg-r-ring" x1={R_CENTER.x} y1={R_CENTER.y} x2={p.x} y2={p.y} />
                );
              })}

              <polygon className="sg-r-bench" points={benchPolygon} />
              <polygon className="sg-r-poly" points={radarPolygon} />

              {vectors.map((v, i) => {
                const p = radarPoint(i, vectors.length, v.value);
                const label = radarPoint(i, vectors.length, 100, R_RADIUS + 18);
                const anchor = label.cos > 0.3 ? 'start' : label.cos < -0.3 ? 'end' : 'middle';
                const isActive = activeVector.id === v.id;
                return (
                  <g key={v.id} onClick={() => setActiveId(v.id)} style={{ cursor: 'pointer' }}>
                    <circle className={`sg-r-dot${isActive ? ' is-active' : ''}`} cx={p.x} cy={p.y} r={isActive ? 6 : 4} />
                    <text
                      className={`sg-r-label${isActive ? ' is-active' : ''}`}
                      x={label.x}
                      y={label.y + 4}
                      textAnchor={anchor}
                    >
                      {v.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="sg-legend sg-legend-center">
              <span><i className="sg-key-you" />Your resume</span>
              <span><i className="sg-key-bench" />Target {BENCHMARK_SCORE}%</span>
            </div>
          </div>

          <div className="sg-rows is-compact">{ranked.map(renderRow)}</div>
        </div>
      )}

      {/* Inspector */}
      <div className="sg-inspect" aria-live="polite">
        <div className="sg-inspect-icon" aria-hidden="true">
          <ActiveIcon size={18} />
        </div>
        <div className="sg-inspect-body">
          <div className="sg-inspect-head">
            <span className="sg-inspect-title">{activeVector.label}</span>
            <span className={`sg-chip ${activeDelta >= 0 ? 'is-pass' : 'is-low'}`}>
              {activeDelta >= 0
                ? `${activeDelta} pts above target`
                : `${Math.abs(activeDelta)} pts below target`}
            </span>
          </div>
          <p className="sg-inspect-text">{activeVector.diagnostic}</p>
          <div className="sg-action">
            <ChevronRight size={14} aria-hidden="true" />
            <span>{activeVector.action}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- Styles (scoped with the sg- prefix; use the theme vars from apple.css) ----------
const CSS = `
.sg-card { padding: 1.5rem; container-type: inline-size; }

.sg-head { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: .75rem 1rem; margin-bottom: 1.25rem; }
.sg-title { margin: 0; font-size: 1.05rem; font-weight: 600; color: var(--ap-text, #f5f2ec); }
.sg-sub { margin: .25rem 0 0; font-size: .82rem; color: var(--ap-text-2, #9b9ba6); }

.sg-seg { display: inline-flex; padding: 3px; border-radius: 999px; background: rgba(255,255,255,.05); border: 1px solid var(--ap-hairline, rgba(255,255,255,.07)); }
html.light .sg-seg { background: rgba(23,21,26,.05); }
.sg-seg button { display: inline-flex; align-items: center; gap: .4rem; min-height: 32px; padding: 0 .95rem; border-radius: 999px; font-size: .8rem; font-weight: 500; color: var(--ap-text-2, #9b9ba6); cursor: pointer; transition: background-color .3s, color .3s; }
.sg-seg button:hover { color: var(--ap-text, #f5f2ec); }
.sg-seg button[aria-selected="true"] { background: var(--ap-on-bg, #d8b46a); color: var(--ap-on-text, #1a1405); font-weight: 600; }

.sg-legend { display: flex; flex-wrap: wrap; gap: .4rem 1.1rem; margin-bottom: .6rem; font-size: .75rem; color: var(--ap-text-2, #9b9ba6); }
.sg-legend span { display: inline-flex; align-items: center; gap: .45rem; }
.sg-legend-center { justify-content: center; margin: .5rem 0 0; }
.sg-dot { width: 8px; height: 8px; border-radius: 999px; display: inline-block; }
.sg-dot.is-pass, .sg-fill.is-pass { background: var(--score-strong, #34c98f); }
.sg-dot.is-low, .sg-fill.is-low { background: var(--score-med, #e8b75d); }
.sg-key-tick { width: 2px; height: 12px; border-radius: 2px; background: var(--ap-text-2, #9b9ba6); opacity: .7; display: inline-block; }
.sg-key-you { width: 14px; height: 3px; border-radius: 2px; background: var(--ap-accent, #d8b46a); display: inline-block; }
.sg-key-bench { width: 14px; height: 0; border-top: 2px dashed var(--ap-text-2, #9b9ba6); display: inline-block; }

/* rows */
.sg-rows { display: flex; flex-direction: column; gap: 2px; }
.sg-row {
  display: grid; align-items: center; column-gap: .9rem; row-gap: .6rem; width: 100%; text-align: left;
  grid-template-columns: minmax(0, 1fr) 44px 56px;
  grid-template-areas: "label val chip" "track track track";
  padding: .7rem .8rem; border-radius: 14px; border: 1px solid transparent; cursor: pointer;
  transition: background-color .25s, border-color .25s;
}
.sg-row:hover { background: rgba(255,255,255,.04); }
html.light .sg-row:hover { background: rgba(23,21,26,.04); }
.sg-row.is-active { background: rgba(255,255,255,.05); border-color: var(--ap-hairline, rgba(255,255,255,.07)); }
html.light .sg-row.is-active { background: rgba(23,21,26,.04); }
.sg-label { grid-area: label; display: flex; align-items: center; gap: .7rem; min-width: 0; }
.sg-icon { width: 32px; height: 32px; flex: none; display: flex; align-items: center; justify-content: center; border-radius: 10px; background: rgba(255,255,255,.05); color: var(--ap-text-2, #9b9ba6); }
html.light .sg-icon { background: rgba(23,21,26,.05); }
.sg-row.is-active .sg-icon { color: var(--ap-accent, #d8b46a); }
.sg-label-text { display: flex; flex-direction: column; min-width: 0; }
.sg-name { font-size: .9rem; font-weight: 500; color: var(--ap-text, #f5f2ec); }
.sg-detail { font-size: .75rem; color: var(--ap-text-2, #9b9ba6); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sg-track-wrap { grid-area: track; }
.sg-track { position: relative; display: block; height: 8px; border-radius: 999px; background: rgba(255,255,255,.07); }
html.light .sg-track { background: rgba(23,21,26,.07); }
.sg-fill { display: block; height: 100%; border-radius: 999px; animation: sg-grow .9s cubic-bezier(.16,1,.3,1) both; }
.sg-tick { position: absolute; left: ${BENCHMARK_SCORE}%; top: -4px; bottom: -4px; width: 2px; border-radius: 2px; background: var(--ap-text-2, #9b9ba6); opacity: .6; }
.sg-value { grid-area: val; text-align: right; font-size: .9rem; font-weight: 600; font-variant-numeric: tabular-nums; color: var(--ap-text, #f5f2ec); }

.sg-chip { grid-area: chip; justify-self: end; font-size: .75rem; font-weight: 600; padding: 2px 9px; border-radius: 999px; white-space: nowrap; }
.sg-chip.is-pass { color: var(--score-strong, #34c98f); background: color-mix(in srgb, var(--score-strong, #34c98f) 14%, transparent); }
.sg-chip.is-low { color: var(--score-med, #e8b75d); background: color-mix(in srgb, var(--score-med, #e8b75d) 14%, transparent); }

@container (min-width: 560px) {
  .sg-rows:not(.is-compact) .sg-row {
    grid-template-columns: minmax(0, 210px) minmax(0, 1fr) 44px 56px;
    grid-template-areas: "label track val chip";
    row-gap: 0;
  }
}

/* radar view */
.sg-radar { display: grid; gap: 1.25rem; grid-template-columns: minmax(0, 1fr); }
@container (min-width: 640px) { .sg-radar { grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); align-items: center; } }
.sg-radar-svg { display: block; width: 100%; max-height: 320px; }
.sg-rows.is-compact .sg-row { grid-template-columns: minmax(0, 1fr) 44px 56px; grid-template-areas: "label val chip"; row-gap: 0; }
.sg-rows.is-compact .sg-track-wrap { display: none; }
.sg-r-ring { fill: none; stroke: var(--ap-hairline, rgba(255,255,255,.07)); stroke-width: 1; }
html.light .sg-r-ring { stroke: rgba(23,21,26,.1); }
.sg-r-bench { fill: none; stroke: var(--ap-text-2, #9b9ba6); stroke-width: 1.5; stroke-dasharray: 4 4; opacity: .85; }
.sg-r-poly { fill: color-mix(in srgb, var(--ap-accent, #d8b46a) 20%, transparent); stroke: var(--ap-accent, #d8b46a); stroke-width: 2; stroke-linejoin: round; }
.sg-r-dot { fill: var(--ap-bg, #07080c); stroke: var(--ap-accent, #d8b46a); stroke-width: 2; transition: r .2s; }
.sg-r-dot.is-active { fill: var(--ap-accent, #d8b46a); }
.sg-r-label { font-size: 11px; fill: var(--ap-text-2, #9b9ba6); }
.sg-r-label.is-active { fill: var(--ap-text, #f5f2ec); font-weight: 600; }

/* inspector */
.sg-inspect { display: flex; gap: .9rem; margin-top: 1.1rem; padding: 1rem 1.1rem; border-radius: 18px; background: rgba(216,180,106,.07); border: 1px solid rgba(216,180,106,.2); }
html.light .sg-inspect { background: rgba(154,114,38,.06); border-color: rgba(154,114,38,.2); }
.sg-inspect-icon { width: 36px; height: 36px; flex: none; display: flex; align-items: center; justify-content: center; border-radius: 12px; color: var(--ap-accent, #d8b46a); background: rgba(216,180,106,.12); }
.sg-inspect-body { min-width: 0; }
.sg-inspect-head { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem .7rem; }
.sg-inspect-title { font-size: .95rem; font-weight: 600; color: var(--ap-text, #f5f2ec); }
.sg-inspect-head .sg-chip { justify-self: auto; }
.sg-inspect-text { margin: .4rem 0 0; font-size: .82rem; line-height: 1.55; color: var(--ap-text-2, #9b9ba6); }
.sg-action { display: flex; align-items: flex-start; gap: .3rem; margin-top: .6rem; font-size: .8rem; font-weight: 500; color: var(--ap-accent, #d8b46a); }
.sg-action svg { flex: none; margin-top: 2px; }

@keyframes sg-grow { from { width: 0; } }
`;