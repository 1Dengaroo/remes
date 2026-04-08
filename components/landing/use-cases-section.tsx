import { MAX_WIDTH } from '@/lib/layout';
import { InteractiveDemo } from './interactive-demo.client';
import { CONVEYOR_PATH, GEAR_PATH } from './hero-illustrations';

export function UseCasesSection() {
  return (
    <section
      id="use-cases"
      className="relative scroll-mt-16 overflow-hidden"
      style={{
        backgroundColor: 'var(--landing-section-dark-bg)',
        borderTop: '1px solid var(--landing-section-dark-border)',
        borderBottom: '1px solid var(--landing-section-dark-border)'
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
          stroke="var(--landing-section-dark-stroke)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
        <path d={GEAR_PATH} fill="var(--landing-section-dark-stroke)" />
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
          stroke="var(--landing-section-dark-stroke-light)"
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
        <path d={GEAR_PATH} fill="var(--landing-section-dark-stroke)" />
      </svg>

      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-[15%] left-1/2 -translate-x-1/2"
          style={{
            width: 800,
            height: 400,
            background:
              'radial-gradient(ellipse at center, rgba(86, 67, 204, 0.3) 0%, rgba(86, 67, 204, 0.08) 50%, transparent 70%)',
            filter: 'blur(80px)'
          }}
        />
        <div
          className="absolute top-[40%] left-[20%]"
          style={{
            width: 600,
            height: 600,
            background:
              'radial-gradient(ellipse at center, rgba(86, 67, 204, 0.12) 0%, transparent 60%)',
            filter: 'blur(100px)'
          }}
        />
      </div>

      {/* Content */}
      <div className={`relative mx-auto w-full ${MAX_WIDTH} px-6 py-24 sm:py-36`}>
        <div className="mb-14 sm:mb-20">
          <p
            className="mb-3 text-xs font-medium tracking-widest uppercase"
            style={{ color: 'var(--landing-hero-fg-muted)' }}
          >
            How it works
          </p>
          <h2
            className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
            style={{ color: 'var(--landing-hero-fg)', textWrap: 'balance' }}
          >
            From signal to sent in minutes
          </h2>
          <p
            className="mt-3 max-w-md text-sm leading-relaxed"
            style={{ color: 'var(--landing-hero-fg-secondary)' }}
          >
            Three steps. Fully automated. No manual research required.
          </p>
        </div>

        <InteractiveDemo />
      </div>
    </section>
  );
}
