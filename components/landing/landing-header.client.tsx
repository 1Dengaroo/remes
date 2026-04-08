'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/auth-store';
import { useProfileStore } from '@/lib/store/profile-store';
import { MAX_WIDTH } from '@/lib/layout';
import { NAV_LINKS } from './landing-constants';
import { MobileNav } from './mobile-nav.client';

function UserAvatar({ light }: { light: boolean }) {
  const user = useAuthStore((s) => s.user);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const openProfile = useProfileStore((s) => s.openProfile);

  if (!user) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="hidden text-sm font-medium transition-colors duration-500 hover:bg-transparent md:inline-flex"
        style={{
          color: light ? 'var(--landing-hero-fg-secondary)' : 'var(--landing-fg)'
        }}
        onClick={openAuthModal}
      >
        Log in
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => openProfile()}
      className="rounded-full hover:bg-transparent hover:opacity-80"
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
    </Button>
  );
}

function DesktopNav({ light }: { light: boolean }) {
  return (
    <>
      {NAV_LINKS.map((link) => (
        <Button
          key={link.label}
          variant="link"
          asChild
          className="hidden h-auto p-0 text-sm font-normal no-underline transition-colors duration-500 hover:no-underline md:inline-flex"
          style={{
            color: light ? 'var(--landing-hero-fg-secondary)' : 'var(--landing-fg)'
          }}
        >
          <a href={link.href}>{link.label}</a>
        </Button>
      ))}
    </>
  );
}

export function LandingHeader() {
  const pathname = usePathname();
  const darkHero = pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const light = darkHero && !scrolled;

  return (
    <div
      className={`fixed top-0 right-0 left-0 z-50 flex justify-center transition-all duration-500 ease-out ${scrolled ? 'px-4 pt-2.5' : 'pt-0'}`}
    >
      <header
        className="w-full transition-all duration-500 ease-out"
        style={{
          maxWidth: scrolled ? '56rem' : '100%',
          backgroundColor: scrolled ? 'var(--landing-header-bg)' : 'transparent',
          borderRadius: scrolled ? '9999px' : '0',
          border: scrolled ? '1px solid var(--landing-border-card)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(1.3)' : 'none',
          boxShadow: scrolled ? 'var(--landing-shadow-header)' : 'none'
        }}
      >
        <div
          className={`mx-auto flex w-full ${MAX_WIDTH} items-center justify-between transition-all duration-500 ease-out`}
          style={{ padding: scrolled ? '10px 24px' : '18px 24px' }}
        >
          <div className="flex items-center gap-6">
            <Link href="/" className="relative z-50 flex items-center gap-2.5">
              <Image src="/remes-logo.png" alt="Remes" width={22} height={22} className="rounded" />
              <span
                className="text-sm font-semibold tracking-wide transition-colors duration-500"
                style={{ color: light ? 'var(--landing-hero-fg)' : 'var(--landing-fg)' }}
              >
                Remes
              </span>
            </Link>
            <DesktopNav light={light} />
          </div>
          <div className="flex items-center gap-3">
            <UserAvatar light={light} />
            <MobileNav light={light} />
          </div>
        </div>
      </header>
    </div>
  );
}
