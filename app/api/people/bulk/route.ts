import { NextRequest } from 'next/server';
import { withAuth, jsonError, parseBody, requireEnvVars } from '@/lib/route-utils';
import { peopleBulkBodySchema, bulkSearchPeople } from '@/lib/services/people';
import { getErrorMessage } from '@/lib/utils';

export const POST = (req: NextRequest) =>
  withAuth(async () => {
    const parsed = parseBody(peopleBulkBodySchema, await req.json());
    if (!parsed.success) return parsed.response;

    const envError = requireEnvVars('APOLLO_API_KEY');
    if (envError) return envError;

    try {
      const results = await bulkSearchPeople(parsed.data.companies);
      return Response.json({ results });
    } catch (err) {
      const message = getErrorMessage(err, 'Bulk people search failed');
      console.error('[People Bulk]', message);
      return jsonError('INTERNAL_ERROR', message, 500);
    }
  });
