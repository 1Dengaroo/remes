import { NextRequest } from 'next/server';
import { withAuth, jsonError, parseBody, requireEnvVars } from '@/lib/route-utils';
import { parseIcpBodySchema, claudeICPParser } from '@/lib/services/icp';
import { getErrorMessage } from '@/lib/utils';

export const POST = (req: NextRequest) =>
  withAuth(async () => {
    const envError = requireEnvVars('ANTHROPIC_API_KEY');
    if (envError) return envError;

    const parsed = parseBody(parseIcpBodySchema, await req.json());
    if (!parsed.success) return parsed.response;

    try {
      const icp = await claudeICPParser.parse(parsed.data.input.trim());
      return Response.json({ icp });
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to parse ICP');
      return jsonError('INTERNAL_ERROR', message, 500);
    }
  });
