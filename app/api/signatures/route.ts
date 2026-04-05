import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/supabase/server';
import { signatureCreateBodySchema, parseBody } from '@/lib/validation';
import { listSignatures, createSignature } from '@/lib/supabase/queries';

export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  const { supabase, user } = auth;

  const { data, error } = await listSignatures(supabase, user.id);

  if (error) {
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }

  return Response.json({ signatures: data });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  const { supabase, user } = auth;

  const parsed = parseBody(signatureCreateBodySchema, await req.json());
  if (!parsed.success) return parsed.response;

  const { name, body: signatureBody } = parsed.data;

  const { data, error } = await createSignature(supabase, user.id, name, signatureBody);

  if (error) {
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }

  return Response.json(data, { status: 201 });
}
