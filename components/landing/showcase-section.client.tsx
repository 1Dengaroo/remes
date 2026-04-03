'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MockSignalDashboard, MockContactList, MockEmailPreview } from './mock-dashboard.client';

gsap.registerPlugin(ScrollTrigger);

/* Each step has a unique CSS mask so the fade-out feels different */
const STEPS = [
  {
    step: '01',
    label: 'Signal Detection',
    title: 'Catch buying signals before your competitors',
    desc: 'Remes monitors job postings, funding rounds, and product launches across the web, surfacing the companies most likely to buy right now.',
    Component: MockSignalDashboard,
    mask: 'radial-gradient(ellipse 85% 80% at 50% 40%, black 60%, transparent 100%)'
  },
  {
    step: '02',
    label: 'Contact Discovery',
    title: 'Find the right person instantly',
    desc: 'Automatically match signals to decision-makers with verified emails and LinkedIn profiles. No more guessing who to reach out to.',
    Component: MockContactList,
    mask: 'radial-gradient(ellipse 80% 85% at 50% 45%, black 55%, transparent 100%)'
  },
  {
    step: '03',
    label: 'AI Outreach',
    title: 'Emails that actually get replies',
    desc: 'Every email is built on proven cold outreach frameworks. Plain text, under 80 words, one clear ask. Each opener references the exact signal that triggered it.',
    Component: MockEmailPreview,
    mask: ''
  }
];

export function ShowcaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop: fade up with reverse
      mm.add('(min-width: 1024px)', () => {
        gsap.utils.toArray<HTMLElement>('.showcase-step').forEach((step) => {
          const text = step.querySelector('.showcase-text');
          const visual = step.querySelector('.showcase-visual');

          if (text) {
            gsap.fromTo(
              text,
              { autoAlpha: 0, y: 30 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: step,
                  start: 'top 95%',
                  toggleActions: 'play none none reverse'
                }
              }
            );
          }

          if (visual) {
            gsap.fromTo(
              visual,
              { autoAlpha: 0, y: 40, scale: 0.98 },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.9,
                delay: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: step,
                  start: 'top 90%',
                  toggleActions: 'play none none reverse'
                }
              }
            );
          }
        });
      });

      // Mobile/tablet: simple fade-up, fire once
      mm.add('(max-width: 1023px)', () => {
        gsap.utils.toArray<HTMLElement>('.showcase-step').forEach((step) => {
          const text = step.querySelector('.showcase-text');
          const visual = step.querySelector('.showcase-visual');

          if (text) {
            gsap.fromTo(
              text,
              { autoAlpha: 0, y: 24 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.5,
                ease: 'power2.out',
                scrollTrigger: { trigger: step, start: 'top 95%', once: true }
              }
            );
          }

          if (visual) {
            gsap.fromTo(
              visual,
              { autoAlpha: 0, y: 24 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.5,
                delay: 0.1,
                ease: 'power2.out',
                scrollTrigger: { trigger: step, start: 'top 92%', once: true }
              }
            );
          }
        });
      });
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

      <div className="flex flex-col gap-28 sm:gap-36 lg:gap-44">
        {STEPS.map((step) => (
          <div key={step.step} className="showcase-step">
            {/* Text above */}
            <div className="showcase-text mb-10 max-w-2xl sm:mb-14">
              <div className="mb-4">
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
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/50">{step.desc}</p>
            </div>

            {/* Full-width interactive component with unique edge fade */}
            <div className="showcase-visual relative">
              {/* White glow border effect */}
              <div
                className="pointer-events-none absolute -inset-px z-10 rounded-xl"
                style={{
                  boxShadow:
                    'inset 0 0 30px rgba(255,255,255,0.03), 0 0 40px rgba(255,255,255,0.03), 0 0 80px rgba(255,255,255,0.02)'
                }}
              />
              <div
                className="relative"
                style={step.mask ? { maskImage: step.mask, WebkitMaskImage: step.mask } : undefined}
              >
                <step.Component />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
