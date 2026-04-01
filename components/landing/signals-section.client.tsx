'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles } from 'lucide-react';
import { SIGNALS } from './landing-constants';
import { RotatingWord } from './rotating-word.client';

gsap.registerPlugin(ScrollTrigger);

export function SignalsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('.signal-card').forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
            delay: i * 0.06,
            scrollTrigger: {
              trigger: el,
              start: 'top 92%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative scroll-mt-16 py-20 sm:py-32">
      <div className="section-heading relative mb-12 sm:mb-16">
        <p className="mb-3 text-sm font-medium text-[#5643cc]">Signals</p>
        <h2
          className="text-2xl font-semibold tracking-tight text-[#e4e5e9] sm:text-3xl lg:text-4xl xl:text-[2.75rem]"
          style={{ textWrap: 'balance' }}
        >
          Reach out the moment you spot <RotatingWord />
        </h2>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#9c9da1]">
          Remes monitors dozens of data sources in real time. Here are some of the signals you can
          track.
        </p>
      </div>

      {/* Card grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SIGNALS.map((signal) => {
          const isCustom = signal.color === 'custom';

          if (isCustom) {
            return (
              <div
                key={signal.source}
                className="signal-card group relative col-span-full rounded-xl border border-[#5643cc]/30 bg-[#111214] transition-colors duration-200 hover:border-[#5643cc]/50 hover:bg-[#131418]"
              >
                <div className="relative flex items-center gap-5 px-6 py-5">
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(69,94,181,0.15), rgba(103,63,215,0.15))'
                    }}
                  >
                    <Sparkles className="size-5 text-[#8a8fff]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span
                      className="text-sm font-semibold"
                      style={{
                        backgroundImage:
                          'linear-gradient(92.88deg, #455eb5 9.16%, #5643cc 43.89%, #673fd7 64.72%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}
                    >
                      {signal.source}
                    </span>
                    <span className="text-sm leading-relaxed text-[#9c9da1]">{signal.example}</span>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={signal.source}
              className="signal-card group relative overflow-hidden rounded-xl border border-white/6 bg-[#111214] transition-all duration-200 hover:border-white/10 hover:bg-[#131418]"
            >
              {/* Top color accent */}
              <div
                className="h-px w-full opacity-50 transition-opacity duration-200 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(90deg, transparent, ${signal.color}, transparent)`
                }}
              />

              <div className="flex flex-col gap-3 px-5 py-5">
                {/* Source header */}
                <div className="flex items-center gap-2.5">
                  <span
                    className="size-2 shrink-0 rounded-full transition-shadow duration-200 group-hover:shadow-[0_0_8px_currentColor]"
                    style={{ backgroundColor: signal.color, color: signal.color }}
                  />
                  <span className="text-sm font-medium text-[#e4e5e9]">{signal.source}</span>
                </div>

                {/* Example */}
                <p className="text-[13px] leading-relaxed text-[#9c9da1]/70 italic">
                  &ldquo;{signal.example}&rdquo;
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
