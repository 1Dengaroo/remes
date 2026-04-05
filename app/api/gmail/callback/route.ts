import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/server';
import { exchangeCodeForTokens } from '@/lib/services/gmail/client';
import { upsertGmailConnection } from '@/lib/supabase/queries';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');

  if (!code || !state) {
    return NextResponse.redirect(new URL('/?error=missing_params', req.url));
  }

  const auth = await requireAuth();
  if (auth instanceof Response) {
    return NextResponse.redirect(new URL('/?error=auth_mismatch', req.url));
  }
  const { supabase, user } = auth;

  if (user.id !== state) {
    return NextResponse.redirect(new URL('/?error=auth_mismatch', req.url));
  }

  try {
    const tokens = await exchangeCodeForTokens(code);

    await upsertGmailConnection(supabase, user.id, {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      token_expiry: tokens.tokenExpiry,
      gmail_email: tokens.email
    });

    return NextResponse.redirect(new URL('/?gmail=connected', req.url));
  } catch (err) {
    console.error('Gmail OAuth callback error:', err);
    return NextResponse.redirect(new URL('/?error=oauth_failed', req.url));
  }
}
