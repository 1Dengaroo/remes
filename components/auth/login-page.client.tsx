'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HERO_THEME } from '@/lib/layout';
import { HeroBackdrop, HERO_THEMES } from '@/components/shared/hero-backdrop';
import { AuthForm } from './auth-form.client';
import { Mode } from './email-form.client';

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const defaultMode = searchParams.get('signup') === 'true' ? Mode.SignUp : Mode.SignIn;

  return (
    <HeroBackdrop
      theme={HERO_THEME.login}
      className="flex min-h-dvh flex-col items-center justify-center px-6 py-16"
    >
      {/* Logo */}
      <Link
        href="/"
        className="relative z-10 mb-8 flex items-center gap-2.5 transition-opacity hover:opacity-80"
      >
        <Image src="/remes-logo.png" alt="Remes" width={28} height={28} className="rounded" />
        <span className="text-lg font-semibold" style={{ color: 'var(--landing-hero-fg)' }}>
          Remes
        </span>
      </Link>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Glow behind card */}
        <div
          className="pointer-events-none absolute -inset-16 z-0"
          style={{
            background: HERO_THEMES[HERO_THEME.login]['--login-card-glow'],
            filter: 'blur(40px)'
          }}
        />

        <div className="bg-card border-border relative z-10 rounded-2xl border p-8 shadow-xl">
          {error === 'auth_failed' && (
            <p className="text-destructive mb-4 text-center text-sm">
              Authentication failed. Please try again.
            </p>
          )}
          <AuthForm defaultMode={defaultMode} />
        </div>
      </div>

      {/* Back to home */}
      <Link
        href="/"
        className="relative z-10 mt-6 text-sm transition-opacity hover:opacity-80"
        style={{ color: 'var(--landing-hero-fg-secondary)' }}
      >
        Back to home
      </Link>
    </HeroBackdrop>
  );
}

export function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
