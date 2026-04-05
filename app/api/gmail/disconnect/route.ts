import { requireAuth } from '@/lib/supabase/server';
import { deleteGmailConnection } from '@/lib/supabase/queries';

export async function POST() {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  const { supabase, user } = auth;

  const { error } = await deleteGmailConnection(supabase, user.id);

  if (error) {
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }

  return Response.json({ success: true });
}
