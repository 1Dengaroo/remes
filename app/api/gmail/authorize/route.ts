import { getAuthUser } from '@/lib/supabase/server';
import { getGoogleAuthUrl } from '@/lib/services/gmail';

export async function GET() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return Response.json({ error: 'Gmail OAuth not configured' }, { status: 500 });
  }

  const { user } = await getAuthUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = getGoogleAuthUrl(user.id);
  return Response.json({ url });
}
