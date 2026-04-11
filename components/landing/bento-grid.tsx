function SignalMock() {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-(--landing-border-card) bg-(--landing-bg-card) shadow-(--landing-shadow-card)">
      <div className="flex items-center gap-2 border-b border-(--landing-border-card) px-4 py-2.5">
        <div className="size-1.5 rounded-full bg-(--landing-accent)" />
        <span className="text-landing-fg-muted text-2xs">3 signals detected</span>
      </div>
      <div className="divide-y divide-(--landing-border-card)">
        {[
          { label: 'Ramp: 6 BDR roles posted', score: 9 },
          { label: 'Lattice: EMEA expansion', score: 9 },
          { label: 'Ashby: Series C closed', score: 8 }
        ].map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-3 border-l-2 px-4 py-2.5"
            style={{ borderLeftColor: 'var(--landing-accent)' }}
          >
            <div
              className="text-2xs flex size-6 shrink-0 items-center justify-center rounded-md font-semibold"
              style={{ backgroundColor: 'rgba(86, 67, 204, 0.1)', color: 'var(--landing-accent)' }}
            >
              {s.label[0]}
            </div>
            <span className="text-landing-fg-secondary truncate text-xs">{s.label}</span>
            <div
              className="text-2xs ml-auto shrink-0 rounded-md px-1.5 py-0.5 font-semibold"
              style={{ backgroundColor: 'rgba(86, 67, 204, 0.1)', color: 'var(--landing-accent)' }}
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
          style={{ backgroundColor: 'rgba(86, 67, 204, 0.1)', color: 'var(--landing-accent)' }}
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
            <div
              className="flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
              style={{ backgroundColor: 'rgba(86, 67, 204, 0.1)', color: 'var(--landing-accent)' }}
            >
              {c.initials}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-landing-fg text-xs font-medium">{c.name}</span>
              <span className="text-landing-fg-muted text-2xs ml-2">{c.title}</span>
            </div>
            <span
              className="text-2xs shrink-0 rounded-full px-2 py-0.5 font-medium"
              style={{ backgroundColor: 'rgba(86, 67, 204, 0.1)', color: 'var(--landing-accent)' }}
            >
              verified
            </span>
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
        <span className="text-landing-fg-muted text-2xs">Draft, Email 1 of 3</span>
      </div>
      <div className="divide-y divide-(--landing-border-card) text-xs">
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
              backgroundColor: i === 0 ? 'rgba(86, 67, 204, 0.2)' : 'var(--landing-skel-base)'
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
          style={{ backgroundColor: 'var(--landing-accent)', color: '#fff' }}
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
          { label: 'Email 1', desc: 'Signal-led opener', status: 'sent', opacity: 1 },
          {
            label: 'Email 2',
            desc: 'Follow-up, different angle',
            status: 'scheduled',
            opacity: 0.5
          },
          { label: 'Email 3', desc: 'Final touch, value prop', status: 'draft', opacity: 0.2 }
        ].map((step) => (
          <div
            key={step.label}
            className="flex items-center gap-3 rounded-lg bg-(--landing-skel-base) px-3 py-2.5"
          >
            <div
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: 'var(--landing-accent)', opacity: step.opacity }}
            />
            <div className="min-w-0 flex-1">
              <span className="text-landing-fg text-xs font-medium">{step.label}</span>
              <span className="text-landing-fg-muted text-2xs ml-2">{step.desc}</span>
            </div>
            <span
              className="text-2xs shrink-0 rounded-full px-2 py-0.5 font-medium capitalize"
              style={{
                backgroundColor:
                  step.status === 'draft' ? 'var(--landing-skel-base)' : 'rgba(86, 67, 204, 0.1)',
                color: step.status === 'draft' ? 'var(--landing-fg-muted)' : 'var(--landing-accent)'
              }}
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
          From signal to sent. One platform handles research, prospecting, and personalized
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
