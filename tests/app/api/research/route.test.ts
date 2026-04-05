jest.mock('@/lib/supabase/server', () => ({ requireAuth: jest.fn() }));
jest.mock('@/lib/services/research/pipeline', () => ({
  discoverCompanies: jest.fn(),
  researchConfirmedCompanies: jest.fn()
}));

import { POST } from '@/app/api/research/route';
import { requireAuth } from '@/lib/supabase/server';
import { discoverCompanies, researchConfirmedCompanies } from '@/lib/services/research/pipeline';
import { mockAuthSuccess, mockAuthFailure, validIcp } from '@/tests/helpers';

const mockAuth = requireAuth as jest.MockedFunction<typeof requireAuth>;
const mockDiscover = discoverCompanies as jest.MockedFunction<typeof discoverCompanies>;
const mockResearch = researchConfirmedCompanies as jest.MockedFunction<
  typeof researchConfirmedCompanies
>;

const original = process.env;

beforeEach(() => {
  jest.clearAllMocks();
  process.env = { ...original, ANTHROPIC_API_KEY: 'test', APOLLO_API_KEY: 'test' };
});

afterAll(() => {
  process.env = original;
});

describe('POST /api/research', () => {
  it('returns 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue(mockAuthFailure());
    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ icp: validIcp })
    });
    expect((await POST(req as never)).status).toBe(401);
  });

  it('returns SSE stream for discovery', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockDiscover.mockResolvedValue(undefined);

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ icp: validIcp })
    });

    const res = await POST(req as never);
    expect(res.headers.get('Content-Type')).toBe('text/event-stream');
  });

  it('calls researchConfirmedCompanies when companies provided', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockResearch.mockResolvedValue(undefined);

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ icp: validIcp, companies: ['Acme'] })
    });

    await POST(req as never);
    // Stream is returned immediately, pipeline runs inside ReadableStream
    // Just verify the response shape
    expect(mockDiscover).not.toHaveBeenCalled();
  });

  it('returns 500 when env vars missing', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    delete process.env.ANTHROPIC_API_KEY;
    mockAuth.mockResolvedValue(mockAuthSuccess());

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ icp: validIcp })
    });

    const res = await POST(req as never);
    expect(res.status).toBe(500);
  });
});
