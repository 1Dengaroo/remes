import { NextRequest } from 'next/server';
import { withAuth, jsonError, parseBody, requireEnvVars } from '@/lib/route-utils';
import { peopleSearchBodySchema, searchAndRankPeople } from '@/lib/services/people';
import { getErrorMessage } from '@/lib/utils';

export const POST = (req: NextRequest) =>
  withAuth(async () => {
    const parsed = parseBody(peopleSearchBodySchema, await req.json());
    if (!parsed.success) return parsed.response;

    const { org_ids: orgIds, icp, companies } = parsed.data;

    const envError = requireEnvVars('APOLLO_API_KEY', 'ANTHROPIC_API_KEY');
    if (envError) return envError;

    try {
      const results = await searchAndRankPeople(orgIds, icp, companies);
      return Response.json({ results });
    } catch (err) {
      const message = getErrorMessage(err, 'People search failed');
      console.error('[People Search]', message);
      return jsonError('INTERNAL_ERROR', message, 500);
    }
  });
