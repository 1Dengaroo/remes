import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/supabase/server';
import { getResearchedCompanyResults } from '@/lib/supabase/queries';

export async function GET(req: NextRequest) {
  const { supabase, user } = await getAuthUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const excludeSessionId = req.nextUrl.searchParams.get('exclude');

  const { data, error } = await getResearchedCompanyResults(
    supabase,
    user.id,
    excludeSessionId ?? undefined
  );

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
