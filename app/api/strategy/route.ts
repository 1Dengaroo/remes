import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/supabase/server';
import { strategyBodySchema, parseBody, requireEnvVars } from '@/lib/validation';
import { streamStrategy } from '@/lib/services/strategy/stream';

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;

  const parsed = parseBody(strategyBodySchema, await req.json());
  if (!parsed.success) return parsed.response;

  const envError = requireEnvVars('ANTHROPIC_API_KEY');
  if (envError) return envError;

  const { icp, messages } = parsed.data;

  return new Response(streamStrategy(icp, messages), {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  });
}
