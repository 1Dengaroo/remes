function SignalMock() {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-(--landing-border-card) bg-(--landing-bg-card) shadow-(--landing-shadow-card)">
      <div className="flex items-center gap-2 border-b border-(--landing-border-card) px-4 py-2.5">
        <div className="size-1.5 rounded-full bg-(--landing-status-active)" />
        <span className="text-landing-fg-muted text-2xs">3 signals detected</span>
      </div>
      <div className="divide-y divide-(--landing-border-card)">
        {[
          {
            label: 'Ramp — 6 BDR roles posted',
            score: 9,
            tier: 'high',
            color: 'var(--landing-signal-job)'
          },
          {
            label: 'Lattice — EMEA expansion',
            score: 9,
            tier: 'high',
            color: 'var(--landing-signal-news)'
          },
          {
            label: 'Ashby — Series C closed',
            score: 8,
            tier: 'mid',
            color: 'var(--landing-signal-funding)'
          }
        ].map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-2.5"
            style={{ borderLeft: `2px solid ${s.color}` }}
          >
            <div
              className="text-2xs flex size-6 shrink-0 items-center justify-center rounded-md font-semibold"
              style={{
                backgroundColor: `color-mix(in srgb, ${s.color} 15%, transparent)`,
                color: s.color
              }}
            >
              {s.label[0]}
            </div>
            <span className="text-landing-fg-secondary text-xs2 truncate">{s.label}</span>
            <div
              className="text-2xs ml-auto shrink-0 rounded-md px-1.5 py-0.5 font-semibold"
              style={{
                backgroundColor: `var(--landing-score-${s.tier}-bg)`,
                color: `var(--landing-score-${s.tier}-text)`
              }}
            >
              {s.score}
            </div>
          </div>
        ))}
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
          {
            name: 'James Park',
            title: 'VP of Sales',
            initials: 'JP',
            color: 'var(--landing-signal-job)'
          },
          {
            name: 'Sarah Chen',
            title: 'Head of Growth',
            initials: 'SC',
            color: 'var(--landing-signal-news)'
          },
          {
            name: 'David Kim',
            title: 'RevOps Director',
            initials: 'DK',
            color: 'var(--landing-signal-linkedin)'
          }
        ].map((c) => (
          <div key={c.initials} className="flex items-center gap-3 px-4 py-2.5">
            <div
              className="text-xs2 flex size-7 shrink-0 items-center justify-center rounded-full font-semibold"
              style={{
                backgroundColor: `color-mix(in srgb, ${c.color} 15%, transparent)`,
                color: c.color
              }}
            >
              {c.initials}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-landing-fg text-xs2 font-medium">{c.name}</span>
              <span className="text-landing-fg-muted text-2xs ml-2">{c.title}</span>
            </div>
            <div
              className="text-2xs shrink-0 rounded-full px-2 py-0.5 font-medium"
              style={{
                backgroundColor: 'var(--landing-badge-verified-bg)',
                color: 'var(--landing-badge-verified-text)'
              }}
            >
              verified
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
          <span className="text-2xs shrink-0">To</span>
          <span className="text-landing-fg-secondary">james.p@ramp.com</span>
        </div>
        <div className="text-landing-fg-muted flex gap-3 px-4 py-2">
          <span className="text-2xs shrink-0">Subject</span>
          <span className="font-medium" style={{ color: 'var(--landing-accent)' }}>
            ramp&apos;s bdr hiring spree
          </span>
        </div>
      </div>
      <div className="space-y-1.5 px-4 py-3">
        {[65, 100, 90, 55, 80, 40, 20].map((w, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full"
            style={{
              width: `${w}%`,
              backgroundColor:
                i === 0 ? 'var(--landing-icon-active-bg)' : 'var(--landing-skel-base)'
            }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-(--landing-border-card) px-4 py-2.5">
        <span className="text-landing-fg-muted text-2xs">
          Plain text · Signal-led · Under 80 words
        </span>
        <div
          className="text-2xs cursor-pointer rounded-full px-2.5 py-1 font-semibold transition-opacity duration-150 hover:opacity-85"
          style={{
            backgroundColor: 'var(--landing-btn-primary-bg)',
            color: 'var(--landing-btn-primary-text)'
          }}
        >
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
          {
            label: 'Email 1',
            desc: 'Signal-led opener',
            status: 'sent',
            color: 'high',
            statusBg: 'var(--landing-score-high-bg)',
            statusText: 'var(--landing-score-high-text)'
          },
          {
            label: 'Email 2',
            desc: 'Follow-up, different angle',
            status: 'scheduled',
            color: 'mid',
            statusBg: 'var(--landing-score-mid-bg)',
            statusText: 'var(--landing-score-mid-text)'
          },
          {
            label: 'Email 3',
            desc: 'Final touch, value prop',
            status: 'draft',
            color: 'low',
            statusBg: 'var(--landing-score-low-bg)',
            statusText: 'var(--landing-score-low-text)'
          }
        ].map((step) => (
          <div
            key={step.label}
            className="flex items-center gap-3 rounded-lg bg-(--landing-skel-base) px-3 py-2.5"
          >
            <div
              className="text-2xs size-2 shrink-0 rounded-full"
              style={{ backgroundColor: `var(--landing-score-${step.color}-text)` }}
            />
            <div className="min-w-0 flex-1">
              <span className="text-landing-fg text-xs2 font-medium">{step.label}</span>
              <span className="text-landing-fg-muted text-2xs ml-2">{step.desc}</span>
            </div>
            <span
              className="text-2xs shrink-0 rounded-full px-2 py-0.5 font-medium capitalize"
              style={{ backgroundColor: step.statusBg, color: step.statusText }}
            >
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
    span: 'lg:col-span-2',
    mock: SignalMock
  },
  {
    title: 'Contact Discovery',
    eyebrow: 'Prospecting',
    description: 'Maps decision-makers with verified emails and LinkedIn profiles.',
    span: '',
    mock: ContactMock
  },
  {
    title: 'AI Outreach',
    eyebrow: 'Generation',
    description: 'Plain-text emails grounded in the trigger signal. Personalized, concise.',
    span: '',
    mock: EmailMock
  },
  {
    title: 'Smart Sequences',
    eyebrow: 'Automation',
    description: 'Multi-touch follow-ups that adapt. Each email takes a different angle.',
    span: 'lg:col-span-2',
    mock: SequenceMock
  }
];

export function BentoGrid() {
  return (
    <section className="py-20 sm:py-28">
      <div className="section-heading mb-12">
        <p className="text-landing-fg-muted mb-3 text-xs font-medium tracking-widest uppercase">
          Platform
        </p>
        <h2
          className="text-landing-fg text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl xl:text-[2.75rem]"
          style={{ textWrap: 'balance' }}
        >
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
              className={`overflow-hidden rounded-xl border border-(--landing-border-card) bg-(--landing-bg-card) p-6 shadow-(--landing-shadow-card) transition-shadow duration-200 hover:shadow-(--landing-shadow-card-hover) sm:p-8 ${f.span}`}
            >
              <p className="text-landing-fg-muted text-2xs font-medium tracking-widest uppercase">
                {f.eyebrow}
              </p>
              <h3 className="text-landing-fg mt-2 text-lg font-bold">{f.title}</h3>
              <p className="text-landing-fg-secondary mt-1.5 max-w-md text-sm leading-relaxed">
                {f.description}
              </p>
              <Mock />
            </div>
          );
        })}
      </div>
    </section>
  );
}
