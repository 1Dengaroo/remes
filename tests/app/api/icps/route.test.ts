jest.mock('@/lib/supabase/server', () => ({ requireAuth: jest.fn() }));
jest.mock('@/lib/supabase/queries', () => ({
  listICPs: jest.fn(),
  createICP: jest.fn()
}));

import { GET, POST } from '@/app/api/icps/route';
import { requireAuth } from '@/lib/supabase/server';
import { listICPs, createICP } from '@/lib/supabase/queries';
import { mockAuthSuccess, mockAuthFailure, expectError, validIcp } from '@/tests/helpers';

const mockAuth = requireAuth as jest.MockedFunction<typeof requireAuth>;
const mockList = listICPs as jest.MockedFunction<typeof listICPs>;
const mockCreate = createICP as jest.MockedFunction<typeof createICP>;

beforeEach(() => jest.clearAllMocks());

describe('GET /api/icps', () => {
  it('returns 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue(mockAuthFailure());
    expect((await GET()).status).toBe(401);
  });

  it('returns icps array on success', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockList.mockResolvedValue({ data: [{ id: '1', name: 'Test' }], error: null } as never);

    const res = await GET();
    const body = await res.json();
    expect(body.icps).toHaveLength(1);
  });
});

describe('POST /api/icps', () => {
  it('returns 201 on successful creation', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    const created = { id: '1', name: 'Test ICP', icp: validIcp };
    mockCreate.mockResolvedValue({ data: created, error: null } as never);

    const req = new Request('http://localhost/api/icps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test ICP', icp: validIcp })
    });

    const res = await POST(req as never);
    expect(res.status).toBe(201);
  });

  it('returns 400 on invalid body', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    mockAuth.mockResolvedValue(mockAuthSuccess());

    const req = new Request('http://localhost/api/icps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '' })
    });

    const res = await POST(req as never);
    await expectError(res, 400, 'VALIDATION_ERROR');
  });

  it('returns 500 on DB failure', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockCreate.mockResolvedValue({ data: null, error: { message: 'DB error' } } as never);

    const req = new Request('http://localhost/api/icps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test', icp: validIcp })
    });

    const res = await POST(req as never);
    await expectError(res, 500, 'INTERNAL_ERROR');
  });
});
