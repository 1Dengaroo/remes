import { MAX_WIDTH } from '@/lib/layout';
import { GradientText } from './gradient-text';
import { PrimaryCta, SecondaryCta } from './cta-buttons.client';
import { CONVEYOR_PATH, GEAR_PATH } from './hero-illustrations';

export function CtaSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: 'var(--landing-cta-bg)',
        borderTop: '1px solid var(--landing-cta-border)',
        borderBottom: '1px solid var(--landing-cta-border)'
      }}
    >
      {/* Noise overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'var(--landing-noise)',
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px'
        }}
      />

      {/* SVG left */}
      <svg
        className="pointer-events-none absolute top-0 left-0 h-auto w-[85vw] max-w-4xl opacity-50"
        viewBox="0 0 896 668"
        fill="none"
        style={{ transform: 'translate(-25%, -10%)' }}
      >
        <path
          d={CONVEYOR_PATH}
          stroke="var(--landing-cta-stroke)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
        <path d={GEAR_PATH} fill="var(--landing-cta-stroke)" />
      </svg>

      {/* SVG right (mirrored) */}
      <svg
        className="pointer-events-none absolute top-0 right-0 h-auto w-[85vw] max-w-4xl opacity-25"
        viewBox="0 0 896 668"
        fill="none"
        style={{ transform: 'translate(35%, 5%) scaleX(-1)' }}
      >
        <path
          d={CONVEYOR_PATH}
          stroke="var(--landing-cta-stroke-light)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      {/* Gear bottom-right */}
      <svg
        className="pointer-events-none absolute right-[10%] bottom-[15%] opacity-20"
        width="48"
        height="48"
        viewBox="394 12 44 44"
        fill="none"
      >
        <path d={GEAR_PATH} fill="var(--landing-cta-stroke)" />
      </svg>

      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-[10%] left-1/2 -translate-x-1/2"
          style={{
            width: 800,
            height: 400,
            background:
              'radial-gradient(ellipse at center, rgba(56, 165, 220, 0.22) 0%, rgba(56, 140, 204, 0.07) 50%, transparent 70%)',
            filter: 'blur(80px)'
          }}
        />
        <div
          className="absolute top-[40%] right-[20%]"
          style={{
            width: 500,
            height: 500,
            background:
              'radial-gradient(ellipse at center, rgba(56, 165, 220, 0.1) 0%, transparent 60%)',
            filter: 'blur(100px)'
          }}
        />
      </div>

      {/* Content */}
      <div className={`relative mx-auto w-full ${MAX_WIDTH} px-6 py-24 sm:py-36`}>
        <p
          className="mb-4 text-xs font-medium tracking-widest uppercase"
          style={{ color: 'var(--landing-hero-fg-muted)' }}
        >
          Get started today
        </p>
        <h2
          className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
          style={{ color: 'var(--landing-hero-fg)', textWrap: 'balance' }}
        >
          Stop missing signals. <GradientText>Start converting them.</GradientText>
        </h2>
        <p
          className="mt-4 max-w-md text-sm leading-relaxed sm:text-base"
          style={{ color: 'var(--landing-hero-fg-secondary)' }}
        >
          Detect signals, find contacts, and send personalized outreach — all in one place.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <PrimaryCta variant="hero">Get started free</PrimaryCta>
          <SecondaryCta variant="hero" />
        </div>
      </div>
    </section>
  );
}
