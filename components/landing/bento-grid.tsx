function SignalMock() {
  return (
    <div className="border-border bg-card mt-6 overflow-hidden rounded-xl border shadow-xs">
      <div className="border-border flex items-center gap-2 border-b px-4 py-2.5">
        <div className="bg-primary size-1.5 rounded-full" />
        <span className="text-muted-foreground text-2xs">3 signals detected</span>
      </div>
      <div className="divide-border divide-y">
        {[
          { label: 'Ramp: 6 BDR roles posted', score: 9 },
          { label: 'Lattice: EMEA expansion', score: 9 },
          { label: 'Ashby: Series C closed', score: 8 }
        ].map((s, i) => (
          <div key={i} className="border-primary/40 flex items-center gap-3 border-l-2 px-4 py-2.5">
            <div className="bg-primary/10 text-primary text-2xs flex size-6 shrink-0 items-center justify-center rounded-md font-semibold">
              {s.label[0]}
            </div>
            <span className="text-foreground/80 text-xs2 truncate">{s.label}</span>
            <div className="bg-primary/10 text-primary text-2xs ml-auto shrink-0 rounded-md px-1.5 py-0.5 font-semibold">
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
    <div className="border-border bg-card mt-6 overflow-hidden rounded-xl border shadow-xs">
      <div className="border-border flex items-center justify-between border-b px-4 py-2.5">
        <span className="text-muted-foreground text-2xs">Contacts at Ramp</span>
        <span className="bg-primary/10 text-primary text-2xs rounded-full px-1.5 py-0.5 font-medium">
          3 verified
        </span>
      </div>
      <div className="divide-border divide-y">
        {[
          { name: 'James Park', title: 'VP of Sales', initials: 'JP' },
          { name: 'Sarah Chen', title: 'Head of Growth', initials: 'SC' },
          { name: 'David Kim', title: 'RevOps Director', initials: 'DK' }
        ].map((c) => (
          <div key={c.initials} className="flex items-center gap-3 px-4 py-2.5">
            <div className="bg-primary/10 text-primary text-xs2 flex size-7 shrink-0 items-center justify-center rounded-full font-semibold">
              {c.initials}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-foreground text-xs2 font-medium">{c.name}</span>
              <span className="text-muted-foreground text-2xs ml-2">{c.title}</span>
            </div>
            <span className="bg-primary/10 text-primary text-2xs shrink-0 rounded-full px-2 py-0.5 font-medium">
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
    <div className="border-border bg-card mt-6 overflow-hidden rounded-xl border shadow-xs">
      <div className="border-border border-b px-4 py-2.5">
        <span className="text-muted-foreground text-2xs">Draft, Email 1 of 3</span>
      </div>
      <div className="divide-border text-xs2 divide-y">
        <div className="text-muted-foreground flex gap-3 px-4 py-2">
          <span className="text-2xs shrink-0">To</span>
          <span className="text-foreground/80">james.p@ramp.com</span>
        </div>
        <div className="text-muted-foreground flex gap-3 px-4 py-2">
          <span className="text-2xs shrink-0">Subject</span>
          <span className="text-primary font-medium">ramp&apos;s bdr hiring spree</span>
        </div>
      </div>
      <div className="space-y-1.5 px-4 py-3">
        {[65, 100, 90, 55, 80, 40, 20].map((w, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full ${i === 0 ? 'bg-primary/20' : 'bg-muted'}`}
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
      <div className="border-border flex items-center justify-between border-t px-4 py-2.5">
        <span className="text-muted-foreground text-2xs">
          Plain text · Signal-led · Under 80 words
        </span>
        <div className="bg-primary text-primary-foreground text-2xs cursor-pointer rounded-full px-2.5 py-1 font-semibold transition-opacity duration-150 hover:opacity-85">
          Send
        </div>
      </div>
    </div>
  );
}

function SequenceMock() {
  return (
    <div className="border-border bg-card mt-6 overflow-hidden rounded-xl border shadow-xs">
      <div className="border-border border-b px-4 py-2.5">
        <span className="text-muted-foreground text-2xs">3-touch sequence</span>
      </div>
      <div className="flex flex-col gap-2 p-3">
        {[
          { label: 'Email 1', desc: 'Signal-led opener', status: 'sent' },
          { label: 'Email 2', desc: 'Follow-up, different angle', status: 'scheduled' },
          { label: 'Email 3', desc: 'Final touch, value prop', status: 'draft' }
        ].map((step) => (
          <div key={step.label} className="bg-muted flex items-center gap-3 rounded-lg px-3 py-2.5">
            <div
              className={`size-2 shrink-0 rounded-full ${
                step.status === 'sent'
                  ? 'bg-primary'
                  : step.status === 'scheduled'
                    ? 'bg-primary/50'
                    : 'bg-primary/20'
              }`}
            />
            <div className="min-w-0 flex-1">
              <span className="text-foreground text-xs2 font-medium">{step.label}</span>
              <span className="text-muted-foreground text-2xs ml-2">{step.desc}</span>
            </div>
            <span
              className={`text-2xs shrink-0 rounded-full px-2 py-0.5 font-medium capitalize ${
                step.status === 'sent'
                  ? 'bg-primary/10 text-primary'
                  : step.status === 'scheduled'
                    ? 'bg-primary/10 text-primary/70'
                    : 'bg-muted-foreground/10 text-muted-foreground'
              }`}
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
        <p className="text-muted-foreground mb-3 text-xs font-medium tracking-widest uppercase">
          Platform
        </p>
        <h2
          className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl xl:text-[2.75rem]"
          style={{ textWrap: 'balance' }}
        >
          Everything you need for outbound
        </h2>
        <p className="text-muted-foreground mt-4 max-w-lg text-sm leading-relaxed sm:text-base">
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
              className={`border-border bg-card overflow-hidden rounded-xl border p-6 shadow-xs transition-shadow duration-200 hover:shadow-sm sm:p-8 ${f.span}`}
            >
              <p className="text-muted-foreground text-2xs font-medium tracking-widest uppercase">
                {f.eyebrow}
              </p>
              <h3 className="text-foreground mt-2 text-lg font-bold">{f.title}</h3>
              <p className="text-muted-foreground mt-1.5 max-w-md text-sm leading-relaxed">
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
