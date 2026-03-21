import { getAuthUser } from '@/lib/supabase/server';

export async function GET() {
  const { supabase, user } = await getAuthUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: connection } = await supabase
    .from('gmail_connections')
    .select('gmail_email')
    .eq('user_id', user.id)
    .single();

  return Response.json({
    connected: !!connection,
    email: connection?.gmail_email ?? null
  });
}
