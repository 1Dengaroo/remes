import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/supabase/server';
import { signatureCreateBodySchema, parseBody } from '@/lib/validation';
import { listSignatures, createSignature } from '@/lib/supabase/queries';

export async function GET() {
  const { supabase, user } = await getAuthUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await listSignatures(supabase, user.id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ signatures: data });
}

export async function POST(req: NextRequest) {
  const { supabase, user } = await getAuthUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsed = parseBody(signatureCreateBodySchema, await req.json());
  if (!parsed.success) return parsed.response;

  const { name, body: signatureBody } = parsed.data;

  const { data, error } = await createSignature(supabase, user.id, name, signatureBody);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data, { status: 201 });
}
