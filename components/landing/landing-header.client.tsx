'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/auth-store';
import { useProfileStore } from '@/lib/store/profile-store';
import { MAX_WIDTH } from '@/lib/layout';
import { NAV_LINKS } from './landing-constants';
import { MobileNav } from './mobile-nav.client';

function UserAvatar() {
  const user = useAuthStore((s) => s.user);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const openProfile = useProfileStore((s) => s.openProfile);

  if (!user) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="text-landing-fg-secondary hover:text-landing-fg hidden text-sm font-medium transition-colors duration-150 hover:bg-transparent md:inline-flex"
        onClick={openAuthModal}
      >
        Log in
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => openProfile()}
      className="rounded-full transition-opacity duration-150 hover:opacity-80"
    >
      {user.user_metadata?.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element -- external Google avatar URL
        <img
          src={user.user_metadata.avatar_url}
          alt=""
          className="size-7 rounded-full"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="flex size-7 items-center justify-center rounded-full bg-(--landing-accent)/20 text-xs font-medium text-(--landing-accent-light)">
          {(user.email?.[0] ?? '?').toUpperCase()}
        </div>
      )}
    </button>
  );
}

function DesktopNav() {
  return (
    <>
      {NAV_LINKS.map((link) => (
        <Button
          key={link.label}
          variant="link"
          asChild
          className="text-landing-fg-secondary hover:text-landing-fg hidden h-auto p-0 text-sm font-normal no-underline transition-colors duration-150 hover:no-underline md:inline-flex"
        >
          <a href={link.href}>{link.label}</a>
        </Button>
      ))}
    </>
  );
}

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 right-0 left-0 z-50 flex justify-center transition-all duration-500 ease-out"
      style={{ padding: scrolled ? '10px 0 0' : '0' }}
    >
      <header
        className="w-full transition-all duration-500 ease-out"
        style={{
          maxWidth: scrolled ? '87.5rem' : '100%',
          backgroundColor: scrolled ? 'var(--landing-header-bg)' : 'transparent',
          borderRadius: scrolled ? '9999px' : '0',
          border: scrolled ? '1px solid var(--landing-header-border)' : '1px solid transparent',
          borderBottomColor: scrolled
            ? 'var(--landing-header-border)'
            : 'var(--landing-header-border-bottom)',
          backdropFilter: scrolled ? 'blur(24px) saturate(1.3)' : 'none',
          boxShadow: scrolled ? 'var(--landing-shadow-header)' : 'none'
        }}
      >
        <div
          className={`mx-auto flex w-full ${MAX_WIDTH} items-center justify-between px-6 transition-all duration-500 ease-out`}
          style={{ padding: scrolled ? '8px 20px' : '14px 24px' }}
        >
          <div className="flex items-center gap-6">
            <Link href="/" className="relative z-50 flex items-center gap-2.5">
              <Image src="/remes-logo.png" alt="Remes" width={22} height={22} className="rounded" />
              <span className="text-landing-fg text-sm font-semibold tracking-wide">Remes</span>
            </Link>
            <DesktopNav />
          </div>
          <div className="flex items-center gap-3">
            <UserAvatar />
            <MobileNav />
          </div>
        </div>
      </header>
    </div>
  );
}
