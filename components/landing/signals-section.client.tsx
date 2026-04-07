'use client';

import {
  Briefcase,
  FileText,
  Globe,
  Linkedin,
  Newspaper,
  Sparkles,
  TrendingUp,
  Users,
  FileBarChart
} from 'lucide-react';
import { SIGNALS } from './landing-constants';
import { RotatingWord } from './rotating-word.client';

const SIGNAL_ICONS: Record<string, React.ReactNode> = {
  'Job Openings': <Briefcase className="size-4" />,
  'News & Press': <Newspaper className="size-4" />,
  'Company Website': <Globe className="size-4" />,
  'Job Descriptions': <FileText className="size-4" />,
  'Employee Activity': <Users className="size-4" />,
  '10-K Reports': <FileBarChart className="size-4" />,
  'Funding Rounds': <TrendingUp className="size-4" />,
  'LinkedIn Posts': <Linkedin className="size-4" />
};

export function SignalsSection() {
  return (
    <section className="relative scroll-mt-16 py-24 sm:py-36">
      <div className="section-heading relative mb-14 sm:mb-20">
        <p className="text-landing-fg-muted mb-3 text-xs font-medium tracking-widest uppercase">
          Signals
        </p>
        <h2
          className="text-landing-fg text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl xl:text-[2.75rem]"
          style={{ textWrap: 'balance' }}
        >
          Reach out the moment you spot <RotatingWord />
        </h2>
        <p className="text-landing-fg-secondary mt-4 max-w-lg text-sm leading-relaxed sm:text-base">
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
                className="signal-card group relative col-span-full overflow-hidden rounded-xl bg-(--landing-bg-card) transition-all duration-300 hover:shadow-(--landing-shadow-card-hover)"
              >
                {/* Rainbow border via inset box-shadow trick */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-xl"
                  style={{
                    padding: 1,
                    background: 'var(--landing-rainbow-border)',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    WebkitMaskComposite: 'xor'
                  }}
                />
                <div>
                  <div className="relative flex items-center gap-5 px-6 py-5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/4">
                      <Sparkles className="size-5 text-(--landing-accent)" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-(--landing-accent)">
                        {signal.source}
                      </span>
                      <span className="text-landing-fg text-sm leading-relaxed">
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
              className="signal-card group relative overflow-hidden rounded-xl border border-white/6 bg-white/2 transition-all duration-300 hover:border-white/10 hover:bg-white/3 hover:shadow-(--landing-shadow-card-hover)"
            >
              {/* Top accent line — colored per signal */}
              <div
                className="h-px w-full opacity-30 transition-opacity duration-300 group-hover:opacity-70"
                style={{
                  background: `linear-gradient(90deg, transparent, ${signal.color}90, transparent)`
                }}
              />

              <div className="flex flex-col gap-3 px-5 py-5">
                {/* Source header */}
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-300"
                    style={{
                      backgroundColor: `${signal.color}15`,
                      color: signal.color
                    }}
                  >
                    {SIGNAL_ICONS[signal.source]}
                  </div>
                  <span className="text-landing-fg text-sm font-medium">{signal.source}</span>
                </div>

                {/* Example */}
                <p className="text-sm2 text-landing-fg-secondary leading-relaxed italic">
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
