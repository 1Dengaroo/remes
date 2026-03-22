import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/supabase/server';
import { updateIcpBodySchema, parseBody } from '@/lib/validation';
import { updateICP, deleteICP } from '@/lib/supabase/queries';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user } = await getAuthUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsed = parseBody(updateIcpBodySchema, await req.json());
  if (!parsed.success) return parsed.response;

  const updates: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) updates.name = parsed.data.name;
  if (parsed.data.icp !== undefined) updates.icp = parsed.data.icp;

  const { data, error } = await updateICP(supabase, id, user.id, updates);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user } = await getAuthUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await deleteICP(supabase, id, user.id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
