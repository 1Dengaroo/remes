'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import type { SentEmail } from '@/lib/types';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { EmailDetailContent } from './email-detail-content';

export function MobileEmailSheet({
  email,
  onClose
}: {
  email: SentEmail | null;
  onClose: () => void;
}) {
  const isMobile = useIsMobile();
  return (
    <Sheet open={!!email && isMobile} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="bottom" className="h-[80dvh]">
        <SheetHeader>
          <SheetTitle className="truncate">{email?.subject ?? 'Email Detail'}</SheetTitle>
          <SheetDescription className="sr-only">Email detail view</SheetDescription>
        </SheetHeader>
        {email && (
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <EmailDetailContent email={email} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
