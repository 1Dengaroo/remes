import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/supabase/server';
import { emailGenerateBodySchema, parseBody, requireEnvVars } from '@/lib/validation';
import { streamEmailGeneration } from '@/lib/services/email/generation';

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  const { supabase, user } = auth;

  const envError = requireEnvVars('ANTHROPIC_API_KEY');
  if (envError) return envError;

  const parsed = parseBody(emailGenerateBodySchema, await req.json());
  if (!parsed.success) return parsed.response;

  const { company, contact, icp } = parsed.data;
  const stream = streamEmailGeneration(supabase, user, company, contact, icp);

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  });
}
