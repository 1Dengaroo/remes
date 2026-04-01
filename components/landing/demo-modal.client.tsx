'use client';

import { Mail } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

export function DemoModal({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="border-white/6 bg-[#111214] text-[#e4e5e9] sm:max-w-sm"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-[#e4e5e9]">Book a demo</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-[#9c9da1]">
            Get a personalized walkthrough of how Remes can build pipeline for your team. We&apos;ll
            show you signal detection, contact discovery, and AI outreach — tailored to your ICP.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <p className="text-sm leading-relaxed text-[#9c9da1]">
            Reach out to schedule a time — most demos are booked within 24 hours.
          </p>

          <a
            href="mailto:kenny@remes.so?subject=Demo%20request"
            className="group flex items-center gap-3 rounded-lg border border-white/6 bg-white/3 px-4 py-3 transition-colors duration-150 hover:border-[#5643cc]/30 hover:bg-[#5643cc]/4"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#5643cc]/10">
              <Mail className="size-4 text-[#5643cc]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[#e4e5e9]">kenny@remes.so</span>
              <span className="text-xs text-[#9c9da1]/60">Co-Founder &amp; Product Lead</span>
            </div>
          </a>

          <a
            href="mailto:andy@remes.so?subject=Demo%20request"
            className="group flex items-center gap-3 rounded-lg border border-white/6 bg-white/3 px-4 py-3 transition-colors duration-150 hover:border-[#5643cc]/30 hover:bg-[#5643cc]/4"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#5643cc]/10">
              <Mail className="size-4 text-[#5643cc]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[#e4e5e9]">andy@remes.so</span>
              <span className="text-xs text-[#9c9da1]/60">Co-Founder &amp; SWE</span>
            </div>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
