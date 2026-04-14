'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HERO_THEME } from '@/lib/layout';
import { HeroBackdrop, HERO_THEMES } from '@/components/shared/hero-backdrop';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PasswordInput } from './email-form.client';

const resetSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

type ResetFormFields = z.infer<typeof resetSchema>;

export function ResetPasswordPage() {
  const router = useRouter();
  const [serverMessage, setServerMessage] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);

  const { control, handleSubmit, formState } = useForm<ResetFormFields>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' }
  });

  async function onSubmit(data: ResetFormFields) {
    setServerMessage(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: data.password });
    if (error) {
      setServerMessage({ type: 'error', text: error.message });
      return;
    }
    router.push('/research');
    router.refresh();
  }

  return (
    <HeroBackdrop
      theme={HERO_THEME.login}
      className="flex min-h-dvh flex-col items-center justify-center px-6 py-16"
    >
      <Link
        href="/"
        className="relative z-10 mb-8 flex items-center gap-2.5 transition-opacity hover:opacity-80"
      >
        <Image src="/remes-logo.png" alt="Remes" width={28} height={28} className="rounded" />
        <span className="text-lg font-semibold" style={{ color: 'var(--landing-hero-fg)' }}>
          Remes
        </span>
      </Link>

      <div className="relative z-10 w-full max-w-md">
        <div
          className="pointer-events-none absolute -inset-16 z-0"
          style={{
            background: HERO_THEMES[HERO_THEME.login]['--login-card-glow'],
            filter: 'blur(40px)'
          }}
        />

        <div className="bg-card border-border relative z-10 rounded-2xl border p-8 shadow-xl">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-foreground text-2xl font-bold tracking-tight">
                Set a new password
              </h1>
              <p className="text-muted-foreground mt-2 text-sm">Enter your new password below.</p>
            </div>

            {serverMessage && (
              <p
                className={`text-sm ${serverMessage.type === 'success' ? 'text-accent-tertiary' : 'text-destructive'}`}
              >
                {serverMessage.text}
              </p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New password</Label>
                    <PasswordInput
                      id="new-password"
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="Enter new password"
                      invalid={fieldState.invalid}
                    />
                    {fieldState.error && (
                      <p className="text-destructive text-xs">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="confirmPassword"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <Label htmlFor="confirm-new-password">Confirm new password</Label>
                    <PasswordInput
                      id="confirm-new-password"
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="Confirm new password"
                      invalid={fieldState.invalid}
                    />
                    {fieldState.error && (
                      <p className="text-destructive text-xs">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />

              <Button type="submit" size="lg" className="w-full" disabled={formState.isSubmitting}>
                {formState.isSubmitting ? 'Updating...' : 'Update password'}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <Link
        href="/login"
        className="relative z-10 mt-6 text-sm transition-opacity hover:opacity-80"
        style={{ color: 'var(--landing-hero-fg-secondary)' }}
      >
        Back to sign in
      </Link>
    </HeroBackdrop>
  );
}
