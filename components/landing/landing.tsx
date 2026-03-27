'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
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
import { AuroraCanvas } from './aurora-canvas';
import { LandingHeader } from './landing-header.client';

gsap.registerPlugin(ScrollTrigger);

const ROTATING_WORDS = [
  'funding rounds',
  'hiring surges',
  'new launches',
  'role changes',
  'growth signals'
];

function RotatingWord() {
  const [index, setIndex] = useState(0);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  const cycle = useCallback(() => {
    const word = wordRef.current;
    const wrapper = wrapperRef.current;
    const measure = measureRef.current;
    if (!word || !wrapper || !measure) return;

    const nextIndex = (index + 1) % ROTATING_WORDS.length;

    // Measure the next word's width
    measure.textContent = ROTATING_WORDS[nextIndex];
    const nextWidth = measure.offsetWidth;

    // Fade out current word
    gsap.to(word, {
      opacity: 0,
      y: '-0.15em',
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        setIndex(nextIndex);
        gsap.set(word, { y: '0.15em' });
        gsap.to(word, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
      }
    });

    // Smoothly animate container width
    gsap.to(wrapper, {
      width: nextWidth,
      duration: 0.4,
      ease: 'power2.inOut'
    });
  }, [index]);

  // Set initial width after mount
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const word = wordRef.current;
    if (wrapper && word) {
      wrapper.style.width = `${word.offsetWidth}px`;
    }
  }, []);

  useEffect(() => {
    const id = setInterval(cycle, 2800);
    return () => clearInterval(id);
  }, [cycle]);

  return (
    <>
      <span
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible absolute whitespace-nowrap"
        style={{ font: 'inherit' }}
      />
      <span ref={wrapperRef} className="inline-block">
        <span
          ref={wordRef}
          className="inline-block bg-linear-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text whitespace-nowrap text-transparent"
        >
          {ROTATING_WORDS[index]}
        </span>
      </span>
    </>
  );
}

const SHOWCASE = [
  {
    label: 'Signal Detection',
    title: 'Catch buying signals before your competitors',
    desc: 'Remes monitors job postings, funding rounds, and product launches across the web — surfacing the companies most likely to buy right now.',
    video: 'https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4',
    poster: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80'
  },
  {
    label: 'Contact Discovery',
    title: 'Find the right person instantly',
    desc: 'Automatically match signals to decision-makers with verified emails and LinkedIn profiles. No more guessing who to reach out to.',
    video: 'https://videos.pexels.com/video-files/7579961/7579961-uhd_2560_1440_30fps.mp4',
    poster: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80'
  },
  {
    label: 'AI Outreach',
    title: 'Emails that actually get replies',
    desc: 'Every email is grounded in the signal that triggered it — relevant, timely, and personal. Not another generic template.',
    video: 'https://videos.pexels.com/video-files/5752729/5752729-uhd_2560_1440_30fps.mp4',
    poster: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80'
  }
];

const FAQS = [
  {
    q: 'What is Remes and how does it work?',
    a: 'Remes is an AI-powered platform that detects real-time buying signals — hiring surges, funding rounds, leadership changes, product launches — and uses them to craft deeply personalized outreach to your ideal customers. You describe your ideal customer, and Remes finds, researches, and engages them automatically.'
  },
  {
    q: 'How is Remes different from other outreach tools?',
    a: 'Most tools automate sending. Remes automates research. We detect real-time buying signals and use them to write emails that reference things happening at the prospect\'s company right now. The difference is an email that says "congrats on your funding" vs. one that knows you raised $8M from Craft to scale your GTM team.'
  },
  {
    q: 'What reply rate can I expect?',
    a: 'Reply rates vary by industry and offer, but our signal-driven approach consistently outperforms generic outreach by 3\u20135x. Most customers see meaningful pipeline activity by week 6.'
  },
  {
    q: 'How much does Remes cost compared to hiring?',
    a: 'Plans start at $1,497/month. A fully loaded sales hire costs $90K\u2013$150K/year, takes 3\u20136 months to ramp, and turns over at 39% annually. Remes starts producing pipeline in 2 weeks and never quits. One closed deal typically pays for the entire annual subscription.'
  },
  {
    q: 'What are buying signals?',
    a: 'Buying signals are real-time indicators that a company is ready to buy — things like hiring surges, funding rounds, leadership changes, product launches, headcount growth, and LinkedIn activity from key decision-makers. Remes detects these automatically so you can reach prospects at the perfect moment.'
  },
  {
    q: 'What types of buying signals does Remes detect?',
    a: 'Anything you can describe. Typical buying signals include hiring surges, specific role postings, funding rounds, leadership changes and new executive hires, product launches and company announcements, headcount growth velocity, LinkedIn posts and engagement from key decision-makers, tech stack changes, and competitive movements. You are not limited to these categories.'
  },
  {
    q: 'Do you send emails from my account?',
    a: 'Yes. Remes sends through your connected email account via official APIs. Emails appear in your Sent folder, replies come to your inbox, and everything threads naturally. Your prospects never know a tool was involved.'
  },
  {
    q: 'How does Remes handle email deliverability?',
    a: 'Remes handles the full deliverability stack: dedicated domains, automated mailbox warmup (typically 2-3 weeks for new mailboxes), reputation monitoring, and sending controls, so you land in the primary inbox, not spam.'
  },
  {
    q: 'How is Remes different from ZoomInfo, Apollo, Instantly or Clay?',
    a: 'Apollo and ZoomInfo are contact databases: they find leads but do not research or write outreach. Instantly is a campaign tool: you have to import a lead list and manually create a campaign. Clay requires building automations from scratch with a credit system that burns fast. Remes replaces Clay + Apollo + Instantly with one tool.'
  },
  {
    q: 'Why is it called Remes?',
    a: "It's a reference to Hermes, the Greek god of commerce, trade, and messengers. He was the original messenger who always knew where to go, who to talk to, and exactly what to say. Fast forward to today, and the best sign that your outreach actually worked? Those two little letters in your inbox: RE:. Remes."
  }
];

function ShowcaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('.showcase-item').forEach((el) => {
        const video = el.querySelector('.showcase-video');
        const text = el.querySelector('.showcase-text');
        const isReversed = el.classList.contains('showcase-reversed');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });

        // Video slides in from its side
        if (video) {
          tl.fromTo(
            video,
            { x: isReversed ? 60 : -60, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: 'power3.out' },
            0
          );
        }

        // Text fades up with slight delay
        if (text) {
          tl.fromTo(
            text,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
            0.2
          );
        }
      });

      // Parallax drift on videos while scrolling
      gsap.utils.toArray<HTMLElement>('.showcase-video').forEach((el) => {
        gsap.to(el, {
          y: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5
          }
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="use-cases" className="relative scroll-mt-16 py-16 sm:py-24">
      <div className="section-heading relative mb-10 sm:mb-14">
        <span className="mb-3 inline-block rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-1.5 text-xs font-medium tracking-widest text-violet-300 uppercase backdrop-blur-sm">
          See it in action
        </span>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Built for modern sales teams
        </h2>
      </div>

      <div className="flex flex-col gap-16 sm:gap-24">
        {SHOWCASE.map((item, i) => (
          <div
            key={item.label}
            className={`showcase-item flex flex-col gap-8 sm:gap-12 ${i % 2 === 1 ? 'showcase-reversed sm:flex-row-reverse' : 'sm:flex-row'}`}
          >
            {/* Video */}
            <div className="showcase-video relative aspect-video flex-[1.4] overflow-hidden rounded-2xl border border-white/8 bg-black/40">
              <video
                autoPlay
                muted
                loop
                playsInline
                poster={item.poster}
                className="absolute inset-0 size-full object-cover"
              >
                <source src={item.video} type="video/mp4" />
              </video>
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.4)]" />
            </div>

            {/* Text */}
            <div className="showcase-text flex flex-1 flex-col justify-center">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex size-7 items-center justify-center rounded-full border border-violet-400/30 bg-violet-500/10 text-xs font-semibold text-violet-300">
                  {i + 1}
                </span>
                <span className="text-xs font-medium tracking-widest text-violet-400 uppercase">
                  {item.label}
                </span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
                {item.title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

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

      // Showcase — text and image enter separately with offset
      gsap.utils.toArray<HTMLElement>('.showcase-item').forEach((el) => {
        const text = el.querySelector('.showcase-text');
        const image = el.querySelector('.showcase-image');

        if (text) {
          gsap.fromTo(
            text,
            { x: -30, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 82%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }
        if (image) {
          gsap.fromTo(
            image,
            { x: 30, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.8,
              delay: 0.12,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 82%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }
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
    <div ref={pageRef} className="relative flex flex-col" style={{ background: '#08080c' }}>
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
              AI-Powered Outbound
            </span>
          </div>

          <h1 className="hero-reveal mt-8 max-w-4xl text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            Reach out the moment
            <br />
            you spot <RotatingWord />
          </h1>

          <p className="hero-reveal mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg sm:leading-relaxed">
            Remes detects buying signals across the web and crafts personalized outreach — so you
            reach prospects at exactly the right moment.
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
          {/* ── Showcase ── */}
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

            <div className="relative mx-auto max-w-2xl rounded-2xl border border-white/8 bg-white/2 p-1">
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="faq-item border-white/6 px-5"
                  >
                    <AccordionTrigger className="text-left text-white/80 hover:text-white">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="leading-relaxed text-white/50">{faq.a}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="relative overflow-hidden border-t border-white/8 py-20 text-center sm:py-28">
            {/* Glow orb — pulses via GSAP */}
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
            <p className="text-xs text-white/40">&copy; {new Date().getFullYear()} Remes</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
