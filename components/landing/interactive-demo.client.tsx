'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Sun, Moon, Search, Users, Mail } from 'lucide-react';
import { COMPANIES, CONTACTS, EMAILS } from './mock-dashboard.client';

const STEPS = [
  { label: 'Signals', icon: Search },
  { label: 'Contacts', icon: Users },
  { label: 'Outreach', icon: Mail }
] as const;

const SIGNAL_LABELS: Record<string, string> = {
  job_posting: 'Job',
  funding: 'Funding',
  news: 'News',
  product_launch: 'Launch'
};

// Maps signal types to CSS token stems (e.g. --signal-job-bg, --signal-funding-text)
const SIGNAL_TOKEN: Record<string, string> = {
  job_posting: 'job',
  funding: 'funding',
  news: 'news',
  product_launch: 'product'
};

const STEP_DURATIONS = [5500, 4500, 11500];
const COMPANY_STAGGER = 800;
const CONTACT_STAGGER = 400;
const STREAM_SPEED = 6;

// Only show first 4 contacts for the demo
const DEMO_CONTACTS = CONTACTS.slice(0, 4);

export function InteractiveDemo() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [activeStep, setActiveStep] = useState(0); // drives content rendering
  const [indicatorStep, setIndicatorStep] = useState(0); // drives button highlight (updates immediately)
  const [visibleCompanies, setVisibleCompanies] = useState(0);
  const [enrichedContacts, setEnrichedContacts] = useState(0);
  const [streamedText, setStreamedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [paused, setPaused] = useState(false);

  const rafRef = useRef<number>(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const cycleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (cycleRef.current) clearTimeout(cycleRef.current);
    cancelAnimationFrame(rafRef.current);
  }, []);

  const goToStep = useCallback((step: number, userInitiated = false) => {
    if (userInitiated) setPaused(true);
    if (transitionRef.current) clearTimeout(transitionRef.current);
    // Update indicator immediately so buttons don't flash
    setIndicatorStep(step);
    // Fade out current content, then swap
    setTransitioning(true);
    transitionRef.current = setTimeout(() => {
      setActiveStep(step);
      setTransitioning(false);
    }, 150);
  }, []);

  // Step animation orchestrator
  const runStep = useCallback(
    (step: number) => {
      clearTimeouts();

      if (step === 0) {
        // Signal Detection: reveal companies one by one
        setVisibleCompanies(0);
        COMPANIES.forEach((_, i) => {
          const t = setTimeout(() => setVisibleCompanies(i + 1), (i + 1) * COMPANY_STAGGER);
          timeoutsRef.current.push(t);
        });
      }

      if (step === 1) {
        // Contact Discovery: enrich contacts one by one
        setEnrichedContacts(0);
        DEMO_CONTACTS.forEach((_, i) => {
          const t = setTimeout(() => setEnrichedContacts(i + 1), 600 + i * CONTACT_STAGGER);
          timeoutsRef.current.push(t);
        });
      }

      if (step === 2) {
        // Email streaming
        setStreamedText('');
        setIsStreaming(true);
        const email = EMAILS[0];
        let charIndex = 0;
        let lastTime = 0;

        const tick = (time: number) => {
          if (time - lastTime < STREAM_SPEED) {
            rafRef.current = requestAnimationFrame(tick);
            return;
          }
          lastTime = time;

          const chunkSize = email.body[charIndex] === '\n' ? 1 : Math.random() > 0.3 ? 4 : 3;
          charIndex += chunkSize;

          if (charIndex >= email.body.length) {
            setStreamedText(email.body);
            setIsStreaming(false);
            return;
          }

          setStreamedText(email.body.slice(0, charIndex));
          rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
      }

      // Auto-advance to next step (skip if user paused)
      if (!pausedRef.current) {
        cycleRef.current = setTimeout(() => goToStep((step + 1) % 3), STEP_DURATIONS[step]);
      }
    },
    [clearTimeouts, goToStep]
  );

  // Run animation when step changes
  useEffect(() => {
    const t = setTimeout(() => runStep(activeStep), 0);
    return () => {
      clearTimeout(t);
      clearTimeouts();
      if (transitionRef.current) clearTimeout(transitionRef.current);
    };
  }, [activeStep, runStep, clearTimeouts]);

  return (
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
        <div className="flex items-center gap-1">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isActive = indicatorStep === i;
            const isPast = i < indicatorStep;
            return (
              <button
                key={step.label}
                type="button"
                className="flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
                style={{
                  transition: 'background-color 150ms, color 150ms',
                  backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                  color: isActive
                    ? 'var(--primary-foreground)'
                    : isPast
                      ? 'var(--foreground)'
                      : 'var(--muted-foreground)'
                }}
                onClick={() => goToStep(i, true)}
              >
                <Icon className="size-3.5" />
                <span className="hidden sm:inline">{step.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="flex size-8 cursor-pointer items-center justify-center rounded-lg"
          style={{
            backgroundColor: 'var(--accent)',
            color: 'var(--accent-foreground)'
          }}
          onClick={() => {
            setPaused(true);
            setTheme(theme === 'dark' ? 'light' : 'dark');
          }}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
        </button>
      </div>

      <div className="h-px w-full" style={{ backgroundColor: 'var(--border)' }}>
        <div
          className="h-full"
          style={{
            width: `${((indicatorStep + 1) / 3) * 100}%`,
            backgroundColor: 'var(--primary)',
            transition: 'width 400ms ease-out'
          }}
        />
      </div>

      <div
        className="relative h-135 overflow-hidden sm:h-115"
        style={{ backgroundColor: 'var(--background)' }}
      >
        <div
          style={{
            opacity: transitioning ? 0 : 1,
            transform: transitioning ? 'translateY(6px)' : 'translateY(0)',
            transition: 'opacity 200ms ease-out, transform 200ms ease-out',
            willChange: 'opacity, transform'
          }}
        >
          {activeStep === 0 && <SignalStep visibleCount={visibleCompanies} />}
          {activeStep === 1 && <ContactStep enrichedCount={enrichedContacts} />}
          {activeStep === 2 && (
            <OutreachStep streamedText={streamedText} isStreaming={isStreaming} />
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
          {indicatorStep === 0 && `${visibleCompanies} of ${COMPANIES.length} companies detected`}
          {indicatorStep === 1 &&
            `${enrichedContacts} of ${DEMO_CONTACTS.length} contacts enriched`}
          {indicatorStep === 2 && (isStreaming ? 'Generating...' : 'Email ready to send')}
        </span>
        <div className="flex gap-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="size-1.5 rounded-full"
              style={{
                backgroundColor: i === indicatorStep ? 'var(--primary)' : 'var(--border)',
                transition: 'background-color 150ms'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SignalStep({ visibleCount }: { visibleCount: number }) {
  return (
    <div className="p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="size-2 rounded-full"
            style={{
              backgroundColor: visibleCount > 0 ? 'var(--signal-funding-text)' : 'var(--border)',
              boxShadow: visibleCount > 0 ? '0 0 6px var(--signal-funding-bg)' : 'none'
            }}
          />
          <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
            {visibleCount > 0 ? `${visibleCount} companies matched` : 'Scanning...'}
          </span>
        </div>
        <span
          className="rounded-md px-2 py-0.5 text-xs"
          style={{
            backgroundColor: 'var(--muted)',
            color: 'var(--muted-foreground)'
          }}
        >
          B2B SaaS &middot; 50-500 employees
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {COMPANIES.map((c, i) => {
          const visible = i < visibleCount;
          return (
            <div
              key={c.name}
              className="rounded-lg px-4 py-3"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 400ms ease-out, transform 400ms ease-out',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--card)'
              }}
            >
              <div className="flex items-center gap-3">
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
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                      {c.name}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      {c.industry}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      &middot;
                    </span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      {c.funding}
                    </span>
                  </div>
                  <div
                    className="mt-0.5 text-xs leading-relaxed italic"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {c.matchReason}
                  </div>
                </div>

                <div
                  className="flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-semibold"
                  style={{
                    backgroundColor:
                      c.score >= 9 ? 'var(--signal-funding-bg)' : 'var(--signal-news-bg)',
                    color: c.score >= 9 ? 'var(--signal-funding-text)' : 'var(--signal-news-text)'
                  }}
                >
                  {c.score}
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                {c.signals.map((s, j) => (
                  <div key={j} className="flex items-center gap-1.5">
                    <span
                      className="rounded px-1.5 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: `var(--signal-${SIGNAL_TOKEN[s.type]}-bg)`,
                        color: `var(--signal-${SIGNAL_TOKEN[s.type]}-text)`
                      }}
                    >
                      {SIGNAL_LABELS[s.type]}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      {s.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContactStep({ enrichedCount }: { enrichedCount: number }) {
  return (
    <div className="p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
          Decision-makers
        </span>
        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          {enrichedCount} of {DEMO_CONTACTS.length} enriched
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {DEMO_CONTACTS.map((c, i) => {
          const isEnriched = i < enrichedCount;
          const justRevealed = isEnriched && !c.enriched;

          return (
            <div
              key={c.name}
              className="flex items-center gap-3 rounded-lg px-4 py-3"
              style={{
                border: '1px solid var(--border)',
                backgroundColor: 'var(--card)',
                opacity: isEnriched ? 1 : 0.5,
                transition: 'opacity 300ms ease-out'
              }}
            >
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-medium"
                style={{
                  backgroundColor: 'var(--muted)',
                  color: 'var(--muted-foreground)'
                }}
              >
                {c.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-medium"
                    style={{
                      color: isEnriched ? 'var(--foreground)' : 'var(--muted-foreground)',
                      filter: isEnriched ? 'none' : 'blur(2px)',
                      transition: 'color 300ms, filter 300ms'
                    }}
                  >
                    {isEnriched ? c.name : c.name.replace(/(\s\w)\w+$/, '$1***')}
                  </span>
                  {justRevealed && (
                    <span
                      className="rounded-full px-1.5 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: 'var(--signal-funding-bg)',
                        color: 'var(--signal-funding-text)'
                      }}
                    >
                      New
                    </span>
                  )}
                </div>
                <span className="mt-0.5 block text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  {c.title} at {c.company}
                </span>
              </div>

              <span
                className="hidden shrink-0 text-xs sm:block"
                style={{
                  color: 'var(--muted-foreground)',
                  opacity: isEnriched ? 1 : 0,
                  transition: 'opacity 0.3s'
                }}
              >
                {c.email}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OutreachStep({
  streamedText,
  isStreaming
}: {
  streamedText: string;
  isStreaming: boolean;
}) {
  const email = EMAILS[0];

  return (
    <div className="p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
            Ramp
          </span>
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            James Park &middot; VP of Sales
          </span>
        </div>
        <div className="flex gap-1">
          {EMAILS.map((_, i) => (
            <span
              key={i}
              className="rounded-md px-2 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: i === 0 ? 'var(--primary)' : 'var(--muted)',
                color: i === 0 ? 'var(--primary-foreground)' : 'var(--muted-foreground)'
              }}
            >
              Email {i + 1}
            </span>
          ))}
        </div>
      </div>

      <div
        className="mb-4 rounded-lg"
        style={{
          border: '1px solid var(--border)',
          backgroundColor: 'var(--card)'
        }}
      >
        <div
          className="flex items-center gap-3 px-4 py-2.5"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            To
          </span>
          <span className="text-xs" style={{ color: 'var(--foreground)' }}>
            james.p@ramp.com
          </span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2.5">
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Subject
          </span>
          <span className="text-xs" style={{ color: 'var(--foreground)' }}>
            {email.subject}
          </span>
        </div>
      </div>

      <div
        className="rounded-lg px-4 py-3"
        style={{
          border: '1px solid var(--border)',
          backgroundColor: 'var(--card)'
        }}
      >
        <div
          className="min-h-35 text-xs leading-relaxed whitespace-pre-line"
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

        <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Plain text &middot; Under 80 words &middot; Signal-led opener
          </span>
        </div>
      </div>
    </div>
  );
}
