'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/auth-store';
import { useProfileStore } from '@/lib/store/profile-store';

function UserAvatar() {
  const user = useAuthStore((s) => s.user);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const openProfile = useProfileStore((s) => s.openProfile);

  if (!user) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="text-white/60 hover:bg-white/10 hover:text-white"
        onClick={openAuthModal}
      >
        Sign in
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => openProfile()}
      className="hover:ring-primary/30 rounded-full transition-all hover:ring-2"
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
        <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-full text-xs font-medium">
          {(user.email?.[0] ?? '?').toUpperCase()}
        </div>
      )}
    </button>
  );
}

function LandingNav() {
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="hidden text-white/60 hover:bg-white/10 hover:text-white md:inline-flex"
        onClick={() => document.getElementById('use-cases')?.scrollIntoView({ behavior: 'smooth' })}
      >
        Use Cases
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="hidden text-white/60 hover:bg-white/10 hover:text-white md:inline-flex"
        onClick={() => document.getElementById('faqs')?.scrollIntoView({ behavior: 'smooth' })}
      >
        FAQs
      </Button>
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
      style={{ padding: scrolled ? '10px 16px 0' : '0' }}
    >
      <header
        className="w-full transition-all duration-500 ease-out"
        style={{
          maxWidth: scrolled ? '1500px' : '100%',
          backgroundColor: scrolled ? 'rgba(8, 8, 12, 0.8)' : 'transparent',
          borderRadius: scrolled ? '9999px' : '0',
          border: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
          borderBottomColor: scrolled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.06)',
          backdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'blur(12px)',
          boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.25)' : 'none'
        }}
      >
        <div
          className="flex items-center justify-between transition-all duration-500 ease-out"
          style={{ padding: scrolled ? '8px 20px' : '12px 24px' }}
        >
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/remes-logo.png" alt="Remes" width={24} height={24} className="rounded" />
              <span className="text-sm font-semibold tracking-widest text-white uppercase">
                Remes
              </span>
              <span className="rounded-sm bg-white/10 px-1.5 py-0.5 text-[10px] leading-none font-medium tracking-wide text-white/60 uppercase">
                Beta
              </span>
            </Link>
            <LandingNav />
          </div>
          <div className="flex items-center gap-2">
            <UserAvatar />
          </div>
        </div>
      </header>
    </div>
  );
}
