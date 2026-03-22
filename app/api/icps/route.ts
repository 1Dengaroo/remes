import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/supabase/server';
import { createIcpBodySchema, parseBody } from '@/lib/validation';
import { listICPs, createICP } from '@/lib/supabase/queries';

export async function GET() {
  const { supabase, user } = await getAuthUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await listICPs(supabase, user.id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ icps: data });
}

export async function POST(req: NextRequest) {
  const { supabase, user } = await getAuthUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsed = parseBody(createIcpBodySchema, await req.json());
  if (!parsed.success) return parsed.response;

  const { name, icp } = parsed.data;

  const { data, error } = await createICP(supabase, user.id, name, icp);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data, { status: 201 });
}
