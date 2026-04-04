'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/auth-store';
import { useDemoStore } from './demo-store';

export function PrimaryCta({ children = 'Get started' }: { children?: React.ReactNode }) {
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

  return (
    <Button
      size="lg"
      className="group relative gap-2 rounded-full bg-white px-8 py-6 text-sm font-semibold text-(--landing-bg) shadow-(--landing-shadow-btn) transition-all duration-300 hover:shadow-(--landing-shadow-btn-hover)"
      onClick={handleClick}
    >
      {children}
      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
    </Button>
  );
}

export function SecondaryCta({ children = 'Book a demo' }: { children?: React.ReactNode }) {
  const openDemo = useDemoStore((s) => s.openDemo);

  return (
    <Button
      variant="ghost"
      size="lg"
      className="text-landing-fg-secondary hover:text-landing-fg rounded-full border border-white/15 px-8 py-6 text-sm font-medium transition-all duration-200 hover:border-white/25 hover:bg-white/3"
      onClick={openDemo}
    >
      {children}
    </Button>
  );
}
