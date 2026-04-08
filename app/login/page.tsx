import { createMetadata } from '@/lib/metadata';
import { LoginPage } from '@/components/auth/login-page.client';

export const metadata = createMetadata({
  title: 'Sign in | Remes',
  description: 'Sign in to your Remes account to start finding high-intent leads.',
  path: '/login'
});

export default function Login() {
  return <LoginPage />;
}
