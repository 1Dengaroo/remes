jest.mock('@/lib/supabase/server', () => ({ requireAuth: jest.fn() }));
jest.mock('@/lib/supabase/queries', () => ({
  updateICP: jest.fn(),
  deleteICP: jest.fn()
}));

import { PATCH, DELETE } from '@/app/api/icps/[id]/route';
import { requireAuth } from '@/lib/supabase/server';
import { updateICP, deleteICP } from '@/lib/supabase/queries';
import { mockAuthSuccess, mockAuthFailure, expectError } from '@/tests/helpers';

const mockAuth = requireAuth as jest.MockedFunction<typeof requireAuth>;
const mockUpdate = updateICP as jest.MockedFunction<typeof updateICP>;
const mockDelete = deleteICP as jest.MockedFunction<typeof deleteICP>;

const routeParams = { params: Promise.resolve({ id: 'icp-1' }) };

beforeEach(() => jest.clearAllMocks());

describe('PATCH /api/icps/[id]', () => {
  it('returns 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue(mockAuthFailure());
    const req = new Request('http://localhost', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Updated' })
    });
    expect((await PATCH(req as never, routeParams)).status).toBe(401);
  });

  it('returns updated ICP on success', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockUpdate.mockResolvedValue({ data: { id: 'icp-1', name: 'Updated' }, error: null } as never);

    const req = new Request('http://localhost', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Updated' })
    });

    const res = await PATCH(req as never, routeParams);
    expect(res.status).toBe(200);
  });
});

describe('DELETE /api/icps/[id]', () => {
  it('returns success on delete', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockDelete.mockResolvedValue({ data: null, error: null } as never);

    const req = new Request('http://localhost', { method: 'DELETE' });
    const res = await DELETE(req as never, routeParams);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it('returns 500 on DB failure', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockDelete.mockResolvedValue({ data: null, error: { message: 'fail' } } as never);

    const req = new Request('http://localhost', { method: 'DELETE' });
    const res = await DELETE(req as never, routeParams);
    await expectError(res, 500, 'INTERNAL_ERROR');
  });
});
