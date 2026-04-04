'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useDemoStore } from '@/lib/store/demo-store';

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
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    )
  },
  {
    label: 'TikTok',
    href: '#',
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
    <footer className="py-16">
      <div className="mb-10 flex justify-center">
        <div className="h-px w-full bg-linear-to-r from-transparent via-white/6 to-transparent" />
      </div>

      <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
        {/* Link columns */}
        <div className="grid grid-cols-3 gap-8 sm:flex sm:gap-16">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-landing-fg-muted mb-3 text-xs font-medium">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {'action' in link ? (
                      <Button
                        variant="link"
                        className="text-landing-fg-secondary hover:text-landing-fg h-auto p-0 text-sm font-normal no-underline transition-colors duration-150 hover:no-underline"
                        onClick={openDemo}
                      >
                        {link.label}
                      </Button>
                    ) : (
                      <Button
                        variant="link"
                        asChild
                        className="text-landing-fg-secondary hover:text-landing-fg h-auto p-0 text-sm font-normal no-underline transition-colors duration-150 hover:no-underline"
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

        {/* Social + copyright */}
        <div className="flex flex-col items-start gap-4 sm:items-end sm:justify-end">
          <div className="flex items-center gap-1">
            {SOCIAL_LINKS.map((social) => (
              <Tooltip key={social.label}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="text-landing-fg-muted hover:text-landing-fg size-8 hover:bg-white/5"
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
          <p className="text-landing-fg-muted text-xs">
            &copy; {new Date().getFullYear()} Remes. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
