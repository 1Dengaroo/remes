'use client';

import { useState } from 'react';

/**
 * Interactive mock UI panels for the landing page.
 * Same text sizes as the real app, but more generous padding/spacing
 * for larger visual presence. Clickable elements throughout.
 */

const SIGNAL_COLORS: Record<string, string> = {
  job_posting: 'bg-[var(--landing-accent)]/20 text-[var(--landing-accent-light)]',
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
    <div className="w-full overflow-hidden rounded-xl border border-white/8 bg-[var(--landing-bg-card)] shadow-[var(--landing-shadow-card)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/4 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-green-400/70 shadow-[var(--landing-shadow-dot)]" />
          <span className="text-landing-fg-secondary text-xs font-medium">
            {COMPANIES.length} companies matched
          </span>
        </div>
        <div className="text-2xs text-landing-fg-muted rounded-md bg-white/4 px-2.5 py-1">
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
                  className={`text-2xs flex size-8 shrink-0 items-center justify-center rounded-lg font-semibold transition-colors duration-150 ${isSelected ? 'bg-[var(--landing-accent)]/20 text-[var(--landing-accent-light)]' : 'text-landing-fg-muted bg-white/6'}`}
                >
                  {c.name.slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-landing-fg text-sm font-medium">{c.name}</span>
                    <span className="text-2xs text-landing-fg-muted">{c.industry}</span>
                  </div>
                  <div className="text-xs2 text-landing-fg-muted mt-0.5">{c.funding}</div>
                </div>
                <div
                  className="text-2xs flex size-7 shrink-0 items-center justify-center rounded-md font-semibold"
                  style={{
                    backgroundColor:
                      c.score >= 9
                        ? 'var(--landing-score-high-bg)'
                        : c.score >= 8
                          ? 'var(--landing-score-mid-bg)'
                          : 'var(--landing-score-low-bg)',
                    color:
                      c.score >= 9
                        ? 'var(--landing-score-high-text)'
                        : c.score >= 8
                          ? 'var(--landing-score-mid-text)'
                          : 'var(--landing-score-low-text)'
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
                      className={`text-2xs mt-0.5 shrink-0 rounded px-1.5 py-0.5 font-medium ${SIGNAL_COLORS[s.type]}`}
                    >
                      {SIGNAL_LABELS[s.type]}
                    </span>
                    <div className="min-w-0">
                      <div className="text-landing-fg-secondary truncate text-xs">{s.title}</div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {s.phrases.map((p) => (
                          <span
                            key={p}
                            className="text-2xs text-landing-fg-muted rounded-full bg-white/4 px-1.5 py-0.5"
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
              <div className="text-xs2 text-landing-fg-secondary mt-2.5 leading-relaxed italic">
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
    <div className="w-full overflow-hidden rounded-xl border border-white/8 bg-[var(--landing-bg-card)] shadow-[var(--landing-shadow-card)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/4 px-6 py-4">
        <span className="text-landing-fg-secondary text-xs font-medium">Contacts</span>
        <span className="text-2xs text-landing-fg-muted">
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
              <div className="text-landing-fg-muted flex size-9 shrink-0 items-center justify-center rounded-full bg-white/6 text-xs font-medium">
                {c.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-medium ${isEnriched ? 'text-landing-fg' : 'text-landing-fg-muted'}`}
                  >
                    {isEnriched ? c.name : c.name.replace(/(\s\w)\w+$/, '$1***')}
                  </span>
                  {isEnriched && c.hasLinkedIn && (
                    <svg
                      className="text-landing-fg-muted size-3"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  )}
                  {justRevealed && (
                    <span className="text-2xs rounded-full bg-emerald-500/15 px-1.5 py-0.5 font-medium text-emerald-400/80">
                      New
                    </span>
                  )}
                </div>
                <div className="text-landing-fg-secondary mt-0.5 text-xs">
                  {c.title} at {c.company}
                </div>
              </div>

              {/* Email or Get Contact */}
              {isEnriched ? (
                <span className="text-xs2 text-landing-fg-muted hidden shrink-0 sm:block">
                  {c.email}
                </span>
              ) : (
                <button
                  type="button"
                  className="text-2xs text-landing-fg-muted hover:text-landing-fg shrink-0 cursor-pointer rounded-full bg-white/6 px-2.5 py-1 font-medium transition-all duration-150 hover:bg-white/10"
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
    <div className="w-full overflow-hidden rounded-xl border border-white/8 bg-[var(--landing-bg-card)] shadow-[var(--landing-shadow-card)]">
      {/* Email header with sequence tabs */}
      <div className="flex items-center justify-between border-b border-white/4 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-landing-fg-secondary text-xs font-medium">Ramp</span>
          <span className="text-2xs text-landing-fg-muted">James Park · VP of Sales</span>
        </div>
        <div className="flex items-center gap-1">
          {EMAILS.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`text-2xs cursor-pointer rounded-md px-2 py-0.5 font-medium transition-all duration-150 ${
                activeEmail === i
                  ? 'text-landing-fg-muted bg-white/10'
                  : 'text-landing-fg-muted hover:text-landing-fg bg-white/3 hover:bg-white/6'
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
          <span className="text-xs2 text-landing-fg-muted">To</span>
          <span className="text-landing-fg-secondary text-xs">james.p@ramp.com</span>
        </div>
        <div className="flex items-center gap-3 px-6 py-3">
          <span className="text-xs2 text-landing-fg-muted">Subject</span>
          <span className="text-landing-fg-secondary text-xs">{email.subject}</span>
        </div>
      </div>

      {/* Email body — grid-stack keeps height of tallest email */}
      <div className="grid px-6 py-5">
        {EMAILS.map((e, i) => (
          <div
            key={i}
            className={`leading-relaxed2 text-landing-fg-secondary col-start-1 row-start-1 text-xs whitespace-pre-line ${
              i === activeEmail ? 'visible' : 'invisible'
            }`}
          >
            {e.body}
          </div>
        ))}
      </div>

      {/* Best practices note */}
      <div className="border-t border-white/4 px-6 py-2.5">
        <p className="text-2xs text-landing-fg-muted leading-relaxed">
          Plain text · Under 80 words · Signal-led opener · One clear CTA
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-white/4 px-6 py-3.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="text-2xs text-landing-fg-muted hover:text-landing-fg cursor-pointer rounded-full bg-white/4 px-3 py-1.5 transition-colors duration-150 hover:bg-white/8"
            onClick={() => setActiveEmail((activeEmail + 1) % EMAILS.length)}
          >
            Regenerate
          </button>
          <div className="text-2xs text-landing-fg-muted flex items-center gap-1">
            <span>{activeEmail + 1}</span>
            <span>/</span>
            <span>{EMAILS.length}</span>
          </div>
        </div>
        <button
          type="button"
          className="text-2xs text-landing-fg-muted hover:text-landing-fg cursor-pointer rounded-full bg-white/10 px-3 py-1.5 font-medium transition-colors duration-150 hover:bg-white/15"
        >
          Send
        </button>
      </div>
    </div>
  );
}
