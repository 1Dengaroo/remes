import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/supabase/server';
import { apolloPersonEnrich } from '@/lib/services/people/apollo';
import { peopleEnrichBodySchema, parseBody, requireEnvVars } from '@/lib/validation';

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;

  const parsed = parseBody(peopleEnrichBodySchema, await req.json());
  if (!parsed.success) return parsed.response;

  const { person_id: personId } = parsed.data;

  const envError = requireEnvVars('APOLLO_API_KEY');
  if (envError) return envError;

  try {
    const person = await apolloPersonEnrich(personId);
    return Response.json({ person });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Person enrichment failed';
    console.error('[People Enrich]', message);
    return Response.json({ error: { code: 'INTERNAL_ERROR', message } }, { status: 500 });
  }
}
