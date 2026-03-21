import { getAuthUser } from '@/lib/supabase/server';

export async function POST() {
  const { supabase, user } = await getAuthUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await supabase.from('gmail_connections').delete().eq('user_id', user.id);

  return Response.json({ success: true });
}
