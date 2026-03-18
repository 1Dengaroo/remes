'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/auth-store';
import { useProfileStore } from '@/lib/store/profile-store';
import { createClient } from '@/lib/supabase/client';

function SignalMark({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="9" cy="9" r="9" fill="currentColor" />
      <circle cx="9" cy="9" r="4" fill="white" />
    </svg>
  );
}

function UserAvatar() {
  const [user, setUser] = useState<User | null>(null);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const openProfile = useProfileStore((s) => s.openProfile);

  const configured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabase = configured ? createClient() : null;

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  if (!user) {
    return (
      <Button variant="ghost" size="sm" onClick={openAuthModal}>
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

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: 'var(--header-bg, hsl(var(--card)))',
        borderColor: 'var(--header-border, hsl(var(--border)))',
        backdropFilter: 'var(--header-backdrop, none)'
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <SignalMark className="text-primary" />
            <span className="text-foreground text-sm font-semibold tracking-widest uppercase">
              Signal
            </span>
            <span className="bg-primary/15 text-primary rounded-sm px-1.5 py-0.5 text-[10px] leading-none font-medium tracking-wide uppercase">
              Beta
            </span>
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link href="/research">Research</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/emails">Emails</Link>
          </Button>
        </div>
        <UserAvatar />
      </div>
    </header>
  );
}
