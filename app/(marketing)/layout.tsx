import { LandingHeader } from '@/components/landing/landing-header.client';
import { LandingFooter } from '@/components/shared/landing-footer';
import { DemoModal } from '@/components/landing/demo-modal.client';
import { MAX_WIDTH } from '@/lib/layout';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="marketing bg-[#08090a]">
      <LandingHeader />
      {children}
      <div className={`mx-auto w-full ${MAX_WIDTH} px-6`}>
        <LandingFooter />
      </div>
      <DemoModal />
    </div>
  );
}
