'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Briefcase,
  FileText,
  Globe,
  Linkedin,
  Moon,
  Newspaper,
  Sparkles,
  Sun,
  TrendingUp,
  Users,
  FileBarChart
} from 'lucide-react';
import { SIGNALS, SIGNAL_PREVIEWS } from './landing-constants';
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

// Non-custom signals for cycling
const CYCLABLE_SIGNALS = SIGNALS.filter((s) => s.color !== 'custom');

export function SignalsSection() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [visibleCompanies, setVisibleCompanies] = useState(0);
  const [streamedText, setStreamedText] = useState('');
  const [showEmail, setShowEmail] = useState(false);

  const skipAnimationRef = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);

  const goToSignal = useCallback((index: number) => {
    skipAnimationRef.current = true;
    setSelectedIndex(index);
    setDisplayIndex(index);
  }, []);

  const runPreview = useCallback((index: number) => {
    setVisibleCompanies(0);
    setStreamedText('');
    setShowEmail(false);

    const signal = CYCLABLE_SIGNALS[index] ?? SIGNALS[index];
    const preview = SIGNAL_PREVIEWS[signal?.source];
    if (!preview) return;

    skipAnimationRef.current = false;
    setVisibleCompanies(preview.companies.length);
    setShowEmail(true);
    setStreamedText(preview.emailOpener);
  }, []);

  // Start animation only when section scrolls into view
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Run preview when display changes (only after entering view)
  useEffect(() => {
    if (!hasEnteredView) return;
    runPreview(displayIndex);
  }, [displayIndex, hasEnteredView, runPreview]);

  const selectedSignal = CYCLABLE_SIGNALS[displayIndex] ?? SIGNALS[displayIndex];
  const preview = SIGNAL_PREVIEWS[selectedSignal?.source];

  return (
    <section ref={sectionRef} className="relative scroll-mt-16 py-24 sm:py-36">
      <div className="section-heading relative mb-14 sm:mb-20">
        <p className="text-landing-fg-muted mb-3 text-xs font-medium tracking-widest uppercase">
          Signals
        </p>
        <h2
          className="text-landing-fg text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl xl:text-[2.75rem]"
          style={{ textWrap: 'balance' }}
        >
          Reach out the moment you spot <RotatingWord />
        </h2>
        <p className="text-landing-fg-secondary mt-4 max-w-lg text-sm leading-relaxed sm:text-base">
          Remes monitors dozens of data sources in real time. Here are some of the signals you can
          track.
        </p>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[2fr_3fr]">
        <div className="flex flex-col gap-1.5">
          {CYCLABLE_SIGNALS.map((signal, i) => {
            const isSelected = selectedIndex === i;
            return (
              <button
                key={signal.source}
                type="button"
                className="flex w-full cursor-pointer items-start gap-3 rounded-xl border bg-(--landing-bg-card) p-4 text-left transition-all duration-200"
                style={{
                  borderColor: isSelected
                    ? 'var(--landing-accent-light)'
                    : 'var(--landing-border-card)',
                  boxShadow: isSelected ? 'var(--landing-shadow-card)' : 'none'
                }}
                onClick={() => goToSignal(i)}
              >
                <div
                  className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${signal.color}14`, color: signal.color }}
                >
                  {SIGNAL_ICONS[signal.source]}
                </div>
                <div className="min-w-0 flex-1">
                  <span
                    className="text-sm font-medium transition-colors duration-200"
                    style={{ color: isSelected ? 'var(--landing-accent)' : 'var(--landing-fg)' }}
                  >
                    {signal.source}
                  </span>
                  <p className="text-landing-fg-secondary mt-0.5 line-clamp-2 text-xs leading-relaxed">
                    {signal.example}
                  </p>
                </div>
              </button>
            );
          })}

          {/* Custom signal — rainbow border applied via pseudo-element mask */}
          <div
            className="relative overflow-hidden rounded-xl border bg-(--landing-bg-card) p-4"
            style={{ borderColor: 'var(--landing-accent-light)' }}
          >
            <div
              className="pointer-events-none absolute inset-0 rounded-(--card-radius) opacity-40"
              style={{
                background: 'var(--landing-rainbow-border)',
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                WebkitMaskComposite: 'xor',
                padding: 1
              }}
            />
            <div className="flex items-start gap-3">
              <div
                className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: 'rgba(86, 67, 204, 0.1)',
                  color: 'var(--landing-accent)'
                }}
              >
                <Sparkles className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium text-(--landing-accent)">Custom Signals</span>
                <p className="text-landing-fg-secondary mt-0.5 text-xs leading-relaxed">
                  If you can describe it, Remes can detect it
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-24">
          <div
            data-theme={theme}
            className="overflow-hidden rounded-xl border"
            style={{
              borderColor: 'var(--border)',
              boxShadow: 'var(--landing-shadow-card)',
              backgroundColor: 'var(--card)',
              color: 'var(--card-foreground)'
            }}
          >
            <div
              className="flex items-center justify-between px-5 py-3.5"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="size-2 rounded-full"
                  style={{
                    backgroundColor:
                      visibleCompanies > 0 ? 'var(--signal-funding-text)' : 'var(--border)',
                    boxShadow: visibleCompanies > 0 ? '0 0 6px var(--signal-funding-bg)' : 'none'
                  }}
                />
                <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                  {visibleCompanies > 0 ? `${visibleCompanies} companies matched` : 'Scanning...'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="rounded-md px-2.5 py-1 text-xs font-medium"
                  style={{
                    backgroundColor:
                      selectedSignal?.color !== 'custom' ? `${selectedSignal?.color}15` : undefined,
                    color: selectedSignal?.color !== 'custom' ? selectedSignal?.color : undefined
                  }}
                >
                  {selectedSignal?.source}
                </span>
                <button
                  type="button"
                  className="flex size-8 cursor-pointer items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: 'var(--accent-foreground)'
                  }}
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  {theme === 'dark' ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
                </button>
              </div>
            </div>

            <div
              className="h-105 overflow-hidden sm:h-115"
              style={{ backgroundColor: 'var(--background)' }}
            >
              <div className="p-4 sm:p-5">
                <div className="flex flex-col gap-2">
                  {preview?.companies.map((c, i) => {
                    const visible = i < visibleCompanies;
                    return (
                      <div
                        key={c.name}
                        className="flex items-center gap-3 rounded-lg px-4 py-3"
                        style={{
                          opacity: visible ? 1 : 0,
                          transform: visible ? 'translateY(0)' : 'translateY(8px)',
                          transition: 'none',
                          border: '1px solid var(--border)',
                          backgroundColor: 'var(--card)'
                        }}
                      >
                        <div
                          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold"
                          style={{
                            backgroundColor: 'var(--primary)',
                            color: 'var(--primary-foreground)'
                          }}
                        >
                          {c.name.slice(0, 2)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span
                            className="text-sm font-medium"
                            style={{ color: 'var(--foreground)' }}
                          >
                            {c.name}
                          </span>
                          <div
                            className="mt-0.5 text-xs leading-relaxed"
                            style={{ color: 'var(--muted-foreground)' }}
                          >
                            {c.reason}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {showEmail && (
                  <div
                    className="mt-4 rounded-lg px-4 py-3"
                    style={{
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--card)'
                    }}
                  >
                    <div
                      className="mb-2 text-xs font-medium"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      Generated outreach
                    </div>
                    <div
                      className="min-h-15 text-xs leading-relaxed whitespace-pre-line"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {streamedText}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div
              className="flex items-center justify-between px-5 py-3"
              style={{
                borderTop: '1px solid var(--border)',
                backgroundColor: 'var(--card)'
              }}
            >
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                {showEmail ? 'Ready to send' : 'Detecting signals...'}
              </span>
              <div className="flex gap-1">
                {CYCLABLE_SIGNALS.map((_, i) => (
                  <div
                    key={i}
                    className="size-1.5 rounded-full"
                    style={{
                      backgroundColor: i === selectedIndex ? 'var(--primary)' : 'var(--border)',
                      transition: 'background-color 150ms'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
