'use client';

import { useRef, useEffect } from 'react';

interface AnimatedArrowProps {
  direction?: 'right' | 'down';
  animated?: boolean;
  delay?: number;
  duration?: number;
  className?: string;
}

export function AnimatedArrow({
  direction = 'right',
  animated = true,
  delay = 0,
  duration = 0.6,
  className = ''
}: AnimatedArrowProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGPolygonElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const head = headRef.current;
    if (!path || !animated) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    if (head) {
      head.style.opacity = '0';
    }

    let innerTimeout: ReturnType<typeof setTimeout>;
    const timeout = setTimeout(() => {
      path.style.transition = `stroke-dashoffset ${duration}s ease-out`;
      path.style.strokeDashoffset = '0';

      if (head) {
        innerTimeout = setTimeout(() => {
          head.style.transition = 'opacity 0.2s ease-out';
          head.style.opacity = '1';
        }, duration * 800);
      }
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(innerTimeout);
    };
  }, [animated, delay, duration]);

  if (direction === 'down') {
    return (
      <svg viewBox="0 0 24 40" fill="none" className={`h-10 w-6 ${className}`} aria-hidden="true">
        <path
          ref={pathRef}
          d="M12 2 C12 8, 12 16, 12 30"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <polygon ref={headRef} points="7,28 12,36 17,28" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 40 24" fill="none" className={`h-6 w-10 ${className}`} aria-hidden="true">
      <path
        ref={pathRef}
        d="M2 12 C8 12, 16 12, 30 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <polygon ref={headRef} points="28,7 36,12 28,17" fill="currentColor" />
    </svg>
  );
}
