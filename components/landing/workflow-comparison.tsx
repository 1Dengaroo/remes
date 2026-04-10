import Image from 'next/image';
import { Clock, Zap } from 'lucide-react';

type Logo = { src: string; alt: string };

const STEPS = [
  {
    logos: [
      { src: '/logo/linkedin.svg', alt: 'LinkedIn' },
      { src: '/logo/x.jpeg', alt: 'X' },
      { src: '/logo/google.svg', alt: 'Google News' }
    ] satisfies Logo[],
    label: 'Find signals',
    without: 'Manually check LinkedIn, job boards, and news sites every morning',
    withRemes: 'Signals auto-detected across dozens of sources in real time',
    timeBefore: '20 min',
    timeAfter: '2 min'
  },
  {
    logos: [
      { src: '/logo/google.svg', alt: 'Google' },
      { src: '/logo/crunchbase.jpeg', alt: 'Crunchbase' },
      { src: '/logo/linkedin.svg', alt: 'LinkedIn' }
    ] satisfies Logo[],
    label: 'Research company',
    without: 'Google the company, read their blog, check Crunchbase for funding',
    withRemes: 'Company deep-researched instantly: funding, tech stack, headcount',
    timeBefore: '10 min',
    timeAfter: '3 min'
  },
  {
    logos: [
      { src: '/logo/apollo.jpeg', alt: 'Apollo' },
      { src: '/logo/linkedin.svg', alt: 'LinkedIn' },
      { src: '/logo/zoominfo.svg', alt: 'ZoomInfo' }
    ] satisfies Logo[],
    label: 'Find contacts',
    without: 'Search Apollo or LinkedIn for the right person, guess their email',
    withRemes: 'Decision makers mapped with verified emails automatically',
    timeBefore: '8 min',
    timeAfter: '2 min'
  },
  {
    logos: [
      { src: '/logo/gmail.svg', alt: 'Gmail' },
      { src: '/logo/google.svg', alt: 'Google Sheets' },
      { src: '/logo/chatgpt.svg', alt: 'ChatGPT' }
    ] satisfies Logo[],
    label: 'Write the email',
    without: 'Copy a template, swap in the company name, hope it sounds personal',
    withRemes: 'Signal-led email drafted, referencing the exact trigger and person',
    timeBefore: '7 min',
    timeAfter: '3 min'
  }
];

function LogoRow({ logos }: { logos: Logo[] }) {
  return (
    <div className="mt-0.5 flex shrink-0 items-center gap-1.5">
      {logos.map((logo) => (
        <Image
          key={logo.alt}
          src={logo.src}
          alt={logo.alt}
          width={18}
          height={18}
          className="rounded-sm"
        />
      ))}
    </div>
  );
}

const TOTAL_BEFORE = '45 min';
const TOTAL_AFTER = '~10 min';

export function WorkflowComparison() {
  return (
    <section className="scroll-mt-16 py-24 sm:py-36">
      <div className="mb-14 sm:mb-20">
        <p className="text-landing-fg-muted mb-3 text-xs font-medium tracking-widest uppercase">
          The difference
        </p>
        <h2
          className="text-landing-fg text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
          style={{ textWrap: 'balance' }}
        >
          45 minutes of grunt work, or 10 with Remes
        </h2>
        <p className="text-landing-fg-secondary mt-4 max-w-lg text-sm leading-relaxed">
          Every prospect takes the same four steps. The only question is whether you do them
          manually or let Remes handle it.
        </p>
      </div>

      {/* Comparison grid */}
      <div className="space-y-3">
        {/* Header row */}
        <div className="hidden grid-cols-[1fr_1fr] gap-3 px-4 lg:grid">
          <div className="flex items-center gap-2">
            <Clock className="text-landing-fg-muted size-3.5" />
            <span className="text-landing-fg-muted text-xs font-medium tracking-wide uppercase">
              Without Remes
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="size-3.5" style={{ color: 'var(--landing-accent)' }} />
            <span
              className="text-xs font-medium tracking-wide uppercase"
              style={{ color: 'var(--landing-accent)' }}
            >
              With Remes
            </span>
          </div>
        </div>

        {/* Step rows */}
        {STEPS.map((step) => (
          <div key={step.label} className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr]">
            {/* Without */}
            <div className="rounded-xl border border-(--landing-border-card) bg-(--landing-bg-card) px-5 py-4 shadow-(--landing-shadow-card)">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LogoRow logos={step.logos} />
                  <span className="text-landing-fg text-sm font-medium">{step.label}</span>
                </div>
                <span className="text-landing-fg-muted text-2xs shrink-0 rounded-full bg-(--landing-skel-base) px-2 py-0.5 font-medium">
                  ~{step.timeBefore}
                </span>
              </div>
              <p className="text-landing-fg-secondary mt-2 text-xs leading-relaxed">
                {step.without}
              </p>
            </div>

            {/* With Remes */}
            <div
              className="rounded-xl border px-5 py-4"
              style={{
                borderColor: 'var(--landing-accent-light)',
                backgroundColor: 'rgba(86, 67, 204, 0.03)',
                boxShadow: 'var(--landing-shadow-card)'
              }}
            >
              <div className="flex items-start gap-3.5">
                <Image
                  src="/remes-logo.png"
                  alt="Remes"
                  width={22}
                  height={22}
                  className="mt-0.5 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-landing-fg text-sm font-medium">{step.label}</span>
                    <span
                      className="text-2xs shrink-0 rounded-full px-2 py-0.5 font-medium"
                      style={{
                        backgroundColor: 'rgba(86, 67, 204, 0.1)',
                        color: 'var(--landing-accent)'
                      }}
                    >
                      {step.timeAfter}
                    </span>
                  </div>
                  <p className="text-landing-fg-secondary mt-1.5 text-xs leading-relaxed">
                    {step.withRemes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Total row */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr]">
          <div className="flex items-center justify-between rounded-xl border border-(--landing-border-card) bg-(--landing-bg-card) px-5 py-4 shadow-(--landing-shadow-card)">
            <span className="text-landing-fg text-sm font-semibold">Total per prospect</span>
            <span className="text-landing-fg-muted text-sm font-semibold">{TOTAL_BEFORE}</span>
          </div>
          <div
            className="flex items-center justify-between rounded-xl border px-5 py-4"
            style={{
              borderColor: 'var(--landing-accent)',
              backgroundColor: 'rgba(86, 67, 204, 0.06)',
              boxShadow: 'var(--landing-shadow-card), 0 0 20px rgba(86, 67, 204, 0.08)'
            }}
          >
            <span className="text-landing-fg text-sm font-semibold">Total per prospect</span>
            <span className="text-sm font-semibold" style={{ color: 'var(--landing-accent)' }}>
              {TOTAL_AFTER}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <p className="text-landing-fg-muted mt-8 text-center text-sm">
        At 50 prospects per week, that&apos;s{' '}
        <span className="text-landing-fg font-medium">29 hours saved every week</span>.
      </p>
    </section>
  );
}
