'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const baseSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  confirmPassword: z.string()
});

const signInSchema = baseSchema;

const signUpSchema = baseSchema
  .extend({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

type AuthFormFields = z.infer<typeof baseSchema>;

export const Mode = { SignIn: 'sign-in', SignUp: 'sign-up' } as const;
export type Mode = (typeof Mode)[keyof typeof Mode];

function PasswordInput({
  id,
  placeholder,
  value,
  onChange,
  onBlur,
  name,
  invalid
}: {
  id: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  name: string;
  invalid: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={invalid}
        className="pr-9"
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible((v) => !v)}
        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer transition-colors"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

interface EmailFormProps {
  mode: Mode;
  onModeSwitch: () => void;
  onServerMessage: (msg: { type: 'error' | 'success'; text: string } | null) => void;
  onSignUpSuccess?: (email: string) => void;
}

export function EmailForm({
  mode,
  onModeSwitch,
  onServerMessage,
  onSignUpSuccess
}: EmailFormProps) {
  const router = useRouter();
  const closeAuthModal = useAuthStore((s) => s.closeAuthModal);
  const isSignUp = mode === Mode.SignUp;

  const { control, handleSubmit, formState } = useForm<AuthFormFields>({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' }
  });

  async function onSubmit(data: AuthFormFields) {
    onServerMessage(null);
    const supabase = createClient();

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
      });
      if (error) {
        onServerMessage({ type: 'error', text: error.message });
        return;
      }
      onSignUpSuccess?.(data.email);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    });
    if (error) {
      onServerMessage({ type: 'error', text: error.message });
      return;
    }

    closeAuthModal();
    router.push('/research');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              {...field}
              id="email"
              type="email"
              placeholder="you@example.com"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && (
              <p className="text-destructive text-xs">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder={isSignUp ? 'Create a password' : 'Your password'}
              invalid={fieldState.invalid}
            />
            {fieldState.error && (
              <p className="text-destructive text-xs">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      {isSignUp && (
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <PasswordInput
                id="confirm-password"
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="Confirm your password"
                invalid={fieldState.invalid}
              />
              {fieldState.error && (
                <p className="text-destructive text-xs">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />
      )}

      <Button type="submit" size="lg" className="w-full" disabled={formState.isSubmitting}>
        {formState.isSubmitting ? 'Loading...' : isSignUp ? 'Create account' : 'Sign in'}
      </Button>
    </form>
  );
}
