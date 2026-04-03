import { createMetadata } from '@/lib/metadata';
import { Landing } from '@/components/landing/landing';

export const metadata = createMetadata({
  title: 'Remes | AI-Powered Outbound Sales',
  description:
    'Remes scans for buying signals, maps contacts at every account, and crafts hyper-personalized outreach.',
  path: '/'
});

export default function Home() {
  return <Landing />;
}
