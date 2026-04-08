import { NextRequest } from 'next/server';
import { withAuth, jsonError, parseBody, requireEnvVars } from '@/lib/route-utils';
import { peopleEnrichBodySchema, apolloPersonEnrich } from '@/lib/services/people';
import { getErrorMessage } from '@/lib/utils';

export const POST = (req: NextRequest) =>
  withAuth(async () => {
    const parsed = parseBody(peopleEnrichBodySchema, await req.json());
    if (!parsed.success) return parsed.response;

    const { person_id: personId } = parsed.data;

    const envError = requireEnvVars('APOLLO_API_KEY');
    if (envError) return envError;

    try {
      const person = await apolloPersonEnrich(personId);
      return Response.json({ person });
    } catch (err) {
      const message = getErrorMessage(err, 'Person enrichment failed');
      console.error('[People Enrich]', message);
      return jsonError('INTERNAL_ERROR', message, 500);
    }
  });
