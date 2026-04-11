'use client';

import { Check, Sparkles } from 'lucide-react';
import { MAX_WIDTH } from '@/lib/layout';
import { PrimaryCta, SecondaryCta } from './cta-buttons.client';

const BETA_FEATURES = [
  'Buying signal detection',
  'AI research & ICP scoring',
  'Contact discovery via Apollo',
  'AI-generated email sequences',
  'Gmail integration & sending',
  'Saved ICP library',
  'Unlimited sessions'
];

const ROADMAP = [
  'Team workspaces & shared pipelines',
  'CRM integrations (HubSpot, Salesforce)',
  'Custom signal sources',
  'Advanced analytics & reporting',
  'Multi-channel outreach (LinkedIn, calls)'
];

export function Pricing() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className={`mx-auto w-full ${MAX_WIDTH} flex-1 px-6 pt-32 pb-24`}>
        <div className="text-center">
          <div className="border-primary/20 bg-primary/5 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5">
            <Sparkles className="text-primary size-3.5" />
            <span className="text-primary text-sm font-medium">Free during beta</span>
          </div>
          <h1
            className="text-foreground mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            We&apos;re building in public
          </h1>
          <p
            className="text-muted-foreground mx-auto mt-5 max-w-xl text-sm leading-relaxed sm:text-base sm:leading-relaxed"
            style={{ textWrap: 'balance' }}
          >
            Remes is in beta while we refine the product with early users. Everything is free right
            now. We want to earn your trust before we earn your money.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-3xl">
          <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-(--landing-shadow-card)">
            <div className="grid gap-0 md:grid-cols-2">
              <div className="border-border border-b p-8 sm:p-10 md:border-r md:border-b-0">
                <div className="mb-1 flex items-baseline gap-3">
                  <span className="text-foreground text-3xl font-bold tracking-tight">$0</span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>
                <p className="text-muted-foreground mb-6 text-xs">
                  No credit card required. No usage limits during beta.
                </p>

                <p className="text-foreground mb-4 text-sm font-semibold">
                  Everything included today
                </p>
                <ul className="space-y-3">
                  {BETA_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="text-primary mt-0.5 size-3.5 shrink-0" />
                      <span className="text-muted-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 sm:p-10">
                <p className="text-foreground mb-4 text-sm font-semibold">On the roadmap</p>
                <ul className="mb-8 space-y-3">
                  {ROADMAP.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <div className="bg-border mt-1.5 size-1.5 shrink-0 rounded-full" />
                      <span className="text-muted-foreground text-sm">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-border bg-background rounded-xl border p-5">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We talk to every beta user. Your feedback directly shapes what we build next.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <PrimaryCta>Start for free</PrimaryCta>
            <SecondaryCta />
          </div>

          <div className="mt-16 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10">
            {['No credit card required', 'Beta pricing locked in forever', 'Cancel anytime'].map(
              (label) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-emerald-400" />
                  <span className="text-muted-foreground text-xs">{label}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
