import { getAuthUser } from '@/lib/supabase/server';
import { listContacts } from '@/lib/supabase/queries';

export async function GET() {
  const { supabase, user } = await getAuthUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await listContacts(supabase, user.id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ contacts: data });
}
