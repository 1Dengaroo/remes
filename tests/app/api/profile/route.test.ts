jest.mock('@/lib/supabase/server', () => ({ requireAuth: jest.fn() }));
jest.mock('@/lib/supabase/queries', () => ({
  getProfile: jest.fn(),
  upsertProfile: jest.fn()
}));

import { GET, PUT } from '@/app/api/profile/route';
import { requireAuth } from '@/lib/supabase/server';
import { getProfile, upsertProfile } from '@/lib/supabase/queries';
import { mockAuthSuccess, mockAuthFailure, expectError } from '@/tests/helpers';

const mockAuth = requireAuth as jest.MockedFunction<typeof requireAuth>;
const mockGet = getProfile as jest.MockedFunction<typeof getProfile>;
const mockUpsert = upsertProfile as jest.MockedFunction<typeof upsertProfile>;

beforeEach(() => jest.clearAllMocks());

describe('GET /api/profile', () => {
  it('returns 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue(mockAuthFailure());
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('returns profile with defaults on success', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockGet.mockResolvedValue({
      data: { full_name: 'Alice', company_name: 'Acme' },
      error: null
    } as never);

    const res = await GET();
    const body = await res.json();
    expect(body.full_name).toBe('Alice');
    expect(body.company_name).toBe('Acme');
  });
});

describe('PUT /api/profile', () => {
  it('returns 400 on invalid body', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    mockAuth.mockResolvedValue(mockAuthSuccess());
    const req = new Request('http://localhost/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: 123 })
    });

    const res = await PUT(req as never);
    await expectError(res, 400, 'VALIDATION_ERROR');
  });

  it('returns updated profile on success', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockUpsert.mockResolvedValue({ data: null, error: null } as never);
    const req = new Request('http://localhost/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: 'Bob', company_name: 'Corp' })
    });

    const res = await PUT(req as never);
    const body = await res.json();
    expect(body.full_name).toBe('Bob');
    expect(body.company_name).toBe('Corp');
  });

  it('returns 500 on DB failure', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockUpsert.mockResolvedValue({ data: null, error: { message: 'DB error' } } as never);
    const req = new Request('http://localhost/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: 'Bob' })
    });

    const res = await PUT(req as never);
    await expectError(res, 500, 'INTERNAL_ERROR');
  });
});
