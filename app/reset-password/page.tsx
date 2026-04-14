import { createMetadata } from '@/lib/metadata';
import { ResetPasswordPage } from '@/components/auth/reset-password-page.client';

export const metadata = createMetadata({
  title: 'Reset Password | Remes',
  description: 'Set a new password for your Remes account.',
  path: '/reset-password'
});

export default function ResetPassword() {
  return <ResetPasswordPage />;
}
