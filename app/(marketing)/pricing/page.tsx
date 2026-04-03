import { createMetadata } from '@/lib/metadata';
import { Pricing } from '@/components/landing/pricing.client';

export const metadata = createMetadata({
  title: 'Pricing',
  description:
    'Remes is free during beta. Get full access to signal detection, contact discovery, and AI outreach while we refine the product.',
  path: '/pricing'
});

export default function PricingPage() {
  return <Pricing />;
}
