jest.mock('@/lib/supabase/server', () => ({ requireAuth: jest.fn() }));
jest.mock('@/lib/supabase/queries', () => ({
  updateSignatureWithDefault: jest.fn(),
  deleteSignature: jest.fn()
}));

import { PATCH, DELETE } from '@/app/api/signatures/[id]/route';
import { requireAuth } from '@/lib/supabase/server';
import { updateSignatureWithDefault, deleteSignature } from '@/lib/supabase/queries';
import { mockAuthSuccess, mockAuthFailure, expectError } from '@/tests/helpers';

const mockAuth = requireAuth as jest.MockedFunction<typeof requireAuth>;
const mockUpdate = updateSignatureWithDefault as jest.MockedFunction<
  typeof updateSignatureWithDefault
>;
const mockDelete = deleteSignature as jest.MockedFunction<typeof deleteSignature>;

const routeParams = { params: Promise.resolve({ id: 'sig-1' }) };

beforeEach(() => jest.clearAllMocks());

describe('PATCH /api/signatures/[id]', () => {
  it('returns updated signature', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockUpdate.mockResolvedValue({ data: { id: 'sig-1', name: 'Updated' }, error: null } as never);

    const req = new Request('http://localhost', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Updated' })
    });

    const res = await PATCH(req as never, routeParams);
    expect(res.status).toBe(200);
  });

  it('returns 500 on failure', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockUpdate.mockResolvedValue({ data: null, error: { message: 'fail' } } as never);

    const req = new Request('http://localhost', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'X' })
    });

    await expectError(await PATCH(req as never, routeParams), 500, 'INTERNAL_ERROR');
  });
});

describe('DELETE /api/signatures/[id]', () => {
  it('returns success', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockDelete.mockResolvedValue({ data: null, error: null } as never);

    const body = await (await DELETE(new Request('http://localhost') as never, routeParams)).json();
    expect(body.success).toBe(true);
  });
});
