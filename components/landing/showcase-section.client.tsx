'use client';

import { SHOWCASE } from './landing-constants';

export function ShowcaseSection() {
  return (
    <section id="use-cases" className="relative scroll-mt-16 py-20 sm:py-32">
      <div className="relative mb-12 sm:mb-16">
        <p className="mb-3 text-sm font-medium text-[#5643cc]">Features</p>
        <h2
          className="text-2xl font-semibold tracking-tight text-[#e4e5e9] sm:text-3xl"
          style={{ textWrap: 'balance' }}
        >
          Built for modern sales teams
        </h2>
      </div>

      <div className="relative">
        {SHOWCASE.map((item, i) => (
          <div
            key={item.label}
            className="stacked-card sticky top-24 mb-24 last:mb-0"
            style={{
              zIndex: i + 1,
              top: `calc(6rem + ${i * 20}px)`
            }}
          >
            <div className="mx-auto max-w-7xl">
              {/* Text above the card */}
              <div className="mb-5 sm:mb-6">
                <span className="text-xs font-medium tracking-wider text-[#9c9da1]/60 uppercase">
                  {item.label}
                </span>
                <h3
                  className="mt-1.5 text-base font-semibold tracking-tight text-[#e4e5e9] sm:text-lg"
                  style={{ textWrap: 'balance' }}
                >
                  {item.title}
                </h3>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-[#9c9da1]/80">
                  {item.desc}
                </p>
              </div>

              {/* Image with clean Linear-style frame */}
              <div className="relative">
                {/* Subtle glow */}
                <div className="absolute -inset-6 rounded-2xl bg-[#5643cc]/3 blur-3xl" />

                {/* Card frame */}
                <div className="relative overflow-hidden rounded-xl border border-white/6 bg-[#111214] shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                  <img src={item.image} alt={item.label} className="w-full object-contain" />

                  {/* Bottom fade */}
                  <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-16 bg-linear-to-t from-[#111214] to-transparent" />
                </div>

                {/* Top reflection line */}
                <div className="pointer-events-none absolute top-0 right-8 left-8 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
