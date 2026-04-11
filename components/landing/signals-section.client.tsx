'use client';

import { useState, useEffect, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { SIGNALS, SIGNAL_PREVIEWS } from './landing-constants';
import { RotatingWord } from './rotating-word.client';

const CYCLE_MS = 4500;

function SignalSourcePill({
  label,
  isCustom,
  active,
  onClick
}: {
  label: string;
  isCustom: boolean;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-all duration-300"
      style={{
        backgroundColor: active ? 'var(--landing-accent)' : 'var(--landing-bg-card)',
        color: active ? '#fff' : 'var(--landing-fg-muted)',
        borderColor: active ? 'var(--landing-accent)' : 'var(--landing-border-card)',
        boxShadow: 'var(--landing-shadow-card)'
      }}
    >
      {isCustom && <Sparkles className="size-3" />}
      {label}
    </button>
  );
}

function CompanyMatch({
  company,
  index
}: {
  company: { name: string; reason: string };
  index: number;
}) {
  return (
    <div
      className="flex items-start gap-3 rounded-lg border border-(--landing-border-card) bg-(--landing-bg-card) px-4 py-3 shadow-(--landing-shadow-card)"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div
        className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-bold"
        style={{ backgroundColor: 'rgba(86, 67, 204, 0.1)', color: 'var(--landing-accent)' }}
      >
        {company.name[0]}
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-landing-fg text-sm font-medium">{company.name}</span>
        <p className="text-landing-fg-muted mt-0.5 text-xs leading-relaxed">{company.reason}</p>
      </div>
    </div>
  );
}

export function SignalsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const activeSignal = SIGNALS[activeIndex];
  const isCustom = activeSignal.color === 'custom';
  const preview = SIGNAL_PREVIEWS[activeSignal.source];

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % SIGNALS.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, CYCLE_MS);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <section
      className="relative scroll-mt-16 py-24 sm:py-36"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Heading */}
      <div className="mb-14 max-w-2xl sm:mb-20">
        <p className="text-landing-fg-muted mb-3 text-xs font-medium tracking-widest uppercase">
          Signals
        </p>
        <h2
          className="text-landing-fg text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
          style={{ textWrap: 'balance' }}
        >
          Reach out the moment you spot <RotatingWord />
        </h2>
        <p className="text-landing-fg-secondary mt-4 max-w-lg text-sm leading-relaxed">
          Remes monitors dozens of data sources in real time, from job boards and SEC filings to
          company websites and LinkedIn. Pick a signal to see what Remes finds.
        </p>
      </div>

      {/* Signal source selector */}
      <div className="mb-8 flex flex-wrap gap-2">
        {SIGNALS.map((signal, i) => (
          <SignalSourcePill
            key={signal.source}
            label={signal.source}
            isCustom={signal.color === 'custom'}
            active={i === activeIndex}
            onClick={() => setActiveIndex(i)}
          />
        ))}
      </div>

      {/* Active signal detail */}
      <div
        key={activeIndex}
        className="grid min-h-100 gap-4 lg:grid-cols-[1fr_1fr]"
        style={{ animation: 'signal-fade-in 0.4s ease-out' }}
      >
        {/* Left: Signal description + matched companies */}
        <div className="flex flex-col">
          <p className="text-landing-fg-muted mb-2 px-1 text-xs font-medium tracking-wide uppercase">
            Signal detected
          </p>
          {/* Signal description card */}
          <div
            className="mb-3 rounded-xl border bg-(--landing-bg-card) p-5 shadow-(--landing-shadow-card)"
            style={{ borderColor: 'rgba(86, 67, 204, 0.2)' }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="flex size-8 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: 'rgba(86, 67, 204, 0.1)',
                  color: 'var(--landing-accent)'
                }}
              >
                {isCustom ? (
                  <Sparkles className="size-4" />
                ) : (
                  <span className="text-xs font-bold">{activeSignal.source[0]}</span>
                )}
              </div>
              <div>
                <span className="text-landing-fg text-sm font-semibold">{activeSignal.source}</span>
                <span
                  className="ml-2 rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: 'rgba(86, 67, 204, 0.1)',
                    color: 'var(--landing-accent)'
                  }}
                >
                  Monitoring
                </span>
              </div>
            </div>
            <p className="text-landing-fg-muted mt-3 text-sm leading-relaxed">
              {activeSignal.example}
            </p>
          </div>

          {/* Matched companies */}
          {preview && (
            <div className="space-y-2">
              <p className="text-landing-fg-muted px-1 text-xs font-medium tracking-wide uppercase">
                Companies matched
              </p>
              {preview.companies.map((company, i) => (
                <CompanyMatch key={company.name} company={company} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* Right: Email preview */}
        {preview && (
          <div className="flex flex-col">
            <p className="text-landing-fg-muted mb-2 px-1 text-xs font-medium tracking-wide uppercase">
              Generated email
            </p>
            <div className="flex flex-col rounded-xl border border-(--landing-border-card) bg-(--landing-bg-card) shadow-(--landing-shadow-card)">
              {/* Email header */}
              <div className="border-b border-(--landing-border-card) px-5 py-3">
                <div className="flex items-center gap-2">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: 'var(--landing-accent)' }}
                  />
                  <span className="text-landing-fg-muted text-xs">
                    Draft from{' '}
                    <span className="font-medium" style={{ color: 'var(--landing-accent)' }}>
                      {activeSignal.source}
                    </span>{' '}
                    signal
                  </span>
                </div>
              </div>

              {/* Email body */}
              <div className="flex-1 px-5 py-4">
                <p className="text-landing-fg text-sm leading-relaxed whitespace-pre-line">
                  {preview.emailOpener}
                </p>
              </div>

              {/* Email footer */}
              <div className="flex items-center justify-between border-t border-(--landing-border-card) px-5 py-3">
                <div className="flex gap-2">
                  {['Signal-led', 'Personalized', 'Under 80 words'].map((tag) => (
                    <span
                      key={tag}
                      className="text-landing-fg-muted rounded-md bg-(--landing-skel-base) px-2 py-0.5 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div
                  className="rounded-md px-3 py-1.5 text-xs font-medium"
                  style={{ backgroundColor: 'var(--landing-accent)', color: '#fff' }}
                >
                  Send
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes signal-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
