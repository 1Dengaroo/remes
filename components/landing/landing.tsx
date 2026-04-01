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
      // Hero text stagger
      gsap.fromTo(
        '.hero-reveal',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.15 }
      );

      // Scroll indicator — bounce + fade out on scroll
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

      // Section headings
      gsap.utils.toArray<HTMLElement>('.section-heading').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // FAQ items — stagger in individually
      gsap.utils.toArray<HTMLElement>('.faq-item').forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
            ease: 'power2.out',
            delay: i * 0.05,
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // CTA reveal
      gsap.fromTo(
        '.final-cta',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.final-cta',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // CTA glow pulse
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
      <LandingHeader />

      {/* ── Hero ── */}
      <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <AuroraCanvas className="absolute inset-0" />
        </div>

        {/* Bottom fade */}
        <div
          className="pointer-events-none absolute right-0 bottom-0 left-0 h-[40%]"
          style={{ background: 'linear-gradient(to bottom, transparent, #08090a)' }}
        />

        <div
          className={`relative z-10 mx-auto flex w-full ${MAX_WIDTH} flex-col items-start px-6 pt-32 pb-20 sm:pt-40 sm:pb-28`}
        >
          <div className="hero-reveal">
            <span className="inline-block rounded-full border border-[#5643cc]/30 bg-[#5643cc]/10 px-4 py-1.5 text-xs font-medium tracking-widest text-[#8a8fff] uppercase">
              Outbound on Auto-Pilot
            </span>
          </div>

          <h1
            className="hero-reveal mt-8 flex max-w-3xl flex-col text-3xl leading-[1.1] font-medium tracking-tight text-[#e4e5e9] sm:text-4xl lg:text-5xl xl:text-6xl"
            style={{ textWrap: 'balance' }}
          >
            <span>Deep Research.</span>
            <span>Right Contacts.</span>
            <span
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
            className="hero-reveal mt-6 max-w-xl text-sm leading-relaxed text-[#9c9da1] sm:text-base sm:leading-relaxed"
            style={{ textWrap: 'balance' }}
          >
            Remes scans for buying signals from companies using your ideal customer criteria, maps
            contacts at every account, and crafts hyper-personalized outreach.
          </p>

          <div className="hero-reveal mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
            <Button
              size="lg"
              className="gap-2 rounded-full bg-[#e4e5e9] px-8 py-6 text-sm font-semibold text-[#08090a] transition-all duration-200 hover:scale-[1.02] hover:bg-white"
              onClick={handleGetStarted}
            >
              Get started
              <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="rounded-full border border-white/8 px-8 py-6 text-sm font-medium text-[#9c9da1] transition-all duration-200 hover:border-white/12 hover:bg-white/3 hover:text-[#e4e5e9]"
              onClick={() => setDemoOpen(true)}
            >
              Book a demo
            </Button>
          </div>
        </div>

        <div className="scroll-indicator absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
          <ChevronDown className="size-5 text-[#9c9da1]/30" />
        </div>
      </section>

      {/* ── Sections ── */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <AuroraCanvas className="absolute inset-0" />
          </div>
        </div>

        <div className={`relative mx-auto flex w-full ${MAX_WIDTH} flex-col px-6`}>
          <SignalsSection />
          <ShowcaseSection />

          {/* ── FAQs ── */}
          <section
            id="faqs"
            className="relative scroll-mt-16 border-t border-white/4 py-20 sm:py-32"
          >
            <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
              {/* Left — heading */}
              <div className="section-heading lg:sticky lg:top-32 lg:self-start">
                <p className="mb-3 text-sm font-medium text-[#5643cc]">Support</p>
                <h2
                  className="text-2xl font-semibold tracking-tight text-[#e4e5e9] sm:text-3xl"
                  style={{ textWrap: 'balance' }}
                >
                  Frequently asked questions
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#9c9da1]/70">
                  Everything you need to know about Remes and how it fits into your sales workflow.
                </p>
              </div>

              {/* Right — accordion */}
              <div>
                <Accordion type="single" collapsible className="w-full">
                  {FAQS.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`} className="faq-item border-white/6">
                      <AccordionTrigger className="py-5 text-left text-[15px] leading-snug font-normal text-[#e4e5e9]/90 no-underline transition-colors duration-150 hover:text-[#e4e5e9] hover:no-underline [&>svg]:text-[#9c9da1]/40">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="pb-2 text-sm leading-[1.7] text-[#9c9da1]">{faq.a}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="relative overflow-hidden border-t border-white/4 py-16 sm:py-20">
            {/* Glow */}
            <div className="cta-glow pointer-events-none absolute top-1/2 left-1/2 size-100 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5643cc]/6 blur-[120px]" />

            {/* Top gradient line */}
            <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
              <div className="h-px w-2/3 bg-linear-to-r from-transparent via-[#5643cc]/20 to-transparent" />
            </div>

            <div className="final-cta relative z-10 flex flex-col items-center text-center">
              <h2
                className="text-2xl font-semibold tracking-tight text-[#e4e5e9] sm:text-3xl"
                style={{ textWrap: 'balance' }}
              >
                Stop missing buying signals
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#9c9da1]">
                Start detecting signals and generating outreach in minutes.
              </p>
              <div className="mt-7 flex items-center gap-4">
                <Button
                  size="lg"
                  className="gap-2 rounded-full bg-[#e4e5e9] px-8 py-6 text-sm font-semibold text-[#08090a] transition-all duration-200 hover:scale-[1.02] hover:bg-white"
                  onClick={handleGetStarted}
                >
                  Get started free
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="rounded-full border border-white/8 px-8 py-6 text-sm font-medium text-[#9c9da1] transition-all duration-200 hover:border-white/12 hover:bg-white/3 hover:text-[#e4e5e9]"
                  onClick={() => setDemoOpen(true)}
                >
                  Book a demo
                </Button>
              </div>
            </div>
          </section>

          {/* ── Footer ── */}
          <footer className="border-t border-white/4 py-8">
            <p className="text-xs text-[#9c9da1]/50">
              &copy; {new Date().getFullYear()} Remes. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
      <DemoModal open={demoOpen} onOpenChange={setDemoOpen} />
    </div>
  );
}
