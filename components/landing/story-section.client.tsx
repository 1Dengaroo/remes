'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function StorySection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      document.querySelectorAll('.story-word').forEach((word) => {
        gsap.fromTo(
          word,
          { opacity: 0.15 },
          {
            opacity: 1,
            scrollTrigger: {
              trigger: word,
              start: 'top 85%',
              end: 'top 55%',
              scrub: true
            }
          }
        );
      });
    },
    { scope: sectionRef }
  );

  const line1 =
    'Great sales teams deserve better tools than Apollo, Clay, and Instantly stitched together.';
  const line2 =
    'Remes combines signal detection, contact discovery, and personalized outreach into one workflow.';
  const line3 =
    'Describe your ideal buyer. Remes finds the signal, the contact, and writes the email.';
  const line4 = 'So your team can focus on closing, not researching.';

  const renderWords = (text: string, highlight?: boolean) =>
    text.split(' ').map((word, i) => (
      <span
        key={`${text.slice(0, 5)}-${i}`}
        className={`story-word inline-block ${highlight ? 'text-white' : ''}`}
        style={{ marginRight: '0.3em' }}
      >
        {word}
      </span>
    ));

  return (
    <section ref={sectionRef} className="relative py-32 sm:py-44">
      <div className="text-2xl leading-[1.5] font-medium tracking-tight text-white/50 sm:text-3xl sm:leading-[1.5] lg:text-[2.5rem] lg:leading-[1.45]">
        <p className="mb-8">{renderWords(line1)}</p>
        <p className="mb-8">{renderWords(line2)}</p>
        <p className="mb-8">{renderWords(line3)}</p>
        <p>{renderWords(line4, true)}</p>
      </div>
    </section>
  );
}
