import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/supabase/server';
import { sessionUpdateBodySchema, parseBody } from '@/lib/validation';
import { getSession, updateSession, deleteSession } from '@/lib/supabase/queries';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  const { supabase, user } = auth;

  const { data, error } = await getSession(supabase, id, user.id);

  if (error) {
    return Response.json({ error: { code: 'NOT_FOUND', message: error.message } }, { status: 404 });
  }

  return Response.json(data);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  const { supabase, user } = auth;

  const parsed = parseBody(sessionUpdateBodySchema, await req.json());
  if (!parsed.success) return parsed.response;

  const { error } = await updateSession(supabase, id, user.id, parsed.data);

  if (error) {
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }

  return Response.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  const { supabase, user } = auth;

  const { error } = await deleteSession(supabase, id, user.id);

  if (error) {
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }

  return Response.json({ success: true });
}
