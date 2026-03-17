'use client';

import Link from 'next/link';
import { ArrowRight, Radio, UserCheck, Pencil, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STEPS = [
  {
    num: '01',
    icon: Radio,
    title: 'Detect signals',
    desc: 'Job postings, funding rounds, hiring surges, tech stack changes — captured in real time.'
  },
  {
    num: '02',
    icon: UserCheck,
    title: 'Find decision makers',
    desc: 'The right person at the right company, with verified contact info ready to go.'
  },
  {
    num: '03',
    icon: Pencil,
    title: 'Draft outreach',
    desc: 'Personalized emails rooted in the exact signal detected. No templates, no fluff.'
  }
];

const STATS = [
  { value: '10x', label: 'faster than manual research' },
  { value: '73%', label: 'open rate on signal-based emails' },
  { value: '0', label: 'sales hires needed' }
];

export function Landing() {
  return (
    <div className="relative min-h-[calc(100vh-49px)] overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}
      />

      <div className="bg-primary/10 pointer-events-none absolute -top-20 right-0 h-[600px] w-px rotate-[25deg]" />
      <div className="bg-primary/5 pointer-events-none absolute -top-10 right-20 h-[500px] w-px rotate-[25deg]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <section className="pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32">
          <div
            className="animate-in fade-in fill-mode-both mb-8 flex items-center gap-3 duration-500"
            style={{ animationDelay: '0ms' }}
          >
            <div className="bg-primary h-px w-8" />
            <span className="text-muted-foreground text-[11px] font-medium tracking-[0.2em] uppercase">
              AI-Powered Outbound
            </span>
          </div>

          <div
            className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700"
            style={{ animationDelay: '100ms' }}
          >
            <h1 className="text-foreground max-w-4xl text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
              The best time
              <br />
              to reach out is{' '}
              <span className="text-primary relative inline-block">
                right now
                <svg
                  className="text-primary/20 absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 8 Q75 0, 150 6 T300 4"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
          </div>

          <div
            className="animate-in fade-in slide-in-from-bottom-3 fill-mode-both mt-8 flex max-w-2xl flex-col gap-8 duration-700 sm:mt-10"
            style={{ animationDelay: '250ms' }}
          >
            <p className="text-muted-foreground max-w-lg text-lg leading-relaxed sm:text-xl">
              Signal monitors the web for buying signals and turns them into personalized outreach —
              automatically. No sales hires needed.
            </p>

            <div className="flex items-center gap-4">
              <Button asChild size="lg" className="gap-2 px-6">
                <Link href="/research">
                  Get started
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <span className="text-muted-foreground text-xs tracking-wide">
                No credit card required
              </span>
            </div>
          </div>

          <div
            className="animate-in fade-in fill-mode-both border-border mt-16 grid grid-cols-3 border-t pt-8 duration-700 sm:mt-20"
            style={{ animationDelay: '450ms' }}
          >
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
                  {stat.value}
                </p>
                <p className="text-muted-foreground mt-1 text-xs leading-relaxed sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="border-border border-t" />

        <section className="py-20 sm:py-28">
          <div
            className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-700"
            style={{ animationDelay: '550ms' }}
          >
            <div className="mb-12 flex items-end justify-between sm:mb-16">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <div className="bg-primary h-px w-8" />
                  <span className="text-muted-foreground text-[11px] font-medium tracking-[0.2em] uppercase">
                    How it works
                  </span>
                </div>
                <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
                  Three steps to pipeline
                </h2>
              </div>
              <Zap className="text-primary/20 hidden size-8 sm:block" />
            </div>

            <div className="grid grid-cols-1 gap-0 sm:grid-cols-3">
              {STEPS.map((step, i) => (
                <div
                  key={step.title}
                  className="border-border group relative border-t py-8 sm:border-t-0 sm:border-l sm:py-0 sm:pl-8 sm:first:border-l-0 sm:first:pl-0"
                >
                  <div className="bg-primary absolute top-0 left-0 hidden h-full w-0.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block" />

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-primary/30 font-mono text-xs font-bold">
                        {step.num}
                      </span>
                      <step.icon className="text-primary size-4" />
                    </div>
                    <div>
                      <h3 className="text-foreground text-base font-semibold">{step.title}</h3>
                      <p className="text-muted-foreground mt-2 max-w-xs text-sm leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="border-border border-t" />
        <section
          className="animate-in fade-in fill-mode-both py-20 duration-700 sm:py-28"
          style={{ animationDelay: '700ms' }}
        >
          <div className="flex flex-col items-center text-center">
            <p className="text-muted-foreground mb-4 text-[11px] font-medium tracking-[0.2em] uppercase">
              Ready to start?
            </p>
            <h2 className="text-foreground max-w-lg text-3xl font-bold tracking-tight sm:text-4xl">
              Turn signals into pipeline, today
            </h2>
            <p className="text-muted-foreground mt-4 max-w-md text-base leading-relaxed">
              Stop paying for sales hires that take months to ramp. Let Signal find and engage your
              best prospects automatically.
            </p>
            <Button asChild size="lg" className="mt-8 gap-2 px-6">
              <Link href="/research">
                Start for free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>

        <footer className="border-border border-t py-8">
          <p className="text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()} Signal. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
