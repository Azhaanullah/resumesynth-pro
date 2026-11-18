import React, { useEffect, useId, useState } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { CountUp } from './CountUp';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showStatus?: boolean;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 180,
  strokeWidth = 12,
  label = 'out of 100',
  showStatus = true
}) => {
  const safeScore = Math.max(0, Math.min(100, score));
  const gradientId = `ring-${useId().replace(/:/g, '')}`;
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(safeScore));
    return () => cancelAnimationFrame(id);
  }, [safeScore]);

  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (shown / 100) * circumference;

  let strokeColor = 'var(--score-strong, #30d158)';
  let statusText = 'Strong evidence';
  let statusBadgeClass = 'bg-lime-400/15 text-lime-300 border-lime-400/30 score-badge-strong';
  let StatusIcon = CheckCircle2;

  if (safeScore < 60) {
    strokeColor = 'var(--score-low, #ff453a)';
    statusText = 'Significant gaps';
    statusBadgeClass = 'bg-rose-400/15 text-rose-200 border-rose-400/30 score-badge-low';
    StatusIcon = AlertCircle;
  } else if (safeScore < 75) {
    strokeColor = 'var(--score-med, #ff9f0a)';
    statusText = 'Needs more evidence';
    statusBadgeClass = 'bg-amber-400/15 text-amber-200 border-amber-400/30 score-badge-med';
    StatusIcon = AlertTriangle;
  } else if (safeScore < 88) {
    strokeColor = 'var(--score-good, #0a84ff)';
    statusText = 'Good evidence';
    statusBadgeClass = 'bg-sky-400/15 text-sky-200 border-sky-400/30 score-badge-good';
    StatusIcon = CheckCircle2;
  }

  return (
    <div
      className="relative flex flex-col items-center justify-center"
      style={{ width: size, height: size }}
      role="region"
      aria-label={`Overall job match score (estimate): ${safeScore} out of 100, ${statusText}`}
    >
      <svg
        className="absolute inset-0 -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: strokeColor, stopOpacity: 0.55 }} />
            <stop offset="100%" style={{ stopColor: strokeColor, stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
          className="score-track"
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="ap-ring-progress"
          style={{
            color: strokeColor,
            transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
      </svg>

      <div className="relative z-10 flex flex-col items-center text-center">
        <span
          className="font-semibold leading-none tabular-nums"
          style={{
            color: strokeColor,
            fontSize: Math.round(size * 0.31),
            letterSpacing: '-0.05em'
          }}
        >
          <CountUp value={safeScore} />
        </span>
        <span className="mt-2 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-slate-400">
          {label}
        </span>
        {showStatus && (
          <span
            className={`mt-3 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusBadgeClass}`}
          >
            <StatusIcon className="h-3 w-3" aria-hidden="true" />
            <span>{statusText}</span>
          </span>
        )}
      </div>
    </div>
  );
};
