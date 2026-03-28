'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SHOWCASE } from './landing-constants';

gsap.registerPlugin(ScrollTrigger);

export function ShowcaseSection() {
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
            <div className="showcase-video relative flex-[1.4] overflow-hidden rounded-2xl border border-white/8 bg-black/40">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="size-full rounded-2xl object-contain"
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
