'use client';

import { ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { MAX_WIDTH } from '@/lib/layout';
import { FAQS } from './landing-constants';
import { AuroraCanvas } from './aurora-canvas';
import { PrimaryCta, SecondaryCta } from './cta-buttons.client';
import { GradientText } from './gradient-text';
import { SignalsSection } from './signals-section.client';
import { ShowcaseSection } from './showcase-section.client';

export function Landing() {
  return (
    <div className="relative flex flex-col overflow-x-hidden">
      {/* Noise texture overlay — hidden on mobile for perf */}
      <div
        className="pointer-events-none fixed inset-0 z-1 hidden opacity-[0.025] md:block"
        style={{
          backgroundImage: 'var(--landing-noise)',
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px'
        }}
      />

      {/* ── Hero ── */}
      <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden">
        {/* Mobile-only subtle gradient (no aurora on mobile for perf) */}
        <div
          className="pointer-events-none absolute inset-0 md:hidden"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 30% 40%, rgba(86, 67, 204, 0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 70% 30%, rgba(69, 94, 181, 0.08) 0%, transparent 60%)'
          }}
        />

        {/* Aurora glow — desktop only (too GPU-heavy for mobile) */}
        <div className="absolute inset-0 hidden md:block">
          <AuroraCanvas className="absolute inset-0" />
        </div>

        {/* White glow behind hero text — desktop only */}
        <div
          className="pointer-events-none absolute top-1/3 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block"
          style={{
            width: 800,
            height: 400,
            background:
              'radial-gradient(ellipse at center, var(--landing-glow-white-strong) 0%, var(--landing-glow-white-edge) 30%, transparent 60%)',
            filter: 'blur(40px)'
          }}
        />

        {/* Purple glow behind hero text — desktop only */}
        <div
          className="pointer-events-none absolute top-[45%] left-[30%] hidden -translate-x-1/2 -translate-y-1/2 md:block"
          style={{
            width: 600,
            height: 350,
            background:
              'radial-gradient(ellipse at center, var(--landing-glow-purple-strong) 0%, var(--landing-glow-purple) 40%, transparent 65%)',
            filter: 'blur(50px)'
          }}
        />

        {/* Bottom fade */}
        <div
          className="pointer-events-none absolute right-0 bottom-0 left-0 h-[40%]"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--landing-bg))' }}
        />

        <div
          className={`relative z-10 mx-auto flex w-full ${MAX_WIDTH} flex-col items-start px-6 pt-32 pb-20 sm:pt-40 sm:pb-28`}
        >
          <div className="animate-[hero-fade-in_0.8s_ease-out_0.15s_both]">
            <span className="text-landing-fg-muted inline-block rounded-full border border-white/8 bg-white/3 px-4 py-1.5 text-xs font-medium tracking-widest uppercase backdrop-blur-sm">
              Outbound on Auto-Pilot
            </span>
          </div>

          <h1
            className="leading-hero text-landing-fg mt-8 max-w-3xl animate-[hero-fade-in_0.8s_ease-out_0.27s_both] text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl"
            style={{ textWrap: 'balance' }}
          >
            Deep Research. Right Contacts. <GradientText>Outreach that Converts.</GradientText>
          </h1>

          <p
            className="text-landing-fg-secondary mt-6 max-w-xl animate-[hero-fade-in_0.8s_ease-out_0.39s_both] text-sm leading-relaxed sm:text-base sm:leading-relaxed"
            style={{ textWrap: 'balance' }}
          >
            Remes scans for buying signals from companies using your ideal customer criteria, maps
            contacts at every account, and crafts hyper-personalized outreach.
          </p>

          <div className="mt-10 flex animate-[hero-fade-in_0.8s_ease-out_0.51s_both] flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
            <PrimaryCta>Get started</PrimaryCta>
            <SecondaryCta />
          </div>
        </div>

        <button
          type="button"
          aria-label="Scroll to content"
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce cursor-pointer bg-transparent"
          onClick={() => {
            const el = document.querySelector('.story-line');
            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }}
        >
          <ChevronDown className="text-landing-fg-muted size-5" />
        </button>
      </section>

      {/* ── Scroll story sections ── */}
      <div className="relative">
        {/* Ambient glows throughout — desktop only for perf */}
        <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
          {/* White glow — top */}
          <div
            className="absolute top-[5%] left-1/2 -translate-x-1/2"
            style={{
              width: 1000,
              height: 600,
              background:
                'radial-gradient(ellipse at center, var(--landing-glow-white) 0%, transparent 60%)',
              filter: 'blur(80px)'
            }}
          />
          {/* White glow — story left */}
          <div
            className="absolute top-[15%] left-[15%]"
            style={{
              width: 500,
              height: 500,
              background:
                'radial-gradient(circle, var(--landing-glow-white-soft) 0%, transparent 60%)',
              filter: 'blur(90px)'
            }}
          />
          {/* White glow — story right */}
          <div
            className="absolute top-[22%] right-[10%]"
            style={{
              width: 450,
              height: 400,
              background:
                'radial-gradient(circle, var(--landing-glow-white-subtle) 0%, transparent 60%)',
              filter: 'blur(80px)'
            }}
          />
          {/* Purple accent — mid left */}
          <div
            className="absolute top-[38%] left-[20%]"
            style={{
              width: 600,
              height: 600,
              background: 'radial-gradient(circle, var(--landing-glow-purple) 0%, transparent 60%)',
              filter: 'blur(100px)'
            }}
          />
          {/* White glow — showcase center */}
          <div
            className="absolute top-[45%] left-1/2 -translate-x-1/2"
            style={{
              width: 900,
              height: 500,
              background:
                'radial-gradient(ellipse at center, var(--landing-glow-white-soft) 0%, transparent 55%)',
              filter: 'blur(80px)'
            }}
          />
          {/* White glow — signals area */}
          <div
            className="absolute top-[60%] right-[15%]"
            style={{
              width: 500,
              height: 500,
              background:
                'radial-gradient(circle, var(--landing-glow-white-subtle) 0%, transparent 60%)',
              filter: 'blur(90px)'
            }}
          />
          {/* White glow — FAQ/CTA area */}
          <div
            className="absolute top-[78%] left-1/2 -translate-x-1/2"
            style={{
              width: 800,
              height: 500,
              background:
                'radial-gradient(ellipse at center, var(--landing-glow-white-subtle) 0%, transparent 60%)',
              filter: 'blur(80px)'
            }}
          />
          {/* White glow — between showcase and signals */}
          <div
            className="absolute top-[52%] left-[75%]"
            style={{
              width: 500,
              height: 450,
              background:
                'radial-gradient(circle, var(--landing-glow-white-soft) 0%, transparent 60%)',
              filter: 'blur(80px)'
            }}
          />
          {/* White glow — signals left */}
          <div
            className="absolute top-[65%] left-[10%]"
            style={{
              width: 450,
              height: 450,
              background:
                'radial-gradient(circle, var(--landing-glow-white-subtle) 0%, transparent 60%)',
              filter: 'blur(80px)'
            }}
          />
          {/* White glow — FAQ right */}
          <div
            className="absolute top-[85%] right-[20%]"
            style={{
              width: 500,
              height: 400,
              background:
                'radial-gradient(circle, var(--landing-glow-white-subtle) 0%, transparent 60%)',
              filter: 'blur(80px)'
            }}
          />
          {/* White glow — bottom left */}
          <div
            className="absolute bottom-[5%] left-[25%]"
            style={{
              width: 400,
              height: 400,
              background:
                'radial-gradient(circle, var(--landing-glow-white-faint) 0%, transparent 60%)',
              filter: 'blur(70px)'
            }}
          />
        </div>

        <div className={`relative mx-auto flex w-full ${MAX_WIDTH} flex-col px-6`}>
          {/* Gradient divider */}
          <div className="flex justify-center">
            <div className="h-px w-2/3 bg-linear-to-r from-transparent via-white/6 to-transparent" />
          </div>

          {/* How it works */}
          <ShowcaseSection />

          {/* Gradient divider */}
          <div className="flex justify-center">
            <div className="h-px w-2/3 bg-linear-to-r from-transparent via-white/6 to-transparent" />
          </div>

          {/* Signals grid */}
          <SignalsSection />

          {/* Integrations section hidden for now */}

          {/* ── FAQs ── */}
          <section id="faqs" className="relative scroll-mt-16 py-24 sm:py-36">
            <div className="absolute inset-x-0 top-0 flex justify-center">
              <div className="h-px w-2/3 bg-linear-to-r from-transparent via-white/6 to-transparent" />
            </div>

            <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
              <div className="section-heading lg:sticky lg:top-32 lg:self-start">
                <p className="text-landing-fg-muted mb-3 text-xs font-medium tracking-widest uppercase">
                  Support
                </p>
                <h2
                  className="text-landing-fg text-2xl font-semibold tracking-tight sm:text-3xl"
                  style={{ textWrap: 'balance' }}
                >
                  Frequently asked questions
                </h2>
                <p className="text-landing-fg-secondary mt-3 max-w-sm text-sm leading-relaxed">
                  Everything you need to know about Remes and how it fits into your sales workflow.
                </p>
              </div>

              <div>
                <Accordion type="single" collapsible className="w-full">
                  {FAQS.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`} className="faq-item border-white/6">
                      <AccordionTrigger className="text-md text-landing-fg-secondary hover:text-landing-fg [&>svg]:text-landing-fg-muted py-5 text-left leading-snug font-normal no-underline transition-colors duration-150 hover:no-underline">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="leading-relaxed2 text-landing-fg-secondary pb-2 text-sm">
                          {faq.a}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="relative overflow-hidden py-24 sm:py-36">
            <div className="absolute inset-x-0 top-0 flex justify-center">
              <div className="h-px w-2/3 bg-linear-to-r from-transparent via-white/6 to-transparent" />
            </div>

            {/* White glow behind CTA */}
            <div
              className="pointer-events-none absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 animate-[glow-pulse_4s_ease-in-out_infinite] md:block"
              style={{
                width: 600,
                height: 400,
                background:
                  'radial-gradient(ellipse at center, var(--landing-glow-white) 0%, transparent 60%)',
                filter: 'blur(60px)'
              }}
            />

            <div className="final-cta relative z-10 flex flex-col items-center text-center">
              <h2
                className="text-landing-fg text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                Stop missing buying <GradientText>signals</GradientText>
              </h2>
              <p className="text-landing-fg-secondary mx-auto mt-4 max-w-md text-sm leading-relaxed sm:text-base">
                Start detecting signals and generating outreach in minutes.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
                <PrimaryCta>Get started free</PrimaryCta>
                <SecondaryCta />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
