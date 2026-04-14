'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDemoStore } from './demo-store';

export function DemoCta({
  children = 'See it in action',
  variant
}: {
  children?: React.ReactNode;
  variant?: 'hero';
}) {
  const openDemo = useDemoStore((s) => s.openDemo);

  const isHero = variant === 'hero';

  return (
    <Button
      size="lg"
      className={`group gap-2 rounded-full px-8 py-6 text-sm font-semibold transition-all duration-200 ${
        isHero
          ? 'bg-(--landing-hero-btn-primary-bg) text-(--landing-hero-btn-primary-text) shadow-(--landing-hero-btn-primary-shadow) hover:bg-(--landing-hero-btn-primary-bg)/90 hover:shadow-(--landing-hero-btn-primary-hover-shadow)'
          : 'text-primary-foreground bg-primary hover:bg-primary/90 shadow-(--landing-shadow-btn) hover:shadow-(--landing-shadow-btn-hover)'
      }`}
      onClick={openDemo}
    >
      {children}
      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
    </Button>
  );
}
