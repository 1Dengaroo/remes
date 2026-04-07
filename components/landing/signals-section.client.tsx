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

const COMPANY_STAGGER = 400;
const STREAM_SPEED = 12;

// Non-custom signals for cycling
const CYCLABLE_SIGNALS = SIGNALS.filter((s) => s.color !== 'custom');

export function SignalsSection() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [visibleCompanies, setVisibleCompanies] = useState(0);
  const [streamedText, setStreamedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const skipAnimationRef = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rafRef = useRef<number>(0);
  const transitionRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAnimations = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (transitionRef.current) clearTimeout(transitionRef.current);
    cancelAnimationFrame(rafRef.current);
  }, []);

  const goToSignal = useCallback((index: number) => {
    skipAnimationRef.current = true;
    setSelectedIndex(index);
    setDisplayIndex(index);
    setTransitioning(false);
    if (transitionRef.current) clearTimeout(transitionRef.current);
  }, []);

  // Animate the preview for the current signal
  // Toggle to false to re-enable stagger + streaming animations
  const SKIP_ANIMATIONS = true;

  const runPreview = useCallback(
    (index: number) => {
      clearAnimations();
      setVisibleCompanies(0);
      setStreamedText('');
      setIsStreaming(false);
      setShowEmail(false);

      const signal = CYCLABLE_SIGNALS[index] ?? SIGNALS[index];
      const preview = SIGNAL_PREVIEWS[signal?.source];
      if (!preview) return;

      // Instant display (no stagger, no streaming)
      if (SKIP_ANIMATIONS || skipAnimationRef.current) {
        skipAnimationRef.current = false;
        setVisibleCompanies(preview.companies.length);
        setShowEmail(true);
        setStreamedText(preview.emailOpener);
        setIsStreaming(false);
        return;
      }

      // Phase 1: Stagger company reveals
      preview.companies.forEach((_, i) => {
        const t = setTimeout(() => setVisibleCompanies(i + 1), (i + 1) * COMPANY_STAGGER);
        timeoutsRef.current.push(t);
      });

      // Phase 2: Stream email after companies appear
      const emailDelay = (preview.companies.length + 1) * COMPANY_STAGGER + 400;
      const emailTimeout = setTimeout(() => {
        setShowEmail(true);
        setIsStreaming(true);
        let charIndex = 0;
        let lastTime = 0;

        const tick = (time: number) => {
          if (time - lastTime < STREAM_SPEED) {
            rafRef.current = requestAnimationFrame(tick);
            return;
          }
          lastTime = time;

          const chunkSize =
            preview.emailOpener[charIndex] === '\n' ? 1 : Math.random() > 0.4 ? 3 : 2;
          charIndex += chunkSize;

          if (charIndex >= preview.emailOpener.length) {
            setStreamedText(preview.emailOpener);
            setIsStreaming(false);
            return;
          }

          setStreamedText(preview.emailOpener.slice(0, charIndex));
          rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
      }, emailDelay);
      timeoutsRef.current.push(emailTimeout);
    },
    [clearAnimations]
  );

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

  // Run preview animation when display changes (only after entering view)
  useEffect(() => {
    if (!hasEnteredView) return;
    runPreview(displayIndex);
    return clearAnimations;
  }, [displayIndex, hasEnteredView, runPreview, clearAnimations]);

  const selectedSignal = CYCLABLE_SIGNALS[displayIndex] ?? SIGNALS[displayIndex];
  const preview = SIGNAL_PREVIEWS[selectedSignal?.source];

  return (
    <section ref={sectionRef} className="relative scroll-mt-16 py-24 sm:py-36">
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

      {/* Two-panel layout */}
      <div className="grid gap-8 lg:grid-cols-[2fr_3fr]">
        {/* Left: Signal cards */}
        <div className="rounded-xl bg-white/2 p-2.5">
          <div className="grid grid-cols-2 gap-2">
            {CYCLABLE_SIGNALS.map((signal, i) => {
              const isSelected = selectedIndex === i;
              return (
                <button
                  key={signal.source}
                  type="button"
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/6 bg-white/2 p-4 text-left transition-all duration-200 hover:border-white/10 hover:bg-white/3"
                  style={{
                    borderColor: isSelected ? `${signal.color}40` : undefined,
                    backgroundColor: isSelected ? `${signal.color}08` : undefined
                  }}
                  onClick={() => goToSignal(i)}
                >
                  {/* Top accent line */}
                  <div
                    className="absolute inset-x-0 top-0 h-px transition-opacity duration-200"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${signal.color}90, transparent)`,
                      opacity: isSelected ? 0.8 : 0.3
                    }}
                  />
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-200"
                      style={{
                        backgroundColor: `${signal.color}15`,
                        color: signal.color
                      }}
                    >
                      {SIGNAL_ICONS[signal.source]}
                    </div>
                    <span className="text-landing-fg text-sm font-medium">{signal.source}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom signal card — full width */}
          <div className="mt-2">
            <div className="group relative overflow-hidden rounded-xl bg-(--landing-bg-card)">
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
              <div className="relative flex items-center gap-4 px-5 py-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/4">
                  <Sparkles className="size-5 text-(--landing-accent)" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-(--landing-accent)">
                    Custom Signals
                  </span>
                  <span className="text-landing-fg-secondary text-xs leading-relaxed">
                    If you can describe it, Remes can detect it
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Animated preview */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div
            data-theme={theme}
            className="overflow-hidden rounded-xl border shadow-lg"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--card)',
              color: 'var(--card-foreground)'
            }}
          >
            {/* Preview header */}
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

            {/* Preview content */}
            <div
              className="h-105 overflow-hidden sm:h-115"
              style={{
                backgroundColor: 'var(--background)',
                opacity: transitioning ? 0 : 1,
                transform: transitioning ? 'translateY(6px)' : 'translateY(0)',
                transition: 'opacity 200ms ease-out, transform 200ms ease-out',
                willChange: 'opacity, transform'
              }}
            >
              {/* Companies */}
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
                          transition: SKIP_ANIMATIONS
                            ? 'none'
                            : 'opacity 400ms ease-out, transform 400ms ease-out',
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

                {/* Email opener */}
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
                      {isStreaming && (
                        <span
                          className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse align-middle"
                          style={{ backgroundColor: 'var(--primary)' }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{
                borderTop: '1px solid var(--border)',
                backgroundColor: 'var(--card)'
              }}
            >
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                {isStreaming
                  ? 'Generating outreach...'
                  : showEmail
                    ? 'Ready to send'
                    : 'Detecting signals...'}
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
