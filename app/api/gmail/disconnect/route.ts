import { getAuthUser } from '@/lib/supabase/server';
import { deleteGmailConnection } from '@/lib/supabase/queries';

export async function POST() {
  const { supabase, user } = await getAuthUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await deleteGmailConnection(supabase, user.id);

  return Response.json({ success: true });
}
