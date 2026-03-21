import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const { supabase, user } = await getAuthUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const excludeSessionId = req.nextUrl.searchParams.get('exclude');

  let query = supabase
    .from('research_sessions')
    .select('results')
    .eq('user_id', user.id)
    .not('results', 'is', null);

  if (excludeSessionId) {
    query = query.neq('id', excludeSessionId);
  }

  const { data, error } = await query;

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const companies = new Set<string>();
  for (const row of data ?? []) {
    const results: unknown = row.results;
    if (!Array.isArray(results)) continue;
    for (const r of results) {
      if (r && typeof r === 'object' && 'company_name' in r && typeof r.company_name === 'string') {
        companies.add(r.company_name);
      }
    }
  }

  return Response.json({ companies: [...companies] });
}
