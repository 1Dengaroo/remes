'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { MAX_WIDTH, HERO_THEME } from '@/lib/layout';
import { HeroBackdrop } from '@/components/shared/hero-backdrop';
import { FAQS } from './landing-constants';
import { PrimaryCta, SecondaryCta } from './cta-buttons.client';
import { HeroPipeline } from './hero-pipeline.client';
import { BentoGrid } from './bento-grid';
import { SignalsSection } from './signals-section.client';
import { UseCasesSection } from './use-cases-section';
import { CtaSection } from './cta-section';

export function Landing() {
  return (
    <div className="relative flex flex-col overflow-x-clip">
      <HeroBackdrop
        theme={HERO_THEME.hero}
        className="flex min-h-dvh flex-col items-center justify-center"
      >
        <div
          className={`relative z-10 mx-auto flex w-full ${MAX_WIDTH} flex-col items-center px-6 pt-28 pb-44 sm:pt-32 sm:pb-56`}
        >
          <div className="flex max-w-3xl flex-col items-center text-center">
            <h1
              className="animate-[hero-fade-in_0.8s_ease-out_0.15s_both] text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
              style={{ color: 'var(--landing-hero-fg)', lineHeight: 1.15 }}
            >
              Outreach that Converts.
            </h1>

            <p
              className="mt-4 max-w-lg animate-[hero-fade-in_0.8s_ease-out_0.27s_both] text-sm leading-relaxed sm:text-base"
              style={{ color: 'var(--landing-hero-fg-secondary)' }}
            >
              Remes monitors the web for buying signals, deep-researches every account, maps the
              right contacts, and crafts hyper-personalized outreach — all on auto-pilot.
            </p>

            <div className="mt-6 flex animate-[hero-fade-in_0.8s_ease-out_0.39s_both] flex-col items-center gap-4 sm:flex-row sm:gap-5">
              <PrimaryCta variant="hero" />
              <SecondaryCta variant="hero" />
            </div>
          </div>

          <div className="relative mt-10 animate-[hero-fade-in_0.8s_ease-out_0.5s_both] sm:mt-12">
            <div
              className="pointer-events-none absolute -inset-20 z-0"
              style={{
                background:
                  'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(37, 55, 177, 0.35) 0%, rgba(86, 67, 204, 0.12) 40%, transparent 70%)',
                filter: 'blur(30px)'
              }}
            />
            <div
              className="pointer-events-none absolute -top-16 left-1/2 z-0 -translate-x-1/2"
              style={{
                width: 500,
                height: 200,
                background:
                  'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.06) 0%, transparent 70%)',
                filter: 'blur(20px)'
              }}
            />
            <div className="relative z-10">
              <HeroPipeline />
            </div>
          </div>
        </div>
      </HeroBackdrop>

      {/* BentoGrid section */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute top-[10%] left-1/2 -translate-x-1/2"
            style={{
              width: 900,
              height: 500,
              background:
                'radial-gradient(ellipse at center, var(--landing-glow-white) 0%, transparent 60%)',
              filter: 'blur(80px)'
            }}
          />
          <div
            className="absolute top-[50%] left-1/2 -translate-x-1/2"
            style={{
              width: 800,
              height: 500,
              background:
                'radial-gradient(ellipse at center, var(--landing-glow-purple) 0%, transparent 60%)',
              filter: 'blur(100px)'
            }}
          />
        </div>

        <div className={`relative mx-auto flex w-full ${MAX_WIDTH} flex-col px-6`}>
          <div id="features">
            <BentoGrid />
          </div>
        </div>
      </div>

      {/* How it works — dark section */}
      <UseCasesSection theme={HERO_THEME.useCases} />

      {/* Signals, FAQs, CTA */}
      <div className="relative">
        <div className={`relative mx-auto flex w-full ${MAX_WIDTH} flex-col px-6`}>
          <div className="flex justify-center">
            <div className="h-px w-2/3 bg-linear-to-r from-transparent via-(--landing-border-card) to-transparent" />
          </div>

          <SignalsSection />

          <div className="flex justify-center">
            <div className="h-px w-2/3 bg-linear-to-r from-transparent via-(--landing-border-card) to-transparent" />
          </div>

          <section id="faqs" className="scroll-mt-16 py-24 sm:py-36">
            <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
              <div className="lg:sticky lg:top-32 lg:self-start">
                <p className="text-landing-fg-muted mb-3 text-xs font-medium tracking-widest uppercase">
                  Support
                </p>
                <h2
                  className="text-landing-fg text-2xl font-bold tracking-tight sm:text-3xl"
                  style={{ textWrap: 'balance' }}
                >
                  Frequently asked questions
                </h2>
                <p className="text-landing-fg-secondary mt-3 max-w-sm text-sm leading-relaxed">
                  Everything you need to know about Remes and how it fits into your sales workflow.
                </p>
              </div>

              <div>
                <Accordion type="single" collapsible className="flex w-full flex-col gap-2">
                  {FAQS.map((faq, i) => (
                    <AccordionItem
                      key={i}
                      value={`faq-${i}`}
                      className="rounded-xl border border-(--landing-border-card) bg-(--landing-bg-card) px-5"
                      style={{ boxShadow: '0 1px 3px rgba(80, 70, 180, 0.04)' }}
                    >
                      <AccordionTrigger className="text-landing-fg hover:text-landing-fg [&>svg]:text-landing-fg-muted py-5 text-left text-sm leading-snug font-medium no-underline transition-colors duration-150 hover:no-underline">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-landing-fg-secondary pb-4 text-sm leading-relaxed">
                          {faq.a}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>
        </div>
      </div>

      <CtaSection theme={HERO_THEME.cta} />
    </div>
  );
}
