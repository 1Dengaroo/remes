import { MAX_WIDTH } from '@/lib/layout';
import { HeroBackdrop, type HeroTheme } from '@/components/shared/hero-backdrop';
import { PrimaryCta, SecondaryCta } from './cta-buttons.client';

export function CtaSection({ theme }: { theme?: HeroTheme }) {
  return (
    <HeroBackdrop theme={theme} cone={false} className="relative">
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
          Stop missing signals.{' '}
          <span style={{ color: 'var(--landing-hero-fg-secondary)' }}>Start converting them.</span>
        </h2>
        <p
          className="mt-4 max-w-md text-sm leading-relaxed sm:text-base"
          style={{ color: 'var(--landing-hero-fg-secondary)' }}
        >
          Detect signals, find contacts, and send personalized outreach. All in one place.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <PrimaryCta variant="hero">Get started free</PrimaryCta>
          <SecondaryCta variant="hero" />
        </div>
      </div>
    </HeroBackdrop>
  );
}
