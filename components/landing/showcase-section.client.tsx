'use client';

import { useRef, useEffect } from 'react';
import { Focusable } from '@/components/shared/focusable';
import { MockSignalDashboard, MockContactList, MockEmailPreview } from './mock-dashboard.client';

const STEPS = [
  {
    step: '01',
    label: 'Signal Detection',
    title: 'Catch buying signals before your competitors',
    desc: 'Remes monitors job postings, funding rounds, and product launches across the web, surfacing the companies most likely to buy right now.',
    Component: MockSignalDashboard
  },
  {
    step: '02',
    label: 'Contact Discovery',
    title: 'Find the right person instantly',
    desc: 'Automatically match signals to decision-makers with verified emails and LinkedIn profiles. No more guessing who to reach out to.',
    Component: MockContactList
  },
  {
    step: '03',
    label: 'AI Outreach',
    title: 'Emails that actually get replies',
    desc: 'Every email is built on proven cold outreach frameworks. Plain text, under 80 words, one clear ask. Each opener references the exact signal that triggered it.',
    Component: MockEmailPreview
  }
];

export function ShowcaseSection() {
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
      { threshold: 0.05 }
    );

    section.querySelectorAll('.showcase-step').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="use-cases" className="relative scroll-mt-16 py-24 sm:py-36">
      <div className="mb-16 sm:mb-24">
        <p className="text-landing-fg-muted mb-3 text-xs font-medium tracking-widest uppercase">
          How it works
        </p>
        <Focusable
          as="h2"
          className="text-landing-fg text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl"
          style={{ textWrap: 'balance' }}
        >
          From signal to sent in minutes
        </Focusable>
        <p className="text-landing-fg-secondary mt-3 max-w-md text-sm leading-relaxed">
          Three steps. Fully automated. No manual research required.
        </p>
      </div>

      <div className="flex flex-col gap-28 sm:gap-36 lg:gap-44">
        {STEPS.map((step, i) => (
          <div
            key={step.step}
            className="showcase-step translate-y-8 opacity-0 transition-all duration-700 ease-out [&.in-view]:translate-y-0 [&.in-view]:opacity-100"
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            {/* Text above */}
            <div className="mb-10 max-w-2xl sm:mb-14">
              <div className="mb-4">
                <span className="text-landing-fg-muted text-xs font-medium tracking-wider uppercase">
                  {step.label}
                </span>
              </div>
              <Focusable
                as="h3"
                className="text-landing-fg text-xl font-semibold tracking-tight sm:text-2xl"
                style={{ textWrap: 'balance' }}
              >
                {step.title}
              </Focusable>
              <p className="text-landing-fg-secondary mt-3 max-w-lg text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>

            <div className="relative">
              {/* White glow border effect */}
              <div
                className="pointer-events-none absolute -inset-px z-10 rounded-lg"
                style={{
                  boxShadow: 'var(--landing-shadow-glow)'
                }}
              />
              <div className="relative">
                <step.Component />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
