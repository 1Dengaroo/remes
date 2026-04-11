'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'remes_cookie_consent';

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function dismiss(value: 'accepted' | 'declined') {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6">
      <div className="border-border bg-card mx-auto flex max-w-lg flex-col items-center gap-3 rounded-xl border px-5 py-4 shadow-lg sm:flex-row sm:gap-4">
        <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
          We use cookies to improve your experience.{' '}
          <a
            href="/privacy"
            className="text-foreground hover:text-primary underline underline-offset-2 transition-colors"
          >
            Privacy policy
          </a>
        </p>
        <div className="flex shrink-0 gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => dismiss('declined')}
            className="text-muted-foreground hover:text-foreground text-xs"
          >
            Decline
          </Button>
          <Button
            size="sm"
            onClick={() => dismiss('accepted')}
            className="bg-primary hover:bg-primary/80 text-xs text-white"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
