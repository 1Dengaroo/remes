'use client';

import { useRef, useEffect } from 'react';

export function StorySection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1 }
    );

    section.querySelectorAll('.story-line').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const lines = [
    'Great sales teams deserve better tools than Apollo, Clay, and Instantly stitched together.',
    'Remes combines signal detection, contact discovery, and personalized outreach into one workflow.',
    'Describe your ideal buyer. Remes finds the signal, the contact, and writes the email.',
    'So your team can focus on closing, not researching.'
  ];

  return (
    <section ref={sectionRef} className="relative py-32 sm:py-44">
      <div className="lg:text-story lg:leading-snug2 leading-normal2 sm:leading-normal2 text-landing-fg-secondary text-2xl font-medium tracking-tight sm:text-3xl">
        {lines.map((line, i) => (
          <p
            key={i}
            className={`story-line mb-8 opacity-15 transition-opacity duration-700 ease-out last:mb-0 [&.in-view]:opacity-100 ${i === lines.length - 1 ? 'text-landing-fg' : ''}`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            {line}
          </p>
        ))}
      </div>
    </section>
  );
}
