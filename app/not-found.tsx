import Link from 'next/link';
import { HeroBackdrop } from '@/components/shared/hero-backdrop';

export default function NotFound() {
  return (
    <HeroBackdrop theme="indigo-dusk" className="min-h-screen">
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="text-[8rem] leading-none font-bold tracking-tighter text-(--landing-hero-fg) sm:text-[10rem]">
          404
        </p>
        <h1 className="-mt-2 text-lg font-medium text-(--landing-hero-fg)">Page not found</h1>
        <p className="mt-2 max-w-xs text-sm text-(--landing-hero-fg-secondary)">
          This page doesn&apos;t exist, or was moved to another location.
        </p>
        <Link
          href="/"
          className="mt-6 text-sm font-medium text-(--landing-hero-fg-secondary) transition-colors hover:text-(--landing-hero-fg)"
        >
          Back to home
        </Link>
      </div>
    </HeroBackdrop>
  );
}
