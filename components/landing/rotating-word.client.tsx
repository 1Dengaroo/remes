'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ROTATING_WORDS } from './landing-constants';

export function RotatingWord() {
  const [index, setIndex] = useState(0);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  const cycle = useCallback(() => {
    const word = wordRef.current;
    const wrapper = wrapperRef.current;
    const measure = measureRef.current;
    if (!word || !wrapper || !measure) return;

    const nextIndex = (index + 1) % ROTATING_WORDS.length;

    // Measure the next word's width
    measure.textContent = ROTATING_WORDS[nextIndex];
    const nextWidth = measure.offsetWidth;

    // Fade out current word
    gsap.to(word, {
      opacity: 0,
      y: '-0.15em',
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        setIndex(nextIndex);
        gsap.set(word, { y: '0.15em' });
        gsap.to(word, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
      }
    });

    // Smoothly animate container width
    gsap.to(wrapper, {
      width: nextWidth,
      duration: 0.4,
      ease: 'power2.inOut'
    });
  }, [index]);

  // Set initial width after mount
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const word = wordRef.current;
    if (wrapper && word) {
      wrapper.style.width = `${word.offsetWidth}px`;
    }
  }, []);

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
      <span ref={wrapperRef} className="inline-block">
        <span
          ref={wordRef}
          className="inline-block bg-linear-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text whitespace-nowrap text-transparent"
        >
          {ROTATING_WORDS[index]}
        </span>
      </span>
    </>
  );
}
