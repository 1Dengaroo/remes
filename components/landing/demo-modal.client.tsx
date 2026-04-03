'use client';

import { Mail } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useDemoStore } from '@/lib/store/demo-store';

export function DemoModal() {
  const open = useDemoStore((s) => s.open);
  const closeDemo = useDemoStore((s) => s.closeDemo);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && closeDemo()}>
      <DialogContent
        className="border-white/6 bg-(--landing-bg-modal) text-(--landing-text) sm:max-w-sm"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-(--landing-text)">
            Book a demo
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-(--landing-text-muted)">
            Get a personalized walkthrough of how Remes can build pipeline for your team. We&apos;ll
            show you signal detection, contact discovery, and AI outreach tailored to your ICP.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <p className="text-sm leading-relaxed text-(--landing-text-muted)">
            Reach out to schedule a time. Most demos are booked within 24 hours.
          </p>

          <a
            href="mailto:kenny@remes.so?subject=Demo%20request"
            className="group flex items-center gap-3 rounded-lg border border-white/6 bg-white/3 px-4 py-3 transition-colors duration-150 hover:border-(--landing-accent)/30 hover:bg-(--landing-accent)/4"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-(--landing-accent)/10">
              <Mail className="size-4 text-(--landing-accent)" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-(--landing-text)">kenny@remes.so</span>
              <span className="text-xs text-(--landing-text-muted)/60">
                Co-Founder &amp; Product Lead
              </span>
            </div>
          </a>

          <a
            href="mailto:andy@remes.so?subject=Demo%20request"
            className="group flex items-center gap-3 rounded-lg border border-white/6 bg-white/3 px-4 py-3 transition-colors duration-150 hover:border-(--landing-accent)/30 hover:bg-(--landing-accent)/4"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-(--landing-accent)/10">
              <Mail className="size-4 text-(--landing-accent)" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-(--landing-text)">andy@remes.so</span>
              <span className="text-xs text-(--landing-text-muted)/60">Co-Founder &amp; SWE</span>
            </div>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
