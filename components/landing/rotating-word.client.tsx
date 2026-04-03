'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { ROTATING_WORDS } from './landing-constants';

export function RotatingWord() {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  const cycle = useCallback(() => {
    setFading(true);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
      setFading(false);
    }, 250);
  }, []);

  // Set initial width after mount
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const measure = measureRef.current;
    if (wrapper && measure) {
      measure.textContent = ROTATING_WORDS[0];
      wrapper.style.width = `${measure.offsetWidth}px`;
    }
  }, []);

  // Animate width when index changes
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const measure = measureRef.current;
    if (wrapper && measure) {
      measure.textContent = ROTATING_WORDS[index];
      wrapper.style.width = `${measure.offsetWidth}px`;
    }
  }, [index]);

  useEffect(() => {
    const id = setInterval(cycle, 2800);
    return () => clearInterval(id);
  }, [cycle]);

  return (
    <>
      <span
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible absolute whitespace-nowrap"
        style={{ font: 'inherit' }}
      />
      <span ref={wrapperRef} className="inline-block transition-[width] duration-400 ease-in-out">
        <span
          className="inline-block whitespace-nowrap transition-all duration-250 ease-in-out"
          style={{
            backgroundImage:
              'linear-gradient(92.88deg, var(--landing-brand-1) 9.16%, var(--landing-brand-2) 43.89%, var(--landing-brand-3) 64.72%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            opacity: fading ? 0 : 1,
            transform: fading ? 'translateY(-0.15em)' : 'translateY(0)'
          }}
        >
          {ROTATING_WORDS[index]}
        </span>
      </span>
    </>
  );
}
