'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/auth-store';
import { useProfileStore } from '@/lib/store/profile-store';
import { MAX_WIDTH } from '@/lib/layout';

function UserAvatar() {
  const user = useAuthStore((s) => s.user);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const openProfile = useProfileStore((s) => s.openProfile);

  if (!user) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="text-sm font-medium text-white/40 transition-colors duration-150 hover:bg-transparent hover:text-white/80"
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
        <div className="flex size-7 items-center justify-center rounded-full bg-[#5643cc]/20 text-xs font-medium text-[#8a8fff]">
          {(user.email?.[0] ?? '?').toUpperCase()}
        </div>
      )}
    </button>
  );
}

function LandingNav() {
  return (
    <>
      <button
        type="button"
        className="hidden text-sm text-white/40 transition-colors duration-150 hover:text-white/80 md:inline-block"
        onClick={() => document.getElementById('use-cases')?.scrollIntoView({ behavior: 'smooth' })}
      >
        Features
      </button>
      <button
        type="button"
        className="hidden text-sm text-white/40 transition-colors duration-150 hover:text-white/80 md:inline-block"
        onClick={() => document.getElementById('faqs')?.scrollIntoView({ behavior: 'smooth' })}
      >
        FAQs
      </button>
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
      style={{ padding: scrolled ? '10px 24px 0' : '0' }}
    >
      <header
        className="w-full transition-all duration-500 ease-out"
        style={{
          maxWidth: scrolled ? '80rem' : '100%',
          backgroundColor: scrolled ? 'rgba(8, 9, 10, 0.8)' : 'transparent',
          borderRadius: scrolled ? '9999px' : '0',
          border: scrolled ? '1px solid rgba(255,255,255,0.04)' : '1px solid transparent',
          borderBottomColor: scrolled ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.03)',
          backdropFilter: scrolled ? 'blur(24px) saturate(1.3)' : 'none',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5)' : 'none'
        }}
      >
        <div
          className={`mx-auto flex w-full ${MAX_WIDTH} items-center justify-between px-6 transition-all duration-500 ease-out`}
          style={{ padding: scrolled ? '8px 20px' : '14px 24px' }}
        >
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/remes-logo.png" alt="Remes" width={22} height={22} className="rounded" />
              <span className="text-sm font-semibold tracking-wide text-white/90">Remes</span>
            </Link>
            <LandingNav />
          </div>
          <div className="flex items-center gap-3">
            <UserAvatar />
          </div>
        </div>
      </header>
    </div>
  );
}
