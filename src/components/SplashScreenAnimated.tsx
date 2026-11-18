import React, { useCallback, useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

const WORD = 'ResumeSynth';
const TAGLINES = [
  'Evidence over buzzwords.',
  'Honest match scoring.',
  'Tailored with proof.',
];
const SEEN_KEY = 'resumesynth_splash_seen';
const TOTAL_MS = 3600;
const EXIT_MS = 950;

const shouldShow = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (window.location.search.includes('splash')) return true;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    return sessionStorage.getItem(SEEN_KEY) !== '1';
  } catch {
    return true;
  }
};

const markSeen = () => {
  try { sessionStorage.setItem(SEEN_KEY, '1'); } catch {}
};

interface SplashScreenAnimatedProps {
  onFinish?: () => void;
}

export const SplashScreenAnimated: React.FC<SplashScreenAnimatedProps> = ({ onFinish }) => {
  const [visible, setVisible] = useState(shouldShow);
  const [exiting, setExiting] = useState(false);
  const [tagIdx, setTagIdx] = useState(-1);

  const startExit = useCallback(() => setExiting(true), []);

  useEffect(() => {
    if (!visible) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.classList.add('rs2-active');

    const tagStart = setTimeout(() => {
      setTagIdx(0);
      const interval = setInterval(
        () => setTagIdx(i => Math.min(i + 1, TAGLINES.length - 1)),
        900,
      );
      return interval;
    }, 1100);

    const exitTimer = setTimeout(startExit, TOTAL_MS);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.documentElement.classList.remove('rs2-active');
      clearTimeout(tagStart as unknown as number);
      clearTimeout(exitTimer);
    };
  }, [visible, startExit]);

  useEffect(() => {
    if (!exiting) return;
    document.documentElement.classList.remove('rs2-active');
    const timer = setTimeout(() => {
      markSeen();
      setVisible(false);
      onFinish?.();
    }, EXIT_MS);
    return () => clearTimeout(timer);
  }, [exiting, onFinish]);

  useEffect(() => {
    if (!visible || exiting) return;
    const onKey = (e: KeyboardEvent) => {
      if (['Escape', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        startExit();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, exiting, startExit]);

  if (!visible) return null;

  return (
    <div className={`rs2-splash${exiting ? ' rs2-exit' : ''}`} onClick={startExit} role="status" aria-label="Loading ResumeSynth">
      <style>{CSS}</style>

      {/* Ambient orbs */}
      <div className="rs2-orb rs2-orb-terracotta" aria-hidden="true" />
      <div className="rs2-orb rs2-orb-indigo" aria-hidden="true" />
      <div className="rs2-orb rs2-orb-lime" aria-hidden="true" />
      <div className="rs2-vignette" aria-hidden="true" />

      <div className="rs2-center">
        {/* Brand mark */}
        <div className="rs2-mark" aria-hidden="true">
          <Sparkles size={24} />
        </div>

        {/* Wordmark */}
        <h1 className="rs2-track" aria-label={WORD}>
          {WORD.split('').map((ch, i) => (
            <span
              key={i}
              className="rs2-letter"
              style={{ animationDelay: `${180 + i * 75}ms, ${1400 + i * 85}ms` }}
              aria-hidden="true"
            >
              {ch}
            </span>
          ))}
        </h1>

        {/* Tagline carousel */}
        <div className="rs2-tagline-row" aria-live="polite">
          {tagIdx >= 0 && (
            <span key={tagIdx} className="rs2-tagline">{TAGLINES[tagIdx]}</span>
          )}
        </div>
      </div>

      <div className="rs2-hint" aria-hidden="true">Press any key or click to skip</div>

      {/* Progress bar */}
      <div className="rs2-progress-wrap" aria-hidden="true">
        <div className="rs2-progress-track">
          <div className="rs2-progress-fill" />
        </div>
      </div>
    </div>
  );
};

export default SplashScreenAnimated;

const CSS = `
/* ── Splash container ─────────────────────────────────────────── */
.rs2-splash {
  position: fixed; inset: 0; z-index: 9999;
  background: #07080c;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; cursor: pointer;
  clip-path: inset(0 0 0 0);
  font-family: inherit;
}
.rs2-exit { animation: rs2-curtain-down ${EXIT_MS}ms cubic-bezier(.76,0,.24,1) forwards; }

/* ── Floating orbs ───────────────────────────────────────────── */
.rs2-orb {
  position: absolute; border-radius: 50%; filter: blur(130px);
  opacity: .28; pointer-events: none; will-change: transform;
}
.rs2-orb-terracotta {
  width: 55vmax; height: 55vmax; background: #d9604a;
  top: -28vmax; right: -14vmax;
  animation: rs2-drift-a 10s ease-in-out infinite alternate;
}
.rs2-orb-indigo {
  width: 50vmax; height: 50vmax; background: #6366f1;
  bottom: -30vmax; left: -12vmax;
  animation: rs2-drift-b 12s ease-in-out infinite alternate-reverse;
}
.rs2-orb-lime {
  width: 30vmax; height: 30vmax; background: #a3e635; opacity: .14;
  top: 30%; left: 45%;
  animation: rs2-drift-c 8s ease-in-out infinite alternate;
}
@keyframes rs2-drift-a { from { transform: translate(0,0) scale(1); } to { transform: translate(-8vmax,6vmax) scale(1.18); } }
@keyframes rs2-drift-b { from { transform: translate(0,0) scale(1); } to { transform: translate(10vmax,-5vmax) scale(1.12); } }
@keyframes rs2-drift-c { from { transform: translate(0,0) scale(1); } to { transform: translate(-5vmax,8vmax) scale(1.22); } }

/* ── Vignette overlay ───────────────────────────────────────── */
.rs2-vignette {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(0,0,0,.65) 100%);
  pointer-events: none;
}

/* ── Center content ─────────────────────────────────────────── */
.rs2-center {
  position: relative; z-index: 2; text-align: center; padding: 0 1rem;
  display: flex; flex-direction: column; align-items: center; gap: 1.5rem;
}
.rs2-exit .rs2-center { animation: rs2-wordOut 700ms cubic-bezier(.5,0,.75,0) forwards; }

/* ── Sparkle brand mark ─────────────────────────────────────── */
.rs2-mark {
  width: 56px; height: 56px; border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  color: #f2dea8;
  background: rgba(212,180,106,.1);
  border: 1px solid rgba(212,180,106,.4);
  box-shadow: 0 0 50px rgba(212,180,106,.25), 0 0 100px rgba(217,96,74,.12);
  animation: rs2-markIn 900ms cubic-bezier(.2,.8,.2,1) both;
}

/* ── Wordmark track ─────────────────────────────────────────── */
.rs2-track {
  margin: 0;
  font-size: clamp(3rem, 13vw, 10rem);
  font-weight: 800; line-height: 1; letter-spacing: .07em;
  white-space: nowrap;
  animation: rs2-trackIn 2000ms cubic-bezier(.2,.8,.2,1) forwards;
}
.rs2-letter {
  display: inline-block;
  color: transparent;
  background-image: linear-gradient(
    110deg,
    #f5f2ec 30%,
    #f2dea8 40%,
    #d6ab57 48%,
    #d9604a 54%,
    #6366f1 62%,
    #f5f2ec 72%
  );
  background-size: 350% 100%;
  background-position: 100% 0;
  -webkit-background-clip: text; background-clip: text;
  opacity: 0;
  animation-name: rs2-letterIn, rs2-shimmerLoop;
  animation-duration: 1050ms, 3200ms;
  animation-timing-function: cubic-bezier(.2,.8,.2,1), ease-in-out;
  animation-fill-mode: both, none;
  animation-iteration-count: 1, infinite;
}

/* ── Tagline ─────────────────────────────────────────────────── */
.rs2-tagline-row { height: 1.6rem; display: flex; align-items: center; justify-content: center; }
.rs2-tagline {
  font-size: .82rem; letter-spacing: .3em; text-transform: uppercase;
  font-weight: 600; color: #a1a1a6;
  animation: rs2-tagPop 700ms cubic-bezier(.2,.8,.2,1) both;
}

/* ── Skip hint ───────────────────────────────────────────────── */
.rs2-hint {
  position: absolute; bottom: 3rem; left: 0; right: 0; text-align: center; z-index: 2;
  font-size: .7rem; letter-spacing: .22em; text-transform: uppercase;
  color: rgba(148,163,184,.65);
  opacity: 0; animation: rs2-fadeUp 600ms cubic-bezier(.2,.8,.2,1) 1600ms both;
}

/* ── Progress bar ────────────────────────────────────────────── */
.rs2-progress-wrap {
  position: absolute; bottom: 1.8rem; left: 50%; transform: translateX(-50%);
  z-index: 2; width: min(300px, 62vw);
}
.rs2-progress-track {
  width: 100%; height: 2px; background: rgba(255,255,255,.1);
  border-radius: 999px; overflow: hidden;
  animation: rs2-fadeUp 650ms cubic-bezier(.2,.8,.2,1) 600ms both;
}
.rs2-progress-fill {
  height: 100%; width: 100%;
  background: linear-gradient(90deg, #d9604a, #d8b46a, #6366f1);
  transform-origin: left; transform: scaleX(0);
  animation: rs2-progressFill ${TOTAL_MS}ms linear forwards;
}

/* ── Keyframes ───────────────────────────────────────────────── */
@keyframes rs2-letterIn {
  from { opacity: 0; transform: translateY(.7em) scale(.93); filter: blur(16px); }
  to   { opacity: 1; transform: translateY(0) scale(1);     filter: blur(0); }
}
@keyframes rs2-shimmerLoop {
  0%   { background-position: 100% 0; }
  60%,100% { background-position: 0% 0; }
}
@keyframes rs2-trackIn { from { letter-spacing: .12em; opacity: 0; } to { letter-spacing: .07em; opacity: 1; } }
@keyframes rs2-markIn {
  0%   { opacity: 0; transform: scale(.4) rotate(-20deg); filter: blur(10px); }
  60%  { opacity: 1; transform: scale(1.14) rotate(6deg);  filter: blur(0); }
  80%  { transform: scale(.93) rotate(-3deg); }
  100% { transform: scale(1) rotate(0); }
}
@keyframes rs2-tagPop {
  0%   { opacity: 0; transform: translateY(10px) scale(.86); }
  70%  { opacity: 1; transform: translateY(-2px) scale(1.06); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes rs2-fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes rs2-progressFill { to { transform: scaleX(1); } }
@keyframes rs2-wordOut { to { opacity: 0; transform: scale(1.12); filter: blur(12px); } }
@keyframes rs2-curtain-down { from { clip-path: inset(0 0 0 0); } to { clip-path: inset(100% 0 0 0); } }

@media (prefers-reduced-motion: reduce) {
  .rs2-splash *, .rs2-splash { animation-duration: 1ms !important; animation-delay: 0ms !important; }
}
`;
