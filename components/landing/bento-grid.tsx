import { ArrowRight } from 'lucide-react';

function SignalMock() {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-(--landing-border-card) bg-(--landing-bg-card) shadow-(--landing-shadow-card)">
      <div className="flex items-center gap-2 border-b border-(--landing-border-card) px-4 py-2.5">
        <div className="size-1.5 rounded-full bg-(--landing-status-active)" />
        <span className="text-landing-fg-muted text-2xs">3 signals detected</span>
      </div>
      <div className="divide-y divide-(--landing-border-card)">
        {['Ramp — 6 BDR roles posted', 'Lattice — EMEA expansion', 'Ashby — Series C closed'].map(
          (s, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5">
              <div
                className="text-2xs flex size-6 shrink-0 items-center justify-center rounded-md font-semibold"
                style={{
                  backgroundColor: 'var(--landing-icon-active-bg)',
                  color: 'var(--landing-icon-active-text)'
                }}
              >
                {s[0]}
              </div>
              <span className="text-landing-fg-secondary text-xs2 truncate">{s}</span>
              <div
                className="text-2xs ml-auto shrink-0 rounded-md px-1.5 py-0.5 font-semibold"
                style={{
                  backgroundColor: `var(--landing-score-${i < 2 ? 'high' : 'mid'}-bg)`,
                  color: `var(--landing-score-${i < 2 ? 'high' : 'mid'}-text)`
                }}
              >
                {i < 2 ? '9' : '8'}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function ContactMock() {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-(--landing-border-card) bg-(--landing-bg-card) shadow-(--landing-shadow-card)">
      <div className="flex items-center justify-between border-b border-(--landing-border-card) px-4 py-2.5">
        <span className="text-landing-fg-muted text-2xs">Contacts at Ramp</span>
        <span
          className="text-2xs rounded-full px-1.5 py-0.5 font-medium"
          style={{
            backgroundColor: 'var(--landing-badge-verified-bg)',
            color: 'var(--landing-badge-verified-text)'
          }}
        >
          3 verified
        </span>
      </div>
      <div className="divide-y divide-(--landing-border-card)">
        {[
          { name: 'James Park', title: 'VP of Sales', initials: 'JP' },
          { name: 'Sarah Chen', title: 'Head of Growth', initials: 'SC' },
          { name: 'David Kim', title: 'RevOps Director', initials: 'DK' }
        ].map((c) => (
          <div key={c.initials} className="flex items-center gap-3 px-4 py-2.5">
            <div className="text-landing-fg-muted text-2xs flex size-7 shrink-0 items-center justify-center rounded-full bg-(--landing-skel-base) font-medium">
              {c.initials}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-landing-fg text-xs2 font-medium">{c.name}</span>
              <span className="text-landing-fg-muted text-2xs ml-2">{c.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmailMock() {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-(--landing-border-card) bg-(--landing-bg-card) shadow-(--landing-shadow-card)">
      <div className="border-b border-(--landing-border-card) px-4 py-2.5">
        <span className="text-landing-fg-muted text-2xs">Draft — Email 1 of 3</span>
      </div>
      <div className="text-xs2 divide-y divide-(--landing-border-card)">
        <div className="text-landing-fg-muted flex gap-3 px-4 py-2">
          <span className="text-2xs">To</span>
          <span className="text-landing-fg-secondary">james.p@ramp.com</span>
        </div>
        <div className="text-landing-fg-muted flex gap-3 px-4 py-2">
          <span className="text-2xs">Subject</span>
          <span className="text-landing-fg-secondary">ramp&apos;s bdr hiring spree</span>
        </div>
      </div>
      <div className="space-y-1.5 px-4 py-3">
        {[65, 100, 90, 55, 80, 40, 20].map((w, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full bg-(--landing-skel-base)"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-(--landing-border-card) px-4 py-2.5">
        <span className="text-landing-fg-muted text-2xs">
          Plain text · Signal-led · Under 80 words
        </span>
        <div className="text-2xs rounded-full bg-(--landing-skel-base) px-2.5 py-1 font-medium text-(--landing-fg-secondary)">
          Send
        </div>
      </div>
    </div>
  );
}

function SequenceMock() {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-(--landing-border-card) bg-(--landing-bg-card) shadow-(--landing-shadow-card)">
      <div className="border-b border-(--landing-border-card) px-4 py-2.5">
        <span className="text-landing-fg-muted text-2xs">3-touch sequence</span>
      </div>
      <div className="flex flex-col gap-2 p-3">
        {[
          { label: 'Email 1', desc: 'Signal-led opener', status: 'sent', color: 'high' },
          {
            label: 'Email 2',
            desc: 'Follow-up, different angle',
            status: 'scheduled',
            color: 'mid'
          },
          { label: 'Email 3', desc: 'Final touch, value prop', status: 'draft', color: 'low' }
        ].map((step) => (
          <div
            key={step.label}
            className="flex items-center gap-3 rounded-lg bg-(--landing-skel-base) px-3 py-2.5"
          >
            <div
              className="text-2xs size-2 shrink-0 rounded-full"
              style={{
                backgroundColor: `var(--landing-score-${step.color}-text)`
              }}
            />
            <div className="min-w-0 flex-1">
              <span className="text-landing-fg text-xs2 font-medium">{step.label}</span>
              <span className="text-landing-fg-muted text-2xs ml-2">{step.desc}</span>
            </div>
            <span className="text-landing-fg-muted text-2xs shrink-0 capitalize">
              {step.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const FEATURES = [
  {
    title: 'Signal Detection',
    eyebrow: 'Research',
    description: 'Monitors the web for buying signals and surfaces companies most likely to buy.',
    color: 'var(--landing-bento-purple)',
    span: 'lg:col-span-2',
    mock: SignalMock
  },
  {
    title: 'Contact Discovery',
    eyebrow: 'Prospecting',
    description: 'Maps decision-makers with verified emails and LinkedIn profiles.',
    color: 'var(--landing-bento-teal)',
    span: '',
    mock: ContactMock
  },
  {
    title: 'AI Outreach',
    eyebrow: 'Generation',
    description: 'Plain-text emails grounded in the trigger signal. Personalized, concise.',
    color: 'var(--landing-bento-rose)',
    span: '',
    mock: EmailMock
  },
  {
    title: 'Smart Sequences',
    eyebrow: 'Automation',
    description: 'Multi-touch follow-ups that adapt. Each email takes a different angle.',
    color: 'var(--landing-bento-amber)',
    span: 'lg:col-span-2',
    mock: SequenceMock
  }
];

export function BentoGrid() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mb-12">
        <p className="text-landing-fg-muted mb-3 text-xs font-medium tracking-widest uppercase">
          Platform
        </p>
        <h2 className="text-landing-fg text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          Everything you need for outbound
        </h2>
        <p className="text-landing-fg-secondary mt-4 max-w-lg text-sm leading-relaxed sm:text-base">
          From signal to sent — one platform handles research, prospecting, and personalized
          outreach.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {FEATURES.map((f) => {
          const Mock = f.mock;
          return (
            <div
              key={f.title}
              className={`group overflow-hidden rounded-2xl p-6 transition-shadow duration-200 hover:shadow-(--landing-shadow-card-hover) sm:p-8 ${f.span}`}
              style={{ backgroundColor: f.color }}
            >
              <p className="text-landing-fg-muted text-2xs font-medium tracking-widest uppercase">
                {f.eyebrow}
              </p>
              <h3 className="text-landing-fg mt-2 text-lg font-bold">{f.title}</h3>
              <p className="text-landing-fg-secondary mt-1.5 max-w-md text-sm leading-relaxed">
                {f.description}
              </p>
              <a
                href="#use-cases"
                className="text-landing-fg-muted hover:text-landing-fg mt-3 inline-flex items-center gap-1 text-xs font-medium transition-colors"
              >
                Learn more <ArrowRight className="size-3" />
              </a>
              <Mock />
            </div>
          );
        })}
      </div>
    </section>
  );
}
