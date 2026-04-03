'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/auth-store';
import { useProfileStore } from '@/lib/store/profile-store';
import { useDemoStore } from '@/lib/store/demo-store';
import { MAX_WIDTH } from '@/lib/layout';

const NAV_LINKS = [
  { label: 'Features', href: '/#use-cases' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'FAQs', href: '/#faqs' },
  { label: 'About', href: '/about' }
];

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

/**
 * Full-screen mobile nav overlay using Radix Dialog.
 * Radix handles: focus trap, body scroll lock, Escape to close,
 * aria-modal, focus restoration on close.
 */
function MobileNav() {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const openDemo = useDemoStore((s) => s.openDemo);

  const close = () => setOpen(false);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      {/* Hamburger trigger */}
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          className="text-landing-fg-secondary relative z-50 flex size-8 items-center justify-center md:hidden"
          aria-label="Open menu"
        >
          <div className="flex w-4 flex-col gap-1.25">
            <span
              className="block h-px w-full bg-current transition-all duration-300 ease-out"
              style={{ transform: open ? 'translateY(3px) rotate(45deg)' : 'none' }}
            />
            <span
              className="block h-px w-full bg-current transition-all duration-300 ease-out"
              style={{ transform: open ? 'translateY(-3px) rotate(-45deg)' : 'none' }}
            />
          </div>
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        {/* Full-screen overlay content */}
        <DialogPrimitive.Content
          className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 fixed inset-0 z-40 flex flex-col md:hidden"
          style={{ backgroundColor: 'var(--landing-bg-card)' }}
          aria-describedby={undefined}
        >
          <DialogPrimitive.Title className="sr-only">Navigation menu</DialogPrimitive.Title>

          {/* Close button — top right, matches hamburger position */}
          <DialogPrimitive.Close asChild>
            <button
              type="button"
              className="text-landing-fg-secondary absolute top-3.5 right-6 z-50 flex size-8 items-center justify-center rounded-sm focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
              aria-label="Close menu"
            >
              <div className="flex w-4 flex-col gap-1.25">
                <span className="block h-px w-full origin-center translate-y-0.75 rotate-45 bg-current" />
                <span className="block h-px w-full origin-center -translate-y-0.75 -rotate-45 bg-current" />
              </div>
            </button>
          </DialogPrimitive.Close>

          {/* Nav links — stagger in from top */}
          <nav className="flex flex-1 flex-col px-8 pt-24">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                onClick={close}
                className="text-landing-fg border-b border-white/6 py-5 text-2xl font-medium tracking-tight transition-all duration-500 ease-out last:border-0"
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: open ? `${100 + i * 60}ms` : '0ms'
                }}
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                openDemo();
                close();
              }}
              className="text-landing-fg py-5 text-left text-2xl font-medium tracking-tight transition-all duration-500 ease-out"
              style={{
                opacity: open ? 1 : 0,
                transform: open ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: open ? `${100 + NAV_LINKS.length * 60}ms` : '0ms'
              }}
            >
              Book a demo
            </button>
          </nav>

          {/* Bottom section */}
          <div
            className="px-8 pb-10 transition-all duration-500 ease-out"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? 'translateY(0)' : 'translateY(12px)',
              transitionDelay: open ? '400ms' : '0ms'
            }}
          >
            {!user && (
              <Button
                className="mb-6 w-full rounded-full bg-white py-6 text-sm font-semibold text-(--landing-bg)"
                onClick={() => {
                  openAuthModal();
                  close();
                }}
              >
                Log in
              </Button>
            )}
            <p className="text-landing-fg-muted text-xs">&copy; {new Date().getFullYear()} Remes</p>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
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
