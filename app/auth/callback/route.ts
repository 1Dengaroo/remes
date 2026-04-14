import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  const ALLOWED_NEXT = new Set(['/login', '/reset-password', '/research']);
  const next = searchParams.get('next');
  const redirectTo = next && ALLOWED_NEXT.has(next) ? next : '/login';

  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
    // Code exchange failed (e.g. missing PKCE verifier from email confirmation
    // opening in a new tab). Email is already confirmed — redirect to login.
    return NextResponse.redirect(`${origin}/login`);
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      // type is validated by Supabase — safe to pass through
      token_hash: tokenHash,
      type: type as 'signup' | 'email'
    });
    if (!error) {
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
