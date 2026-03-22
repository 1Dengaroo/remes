import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/supabase/server';
import { sessionCreateBodySchema, parseBody } from '@/lib/validation';
import { listSessions, createSession } from '@/lib/supabase/queries';

export async function GET() {
  const { supabase, user } = await getAuthUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await listSessions(supabase, user.id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const sessions = (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    step: row.step,
    status: row.status,
    icp_description: row.icp?.description ?? null,
    company_count: Array.isArray(row.candidates) ? row.candidates.length : 0,
    created_at: row.created_at,
    updated_at: row.updated_at
  }));

  return Response.json({ sessions });
}

export async function POST(req: NextRequest) {
  const { supabase, user } = await getAuthUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsed = parseBody(sessionCreateBodySchema, await req.json());
  if (!parsed.success) return parsed.response;

  const { data, error } = await createSession(supabase, { user_id: user.id, ...parsed.data });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data, { status: 201 });
}
