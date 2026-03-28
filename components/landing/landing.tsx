'use client';

import { useRef } from 'react';
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

gsap.registerPlugin(ScrollTrigger);

export function Landing() {
  const user = useAuthStore((s) => s.user);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);

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
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', stagger: 0.15, delay: 0.2 }
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
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
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
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
            delay: i * 0.06,
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
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
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
        scale: 1.15,
        opacity: 0.08,
        repeat: -1,
        yoyo: true,
        duration: 3,
        ease: 'sine.inOut'
      });
    },
    { scope: pageRef }
  );

  return (
    <div ref={pageRef} className="relative flex flex-col overflow-x-hidden" style={{ background: '#08080c' }}>
      <LandingHeader />

      {/* ── Hero ── */}
      <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <AuroraCanvas className="absolute inset-0" />
        </div>

        {/* Grain overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '128px 128px'
          }}
        />

        {/* Grid lines */}
        <div
          className="pointer-events-none absolute inset-0 opacity-3"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {/* Bottom fade */}
        <div
          className="pointer-events-none absolute right-0 bottom-0 left-0 h-[40%]"
          style={{ background: 'linear-gradient(to bottom, transparent, #08080c)' }}
        />

        <div
          className={`relative z-10 mx-auto flex w-full ${MAX_WIDTH} flex-col items-center px-6 pt-32 pb-20 text-center sm:pt-40 sm:pb-28`}
        >
          <div className="hero-reveal">
            <span className="inline-block rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-1.5 text-xs font-medium tracking-widest text-violet-300 uppercase backdrop-blur-sm">
              Outbound on Auto-Pilot
            </span>
          </div>

          <h1 className="hero-reveal mt-8 flex max-w-4xl flex-col text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            <span>Deep Research.</span>
            <span>Right Contacts.</span>
            <span className="bg-linear-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Outreach that Converts.
            </span>
          </h1>

          <p className="hero-reveal mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg sm:leading-relaxed">
            Remes scans for buying signals from companies using your ideal customer criteria,
            maps contacts at every account, and crafts hyper-personalized outreach.
          </p>

          <div className="hero-reveal mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <Button
              size="lg"
              className="gap-2 rounded-full border border-white/10 bg-white px-8 py-6 text-base font-semibold text-[#08080c] shadow-xl shadow-violet-500/15 transition-all duration-300 hover:bg-white/90 hover:shadow-violet-500/25"
              onClick={handleGetStarted}
            >
              Get started
              <ArrowRight className="size-4" />
            </Button>
            <span className="text-sm text-white/40">No credit card required</span>
          </div>
        </div>

        <div className="scroll-indicator absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
          <ChevronDown className="size-5 text-white/20" />
        </div>
      </section>

      {/* ── Sections background — aurora + grain, dimmed ── */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-15">
            <AuroraCanvas className="absolute inset-0" />
          </div>
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: '128px 128px'
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }}
          />
        </div>

        <div className={`relative mx-auto flex w-full ${MAX_WIDTH} flex-col px-6`}>
          <SignalsSection />
          <ShowcaseSection />

          {/* ── FAQs ── */}
          <section
            id="faqs"
            className="relative scroll-mt-16 border-t border-white/8 py-16 sm:py-24"
          >
            <div className="section-heading relative mb-10 text-center sm:mb-14">
              <span className="mb-3 inline-block rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-1.5 text-xs font-medium tracking-widest text-violet-300 uppercase backdrop-blur-sm">
                FAQs
              </span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Frequently asked questions
              </h2>
            </div>

            <div className="relative rounded-2xl border border-white/8 bg-white/2 p-1">
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="faq-item border-white/6 px-5 sm:px-6"
                  >
                    <AccordionTrigger className="text-left text-sm text-white/80 hover:text-white sm:text-base">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-xs leading-relaxed text-white/50 sm:text-sm">
                        {faq.a}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="relative overflow-hidden border-t border-white/8 py-20 text-center sm:py-28">
            <div className="cta-glow absolute top-1/2 left-1/2 size-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

            <div className="final-cta relative z-10">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Stop missing buying signals
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
                Start detecting signals and generating outreach in minutes. No credit card required.
              </p>
              <Button
                size="lg"
                className="mt-8 gap-2 rounded-full border border-white/10 bg-white px-8 py-6 text-base font-semibold text-[#08080c] shadow-xl shadow-violet-500/15 transition-all duration-300 hover:bg-white/90 hover:shadow-violet-500/25"
                onClick={handleGetStarted}
              >
                Get started free
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </section>

          {/* ── Footer ── */}
          <footer className="border-t border-white/8 py-8">
            <p className="text-xs text-white/40">
              &copy; {new Date().getFullYear()} Remes. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
