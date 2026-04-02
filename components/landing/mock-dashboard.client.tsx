'use client';

/**
 * Mock UI panels for the showcase section.
 * Matches the real Remes app: company cards, contact enrichment, email editor.
 */

const SIGNAL_COLORS: Record<string, string> = {
  job_posting: 'bg-[#5643cc]/20 text-[#8a8fff]',
  funding: 'bg-emerald-500/15 text-emerald-400/80',
  news: 'bg-red-500/15 text-red-400/80',
  product_launch: 'bg-amber-500/15 text-amber-400/80'
};

const SIGNAL_LABELS: Record<string, string> = {
  job_posting: 'Job Posting',
  funding: 'Funding',
  news: 'News',
  product_launch: 'Launch'
};

export function MockSignalDashboard() {
  const companies = [
    {
      name: 'Ashby',
      industry: 'Recruiting',
      funding: '$30M Series C',
      matchReason: 'Building out data infrastructure, posted Snowflake roles',
      signals: [
        {
          type: 'job_posting',
          title: 'Data Engineer role mentions Snowflake, dbt',
          phrases: ['Snowflake', 'dbt', 'Data Engineer']
        }
      ]
    },
    {
      name: 'Vanta',
      industry: 'Security',
      funding: '$150M Series C',
      matchReason: 'New VP of Sales hired, likely retooling the sales stack',
      signals: [
        {
          type: 'news',
          title: 'Appointed new VP of Sales from Datadog',
          phrases: ['VP Sales', 'leadership change']
        },
        {
          type: 'product_launch',
          title: 'Launched AI-powered compliance automation',
          phrases: ['AI', 'compliance', 'automation']
        }
      ]
    }
  ];

  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/[0.08] bg-[#0c0d0f] shadow-[0_0_30px_rgba(255,255,255,0.04),0_0_60px_rgba(255,255,255,0.02)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.04] px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-green-400/70 shadow-[0_0_6px_rgba(74,222,128,0.4)]" />
          <span className="text-xs font-medium text-white/60">2 companies matched</span>
        </div>
        <div className="rounded-md bg-white/[0.04] px-2.5 py-1 text-[10px] text-white/30">
          B2B SaaS · 50–500 employees
        </div>
      </div>

      {/* Company rows */}
      <div className="divide-y divide-white/[0.03]">
        {companies.map((c, i) => (
          <div key={i} className="px-5 py-4">
            {/* Company header */}
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-[10px] font-semibold text-white/50">
                {c.name.slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white/80">{c.name}</span>
                  <span className="text-[10px] text-white/25">{c.industry}</span>
                </div>
                <div className="mt-0.5 text-[11px] text-white/30">{c.funding}</div>
              </div>
            </div>

            {/* Signals */}
            <div className="mt-3 space-y-2">
              {c.signals.map((s, j) => (
                <div key={j} className="flex items-start gap-2.5">
                  <span
                    className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[9px] font-medium ${SIGNAL_COLORS[s.type]}`}
                  >
                    {SIGNAL_LABELS[s.type]}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-xs text-white/55">{s.title}</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {s.phrases.map((p) => (
                        <span
                          key={p}
                          className="rounded-full bg-white/[0.04] px-1.5 py-0.5 text-[9px] text-white/25"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Match reason */}
            <div className="mt-2.5 text-[11px] leading-relaxed text-white/30 italic">
              {c.matchReason}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MockContactList() {
  const contacts = [
    {
      name: 'Rachel Torres',
      title: 'Head of Revenue',
      company: 'Campfire',
      email: 'rachel@campfire.com',
      enriched: true,
      hasLinkedIn: true
    },
    {
      name: 'David K***',
      title: 'VP of Sales',
      company: 'Ashby',
      email: null,
      enriched: false,
      hasLinkedIn: false
    },
    {
      name: 'Priya Sharma',
      title: 'Director of Sales Ops',
      company: 'Vanta',
      email: 'priya.sharma@vanta.com',
      enriched: true,
      hasLinkedIn: true
    },
    {
      name: 'Mike L***',
      title: 'Account Executive',
      company: 'Campfire',
      email: null,
      enriched: false,
      hasLinkedIn: false
    }
  ];

  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/[0.08] bg-[#0c0d0f] shadow-[0_0_30px_rgba(255,255,255,0.04),0_0_60px_rgba(255,255,255,0.02)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.04] px-5 py-3">
        <span className="text-xs font-medium text-white/60">Contacts</span>
        <span className="text-[10px] text-white/25">2 of 4 enriched</span>
      </div>

      {/* Contacts */}
      <div className="divide-y divide-white/[0.03]">
        {contacts.map((c, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3.5">
            {/* Avatar */}
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-xs font-medium text-white/40">
              {c.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .replace('*', '')}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-medium ${c.enriched ? 'text-white/80' : 'text-white/40'}`}
                >
                  {c.name}
                </span>
                {c.enriched && c.hasLinkedIn && (
                  <svg className="size-3 text-white/25" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                )}
              </div>
              <div className="mt-0.5 text-xs text-white/30">
                {c.title} at {c.company}
              </div>
            </div>

            {/* Email or Get Contact */}
            {c.enriched ? (
              <span className="hidden shrink-0 text-[11px] text-white/25 sm:block">{c.email}</span>
            ) : (
              <span className="shrink-0 rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px] font-medium text-white/40">
                Get Contact
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MockEmailPreview() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/[0.08] bg-[#0c0d0f] shadow-[0_0_30px_rgba(255,255,255,0.04),0_0_60px_rgba(255,255,255,0.02)]">
      {/* Email header with sequence tabs */}
      <div className="flex items-center justify-between border-b border-white/[0.04] px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-white/60">Campfire</span>
          <span className="text-[10px] text-white/25">Rachel Torres · Head of Revenue</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/60">
            Email 1
          </span>
          <span className="rounded-md bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/25">
            Email 2
          </span>
          <span className="rounded-md bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/25">
            Email 3
          </span>
        </div>
      </div>

      {/* Email fields */}
      <div className="space-y-0 divide-y divide-white/[0.03] border-b border-white/[0.04]">
        <div className="flex items-center gap-3 px-5 py-2.5">
          <span className="text-[11px] text-white/25">To</span>
          <span className="text-xs text-white/60">rachel@campfire.com</span>
        </div>
        <div className="flex items-center gap-3 px-5 py-2.5">
          <span className="text-[11px] text-white/25">Subject</span>
          <span className="text-xs text-white/60">Campfire&apos;s SDR ramp</span>
        </div>
      </div>

      {/* Email body */}
      <div className="px-5 py-4">
        <div className="space-y-3 text-xs leading-[1.7] text-white/45">
          <p>Hi Rachel,</p>
          <p>
            I saw Campfire just posted 4 SDR roles and an AE position. Scaling outbound that fast
            after a Series A usually means the team needs pipeline yesterday.
          </p>
          <p>
            We built Remes to solve exactly that. It detects buying signals like the ones
            you&apos;re creating right now, finds the right contacts, and writes the first email so
            your new reps hit quota faster.
          </p>
          <p>Worth a quick look?</p>
          <p className="text-white/30">Rachel</p>
        </div>
      </div>

      {/* Best practices note */}
      <div className="border-t border-white/[0.04] px-5 py-2">
        <p className="text-[10px] leading-relaxed text-white/20">
          Built on proven frameworks · Plain text · Under 80 words · No jargon · Signal-led opener ·
          One clear CTA
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-white/[0.04] px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-white/[0.04] px-3 py-1.5 text-[10px] text-white/30">
            Regenerate
          </div>
          <div className="flex items-center gap-1 text-[10px] text-white/20">
            <span>1</span>
            <span>/</span>
            <span>3</span>
          </div>
        </div>
        <div className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-medium text-white/60">
          Send
        </div>
      </div>
    </div>
  );
}
