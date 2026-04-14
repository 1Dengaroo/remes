'use client';

import { useState } from 'react';
import { Info, Mail } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store/auth-store';
import { useDemoStore } from '@/components/landing/demo-store';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmailForm, Mode } from './email-form.client';

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
        fill="#EA4335"
      />
    </svg>
  );
}

interface AuthFormProps {
  defaultMode?: Mode;
}

const ENV_SIGNUP_DISABLED = process.env.NEXT_PUBLIC_DISABLE_SIGNUP === 'true';

function useBypassParam() {
  const [bypassed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).has('enableLogin');
  });
  return bypassed;
}

export function AuthForm({ defaultMode = Mode.SignIn }: AuthFormProps) {
  const bypassed = useBypassParam();
  const signupDisabled = ENV_SIGNUP_DISABLED && !bypassed;
  const closeAuthModal = useAuthStore((s) => s.closeAuthModal);
  const openDemo = useDemoStore((s) => s.openDemo);
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  const isSignUp = mode === Mode.SignUp;

  function switchMode() {
    setMode(isSignUp ? Mode.SignIn : Mode.SignUp);
    setServerMessage(null);
    setConfirmationEmail(null);
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setServerMessage(null);
    setResetLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`
    });
    setResetLoading(false);
    if (error) {
      setServerMessage({ type: 'error', text: error.message });
      return;
    }
    setResetEmailSent(resetEmail);
  }

  async function handleGoogleLogin() {
    setOauthLoading(true);
    setServerMessage(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) {
      setServerMessage({ type: 'error', text: error.message });
      setOauthLoading(false);
    }
  }

  if (resetEmailSent) {
    return (
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="bg-muted/50 mx-auto flex size-12 items-center justify-center rounded-full">
          <Mail className="text-muted-foreground size-5" />
        </div>
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">Check your email</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            We sent a password reset link to{' '}
            <span className="text-foreground font-medium">{resetEmailSent}</span>. Click the link to
            set a new password.
          </p>
        </div>
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => {
            setResetEmailSent(null);
            setForgotPassword(false);
            setResetEmail('');
            setServerMessage(null);
          }}
        >
          Back to sign in
        </Button>
      </div>
    );
  }

  if (confirmationEmail) {
    return (
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="bg-muted/50 mx-auto flex size-12 items-center justify-center rounded-full">
          <Mail className="text-muted-foreground size-5" />
        </div>
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">Check your email</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            We sent a confirmation link to{' '}
            <span className="text-foreground font-medium">{confirmationEmail}</span>. Click the link
            to activate your account, then sign in.
          </p>
        </div>
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => {
            setConfirmationEmail(null);
            setMode(Mode.SignIn);
          }}
        >
          Back to sign in
        </Button>
      </div>
    );
  }

  if (forgotPassword) {
    return (
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-foreground text-2xl font-bold tracking-tight">Reset your password</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {serverMessage && (
          <p
            className={`text-sm ${serverMessage.type === 'success' ? 'text-accent-tertiary' : 'text-destructive'}`}
          >
            {serverMessage.text}
          </p>
        )}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <Input
              id="reset-email"
              type="email"
              placeholder="you@example.com"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={resetLoading}>
            {resetLoading ? 'Sending...' : 'Send reset link'}
          </Button>
        </form>

        <p className="text-muted-foreground text-center text-sm">
          Remember your password?{' '}
          <Button
            type="button"
            variant="link"
            className="h-auto p-0"
            onClick={() => {
              setForgotPassword(false);
              setServerMessage(null);
            }}
          >
            Back to sign in
          </Button>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          {isSignUp ? 'Create your account' : 'Sign in to Remes'}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          {signupDisabled
            ? 'Access is currently invite-only. Book a demo to get started.'
            : isSignUp
              ? 'Get started finding high-intent leads'
              : 'Start finding high-intent leads in minutes'}
        </p>
      </div>

      <Button
        variant="outline"
        size="lg"
        className="w-full gap-3"
        onClick={handleGoogleLogin}
        disabled={signupDisabled || oauthLoading}
      >
        <GoogleIcon className="size-5" />
        {oauthLoading ? 'Redirecting...' : 'Continue with Google'}
      </Button>

      <div className="flex items-center gap-3">
        <div className="bg-border h-px flex-1" />
        <span className="text-muted-foreground text-xs">or</span>
        <div className="bg-border h-px flex-1" />
      </div>

      {serverMessage && (
        <p
          className={`text-sm ${serverMessage.type === 'success' ? 'text-accent-tertiary' : 'text-destructive'}`}
        >
          {serverMessage.text}
        </p>
      )}

      <EmailForm
        key={mode}
        mode={mode}
        disabled={signupDisabled}
        onServerMessage={setServerMessage}
        onSignUpSuccess={setConfirmationEmail}
        onForgotPassword={() => {
          setForgotPassword(true);
          setServerMessage(null);
        }}
      />

      {signupDisabled ? (
        <Alert variant="info">
          <Info className="size-4" />
          <AlertDescription>
            We onboard new teams through a short demo so we can tailor Remes to your workflow.{' '}
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-inherit underline"
              onClick={() => {
                closeAuthModal();
                openDemo();
              }}
            >
              Book a demo
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <p className="text-muted-foreground text-center text-sm">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <Button type="button" variant="link" className="h-auto p-0" onClick={switchMode}>
            {isSignUp ? 'Sign in' : 'Sign up'}
          </Button>
        </p>
      )}
    </div>
  );
}
