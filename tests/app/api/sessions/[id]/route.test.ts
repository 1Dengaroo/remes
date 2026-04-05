jest.mock('@/lib/supabase/server', () => ({ requireAuth: jest.fn() }));
jest.mock('@/lib/supabase/queries', () => ({
  getSession: jest.fn(),
  updateSession: jest.fn(),
  deleteSession: jest.fn()
}));

import { GET, PATCH, DELETE } from '@/app/api/sessions/[id]/route';
import { requireAuth } from '@/lib/supabase/server';
import { getSession, updateSession, deleteSession } from '@/lib/supabase/queries';
import { mockAuthSuccess, mockAuthFailure, expectError } from '@/tests/helpers';

const mockAuth = requireAuth as jest.MockedFunction<typeof requireAuth>;
const mockGet = getSession as jest.MockedFunction<typeof getSession>;
const mockUpdate = updateSession as jest.MockedFunction<typeof updateSession>;
const mockDelete = deleteSession as jest.MockedFunction<typeof deleteSession>;

const routeParams = { params: Promise.resolve({ id: 's-1' }) };

beforeEach(() => jest.clearAllMocks());

describe('GET /api/sessions/[id]', () => {
  it('returns 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue(mockAuthFailure());
    expect((await GET(new Request('http://localhost') as never, routeParams)).status).toBe(401);
  });

  it('returns session on success', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockGet.mockResolvedValue({ data: { id: 's-1', name: 'Test' }, error: null } as never);

    const res = await GET(new Request('http://localhost') as never, routeParams);
    const body = await res.json();
    expect(body.id).toBe('s-1');
  });

  it('returns 404 when not found', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockGet.mockResolvedValue({ data: null, error: { message: 'not found' } } as never);

    await expectError(
      await GET(new Request('http://localhost') as never, routeParams),
      404,
      'NOT_FOUND'
    );
  });
});

describe('PATCH /api/sessions/[id]', () => {
  it('returns success on update', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockUpdate.mockResolvedValue({ data: null, error: null } as never);

    const req = new Request('http://localhost', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Updated' })
    });

    const body = await (await PATCH(req as never, routeParams)).json();
    expect(body.success).toBe(true);
  });
});

describe('DELETE /api/sessions/[id]', () => {
  it('returns success on delete', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockDelete.mockResolvedValue({ data: null, error: null } as never);

    const body = await (await DELETE(new Request('http://localhost') as never, routeParams)).json();
    expect(body.success).toBe(true);
  });
});
