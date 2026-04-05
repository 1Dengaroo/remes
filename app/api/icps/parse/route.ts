import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/supabase/server';
import { claudeICPParser } from '@/lib/services/icp/parser';
import { parseIcpBodySchema, parseBody, requireEnvVars } from '@/lib/validation';

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;

  const parsed = parseBody(parseIcpBodySchema, await req.json());
  if (!parsed.success) return parsed.response;

  const { input } = parsed.data;

  const envError = requireEnvVars('ANTHROPIC_API_KEY');
  if (envError) return envError;

  try {
    const icp = await claudeICPParser.parse(input.trim());
    return Response.json({ icp });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to parse ICP';
    return Response.json({ error: { code: 'INTERNAL_ERROR', message } }, { status: 500 });
  }
}
