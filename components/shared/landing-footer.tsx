'use client';

import Image from 'next/image';
import { MAX_WIDTH } from '@/lib/layout';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useDemoStore } from '@/components/landing/demo-store';

const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/#use-cases' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'FAQs', href: '/#faqs' }
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', action: 'demo' as const }
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' }
    ]
  }
];

const SOCIAL_LINKS = [
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@apollo.advice',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    )
  }
];

export function LandingFooter() {
  const openDemo = useDemoStore((s) => s.openDemo);

  return (
    <footer className="bg-card py-16">
      <div className={`mx-auto w-full ${MAX_WIDTH} px-6`}>
        <div className="flex flex-col gap-12 sm:flex-row sm:justify-between">
          {/* Brand column */}
          <div className="flex max-w-55 flex-col gap-4">
            <div className="flex items-center gap-2">
              <Image src="/remes-logo.png" alt="Remes" width={22} height={22} className="rounded" />
              <span className="text-foreground text-sm font-semibold tracking-tight">Remes</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              AI-powered outbound sales for SMBs. Monitor buying signals, find contacts, and send
              personalized outreach — automatically.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-3 gap-8 sm:flex sm:gap-16">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="text-foreground mb-4 text-sm font-semibold tracking-tight">
                  {col.title}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {'action' in link ? (
                        <Button
                          variant="link"
                          className="text-muted-foreground hover:text-foreground h-auto p-0 text-sm font-normal no-underline transition-colors duration-150 hover:no-underline"
                          onClick={openDemo}
                        >
                          {link.label}
                        </Button>
                      ) : (
                        <Button
                          variant="link"
                          asChild
                          className="text-muted-foreground hover:text-foreground h-auto p-0 text-sm font-normal no-underline transition-colors duration-150 hover:no-underline"
                        >
                          <a href={link.href}>{link.label}</a>
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex items-center justify-between border-t border-black/8 pt-6">
          <p className="text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()} Remes. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            {SOCIAL_LINKS.map((social) => (
              <Tooltip key={social.label}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="text-muted-foreground hover:text-foreground size-8 hover:bg-black/5"
                  >
                    <a href={social.href} aria-label={social.label}>
                      {social.icon}
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{social.label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
