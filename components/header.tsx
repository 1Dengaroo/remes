'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import { useAuthStore } from '@/lib/store/auth-store';
import { useProfileStore } from '@/lib/store/profile-store';
import { MAX_WIDTH } from '@/lib/layout';

function UserAvatar() {
  const user = useAuthStore((s) => s.user);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const openProfile = useProfileStore((s) => s.openProfile);

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

function MobileNav() {
  const pathname = usePathname();
  return <MobileNavSheet key={pathname} pathname={pathname} />;
}

function MobileNavSheet({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const linkClass = (active: boolean) =>
    `rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
      active
        ? 'bg-muted text-foreground'
        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
    }`;

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon-sm" onClick={() => setOpen(true)}>
        <Menu className="size-5" />
        <span className="sr-only">Open menu</span>
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" size="sm">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription className="sr-only">Site navigation links</SheetDescription>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-4">
            <Link href="/dashboard" className={linkClass(pathname.startsWith('/dashboard'))}>
              Dashboard
            </Link>
            <Link href="/research" className={linkClass(pathname.startsWith('/research'))}>
              Research
            </Link>
            <Link href="/emails" className={linkClass(pathname.startsWith('/emails'))}>
              Emails
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function LandingNav() {
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="hidden md:inline-flex"
        onClick={() => document.getElementById('use-cases')?.scrollIntoView({ behavior: 'smooth' })}
      >
        Use Cases
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="hidden md:inline-flex"
        onClick={() => document.getElementById('faqs')?.scrollIntoView({ behavior: 'smooth' })}
      >
        FAQs
      </Button>
    </>
  );
}

function getPageTitle(pathname: string): string | null {
  if (pathname.startsWith('/dashboard')) return 'Dashboard';
  if (pathname.startsWith('/research')) return 'Research';
  if (pathname.startsWith('/emails')) return 'Emails';
  if (pathname.startsWith('/settings')) return 'Settings';
  return null;
}

function AppNav({ pathname }: { pathname: string }) {
  const title = getPageTitle(pathname);
  const linkClass = (active: boolean) =>
    `hidden md:inline-flex ${active ? 'text-foreground' : 'text-muted-foreground'}`;

  return (
    <>
      <Button
        asChild
        variant="ghost"
        size="sm"
        className={linkClass(pathname.startsWith('/dashboard'))}
      >
        <Link href="/dashboard">Dashboard</Link>
      </Button>
      <Button
        asChild
        variant="ghost"
        size="sm"
        className={linkClass(pathname.startsWith('/research'))}
      >
        <Link href="/research">Research</Link>
      </Button>
      <Button
        asChild
        variant="ghost"
        size="sm"
        className={linkClass(pathname.startsWith('/emails'))}
      >
        <Link href="/emails">Emails</Link>
      </Button>
    </>
  );
}

export function Header() {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: 'var(--header-bg, hsl(var(--card)))',
        borderColor: 'var(--header-border, hsl(var(--border)))',
        backdropFilter: 'var(--header-backdrop, none)'
      }}
    >
      <div className={`mx-auto flex ${MAX_WIDTH} items-center justify-between px-4 py-3 md:px-6`}>
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/remes-logo.png" alt="Remes" width={24} height={24} className="rounded" />
            <span className="text-foreground text-sm font-semibold tracking-widest uppercase">
              Remes
            </span>
            <span className="bg-primary/15 text-primary rounded-sm px-1.5 py-0.5 text-[10px] leading-none font-medium tracking-wide uppercase">
              Beta
            </span>
          </Link>
          {!isLanding && (
            <span className="text-muted-foreground text-sm font-medium md:hidden">
              / {getPageTitle(pathname)}
            </span>
          )}
          {isLanding ? <LandingNav /> : <AppNav pathname={pathname} />}
        </div>
        <div className="flex items-center gap-2">
          <UserAvatar />
          {!isLanding && <MobileNav />}
        </div>
      </div>
    </header>
  );
}
