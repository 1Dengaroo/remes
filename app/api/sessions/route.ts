import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/supabase/server';
import { sessionCreateBodySchema, parseBody } from '@/lib/validation';
import { listSessionSummaries, createSession } from '@/lib/supabase/queries';

export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  const { supabase, user } = auth;

  const { data: sessions, error } = await listSessionSummaries(supabase, user.id);

  if (error) {
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }

  return Response.json({ sessions });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  const { supabase, user } = auth;

  const parsed = parseBody(sessionCreateBodySchema, await req.json());
  if (!parsed.success) return parsed.response;

  const { data, error } = await createSession(supabase, { user_id: user.id, ...parsed.data });

  if (error) {
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }

  return Response.json(data, { status: 201 });
}
