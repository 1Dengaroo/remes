'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

function Skel({ className }: { className?: string }) {
  return <div className={`rounded-full bg-(--landing-skel-base) ${className ?? ''}`} />;
}

function ScoreBadge({ tier, value }: { tier: 'high' | 'mid' | 'low'; value: string }) {
  return (
    <div
      className="score-badge text-2xs flex size-7 items-center justify-center rounded-lg font-bold opacity-0"
      style={{
        backgroundColor: `var(--landing-score-${tier}-bg)`,
        color: `var(--landing-score-${tier}-text)`
      }}
    >
      {value}
    </div>
  );
}

const SIGNAL_COLORS: Record<string, string> = {
  purple: 'bg-(--landing-signal-job)/20 text-(--landing-accent-light)',
  emerald: 'bg-(--landing-signal-funding)/20 text-(--landing-signal-funding)',
  red: 'bg-(--landing-signal-news)/20 text-(--landing-signal-news)',
  amber: 'bg-(--landing-signal-jd)/20 text-(--landing-signal-jd)'
};

function SignalPill({
  color,
  label
}: {
  color: 'purple' | 'emerald' | 'red' | 'amber';
  label: string;
}) {
  return (
    <span
      className={`signal-pill text-2xs inline-flex items-center rounded px-1.5 py-0.5 font-medium opacity-0 ${SIGNAL_COLORS[color]}`}
    >
      {label}
    </span>
  );
}

function CompanyRow({
  name,
  initials,
  meta,
  className,
  tier,
  score,
  signals
}: {
  name: string;
  initials: string;
  meta: string;
  className?: string;
  tier: 'high' | 'mid' | 'low';
  score: string;
  signals: Array<{ color: 'purple' | 'emerald' | 'red' | 'amber'; label: string }>;
}) {
  return (
    <div className={`company-row rounded-lg px-4 py-3.5 ${className ?? ''}`}>
      <div className="flex items-center gap-3">
        <div className="company-icon text-2xs text-landing-fg-muted flex size-8 shrink-0 items-center justify-center rounded-lg bg-(--landing-skel-base) font-semibold">
          {initials}
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="relative flex items-center gap-2">
            <span className="company-name text-landing-fg text-sm2 font-medium opacity-0">
              {name}
            </span>
            <span className="company-meta text-landing-fg-muted text-2xs opacity-0">{meta}</span>
            <div className="company-name-skel pointer-events-none absolute inset-0 flex items-center gap-2">
              <Skel className="h-3.5 w-14" />
              <Skel className="h-2.5 w-28" />
            </div>
          </div>
          <Skel className="company-desc h-2.5 w-5/6" />
        </div>
        <ScoreBadge tier={tier} value={score} />
      </div>
      <div className="mt-2.5 flex items-center gap-2">
        {signals.map((s, i) => (
          <SignalPill key={i} color={s.color} label={s.label} />
        ))}
        <Skel className="signal-desc h-2.5 flex-1 opacity-0" />
      </div>
    </div>
  );
}

function ContactRow({ name, initials, title }: { name: string; initials: string; title: string }) {
  return (
    <div className="contact-row flex items-center gap-3 px-4 py-3">
      <div className="contact-avatar text-2xs text-landing-fg-muted flex size-8 shrink-0 items-center justify-center rounded-full bg-(--landing-skel-base) font-medium">
        {initials}
      </div>
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="contact-name text-landing-fg text-sm2 font-medium">{name}</span>
          <svg
            className="contact-linkedin text-landing-fg-muted size-3 opacity-0"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          <span
            className="contact-badge text-2xs rounded-full px-1.5 py-0.5 font-medium opacity-0"
            style={{
              backgroundColor: 'var(--landing-badge-verified-bg)',
              color: 'var(--landing-badge-verified-text)'
            }}
          >
            Verified
          </span>
        </div>
        <span className="text-landing-fg-muted text-xs2">{title}</span>
      </div>
      <Skel className="contact-email h-2.5 w-25" />
    </div>
  );
}

function EmailLine({ className, width }: { className?: string; width: string }) {
  return (
    <div className={`email-line overflow-hidden ${className ?? ''}`} style={{ width }}>
      <div className="email-line-fill relative h-full w-0 overflow-hidden rounded-full bg-(--landing-skel-base)">
        <div className="email-shimmer absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/8 to-transparent opacity-0" />
      </div>
    </div>
  );
}

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-(--landing-hero-badge-border) bg-(--landing-bg-card) shadow-(--landing-shadow-glow) ${className ?? ''}`}
      style={{ visibility: 'hidden' }}
    >
      {children}
    </div>
  );
}

function resolveTokens(el: HTMLElement) {
  const s = getComputedStyle(el);
  const get = (token: string) => s.getPropertyValue(token).trim();
  return {
    statusActive: get('--landing-status-active'),
    statusActiveGlow: get('--landing-status-active-glow'),
    iconActiveBg: get('--landing-icon-active-bg'),
    iconActiveText: get('--landing-icon-active-text'),
    skelBright: get('--landing-skel-bright'),
    skelDim: get('--landing-skel-dim'),
    avatarEnrichedBg: get('--landing-avatar-enriched-bg'),
    avatarEnrichedText: get('--landing-avatar-enriched-text'),
    rowActiveBg: get('--landing-row-active-bg'),
    rowActiveBorder: get('--landing-row-active-border')
  };
}

export function HeroPipeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const t = resolveTokens(containerRef.current);
      const tl = gsap.timeline({ delay: 0.8 });

      /* ── Layer 1: Signals ── */

      tl.to('.signal-card', { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' });

      tl.to(
        '.header-dot',
        {
          backgroundColor: t.statusActive,
          boxShadow: t.statusActiveGlow,
          duration: 0.4,
          ease: 'power2.out'
        },
        '-=0.2'
      );
      tl.to('.status-text', { opacity: 1, duration: 0.3, ease: 'power2.out' }, '<0.1');
      tl.to('.signals-header', { opacity: 1, duration: 0.3, ease: 'power2.out' }, '+=0.1');

      tl.to('.company-row .company-icon', {
        backgroundColor: t.iconActiveBg,
        color: t.iconActiveText,
        duration: 0.35,
        stagger: 0.1,
        ease: 'power1.out'
      });

      tl.to(
        '.company-name-skel',
        { opacity: 1, duration: 0.3, stagger: 0.1, ease: 'power1.out' },
        '<0.05'
      );

      tl.to(
        '.company-row .company-desc',
        { backgroundColor: t.skelBright, duration: 0.3, stagger: 0.1, ease: 'power1.out' },
        '<0.05'
      );

      tl.to(
        '.score-badge',
        { opacity: 1, scale: 1, duration: 0.35, stagger: 0.08, ease: 'back.out(2)' },
        '-=0.15'
      );

      tl.to(
        '.signal-pill',
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.04, ease: 'power2.out' },
        '-=0.2'
      );
      tl.to(
        '.signal-desc',
        {
          opacity: 1,
          backgroundColor: t.skelDim,
          duration: 0.3,
          stagger: 0.04,
          ease: 'power1.out'
        },
        '<0.1'
      );

      tl.to(
        '.company-name-skel',
        { opacity: 0, duration: 0.25, stagger: 0.08, ease: 'power1.in' },
        '+=0.2'
      );
      tl.to(
        '.company-row .company-name',
        { opacity: 1, duration: 0.3, stagger: 0.08, ease: 'power1.out' },
        '<0.1'
      );
      tl.to(
        '.company-row .company-meta',
        { opacity: 1, duration: 0.3, stagger: 0.08, ease: 'power1.out' },
        '<0.05'
      );

      tl.to(
        '.company-row-active',
        {
          backgroundColor: t.rowActiveBg,
          borderColor: t.rowActiveBorder,
          duration: 0.3,
          ease: 'power1.out'
        },
        '-=0.2'
      );
      tl.to('.match-count', { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, '-=0.1');

      /* ── Layer 2: Contacts ── */

      tl.to('.contact-card', { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '+=1.3');
      tl.to('.signal-card', { scale: 0.98, opacity: 0.85, duration: 0.4, ease: 'power2.out' }, '<');

      tl.to('.contacts-header', { opacity: 1, duration: 0.3, ease: 'power2.out' }, '-=0.2');

      tl.to('.contact-avatar', {
        backgroundColor: t.avatarEnrichedBg,
        color: t.avatarEnrichedText,
        duration: 0.3,
        stagger: 0.1,
        ease: 'power1.out'
      });
      tl.to(
        '.contact-name',
        { opacity: 1, duration: 0.3, stagger: 0.1, ease: 'power1.out' },
        '<0.05'
      );
      tl.to(
        '.contact-linkedin',
        { opacity: 1, duration: 0.2, stagger: 0.1, ease: 'power2.out' },
        '<0.1'
      );
      tl.to(
        '.contact-badge',
        { opacity: 1, scale: 1, duration: 0.3, stagger: 0.1, ease: 'back.out(2)' },
        '-=0.1'
      );
      tl.to(
        '.contact-email',
        { backgroundColor: t.skelBright, duration: 0.3, stagger: 0.1, ease: 'power1.out' },
        '<'
      );
      tl.to(
        '.enriched-count',
        { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' },
        '-=0.1'
      );

      /* ── Layer 3: Email ── */

      tl.to('.email-card', { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '+=1.3');
      tl.to(
        '.contact-card',
        { scale: 0.98, opacity: 0.85, duration: 0.4, ease: 'power2.out' },
        '<'
      );
      tl.to('.signal-card', { scale: 0.96, opacity: 0.7, duration: 0.4, ease: 'power2.out' }, '<');

      tl.to('.email-status', { opacity: 1, duration: 0.3, ease: 'power2.out' }, '-=0.2');
      tl.to('.email-label', { opacity: 1, duration: 0.3, ease: 'power2.out' }, '<0.05');

      tl.to(
        '.email-field',
        { backgroundColor: t.skelBright, duration: 0.25, stagger: 0.1, ease: 'power1.out' },
        '-=0.1'
      );

      const lines = [
        { sel: '.eline-0', dur: 0.15 },
        { sel: '.eline-1', dur: 0.25 },
        { sel: '.eline-2', dur: 0.25 },
        { sel: '.eline-3', dur: 0.2 },
        { sel: '.eline-4', dur: 0.25 },
        { sel: '.eline-5', dur: 0.2 },
        { sel: '.eline-6', dur: 0.25 },
        { sel: '.eline-7', dur: 0.18 },
        { sel: '.eline-8', dur: 0.15 },
        { sel: '.eline-9', dur: 0.1 }
      ];

      lines.forEach((l, i) => {
        const offset = i === 0 ? '+=0.05' : '-=0.02';
        tl.to(
          `${l.sel} .email-line-fill`,
          { width: '100%', duration: l.dur, ease: 'none' },
          offset
        );
        tl.to(
          `${l.sel} .email-shimmer`,
          {
            opacity: 1,
            x: '200%',
            duration: 0.4,
            ease: 'power1.in',
            onComplete() {
              gsap.set(`${l.sel} .email-shimmer`, { opacity: 0, x: '-100%' });
            }
          },
          '>-0.15'
        );
      });

      tl.to('.email-footer-text', { opacity: 1, duration: 0.25, ease: 'power2.out' }, '-=0.1');
      tl.to(
        '.practice-pill',
        { opacity: 1, y: 0, duration: 0.25, stagger: 0.06, ease: 'power2.out' },
        '<'
      );
      tl.to('.send-btn', { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, '-=0.1');

      gsap.set('.signal-card', { autoAlpha: 0, y: 20 });
      gsap.set('.contact-card', { autoAlpha: 0, y: 24 });
      gsap.set('.email-card', { autoAlpha: 0, y: 30 });
      gsap.set('.status-text', { opacity: 0 });
      gsap.set('.signals-header', { opacity: 0 });
      gsap.set('.company-row .company-name', { opacity: 0 });
      gsap.set('.company-row .company-meta', { opacity: 0 });
      gsap.set('.score-badge', { opacity: 0, scale: 0.8 });
      gsap.set('.signal-pill', { opacity: 0, x: -8 });
      gsap.set('.signal-desc', { opacity: 0 });
      gsap.set('.match-count', { opacity: 0, scale: 0.8 });
      gsap.set('.contacts-header', { opacity: 0 });
      gsap.set('.contact-name', { opacity: 0.4 });
      gsap.set('.contact-linkedin', { opacity: 0 });
      gsap.set('.contact-badge', { opacity: 0, scale: 0.8 });
      gsap.set('.enriched-count', { opacity: 0, scale: 0.8 });
      gsap.set('.email-status', { opacity: 0 });
      gsap.set('.email-label', { opacity: 0 });
      gsap.set('.email-footer-text', { opacity: 0 });
      gsap.set('.practice-pill', { opacity: 0, y: 4 });
      gsap.set('.send-btn', { opacity: 0, scale: 0.8 });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative hidden h-80 w-200 lg:flex lg:justify-center xl:h-90 xl:w-240"
    >
      <Card className="signal-card absolute top-0 left-1/2 w-190 -translate-x-1/2 xl:w-230">
        <div className="flex items-center justify-between border-b border-(--landing-border-card) px-5 py-3">
          <div className="flex items-center gap-2.5">
            <div className="header-dot size-2 rounded-full bg-(--landing-skel-base)" />
            <span className="status-text text-landing-fg-secondary text-xs2 font-medium">
              Scanning signals...
            </span>
          </div>
          <Skel className="h-4.5 w-18" />
        </div>

        <div>
          <div className="signals-header flex items-center justify-between px-5 py-2.5">
            <span className="text-landing-fg-muted text-2xs font-medium tracking-wide uppercase">
              Matched Companies
            </span>
            <span className="match-count text-landing-fg-muted text-2xs rounded-full bg-(--landing-skel-base) px-2 py-0.5 font-medium opacity-0">
              3 found
            </span>
          </div>

          <div className="space-y-0.5 px-2 pb-2.5">
            <CompanyRow
              name="Remes"
              initials="Re"
              meta="Sales Tech · Seed"
              className="company-row-active rounded-lg border border-transparent"
              tier="high"
              score="9"
              signals={[
                { color: 'purple', label: 'Job Posting' },
                { color: 'emerald', label: 'Funding' }
              ]}
            />
            <CompanyRow
              name="Lattice"
              initials="La"
              meta="HR Tech · Series F"
              tier="mid"
              score="8"
              signals={[{ color: 'red', label: 'News' }]}
            />
            <CompanyRow
              name="Ashby"
              initials="As"
              meta="Recruiting · Series C"
              tier="high"
              score="9"
              signals={[
                { color: 'purple', label: 'Job Posting' },
                { color: 'amber', label: 'Product' }
              ]}
            />
          </div>
        </div>
      </Card>

      <Card className="contact-card absolute top-12 left-1/2 w-190 -translate-x-1/2 xl:top-14 xl:w-230">
        <div className="contacts-header flex items-center justify-between border-b border-(--landing-border-card) px-5 py-3">
          <span className="text-landing-fg-secondary text-xs2 font-medium">Contacts at Remes</span>
          <span
            className="enriched-count text-2xs rounded-full px-2 py-0.5 font-medium opacity-0"
            style={{
              backgroundColor: 'var(--landing-badge-verified-bg)',
              color: 'var(--landing-badge-verified-text)'
            }}
          >
            3 enriched
          </span>
        </div>

        <div className="space-y-0.5 px-2 py-2">
          <ContactRow name="Kenny" initials="KL" title="kenny@remes.so" />
          <ContactRow name="Andy" initials="AD" title="andy@remes.so" />
          <ContactRow name="Josh Besse" initials="JB" title="josh.besse@remes.so" />
        </div>
      </Card>

      <Card className="email-card absolute top-24 left-1/2 w-190 -translate-x-1/2 xl:top-28 xl:w-230">
        <div className="flex items-center justify-between border-b border-(--landing-border-card) px-5 py-3">
          <span className="email-status text-landing-fg-secondary text-xs2 font-medium">
            Generating outreach
          </span>
          <span className="email-label text-landing-fg-muted text-2xs">Email 1 of 3</span>
        </div>

        <div className="mx-5 divide-y divide-(--landing-border-card)">
          <div className="flex items-center gap-3 py-2.5">
            <span className="email-label text-landing-fg-muted text-2xs">To</span>
            <span className="email-label text-landing-fg-secondary text-xs2">kenny@remes.so</span>
          </div>
          <div className="flex items-center gap-3 py-2.5">
            <span className="email-label text-landing-fg-muted text-2xs">Subject</span>
            <span className="email-label text-landing-fg-secondary text-xs2">
              remes&apos; outbound automation
            </span>
          </div>
        </div>

        <div className="mx-5 border-t border-(--landing-border-card)" />

        <div className="space-y-1.75 px-5 pt-3.5 pb-4">
          <EmailLine className="eline-0 h-2" width="28%" />
          <div className="h-0.75" />
          <EmailLine className="eline-1 h-2" width="100%" />
          <EmailLine className="eline-2 h-2" width="96%" />
          <EmailLine className="eline-3 h-2" width="68%" />
          <div className="h-0.75" />
          <EmailLine className="eline-4 h-2" width="92%" />
          <EmailLine className="eline-5 h-2" width="74%" />
          <div className="h-0.75" />
          <EmailLine className="eline-6 h-2" width="100%" />
          <EmailLine className="eline-7 h-2" width="58%" />
          <div className="h-0.75" />
          <EmailLine className="eline-8 h-2" width="38%" />
          <div className="h-0.75" />
          <EmailLine className="eline-9 h-2" width="14%" />
        </div>

        <div className="border-t border-(--landing-border-card) px-5 py-2">
          <div className="flex flex-wrap gap-1.5">
            {['Plain text', 'Signal-led', 'Under 80 words', 'One CTA'].map((t) => (
              <span
                key={t}
                className="practice-pill text-2xs text-landing-fg-muted rounded-full bg-(--landing-skel-base) px-2 py-0.5"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-(--landing-border-card) px-5 py-2.5">
          <span className="email-footer-text text-landing-fg-muted text-2xs">
            Personalized from signal data
          </span>
          <div className="send-btn text-2xs text-landing-fg-secondary flex h-6.5 items-center rounded-full bg-(--landing-skel-base) px-3.5 font-medium opacity-0">
            Send
          </div>
        </div>
      </Card>
    </div>
  );
}
