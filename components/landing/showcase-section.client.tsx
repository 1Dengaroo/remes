'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MockSignalDashboard, MockContactList, MockEmailPreview } from './mock-dashboard.client';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    step: '01',
    label: 'Signal Detection',
    title: 'Catch buying signals before your competitors',
    desc: 'Remes monitors job postings, funding rounds, and product launches across the web, surfacing the companies most likely to buy right now.',
    component: MockSignalDashboard
  },
  {
    step: '02',
    label: 'Contact Discovery',
    title: 'Find the right person instantly',
    desc: 'Automatically match signals to decision-makers with verified emails and LinkedIn profiles. No more guessing who to reach out to.',
    component: MockContactList
  },
  {
    step: '03',
    label: 'AI Outreach',
    title: 'Emails that actually get replies',
    desc: 'Every email is built on proven cold outreach frameworks. Plain text, under 80 words, one clear ask. Each opener references the exact signal that triggered it, so nothing reads like a template.',
    component: MockEmailPreview
  }
];

export function ShowcaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('.showcase-step').forEach((step) => {
        const text = step.querySelector('.showcase-text');
        const visual = step.querySelector('.showcase-visual');

        if (text) {
          gsap.fromTo(
            text,
            { opacity: 0, x: -40 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: step,
                start: 'top 75%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }

        if (visual) {
          gsap.fromTo(
            visual,
            { opacity: 0, x: 40, scale: 0.97 },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 0.8,
              delay: 0.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: step,
                start: 'top 75%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }
      });

      // Animate the connecting line
      const line = document.querySelector('.showcase-line') as HTMLElement | null;
      if (line) {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              end: 'bottom 60%',
              scrub: true
            }
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="use-cases" className="relative scroll-mt-16 py-24 sm:py-36">
      <div className="mb-16 sm:mb-24">
        <p className="mb-3 text-xs font-medium tracking-widest text-white/40 uppercase">
          How it works
        </p>
        <h2
          className="text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl"
          style={{ textWrap: 'balance' }}
        >
          From signal to sent in minutes
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/50">
          Three steps. Fully automated. No manual research required.
        </p>
      </div>

      <div className="relative">
        {/* Vertical connecting line */}
        <div className="absolute top-0 bottom-0 left-1/2 hidden -translate-x-1/2 lg:block">
          <div className="showcase-line h-full w-px origin-top bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-transparent" />
        </div>

        <div className="flex flex-col gap-24 sm:gap-32 lg:gap-40">
          {STEPS.map((step, i) => {
            const isEven = i % 2 === 0;
            const Component = step.component;

            return (
              <div
                key={step.step}
                className={`showcase-step relative grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                  !isEven ? 'lg:[direction:rtl]' : ''
                }`}
              >
                {/* Text side */}
                <div className={`showcase-text ${!isEven ? 'lg:[direction:ltr]' : ''}`}>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-xs font-medium text-white/50">
                      {step.step}
                    </span>
                    <span className="text-xs font-medium tracking-wider text-white/40 uppercase">
                      {step.label}
                    </span>
                  </div>
                  <h3
                    className="text-xl font-semibold tracking-tight text-white sm:text-2xl"
                    style={{ textWrap: 'balance' }}
                  >
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-white/50">{step.desc}</p>
                </div>

                {/* Visual side */}
                <div className={`showcase-visual relative ${!isEven ? 'lg:[direction:ltr]' : ''}`}>
                  <div className="relative">
                    <Component />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
