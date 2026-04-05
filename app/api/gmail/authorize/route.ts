import { requireAuth } from '@/lib/supabase/server';
import { getGoogleAuthUrl } from '@/lib/services/gmail/client';
import { requireEnvVars } from '@/lib/validation';

export async function GET() {
  const envError = requireEnvVars('GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET');
  if (envError) return envError;

  const auth = await requireAuth();
  if (auth instanceof Response) return auth;

  const url = getGoogleAuthUrl(auth.user.id);
  return Response.json({ url });
}
