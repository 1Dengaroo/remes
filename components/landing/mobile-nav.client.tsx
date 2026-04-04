'use client';

import { useState } from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/auth-store';
import { useDemoStore } from './demo-store';
import { NAV_LINKS } from './landing-constants';

/**
 * Full-screen mobile nav overlay using Radix Dialog.
 * Radix handles: focus trap, body scroll lock, Escape to close,
 * aria-modal, focus restoration on close.
 */
export function MobileNav() {
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
