'use client';

import { useState } from 'react';

/**
 * Interactive mock UI panels for the landing page.
 * Same text sizes as the real app, but more generous padding/spacing
 * for larger visual presence. Clickable elements throughout.
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

const COMPANIES = [
  {
    name: 'Ashby',
    industry: 'Recruiting',
    funding: '$30M Series C',
    score: 9,
    matchReason: 'Building out data infrastructure, posted Snowflake roles',
    signals: [
      {
        type: 'job_posting',
        title: 'Data Engineer role mentions Snowflake, dbt',
        phrases: ['Snowflake', 'dbt', 'Data Engineer']
      },
      {
        type: 'funding',
        title: 'Closed Series C with Benchmark',
        phrases: ['Series C', 'Benchmark', '$30M']
      }
    ]
  },
  {
    name: 'Lattice',
    industry: 'HR Tech',
    funding: '$328M Series F',
    score: 8,
    matchReason: 'Expanding into EMEA, building new sales org from scratch',
    signals: [
      {
        type: 'news',
        title: 'Opened London office, hiring EMEA sales lead',
        phrases: ['EMEA', 'expansion', 'sales lead']
      }
    ]
  },
  {
    name: 'Ramp',
    industry: 'Fintech',
    funding: '$300M Series D',
    score: 9,
    matchReason: 'Tripled headcount in 6 months, retooling outbound stack',
    signals: [
      {
        type: 'job_posting',
        title: 'Posted 6 BDR roles in the last 2 weeks',
        phrases: ['BDR', 'outbound', 'rapid hiring']
      },
      {
        type: 'funding',
        title: 'Raised $300M at $16B valuation',
        phrases: ['Series D', '$300M', 'growth']
      }
    ]
  }
];

export function MockSignalDashboard() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/8 bg-[#0c0d0f] shadow-[0_0_30px_rgba(255,255,255,0.04),0_0_60px_rgba(255,255,255,0.02)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/4 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-green-400/70 shadow-[0_0_6px_rgba(74,222,128,0.4)]" />
          <span className="text-xs font-medium text-white/60">
            {COMPANIES.length} companies matched
          </span>
        </div>
        <div className="rounded-md bg-white/4 px-2.5 py-1 text-[10px] text-white/30">
          B2B SaaS · 50–500 employees
        </div>
      </div>

      {/* Company rows */}
      <div className="divide-y divide-white/3">
        {COMPANIES.map((c, i) => {
          const isSelected = selected === i;
          return (
            <button
              key={i}
              type="button"
              className={`w-full px-6 py-5 text-left transition-colors duration-150 ${isSelected ? 'bg-white/4' : 'hover:bg-white/2'}`}
              onClick={() => setSelected(i)}
            >
              {/* Company header */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-semibold transition-colors duration-150 ${isSelected ? 'bg-[#5643cc]/20 text-[#8a8fff]' : 'bg-white/6 text-white/50'}`}
                >
                  {c.name.slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white/80">{c.name}</span>
                    <span className="text-[10px] text-white/25">{c.industry}</span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-white/30">{c.funding}</div>
                </div>
                <div
                  className="flex size-7 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold"
                  style={{
                    backgroundColor:
                      c.score >= 9
                        ? 'rgba(52,211,153,0.15)'
                        : c.score >= 8
                          ? 'rgba(96,165,250,0.15)'
                          : 'rgba(255,255,255,0.06)',
                    color:
                      c.score >= 9
                        ? 'rgba(52,211,153,0.8)'
                        : c.score >= 8
                          ? 'rgba(96,165,250,0.8)'
                          : 'rgba(255,255,255,0.4)'
                  }}
                >
                  {c.score}
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
                            className="rounded-full bg-white/4 px-1.5 py-0.5 text-[9px] text-white/25"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Match reason — always visible */}
              <div className="mt-2.5 text-[11px] leading-relaxed text-white/30 italic">
                {c.matchReason}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const CONTACTS = [
  {
    name: 'David Kim',
    title: 'VP of Sales',
    company: 'Ashby',
    email: 'david.k@ashby.com',
    enriched: true,
    hasLinkedIn: true
  },
  {
    name: 'Sarah Chen',
    title: 'Head of Growth',
    company: 'Lattice',
    email: 'sarah.c@lattice.com',
    enriched: true,
    hasLinkedIn: true
  },
  {
    name: 'James Park',
    title: 'VP of Sales',
    company: 'Ramp',
    email: 'james.p@ramp.com',
    enriched: false,
    hasLinkedIn: false
  },
  {
    name: 'Nina Patel',
    title: 'Director of Revenue Ops',
    company: 'Ashby',
    email: 'nina.p@ashby.com',
    enriched: false,
    hasLinkedIn: false
  },
  {
    name: 'Alex Rivera',
    title: 'Head of Partnerships',
    company: 'Ramp',
    email: 'alex.r@ramp.com',
    enriched: true,
    hasLinkedIn: true
  },
  {
    name: 'Tom Zhang',
    title: 'SDR Manager',
    company: 'Lattice',
    email: 'tom.z@lattice.com',
    enriched: false,
    hasLinkedIn: false
  }
];

export function MockContactList() {
  const [enriched, setEnriched] = useState<Set<number>>(
    new Set(CONTACTS.map((c, i) => (c.enriched ? i : -1)).filter((i) => i >= 0))
  );

  const handleEnrich = (idx: number) => {
    setEnriched((prev) => new Set([...prev, idx]));
  };

  const enrichedCount = enriched.size;

  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/8 bg-[#0c0d0f] shadow-[0_0_30px_rgba(255,255,255,0.04),0_0_60px_rgba(255,255,255,0.02)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/4 px-6 py-4">
        <span className="text-xs font-medium text-white/60">Contacts</span>
        <span className="text-[10px] text-white/25">
          {enrichedCount} of {CONTACTS.length} enriched
        </span>
      </div>

      {/* Contacts */}
      <div className="divide-y divide-white/3">
        {CONTACTS.map((c, i) => {
          const isEnriched = enriched.has(i);
          const wasOriginallyHidden = !c.enriched;
          const justRevealed = wasOriginallyHidden && isEnriched;

          return (
            <div
              key={i}
              className="flex items-center gap-4 px-6 py-4 transition-colors duration-150 hover:bg-white/2"
            >
              {/* Avatar */}
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/6 text-xs font-medium text-white/40">
                {c.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-medium ${isEnriched ? 'text-white/80' : 'text-white/40'}`}
                  >
                    {isEnriched ? c.name : c.name.replace(/(\s\w)\w+$/, '$1***')}
                  </span>
                  {isEnriched && c.hasLinkedIn && (
                    <svg className="size-3 text-white/25" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  )}
                  {justRevealed && (
                    <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-medium text-emerald-400/80">
                      New
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-xs text-white/30">
                  {c.title} at {c.company}
                </div>
              </div>

              {/* Email or Get Contact */}
              {isEnriched ? (
                <span className="hidden shrink-0 text-[11px] text-white/25 sm:block">
                  {c.email}
                </span>
              ) : (
                <button
                  type="button"
                  className="shrink-0 cursor-pointer rounded-full bg-white/6 px-2.5 py-1 text-[10px] font-medium text-white/40 transition-all duration-150 hover:bg-white/10 hover:text-white/60"
                  onClick={() => handleEnrich(i)}
                >
                  Get Contact
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/*
 * Emails match the Remes generation prompt:
 * - Plain text, no formatting
 * - Short paragraphs (1-2 sentences)
 * - Signal-led opener
 * - Email 1: 60-80 words, Email 2: under 45 words, Email 3: under 60 words
 * - Sign off with first name only
 * - No forbidden phrases
 */
const EMAILS = [
  {
    subject: "ramp's bdr hiring spree",
    body: 'Hi James,\n\nSaw Ramp posted 6 BDR roles in the last two weeks. Tripling outbound headcount after a $300M raise usually means pipeline targets just got aggressive.\n\nWe built Remes to detect signals like yours and write the first email automatically. One customer went from 0 to 47 qualified meetings in their first month.\n\nWorth a quick look?\n\nKenny'
  },
  {
    subject: "Re: ramp's bdr hiring spree",
    body: 'Hi James,\n\nQuick follow-up. Teams like Ashby and Lattice use Remes to cut their prospecting time by 80%. Figured it might be relevant as you scale the BDR org.\n\nKenny'
  },
  {
    subject: "Re: ramp's bdr hiring spree",
    body: 'Hi James,\n\nDifferent angle: most BDR teams spend 60% of their day researching accounts instead of selling. Remes handles the research and writes the first touch so reps can focus on conversations from day one.\n\nWould it help to see how the signal detection works?\n\nKenny'
  }
];

export function MockEmailPreview() {
  const [activeEmail, setActiveEmail] = useState(0);
  const email = EMAILS[activeEmail];

  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/8 bg-[#0c0d0f] shadow-[0_0_30px_rgba(255,255,255,0.04),0_0_60px_rgba(255,255,255,0.02)]">
      {/* Email header with sequence tabs */}
      <div className="flex items-center justify-between border-b border-white/4 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-white/60">Ramp</span>
          <span className="text-[10px] text-white/25">James Park · VP of Sales</span>
        </div>
        <div className="flex items-center gap-1">
          {EMAILS.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`cursor-pointer rounded-md px-2 py-0.5 text-[10px] font-medium transition-all duration-150 ${
                activeEmail === i
                  ? 'bg-white/10 text-white/60'
                  : 'bg-white/3 text-white/25 hover:bg-white/6 hover:text-white/40'
              }`}
              onClick={() => setActiveEmail(i)}
            >
              Email {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Email fields */}
      <div className="space-y-0 divide-y divide-white/3 border-b border-white/4">
        <div className="flex items-center gap-3 px-6 py-3">
          <span className="text-[11px] text-white/25">To</span>
          <span className="text-xs text-white/60">james.p@ramp.com</span>
        </div>
        <div className="flex items-center gap-3 px-6 py-3">
          <span className="text-[11px] text-white/25">Subject</span>
          <span className="text-xs text-white/60">{email.subject}</span>
        </div>
      </div>

      {/* Email body — grid-stack keeps height of tallest email */}
      <div className="grid px-6 py-5">
        {EMAILS.map((e, i) => (
          <div
            key={i}
            className={`col-start-1 row-start-1 text-xs leading-[1.7] whitespace-pre-line text-white/45 ${
              i === activeEmail ? 'visible' : 'invisible'
            }`}
          >
            {e.body}
          </div>
        ))}
      </div>

      {/* Best practices note */}
      <div className="border-t border-white/4 px-6 py-2.5">
        <p className="text-[10px] leading-relaxed text-white/20">
          Plain text · Under 80 words · Signal-led opener · One clear CTA
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-white/4 px-6 py-3.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="cursor-pointer rounded-full bg-white/4 px-3 py-1.5 text-[10px] text-white/30 transition-colors duration-150 hover:bg-white/8 hover:text-white/50"
            onClick={() => setActiveEmail((activeEmail + 1) % EMAILS.length)}
          >
            Regenerate
          </button>
          <div className="flex items-center gap-1 text-[10px] text-white/20">
            <span>{activeEmail + 1}</span>
            <span>/</span>
            <span>{EMAILS.length}</span>
          </div>
        </div>
        <button
          type="button"
          className="cursor-pointer rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-medium text-white/60 transition-colors duration-150 hover:bg-white/15 hover:text-white/80"
        >
          Send
        </button>
      </div>
    </div>
  );
}
