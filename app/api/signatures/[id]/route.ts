import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/supabase/server';
import { signatureUpdateBodySchema, parseBody } from '@/lib/validation';
import { updateSignatureWithDefault, deleteSignature } from '@/lib/supabase/queries';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  const { supabase, user } = auth;

  const parsed = parseBody(signatureUpdateBodySchema, await req.json());
  if (!parsed.success) return parsed.response;

  const { data, error } = await updateSignatureWithDefault(supabase, id, user.id, parsed.data);

  if (error) {
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }

  return Response.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  const { supabase, user } = auth;

  const { error } = await deleteSignature(supabase, id, user.id);

  if (error) {
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }

  return Response.json({ success: true });
}
