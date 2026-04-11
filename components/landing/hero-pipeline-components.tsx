export function Skel({ className }: { className?: string }) {
  return <div className={`rounded-full bg-(--landing-skel-base) ${className ?? ''}`} />;
}

export function ScoreBadge({ tier, value }: { tier: 'high' | 'mid' | 'low'; value: string }) {
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

export function SignalPill({
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

export function CompanyRow({
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

export function ContactRow({
  name,
  initials,
  title
}: {
  name: string;
  initials: string;
  title: string;
}) {
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

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-(--landing-hero-badge-border) bg-(--landing-bg-card) shadow-(--landing-shadow-glow) ${className ?? ''}`}
      style={{ visibility: 'hidden' }}
    >
      {children}
    </div>
  );
}

export function resolveTokens(el: HTMLElement) {
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
