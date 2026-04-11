import Link from 'next/link';
import { HeroBackdrop } from '@/components/shared/hero-backdrop';

export default function SessionNotFound() {
  return (
    <HeroBackdrop theme="indigo-dusk" className="min-h-[calc(100vh-49px)]">
      <div className="relative z-10 flex min-h-[calc(100vh-49px)] flex-col items-center justify-center px-6 text-center">
        <p className="text-[8rem] leading-none font-bold tracking-tighter text-(--landing-hero-fg) sm:text-[10rem]">
          404
        </p>
        <h1 className="-mt-2 text-lg font-medium text-(--landing-hero-fg)">Session not found</h1>
        <p className="mt-2 max-w-xs text-sm text-(--landing-hero-fg-secondary)">
          This session doesn&apos;t exist or you don&apos;t have access to it.
        </p>
        <Link
          href="/research"
          className="mt-6 text-sm font-medium text-(--landing-hero-fg-secondary) transition-colors hover:text-(--landing-hero-fg)"
        >
          Back to sessions
        </Link>
      </div>
    </HeroBackdrop>
  );
}
