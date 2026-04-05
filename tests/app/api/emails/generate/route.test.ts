jest.mock('@/lib/supabase/server', () => ({ requireAuth: jest.fn() }));
jest.mock('@/lib/validation', () => ({
  ...jest.requireActual('@/lib/validation'),
  requireEnvVars: jest.fn()
}));
jest.mock('@/lib/services/email/generation', () => ({
  streamEmailGeneration: jest.fn()
}));

import { POST } from '@/app/api/emails/generate/route';
import { requireAuth } from '@/lib/supabase/server';
import { requireEnvVars } from '@/lib/validation';
import { streamEmailGeneration } from '@/lib/services/email/generation';
import { mockAuthSuccess, mockAuthFailure, validIcp } from '@/tests/helpers';

const mockAuth = requireAuth as jest.MockedFunction<typeof requireAuth>;
const mockEnvVars = requireEnvVars as jest.MockedFunction<typeof requireEnvVars>;
const mockStream = streamEmailGeneration as jest.MockedFunction<typeof streamEmailGeneration>;

const validBody = {
  company: {
    company_name: 'Acme',
    industry: 'SaaS',
    funding_stage: 'A',
    amount_raised: '$10M',
    website: null,
    linkedin_url: 'https://linkedin.com',
    logo_url: 'https://logo.com',
    signals: [],
    match_reason: 'Good',
    company_overview: 'A company',
    contacts: [],
    sources: { jobs: [], funding: [], news: [] }
  },
  contact: {
    name: 'Alice Smith',
    title: 'VP Eng',
    linkedin_url: 'https://linkedin.com/in/alice',
    email: null,
    is_decision_maker: true
  },
  icp: validIcp
};

beforeEach(() => {
  jest.clearAllMocks();
  mockEnvVars.mockReturnValue(null);
});

describe('POST /api/emails/generate', () => {
  it('returns 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue(mockAuthFailure());
    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validBody)
    });
    expect((await POST(req as never)).status).toBe(401);
  });

  it('returns SSE stream on success', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    const readable = new ReadableStream();
    mockStream.mockReturnValue(readable);

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validBody)
    });

    const res = await POST(req as never);
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('text/event-stream');
  });

  it('returns 500 when env vars missing', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockEnvVars.mockReturnValue(
      Response.json(
        { error: { code: 'SERVICE_UNAVAILABLE', message: 'Missing config' } },
        { status: 500 }
      )
    );

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validBody)
    });

    expect((await POST(req as never)).status).toBe(500);
  });
});
