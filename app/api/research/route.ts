import { NextRequest } from 'next/server';
import { discoverCompanies, researchConfirmedCompanies } from '@/lib/services/pipeline';
import type { ResearchStreamEvent, ICPCriteria, DiscoveredCompanyPreview } from '@/lib/types';

export const maxDuration = 300;

function isICPCriteria(value: unknown): value is ICPCriteria {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.description === 'string' && Array.isArray(obj.industry_keywords);
}

export async function POST(req: NextRequest) {
  const body: Record<string, unknown> = await req.json();

  // Phase 1: discover — send { icp } → get candidates back
  // Phase 2: research — send { icp, companies: [...], candidates: [...] } → get results back
  const icp = isICPCriteria(body.icp) ? body.icp : undefined;
  const companies = Array.isArray(body.companies) ? (body.companies as string[]) : undefined;
  const candidates = Array.isArray(body.candidates)
    ? (body.candidates as DiscoveredCompanyPreview[])
    : undefined;

  if (!icp) {
    return Response.json({ error: 'ICP is required' }, { status: 400 });
  }

  const missing: string[] = [];
  if (!process.env.ANTHROPIC_API_KEY) missing.push('ANTHROPIC_API_KEY');
  if (!process.env.APOLLO_API_KEY && !companies) missing.push('APOLLO_API_KEY');

  if (missing.length > 0) {
    return Response.json(
      { error: `Missing environment variables: ${missing.join(', ')}. Add them to .env.local` },
      { status: 500 }
    );
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
        const message = err instanceof Error ? err.message : 'Unknown error';
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
}
