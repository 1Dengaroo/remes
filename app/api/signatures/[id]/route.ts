import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/supabase/server';
import { signatureUpdateBodySchema, parseBody } from '@/lib/validation';
import { clearDefaultSignatures, updateSignature, deleteSignature } from '@/lib/supabase/queries';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user } = await getAuthUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsed = parseBody(signatureUpdateBodySchema, await req.json());
  if (!parsed.success) return parsed.response;

  const updates: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) updates.name = parsed.data.name;
  if (parsed.data.body !== undefined) updates.body = parsed.data.body;
  if (parsed.data.is_default !== undefined) {
    if (parsed.data.is_default) {
      await clearDefaultSignatures(supabase, user.id, id);
    }
    updates.is_default = parsed.data.is_default;
  }

  const { data, error } = await updateSignature(supabase, id, user.id, updates);

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

  const { error } = await deleteSignature(supabase, id, user.id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
