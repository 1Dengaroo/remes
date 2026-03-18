import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('research_sessions')
    .select('id, name, step, status, icp, candidates, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

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
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body: Record<string, unknown> = await req.json();

  const insert: Record<string, unknown> = { user_id: user.id };
  if (typeof body.name === 'string') insert.name = body.name;
  if (typeof body.transcript === 'string') insert.transcript = body.transcript;
  if (typeof body.step === 'string') insert.step = body.step;
  if (body.icp) insert.icp = body.icp;
  if (Array.isArray(body.strategy_messages)) insert.strategy_messages = body.strategy_messages;
  if (Array.isArray(body.candidates)) insert.candidates = body.candidates;
  if (Array.isArray(body.selected_companies)) insert.selected_companies = body.selected_companies;
  if (Array.isArray(body.results)) insert.results = body.results;
  if (body.people_results && typeof body.people_results === 'object')
    insert.people_results = body.people_results;

  const { data, error } = await supabase.from('research_sessions').insert(insert).select().single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data, { status: 201 });
}
