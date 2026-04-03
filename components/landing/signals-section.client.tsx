'use client';

import { Sparkles } from 'lucide-react';
import { SIGNALS } from './landing-constants';
import { RotatingWord } from './rotating-word.client';

export function SignalsSection() {
  return (
    <section className="relative scroll-mt-16 py-24 sm:py-36">
      <div className="section-heading relative mb-14 sm:mb-20">
        <p className="mb-3 text-xs font-medium tracking-widest text-white/40 uppercase">Signals</p>
        <h2
          className="text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl xl:text-[2.75rem]"
          style={{ textWrap: 'balance' }}
        >
          Reach out the moment you spot <RotatingWord />
        </h2>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/50 sm:text-base">
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
                className="signal-card group relative col-span-full overflow-hidden rounded-xl bg-[#0c0d0f] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.03)]"
              >
                {/* Rainbow border via inset box-shadow trick */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-xl"
                  style={{
                    padding: 1,
                    background:
                      'linear-gradient(135deg, rgba(86,67,204,0.4), rgba(229,72,77,0.3), rgba(247,193,43,0.3), rgba(70,227,183,0.3), rgba(47,122,208,0.3), rgba(103,63,215,0.4))',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    WebkitMaskComposite: 'xor'
                  }}
                />
                <div>
                  <div className="relative flex items-center gap-5 px-6 py-5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/4">
                      <Sparkles className="size-5 text-white/50" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-white/90">{signal.source}</span>
                      <span className="text-sm leading-relaxed text-white/50">
                        {signal.example}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={signal.source}
              className="signal-card group relative overflow-hidden rounded-xl border border-white/6 bg-white/2 transition-all duration-300 hover:border-white/10 hover:bg-white/3 hover:shadow-[0_0_30px_rgba(255,255,255,0.03)]"
            >
              {/* Top accent line — white glow */}
              <div
                className="h-px w-full opacity-30 transition-opacity duration-300 group-hover:opacity-60"
                style={{
                  background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`
                }}
              />

              <div className="flex flex-col gap-3 px-5 py-5">
                {/* Source header */}
                <div className="flex items-center gap-2.5">
                  <span
                    className="size-1.5 shrink-0 rounded-full transition-shadow duration-300 group-hover:shadow-[0_0_6px_currentColor]"
                    style={{ backgroundColor: signal.color, color: signal.color }}
                  />
                  <span className="text-sm font-medium text-white/90">{signal.source}</span>
                </div>

                {/* Example */}
                <p className="text-[13px] leading-relaxed text-white/40 italic">
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
