import React, { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  value: number;
  duration?: number;
}

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export const CountUp: React.FC<CountUpProps> = ({ value, duration = 1200 }) => {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      fromRef.current = value;
      setDisplay(value);
      return;
    }

    const from = fromRef.current;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const nextValue = from + (value - from) * eased;
      fromRef.current = nextValue;
      setDisplay(nextValue);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <>{Math.round(display)}</>;
};

export default CountUp;
