import { Suspense } from 'react';
import { LandingHeader } from '@/components/landing/landing-header.client';
import { LandingFooter } from '@/components/shared/landing-footer';
import { DemoModal } from '@/components/landing/demo-modal.client';
import { CookieConsentBanner } from '@/components/shared/cookie-consent-banner.client';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="light" className="marketing bg-background">
      <LandingHeader />
      {children}
      <LandingFooter />
      <Suspense>
        <DemoModal />
      </Suspense>
      <CookieConsentBanner />
    </div>
  );
}
