'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { MAX_WIDTH } from '@/lib/layout';
import { FAQS } from './landing-constants';
import { PrimaryCta, SecondaryCta } from './cta-buttons.client';
import { HeroIllustrations } from './hero-illustrations';
import { HeroPipeline } from './hero-pipeline.client';
import { BentoGrid } from './bento-grid';
import { SignalsSection } from './signals-section.client';
import { UseCasesSection } from './use-cases-section';
import { CtaSection } from './cta-section';

export function Landing() {
  return (
    <div className="relative flex flex-col overflow-x-clip">
      <div
        className="pointer-events-none fixed inset-0 z-1 hidden opacity-[0.025] md:block"
        style={{
          backgroundImage: 'var(--landing-noise)',
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px'
        }}
      />

      <section
        className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden"
        style={{
          backgroundColor: 'var(--landing-hero-bg)',
          borderBottom: '1px solid var(--landing-hero-stroke-light)'
        }}
      >
        <HeroIllustrations />

        {/* Light cone from top center */}
        <div
          className="pointer-events-none absolute -top-16 left-0 z-1 w-full"
          aria-hidden="true"
          style={
            {
              '--cone-spread': '10%',
              '--cone-gap': '3%',
              '--cone-offset-y': '-5%',
              '--cone-color': 'rgba(200, 190, 255, 0.18)',
              '--glow-spread': '4%',
              '--glow-color': 'rgba(140, 120, 255, 0.04)',
              '--cone-start': 'calc(50% - var(--cone-spread))',
              '--cone-end': 'calc(50% + var(--cone-spread))',
              '--glow-start': 'calc(var(--cone-start) - var(--glow-spread))',
              '--glow-end': 'calc(var(--cone-end) + var(--glow-spread))',
              '--mask-width': '100%',
              '--mask-height': '720px',
              '--mask-fade-start': '0px',
              '--mask-fade-end': '100px',
              height: 'var(--mask-height)',
              background: [
                'conic-gradient(from 0deg at 50% var(--cone-offset-y), #0000 0, #0000 var(--glow-start), var(--glow-color) var(--cone-start), var(--cone-color) calc(var(--cone-start) + var(--cone-gap)), var(--cone-color) 50%, var(--cone-color) calc(var(--cone-end) - var(--cone-gap)), var(--glow-color) var(--cone-end), #0000 var(--glow-end), #0000 100%)',
                'radial-gradient(ellipse 30% 60% at 50% 10%, rgba(120, 100, 255, 0.06) 0%, transparent 100%)'
              ].join(', '),
              maskImage: [
                "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='grain'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='noise'/><feComponentTransfer in='noise'><feFuncA type='linear' slope='0.4' intercept='0.6'/></feComponentTransfer></filter><rect width='100%25' height='100%25' filter='url(%23grain)'/></svg>\")",
                'linear-gradient(to bottom, #0000 var(--mask-fade-start), #000 var(--mask-fade-end))',
                'radial-gradient(ellipse var(--mask-width) var(--mask-height) at 50% 0, #000 0, #000 30%, #0000 100%)'
              ].join(', '),
              maskComposite: 'intersect, intersect',
              WebkitMaskComposite: 'source-in, source-in'
            } as React.CSSProperties
          }
        />

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
      </section>

      {/* BentoGrid section */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
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
      <UseCasesSection />

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

      <CtaSection />
    </div>
  );
}
