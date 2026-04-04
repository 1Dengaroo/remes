'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
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

interface EmailFormProps {
  mode: Mode;
  onModeSwitch: () => void;
  onServerMessage: (msg: { type: 'error' | 'success'; text: string } | null) => void;
}

export function EmailForm({ mode, onModeSwitch, onServerMessage }: EmailFormProps) {
  const router = useRouter();
  const isSignUp = mode === Mode.SignUp;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AuthFormFields>({
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
      onServerMessage({
        type: 'success',
        text: 'Check your email to confirm your account, then sign in.'
      });
      onModeSwitch();
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

    router.push('/research');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
        {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder={isSignUp ? 'Create a password' : 'Your password'}
          {...register('password')}
        />
        {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
      </div>
      {isSignUp && (
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm password</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirm your password"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-destructive text-xs">{errors.confirmPassword.message}</p>
          )}
        </div>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Loading...' : isSignUp ? 'Create account' : 'Sign in'}
      </Button>
    </form>
  );
}
