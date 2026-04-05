import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/supabase/server';
import { createIcpBodySchema, parseBody } from '@/lib/validation';
import { listICPs, createICP } from '@/lib/supabase/queries';

export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  const { supabase, user } = auth;

  const { data, error } = await listICPs(supabase, user.id);

  if (error) {
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }

  return Response.json({ icps: data });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  const { supabase, user } = auth;

  const parsed = parseBody(createIcpBodySchema, await req.json());
  if (!parsed.success) return parsed.response;

  const { name, icp } = parsed.data;

  const { data, error } = await createICP(supabase, user.id, name, icp);

  if (error) {
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }

  return Response.json(data, { status: 201 });
}
