import { MAX_WIDTH } from '@/lib/layout';
import { HeroBackdrop, type HeroTheme } from '@/components/shared/hero-backdrop';
import { InteractiveDemo } from './interactive-demo.client';

export function UseCasesSection({ theme }: { theme?: HeroTheme }) {
  return (
    <HeroBackdrop theme={theme} cone={false} className="relative scroll-mt-16">
      {/* Content */}
      <div id="use-cases" className={`relative mx-auto w-full ${MAX_WIDTH} px-6 py-24 sm:py-36`}>
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
    </HeroBackdrop>
  );
}
