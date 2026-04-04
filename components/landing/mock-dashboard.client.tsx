'use client';

import { useState, useRef, useEffect } from 'react';

/**
 * Interactive mock UI panels for the landing page.
 * Same text sizes as the real app, but more generous padding/spacing
 * for larger visual presence. Clickable elements throughout.
 */

const SIGNAL_COLORS: Record<string, string> = {
  job_posting: 'bg-(--landing-accent)/25 text-(--landing-accent-light)',
  funding: 'bg-emerald-500/20 text-emerald-400/90',
  news: 'bg-red-500/20 text-red-400/90',
  product_launch: 'bg-amber-500/20 text-amber-400/90'
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
      { type: 'job_posting', title: 'Data Engineer role mentions Snowflake, dbt' },
      { type: 'funding', title: 'Closed Series C with Benchmark' }
    ]
  },
  {
    name: 'Lattice',
    industry: 'HR Tech',
    funding: '$328M Series F',
    score: 8,
    matchReason: 'Expanding into EMEA, building new sales org from scratch',
    signals: [{ type: 'news', title: 'Opened London office, hiring EMEA sales lead' }]
  },
  {
    name: 'Ramp',
    industry: 'Fintech',
    funding: '$300M Series D',
    score: 9,
    matchReason: 'Tripled headcount in 6 months, retooling outbound stack',
    signals: [
      { type: 'job_posting', title: 'Posted 6 BDR roles in the last 2 weeks' },
      { type: 'funding', title: 'Raised $300M at $16B valuation' }
    ]
  }
];

export function MockSignalDashboard() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="w-full overflow-hidden rounded-lg border border-white/12 bg-(--landing-bg-card) shadow-(--landing-shadow-card)">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/6 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-green-400/70 shadow-(--landing-shadow-dot)" />
          <span className="text-landing-fg-secondary text-xs font-medium">
            {COMPANIES.length} companies matched
          </span>
        </div>
        <div className="text-2xs text-landing-fg-muted rounded-md bg-white/6 px-2.5 py-1">
          B2B SaaS · 50–500 employees
        </div>
      </div>

      {/* Company rows */}
      <div className="divide-y divide-white/5 p-3">
        {COMPANIES.map((c, i) => {
          const isSelected = selected === i;
          return (
            <button
              key={i}
              type="button"
              className={`w-full rounded-md px-4 py-4 text-left transition-colors duration-150 ${isSelected ? 'bg-white/6' : 'hover:bg-white/3'}`}
              onClick={() => setSelected(i)}
            >
              {/* Company header */}
              <div className="flex items-center gap-3">
                <div
                  className={`text-2xs flex size-8 shrink-0 items-center justify-center rounded-lg font-semibold transition-colors duration-150 ${isSelected ? 'bg-(--landing-accent)/25 text-(--landing-accent-light)' : 'text-landing-fg-muted bg-white/8'}`}
                >
                  {c.name.slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-landing-fg text-sm font-medium">{c.name}</span>
                    <span className="text-2xs text-landing-fg-muted">{c.industry}</span>
                    <span className="text-2xs text-landing-fg-muted">·</span>
                    <span className="text-2xs text-landing-fg-muted">{c.funding}</span>
                  </div>
                  <div className="text-xs2 text-landing-fg-secondary mt-0.5 leading-relaxed italic">
                    {c.matchReason}
                  </div>
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
              <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
                {c.signals.map((s, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <span
                      className={`text-2xs shrink-0 rounded px-1.5 py-0.5 font-medium ${SIGNAL_COLORS[s.type]}`}
                    >
                      {SIGNAL_LABELS[s.type]}
                    </span>
                    <span className="text-landing-fg-secondary text-xs">{s.title}</span>
                  </div>
                ))}
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
    <div className="w-full overflow-hidden rounded-lg border border-white/12 bg-(--landing-bg-card) shadow-(--landing-shadow-card)">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/6 px-6 py-4">
        <span className="text-landing-fg-secondary text-xs font-medium">Contacts</span>
        <span className="text-2xs text-landing-fg-muted">
          {enrichedCount} of {CONTACTS.length} enriched
        </span>
      </div>

      {/* Contacts */}
      <div className="divide-y divide-white/5 p-3">
        {CONTACTS.map((c, i) => {
          const isEnriched = enriched.has(i);
          const wasOriginallyHidden = !c.enriched;
          const justRevealed = wasOriginallyHidden && isEnriched;

          return (
            <div
              key={i}
              className="flex items-center gap-4 rounded-md px-4 py-3 transition-colors duration-150 hover:bg-white/3"
            >
              {/* Avatar */}
              <div className="text-landing-fg-muted flex size-9 shrink-0 items-center justify-center rounded-full bg-white/8 text-xs font-medium">
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
                  className="text-2xs text-landing-fg-muted hover:text-landing-fg shrink-0 cursor-pointer rounded-full bg-white/8 px-2.5 py-1 font-medium transition-all duration-150 hover:bg-white/12"
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

const REGEN_EMAILS = [
  {
    subject: "ramp's outbound overhaul",
    body: 'Hi James,\n\nNoticed Ramp just posted 6 BDR roles back to back. When teams scale that fast, the bottleneck usually shifts from hiring to pipeline quality.\n\nRemes catches buying signals like yours and drafts the first email so reps can start selling on day one instead of researching. Happy to show you how it works in 15 min.\n\nKenny'
  },
  {
    subject: 'scaling bdrs at ramp',
    body: 'Hi James,\n\nRamp tripling its BDR team caught my eye. Most orgs at that stage find their reps spend more time researching than actually reaching out.\n\nWe automate the research and first-touch for teams exactly like yours. One customer booked 47 meetings in month one. Worth a look?\n\nKenny'
  },
  {
    subject: 'a faster ramp-up for ramp',
    body: 'Hi James,\n\nWhen a team goes from 2 to 6 BDRs overnight, onboarding speed becomes the real constraint. Remes gives new reps qualified accounts and ready-to-send emails from their first day.\n\nWould it be useful to see how signal detection works for a fintech ICP?\n\nKenny'
  },
  {
    subject: 're: outbound at scale',
    body: 'Hi James,\n\nQuick thought: the biggest risk with rapid BDR hiring is inconsistent messaging. Remes keeps every first touch on-brand and signal-relevant so quality stays high even as you scale.\n\n15 min walkthrough work this week?\n\nKenny'
  }
];

const STREAM_SPEED_MS = 12;

export function MockEmailPreview() {
  const [activeEmail, setActiveEmail] = useState(0);
  const [streamingBody, setStreamingBody] = useState<string | null>(null);
  const [streamingSubject, setStreamingSubject] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const regenIndexRef = useRef(0);
  const rafRef = useRef<number>(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleRegenerate = () => {
    if (isStreaming) return;

    const target = REGEN_EMAILS[regenIndexRef.current % REGEN_EMAILS.length];
    regenIndexRef.current += 1;

    setIsStreaming(true);
    setStreamingBody('');
    setStreamingSubject(target.subject);

    let charIndex = 0;
    let lastTime = 0;

    const tick = (time: number) => {
      if (time - lastTime < STREAM_SPEED_MS) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      lastTime = time;

      const chunkSize = target.body[charIndex] === '\n' ? 1 : Math.random() > 0.7 ? 2 : 1;
      charIndex += chunkSize;

      if (charIndex >= target.body.length) {
        setStreamingBody(target.body);
        setIsStreaming(false);
        return;
      }

      setStreamingBody(target.body.slice(0, charIndex));
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const email = EMAILS[activeEmail];
  const displaySubject = streamingSubject ?? email.subject;
  const displayBody = streamingBody ?? email.body;

  return (
    <div className="w-full overflow-hidden rounded-lg border border-white/12 bg-(--landing-bg-card) shadow-(--landing-shadow-card)">
      {/* Email header with sequence tabs */}
      <div className="flex items-center justify-between border-b border-white/6 px-6 py-4">
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
                activeEmail === i && streamingBody === null
                  ? 'text-landing-fg-muted bg-white/12'
                  : 'text-landing-fg-muted hover:text-landing-fg bg-white/5 hover:bg-white/8'
              }`}
              onClick={() => {
                if (isStreaming) return;
                setStreamingBody(null);
                setStreamingSubject(null);
                setActiveEmail(i);
              }}
            >
              Email {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Email fields */}
      <div className="space-y-0 divide-y divide-white/5 border-b border-white/6">
        <div className="flex items-center gap-3 px-6 py-3">
          <span className="text-xs2 text-landing-fg-muted">To</span>
          <span className="text-landing-fg-secondary text-xs">james.p@ramp.com</span>
        </div>
        <div className="flex items-center gap-3 px-6 py-3">
          <span className="text-xs2 text-landing-fg-muted">Subject</span>
          <span className="text-landing-fg-secondary text-xs">{displaySubject}</span>
        </div>
      </div>

      {/* Email body */}
      <div className="grid px-6 py-5">
        {/* Hidden stacks for height reservation */}
        {EMAILS.map((e, i) => (
          <div
            key={i}
            className="leading-relaxed2 text-landing-fg-secondary invisible col-start-1 row-start-1 text-xs whitespace-pre-line"
          >
            {e.body}
          </div>
        ))}
        {/* Visible body — either streaming or selected email */}
        <div className="leading-relaxed2 text-landing-fg-secondary col-start-1 row-start-1 text-xs whitespace-pre-line">
          {displayBody}
          {isStreaming && (
            <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-white/50 align-middle" />
          )}
        </div>
      </div>

      {/* Best practices note */}
      <div className="border-t border-white/6 px-6 py-2.5">
        <p className="text-2xs text-landing-fg-muted leading-relaxed">
          Plain text · Under 80 words · Signal-led opener · One clear CTA
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-white/6 px-6 py-3.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`text-2xs cursor-pointer rounded-full px-3 py-1.5 transition-colors duration-150 ${
              isStreaming
                ? 'text-landing-fg-muted bg-white/6 opacity-50'
                : 'text-landing-fg-muted hover:text-landing-fg bg-white/6 hover:bg-white/10'
            }`}
            onClick={handleRegenerate}
            disabled={isStreaming}
          >
            {isStreaming ? 'Generating...' : 'Regenerate'}
          </button>
        </div>
        <button
          type="button"
          className="text-2xs text-landing-fg-muted hover:text-landing-fg cursor-pointer rounded-full bg-white/12 px-3 py-1.5 font-medium transition-colors duration-150 hover:bg-white/18"
        >
          Send
        </button>
      </div>
    </div>
  );
}
