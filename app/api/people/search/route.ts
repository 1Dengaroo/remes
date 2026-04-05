import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/supabase/server';
import { peopleSearchBodySchema, parseBody, requireEnvVars } from '@/lib/validation';
import { searchAndRankPeople } from '@/lib/services/people/search';

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;

  const parsed = parseBody(peopleSearchBodySchema, await req.json());
  if (!parsed.success) return parsed.response;

  const { org_ids: orgIds, icp, companies } = parsed.data;

  const envError = requireEnvVars('APOLLO_API_KEY', 'ANTHROPIC_API_KEY');
  if (envError) return envError;

  try {
    const results = await searchAndRankPeople(orgIds, icp, companies);
    return Response.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'People search failed';
    console.error('[People Search]', message);
    return Response.json({ error: { code: 'INTERNAL_ERROR', message } }, { status: 500 });
  }
}
