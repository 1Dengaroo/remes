'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/auth-store';
import { useDemoStore } from './demo-store';

export function PrimaryCta({
  children = 'Get started',
  variant
}: {
  children?: React.ReactNode;
  variant?: 'hero';
}) {
  const user = useAuthStore((s) => s.user);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const router = useRouter();

  const handleClick = () => {
    if (user) {
      router.push('/research');
    } else {
      openAuthModal();
    }
  };

  const isHero = variant === 'hero';

  return (
    <Button
      size="lg"
      className={`group gap-2 rounded-full px-8 py-6 text-sm font-semibold transition-all duration-200 hover:opacity-90 ${
        isHero
          ? 'bg-(--landing-hero-btn-primary-bg) text-(--landing-hero-btn-primary-text) shadow-(--landing-hero-btn-primary-shadow) hover:shadow-(--landing-hero-btn-primary-hover-shadow)'
          : 'bg-(--landing-btn-primary-bg) text-(--landing-btn-primary-text) shadow-(--landing-shadow-btn) hover:shadow-(--landing-shadow-btn-hover)'
      }`}
      onClick={handleClick}
    >
      {children}
      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
    </Button>
  );
}

export function SecondaryCta({
  children = 'Book a demo',
  variant
}: {
  children?: React.ReactNode;
  variant?: 'hero';
}) {
  const openDemo = useDemoStore((s) => s.openDemo);

  const isHero = variant === 'hero';

  return (
    <Button
      variant="ghost"
      size="lg"
      className={`rounded-full border px-8 py-6 text-sm font-medium transition-all duration-200 ${
        isHero
          ? 'border-(--landing-hero-btn-secondary-border) text-(--landing-hero-btn-secondary-text) hover:bg-(--landing-hero-btn-secondary-hover)'
          : 'border-(--landing-btn-secondary-border) text-(--landing-btn-secondary-text) hover:bg-(--landing-btn-secondary-hover)'
      }`}
      onClick={openDemo}
    >
      {children}
    </Button>
  );
}
