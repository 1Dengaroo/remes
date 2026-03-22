import { getAuthUser } from '@/lib/supabase/server';
import { getGmailEmail } from '@/lib/supabase/queries';

export async function GET() {
  const { supabase, user } = await getAuthUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: connection } = await getGmailEmail(supabase, user.id);

  return Response.json({
    connected: !!connection,
    email: connection?.gmail_email ?? null
  });
}
