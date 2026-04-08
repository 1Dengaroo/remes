'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Users, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { COMPANIES, CONTACTS, EMAILS } from './mock-dashboard-data';
import { ThemeToggleButton } from './theme-toggle-button';
import { SignalStep } from './interactive-demo-signal-step';
import { ContactStep } from './interactive-demo-contact-step';
import { OutreachStep } from './interactive-demo-outreach-step';

const STEPS = [
  { label: 'Signals', icon: Search },
  { label: 'Contacts', icon: Users },
  { label: 'Outreach', icon: Mail }
] as const;

const STEP_DURATIONS = [5500, 4500, 11500];
const COMPANY_STAGGER = 800;
const CONTACT_STAGGER = 400;
const STREAM_SPEED = 6;

// Only show first 4 contacts for the demo
const DEMO_CONTACTS = CONTACTS.slice(0, 4);

export function InteractiveDemo() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [activeStep, setActiveStep] = useState(0);
  const [indicatorStep, setIndicatorStep] = useState(0);
  const [visibleCompanies, setVisibleCompanies] = useState(0);
  const [enrichedContacts, setEnrichedContacts] = useState(0);
  const [streamedText, setStreamedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hasEnteredView, setHasEnteredView] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const cycleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(false);
  const skipAnimationRef = useRef(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (cycleRef.current) clearTimeout(cycleRef.current);
    cancelAnimationFrame(rafRef.current);
  }, []);

  const goToStep = useCallback((step: number, userInitiated = false) => {
    if (userInitiated) {
      setPaused(true);
      skipAnimationRef.current = true;
      if (transitionRef.current) clearTimeout(transitionRef.current);
      setIndicatorStep(step);
      setActiveStep(step);
      return;
    }
    if (transitionRef.current) clearTimeout(transitionRef.current);
    setIndicatorStep(step);
    setTransitioning(true);
    transitionRef.current = setTimeout(() => {
      setActiveStep(step);
      setTransitioning(false);
    }, 150);
  }, []);

  const runStep = useCallback(
    (step: number) => {
      const immediate = skipAnimationRef.current;
      skipAnimationRef.current = false;
      clearTimeouts();

      if (step === 0) {
        if (immediate) {
          setVisibleCompanies(COMPANIES.length);
        } else {
          setVisibleCompanies(0);
          COMPANIES.forEach((_, i) => {
            const t = setTimeout(() => setVisibleCompanies(i + 1), (i + 1) * COMPANY_STAGGER);
            timeoutsRef.current.push(t);
          });
        }
      }

      if (step === 1) {
        if (immediate) {
          setEnrichedContacts(DEMO_CONTACTS.length);
        } else {
          setEnrichedContacts(0);
          DEMO_CONTACTS.forEach((_, i) => {
            const t = setTimeout(() => setEnrichedContacts(i + 1), 600 + i * CONTACT_STAGGER);
            timeoutsRef.current.push(t);
          });
        }
      }

      if (step === 2) {
        if (immediate) {
          setStreamedText(EMAILS[0].body);
          setIsStreaming(false);
        } else {
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
      }

      if (!pausedRef.current) {
        cycleRef.current = setTimeout(() => goToStep((step + 1) % 3), STEP_DURATIONS[step]);
      }
    },
    [clearTimeouts, goToStep]
  );

  useEffect(() => {
    if (!hasEnteredView) return;
    const t = setTimeout(() => runStep(activeStep), 0);
    return () => {
      clearTimeout(t);
      clearTimeouts();
      if (transitionRef.current) clearTimeout(transitionRef.current);
    };
  }, [activeStep, hasEnteredView, runStep, clearTimeouts]);

  return (
    <div
      ref={containerRef}
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
              <Button
                key={step.label}
                variant="ghost"
                size="sm"
                className="h-auto gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
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
              </Button>
            );
          })}
        </div>

        <ThemeToggleButton
          theme={theme}
          onToggle={() => {
            setPaused(true);
            setTheme(theme === 'dark' ? 'light' : 'dark');
          }}
        />
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
          {activeStep === 1 && (
            <ContactStep contacts={DEMO_CONTACTS} enrichedCount={enrichedContacts} />
          )}
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
