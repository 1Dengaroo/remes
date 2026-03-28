'use client';

import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);
import { SIGNAL_CARDS } from './landing-constants';
import { RotatingWord } from './rotating-word.client';

export function SignalsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('.signal-card').forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
            delay: i * 0.06,
            scrollTrigger: {
              trigger: el,
              start: 'top 92%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative scroll-mt-16 py-16 sm:py-24">
      <div className="section-heading relative mb-10 text-center sm:mb-14">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl xl:text-5xl">
          Reach out the moment you spot <RotatingWord />
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SIGNAL_CARDS.map((card, i) => (
          <div
            key={`${card.title}-${i}`}
            className="signal-card group rounded-2xl border border-white/8 bg-white/[0.03] p-6 transition-colors hover:border-violet-400/20 hover:bg-white/[0.05] sm:p-8"
          >
            <card.icon className="mb-6 size-10 text-violet-400 sm:size-12" strokeWidth={1.5} />
            <h3 className="text-lg font-semibold text-white">{card.title}</h3>
            {card.desc ? (
              <p className="mt-2 text-sm leading-relaxed text-white/50">{card.desc}</p>
            ) : (
              <Button
                variant="outline"
                className="mt-4 gap-2 rounded-full border-violet-400/30 bg-violet-500/10 text-sm text-violet-300 hover:bg-violet-500/20 hover:text-violet-200"
              >
                Curate your own signal
                <ArrowRight className="size-3.5" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
