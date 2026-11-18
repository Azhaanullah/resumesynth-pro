import React, { useCallback, useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

/**
 * ResumeSynth splash screen — kinetic type intro.
 *
 * - Letters rise in one by one (blur -> sharp) while tracking tightens
 * - A champagne→indigo light sweep travels across the wordmark in a loop
 * - Taglines swap under the word, a thin progress line fills at the bottom
 * - Exits with a curtain wipe + the word scaling up and fading
 * - Plays once per browser session; click / Esc / Enter / Space skips it
 * - Skipped entirely for users with "reduce motion" turned on
 * - Add ?splash to the URL to force it to play again while testing
 *
 * Self-contained: only React + lucide-react (already in your project).
 */

const WORD = 'ResumeSynth';
const TAGLINES = ['Evidence over buzzwords.', 'Honest match scoring.', 'Tailored with proof.'];
const SEEN_KEY = 'resumesynth_splash_seen';
const TOTAL_MS = 3800;
const EXIT_MS = 900;

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
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Continue if session storage is unavailable.
  }
};

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [visible, setVisible] = useState<boolean>(shouldShow);
  const [exiting, setExiting] = useState(false);
  const [tagIdx, setTagIdx] = useState(-1);

  const startExit = useCallback(() => setExiting(true), []);

  useEffect(() => {
    if (!visible) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.classList.add('rs-splash-active');

    let interval: ReturnType<typeof setInterval> | undefined;
    const tagStart = setTimeout(() => {
      setTagIdx(0);
      interval = setInterval(() => setTagIdx(i => Math.min(i + 1, TAGLINES.length - 1)), 800);
    }, 1200);
    const exitTimer = setTimeout(startExit, TOTAL_MS);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.documentElement.classList.remove('rs-splash-active');
      clearTimeout(tagStart);
      clearTimeout(exitTimer);
      if (interval) clearInterval(interval);
    };
  }, [visible, startExit]);

  useEffect(() => {
    if (!exiting) return;
    document.documentElement.classList.remove('rs-splash-active');
    const timer = setTimeout(() => {
      markSeen();
      setVisible(false);
      onFinish?.();
    }, EXIT_MS);
    return () => clearTimeout(timer);
  }, [exiting, onFinish]);

  useEffect(() => {
    if (!visible || exiting) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        startExit();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, exiting, startExit]);

  if (!visible) return null;

  return (
    <div
      className={`rs-splash${exiting ? ' rs-exit' : ''}`}
      role="status"
      aria-label="Loading ResumeSynth"
      onClick={startExit}
    >
      <style>{CSS}</style>

      <div className="rs-orb rs-orb-lime" aria-hidden="true" />
      <div className="rs-orb rs-orb-cyan" aria-hidden="true" />
      <div className="rs-vignette" aria-hidden="true" />

      <div className="rs-center">
        <div className="rs-word">
          <div className="rs-mark" aria-hidden="true">
            <Sparkles size={22} />
          </div>

          <h1 className="rs-track" aria-label={WORD}>
            {WORD.split('').map((character, index) => (
              <span
                key={index}
                aria-hidden="true"
                className="rs-letter"
                style={{
                  animationDelay: `${150 + index * 70}ms, ${1500 + index * 90}ms`,
                }}
              >
                {character}
              </span>
            ))}
          </h1>

          <div className="rs-tagline-row" aria-live="polite">
            {tagIdx >= 0 && (
              <span key={tagIdx} className="rs-tagline">
                {TAGLINES[tagIdx]}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="rs-hint" aria-hidden="true">
        Press any key or click to skip
      </div>

      <div className="rs-progress" aria-hidden="true">
        <div className="rs-progress-fill" />
      </div>
    </div>
  );
};

export default SplashScreen;

const CSS = `
.rs-splash {
  position: fixed; inset: 0; z-index: 9999;
  background: #07080c;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; cursor: pointer;
  clip-path: inset(0 0 0 0);
  font-family: inherit;
}
.rs-splash.rs-exit { animation: rs-curtain ${EXIT_MS}ms cubic-bezier(.76,0,.24,1) forwards; }

.rs-center { position: relative; z-index: 2; text-align: center; padding: 0 1rem; }

.rs-word { display: flex; flex-direction: column; align-items: center; gap: 1.25rem; }
.rs-exit .rs-word { animation: rs-wordOut 700ms cubic-bezier(.5,0,.75,0) forwards; }

.rs-mark {
  width: 48px; height: 48px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  color: #e8c982;
  background: rgba(216,180,106,.12);
  border: 1px solid rgba(216,180,106,.38);
  box-shadow: 0 0 40px rgba(216,180,106,.28);
  animation: rs-markIn 800ms cubic-bezier(.2,.8,.2,1) both;
}

.rs-track {
  margin: 0;
  font-size: clamp(2.75rem, 11vw, 9rem);
  font-weight: 800; line-height: 1;
  letter-spacing: .08em;
  white-space: nowrap;
  animation: rs-track 1800ms cubic-bezier(.2,.8,.2,1) forwards;
}
.rs-letter {
  display: inline-block;
  color: transparent;
  background-image: linear-gradient(110deg, #f5f2ec 32%, #f2dea8 43%, #d6ab57 50%, #8b9cff 58%, #f5f2ec 68%);
  background-size: 300% 100%;
  background-position: 100% 0;
  -webkit-background-clip: text; background-clip: text;
  opacity: 0;
  animation-name: rs-letterIn, rs-shimmer;
  animation-duration: 950ms, 2600ms;
  animation-timing-function: cubic-bezier(.2,.8,.2,1), ease-in-out;
  animation-fill-mode: both, none;
  animation-iteration-count: 1, infinite;
}

.rs-tagline-row { height: 1.5rem; display: flex; align-items: center; justify-content: center; }
.rs-tagline {
  font-size: .8rem; letter-spacing: .28em; text-transform: uppercase; font-weight: 600;
  color: #a1a1a6;
  animation: rs-taglinePop 600ms cubic-bezier(.2,.8,.2,1) both;
}

.rs-orb {
  position: absolute; width: 60vmax; height: 60vmax; border-radius: 50%;
  filter: blur(120px); opacity: .22; pointer-events: none;
}
.rs-orb-lime { background: #6366f1; top: -25vmax; left: -15vmax; animation: rs-drift 9s ease-in-out infinite alternate; }
.rs-orb-cyan { background: #d8b46a; bottom: -28vmax; right: -18vmax; animation: rs-drift 11s ease-in-out infinite alternate-reverse; }
.rs-vignette { position: absolute; inset: 0; background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,.55) 100%); pointer-events: none; }

.rs-hint {
  position: absolute; bottom: 3.2rem; left: 0; right: 0; text-align: center; z-index: 2;
  font-size: .7rem; letter-spacing: .2em; text-transform: uppercase; color: rgba(148,163,184,.7);
  opacity: 0; animation: rs-hintPop 600ms cubic-bezier(.2,.8,.2,1) 1400ms both;
}
.rs-progress {
  position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); z-index: 2;
  width: min(280px, 60vw); height: 2px; background: rgba(255,255,255,.12); border-radius: 2px; overflow: hidden;
  animation: rs-progressPop 650ms cubic-bezier(.2,.8,.2,1) 700ms both;
}
.rs-progress-fill {
  height: 100%; background: linear-gradient(90deg, #d8b46a, #8b9cff);
  transform-origin: left; transform: scaleX(0);
  animation: rs-progress ${TOTAL_MS}ms linear forwards;
}

@keyframes rs-letterIn {
  from { opacity: 0; transform: translateY(0.6em) scale(.94); filter: blur(14px); }
  to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
@keyframes rs-shimmer {
  0%   { background-position: 100% 0; }
  55%, 100% { background-position: 0% 0; }
}
@keyframes rs-track { from { letter-spacing: .08em; } to { letter-spacing: -.045em; } }
@keyframes rs-markIn {
  0% { opacity: 0; transform: scale(.45) rotate(-18deg); filter: blur(8px); }
  65% { opacity: 1; transform: scale(1.16) rotate(5deg); filter: blur(0); }
  82% { transform: scale(.94) rotate(-2deg); }
  100% { transform: scale(1) rotate(0); }
}
@keyframes rs-taglinePop {
  0% { opacity: 0; transform: translateY(10px) scale(.86); }
  70% { opacity: 1; transform: translateY(-2px) scale(1.06); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes rs-hintPop {
  0% { opacity: 0; transform: translateY(10px) scale(.9); }
  70% { opacity: 1; transform: translateY(-2px) scale(1.04); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes rs-progressPop {
  0% { opacity: 0; transform: translate(-50%, 6px) scaleX(.7); }
  70% { opacity: 1; transform: translate(-50%, -1px) scaleX(1.04); }
  100% { opacity: 1; transform: translate(-50%, 0) scaleX(1); }
}
@keyframes rs-progress { to { transform: scaleX(1); } }
@keyframes rs-drift { from { transform: translate(0,0) scale(1); } to { transform: translate(6vmax, 4vmax) scale(1.15); } }
@keyframes rs-wordOut { to { opacity: 0; transform: scale(1.14); filter: blur(10px); } }
@keyframes rs-curtain { from { clip-path: inset(0 0 0 0); } to { clip-path: inset(0 0 100% 0); } }

@media (prefers-reduced-motion: reduce) {
  .rs-splash *, .rs-splash { animation-duration: 1ms !important; animation-delay: 0ms !important; }
}
`;
