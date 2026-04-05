jest.mock('@/lib/supabase/server', () => ({ requireAuth: jest.fn() }));
jest.mock('@/lib/validation', () => ({
  ...jest.requireActual('@/lib/validation'),
  requireEnvVars: jest.fn()
}));
jest.mock('@/lib/services/strategy/stream', () => ({
  streamStrategy: jest.fn()
}));

import { POST } from '@/app/api/strategy/route';
import { requireAuth } from '@/lib/supabase/server';
import { requireEnvVars } from '@/lib/validation';
import { streamStrategy } from '@/lib/services/strategy/stream';
import { mockAuthSuccess, mockAuthFailure, validIcp } from '@/tests/helpers';

const mockAuth = requireAuth as jest.MockedFunction<typeof requireAuth>;
const mockEnvVars = requireEnvVars as jest.MockedFunction<typeof requireEnvVars>;
const mockStream = streamStrategy as jest.MockedFunction<typeof streamStrategy>;

beforeEach(() => {
  jest.clearAllMocks();
  mockEnvVars.mockReturnValue(null);
});

describe('POST /api/strategy', () => {
  it('returns 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue(mockAuthFailure());
    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ icp: validIcp })
    });
    expect((await POST(req as never)).status).toBe(401);
  });

  it('returns SSE stream on success', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockStream.mockReturnValue(new ReadableStream());

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ icp: validIcp })
    });

    const res = await POST(req as never);
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('text/event-stream');
  });

  it('passes messages to streamStrategy for revisions', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockStream.mockReturnValue(new ReadableStream());

    const messages = [{ role: 'user', content: 'Focus on fintech' }];
    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ icp: validIcp, messages })
    });

    await POST(req as never);
    expect(mockStream).toHaveBeenCalledWith(validIcp, messages);
  });

  it('returns 400 on invalid body', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    mockAuth.mockResolvedValue(mockAuthSuccess());

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });

    const res = await POST(req as never);
    expect(res.status).toBe(400);
  });
});
