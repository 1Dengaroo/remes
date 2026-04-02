'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { useAuthStore } from '@/lib/store/auth-store';
import { MAX_WIDTH } from '@/lib/layout';
import { FAQS } from './landing-constants';
import { AuroraCanvas } from './aurora-canvas';
import { LandingHeader } from './landing-header.client';
import { StorySection } from './story-section.client';
import { SignalsSection } from './signals-section.client';
import { ShowcaseSection } from './showcase-section.client';
import { DemoModal } from './demo-modal.client';

gsap.registerPlugin(ScrollTrigger);

export function Landing() {
  const user = useAuthStore((s) => s.user);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);
  const [demoOpen, setDemoOpen] = useState(false);

  const handleGetStarted = () => {
    if (user) {
      router.push('/research');
    } else {
      openAuthModal();
    }
  };

  useGSAP(
    () => {
      gsap.fromTo(
        '.hero-reveal',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.15 }
      );

      gsap.to('.scroll-indicator', {
        y: 8,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: 'power1.inOut'
      });
      gsap.to('.scroll-indicator', {
        opacity: 0,
        scrollTrigger: {
          trigger: '.scroll-indicator',
          start: 'top 90%',
          end: 'top 70%',
          scrub: true
        }
      });

      gsap.to('.cta-glow', {
        scale: 1.1,
        opacity: 0.06,
        repeat: -1,
        yoyo: true,
        duration: 4,
        ease: 'sine.inOut'
      });
    },
    { scope: pageRef }
  );

  return (
    <div
      ref={pageRef}
      className="relative flex flex-col overflow-x-hidden"
      style={{ background: '#08090a' }}
    >
      {/* Noise texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px'
        }}
      />

      <LandingHeader />

      {/* ── Hero ── */}
      <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <AuroraCanvas className="absolute inset-0" />
        </div>

        {/* White glow behind hero text */}
        <div
          className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 800,
            height: 400,
            background:
              'radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 30%, transparent 60%)',
            filter: 'blur(40px)'
          }}
        />

        {/* Purple glow behind hero text */}
        <div
          className="pointer-events-none absolute top-[45%] left-[30%] -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 600,
            height: 350,
            background:
              'radial-gradient(ellipse at center, rgba(86,67,204,0.12) 0%, rgba(86,67,204,0.04) 40%, transparent 65%)',
            filter: 'blur(50px)'
          }}
        />

        {/* Bottom fade */}
        <div
          className="pointer-events-none absolute right-0 bottom-0 left-0 h-[40%]"
          style={{ background: 'linear-gradient(to bottom, transparent, #08090a)' }}
        />

        <div
          className={`relative z-10 mx-auto flex w-full ${MAX_WIDTH} flex-col items-start px-6 pt-32 pb-20 sm:pt-40 sm:pb-28`}
        >
          <div className="hero-reveal">
            <span className="inline-block rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-xs font-medium tracking-widest text-white/50 uppercase backdrop-blur-sm">
              Outbound on Auto-Pilot
            </span>
          </div>

          <h1
            className="hero-reveal mt-8 max-w-3xl text-3xl leading-[1.1] font-medium tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl"
            style={{ textWrap: 'balance' }}
          >
            Deep Research. Right Contacts.{' '}
            <span
              className="inline-block"
              style={{
                backgroundImage:
                  'linear-gradient(92.88deg, #455eb5 9.16%, #5643cc 43.89%, #673fd7 64.72%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Outreach that Converts.
            </span>
          </h1>

          <p
            className="hero-reveal mt-6 max-w-xl text-sm leading-relaxed text-white/50 sm:text-base sm:leading-relaxed"
            style={{ textWrap: 'balance' }}
          >
            Remes scans for buying signals from companies using your ideal customer criteria, maps
            contacts at every account, and crafts hyper-personalized outreach.
          </p>

          <div className="hero-reveal mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
            <Button
              size="lg"
              className="group relative gap-2 rounded-full bg-white px-8 py-6 text-sm font-semibold text-[#08090a] shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]"
              onClick={handleGetStarted}
            >
              Get started
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="rounded-full border border-white/[0.08] px-8 py-6 text-sm font-medium text-white/40 transition-all duration-200 hover:border-white/[0.15] hover:bg-white/[0.03] hover:text-white/70"
              onClick={() => setDemoOpen(true)}
            >
              Book a demo
            </Button>
          </div>
        </div>

        <div className="scroll-indicator absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
          <ChevronDown className="size-5 text-white/20" />
        </div>
      </section>

      {/* ── Scroll story sections ── */}
      <div className="relative">
        {/* Ambient glows throughout */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* White glow — top */}
          <div
            className="absolute top-[5%] left-1/2 -translate-x-1/2"
            style={{
              width: 1000,
              height: 600,
              background:
                'radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 60%)',
              filter: 'blur(80px)'
            }}
          />
          {/* White glow — story left */}
          <div
            className="absolute top-[15%] left-[15%]"
            style={{
              width: 500,
              height: 500,
              background: 'radial-gradient(circle, rgba(255,255,255,0.035) 0%, transparent 60%)',
              filter: 'blur(90px)'
            }}
          />
          {/* White glow — story right */}
          <div
            className="absolute top-[22%] right-[10%]"
            style={{
              width: 450,
              height: 400,
              background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 60%)',
              filter: 'blur(80px)'
            }}
          />
          {/* Purple accent — mid left */}
          <div
            className="absolute top-[38%] left-[20%]"
            style={{
              width: 600,
              height: 600,
              background: 'radial-gradient(circle, rgba(86,67,204,0.04) 0%, transparent 60%)',
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
                'radial-gradient(ellipse at center, rgba(255,255,255,0.035) 0%, transparent 55%)',
              filter: 'blur(80px)'
            }}
          />
          {/* White glow — signals area */}
          <div
            className="absolute top-[60%] right-[15%]"
            style={{
              width: 500,
              height: 500,
              background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 60%)',
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
                'radial-gradient(ellipse at center, rgba(255,255,255,0.03) 0%, transparent 60%)',
              filter: 'blur(80px)'
            }}
          />
          {/* White glow — between showcase and signals */}
          <div
            className="absolute top-[52%] left-[75%]"
            style={{
              width: 500,
              height: 450,
              background: 'radial-gradient(circle, rgba(255,255,255,0.035) 0%, transparent 60%)',
              filter: 'blur(80px)'
            }}
          />
          {/* White glow — signals left */}
          <div
            className="absolute top-[65%] left-[10%]"
            style={{
              width: 450,
              height: 450,
              background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 60%)',
              filter: 'blur(80px)'
            }}
          />
          {/* White glow — FAQ right */}
          <div
            className="absolute top-[85%] right-[20%]"
            style={{
              width: 500,
              height: 400,
              background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 60%)',
              filter: 'blur(80px)'
            }}
          />
          {/* White glow — bottom left */}
          <div
            className="absolute bottom-[5%] left-[25%]"
            style={{
              width: 400,
              height: 400,
              background: 'radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 60%)',
              filter: 'blur(70px)'
            }}
          />
        </div>

        <div className={`relative mx-auto flex w-full ${MAX_WIDTH} flex-col px-6`}>
          {/* Gradient divider */}
          <div className="flex justify-center">
            <div className="h-px w-2/3 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          </div>

          {/* 1. The Problem — word-by-word scroll reveal */}
          <StorySection />

          {/* Gradient divider */}
          <div className="flex justify-center">
            <div className="h-px w-2/3 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          </div>

          {/* 2. How it works — side-by-side mock UIs */}
          <ShowcaseSection />

          {/* Gradient divider */}
          <div className="flex justify-center">
            <div className="h-px w-2/3 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          </div>

          {/* 3. Signals grid */}
          <SignalsSection />

          {/* ── FAQs ── */}
          <section id="faqs" className="relative scroll-mt-16 py-24 sm:py-36">
            <div className="absolute inset-x-0 top-0 flex justify-center">
              <div className="h-px w-2/3 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
            </div>

            <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
              <div className="section-heading lg:sticky lg:top-32 lg:self-start">
                <p className="mb-3 text-xs font-medium tracking-widest text-white/40 uppercase">
                  Support
                </p>
                <h2
                  className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
                  style={{ textWrap: 'balance' }}
                >
                  Frequently asked questions
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/50">
                  Everything you need to know about Remes and how it fits into your sales workflow.
                </p>
              </div>

              <div>
                <Accordion type="single" collapsible className="w-full">
                  {FAQS.map((faq, i) => (
                    <AccordionItem
                      key={i}
                      value={`faq-${i}`}
                      className="faq-item border-white/[0.06]"
                    >
                      <AccordionTrigger className="py-5 text-left text-[15px] leading-snug font-normal text-white/70 no-underline transition-colors duration-150 hover:text-white hover:no-underline [&>svg]:text-white/20">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="pb-2 text-sm leading-[1.7] text-white/50">{faq.a}</p>
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
              <div className="h-px w-2/3 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
            </div>

            {/* White glow behind CTA */}
            <div
              className="cta-glow pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: 600,
                height: 400,
                background:
                  'radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 60%)',
                filter: 'blur(60px)'
              }}
            />

            <div className="final-cta relative z-10 flex flex-col items-center text-center">
              <h2
                className="text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                Stop missing buying signals
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/50 sm:text-base">
                Start detecting signals and generating outreach in minutes.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="group relative gap-2 rounded-full bg-white px-8 py-6 text-sm font-semibold text-[#08090a] shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]"
                  onClick={handleGetStarted}
                >
                  Get started free
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="rounded-full border border-white/[0.08] px-8 py-6 text-sm font-medium text-white/40 transition-all duration-200 hover:border-white/[0.15] hover:bg-white/[0.03] hover:text-white/70"
                  onClick={() => setDemoOpen(true)}
                >
                  Book a demo
                </Button>
              </div>
            </div>
          </section>

          {/* ── Footer ── */}
          <footer className="py-8">
            <div className="mb-8 flex justify-center">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
            </div>
            <p className="text-xs text-white/35">
              &copy; {new Date().getFullYear()} Remes. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
      <DemoModal open={demoOpen} onOpenChange={setDemoOpen} />
    </div>
  );
}
