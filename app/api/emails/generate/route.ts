import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { serviceConfig } from '@/lib/services/config';
import { buildEmailGenerationPrompt } from '@/lib/prompts/email-generation';
import { getAuthUser } from '@/lib/supabase/server';
import { emailGenerateBodySchema, parseBody } from '@/lib/validation';
import { getProfile } from '@/lib/supabase/queries';

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'ANTHROPIC_API_KEY is not set' }, { status: 500 });
  }

  const parsed = parseBody(emailGenerateBodySchema, await req.json());
  if (!parsed.success) return parsed.response;

  const { company, contact, icp } = parsed.data;

  try {
    const { supabase, user } = await getAuthUser();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await getProfile(supabase, user.id);
    const fullName =
      profile?.full_name ||
      (typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : '');
    const senderFirstName = fullName.split(' ')[0] || undefined;
    const senderCompany = profile?.company_name || undefined;

    const anthropic = new Anthropic();
    const prompt = buildEmailGenerationPrompt(
      company,
      contact,
      icp,
      senderFirstName,
      senderCompany
    );

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = anthropic.messages.stream({
            model: serviceConfig.emailModel,
            max_tokens: serviceConfig.emailMaxTokens,
            messages: [{ role: 'user', content: prompt }]
          });

          for await (const event of response) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: 'delta', text: event.delta.text })}\n\n`
                )
              );
            }
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to generate email';
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'error', message })}\n\n`)
          );
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
      }
    });
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'Failed to generate email';
    return Response.json({ error: errMessage }, { status: 500 });
  }
}
