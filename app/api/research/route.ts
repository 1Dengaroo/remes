import { NextRequest } from 'next/server';
import { withAuth, jsonError, parseBody } from '@/lib/route-utils';
import { getErrorMessage } from '@/lib/utils';
import {
  researchBodySchema,
  discoverCompanies,
  researchConfirmedCompanies
} from '@/lib/services/research';
import type { ResearchStreamEvent } from '@/lib/services/research';

export const maxDuration = 300;

export const POST = (req: NextRequest) =>
  withAuth(async () => {
    const parsed = parseBody(researchBodySchema, await req.json());
    if (!parsed.success) return parsed.response;

    const { icp, companies, candidates } = parsed.data;

    const missing: string[] = [];
    if (!process.env.ANTHROPIC_API_KEY) missing.push('ANTHROPIC_API_KEY');
    if (!process.env.APOLLO_API_KEY && !companies) missing.push('APOLLO_API_KEY');

    if (missing.length > 0) {
      console.error('[Config] Missing environment variables:', missing.join(', '));
      return jsonError('SERVICE_UNAVAILABLE', 'Required service configuration is missing', 500);
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const send = (event: ResearchStreamEvent) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        };

        try {
          if (companies) {
            await researchConfirmedCompanies(companies, icp, send, undefined, candidates);
          } else {
            await discoverCompanies(icp, send);
          }
        } catch (err) {
          const message = getErrorMessage(err);
          send({ type: 'error', message });
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
  });
