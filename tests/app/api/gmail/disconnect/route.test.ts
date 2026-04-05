jest.mock('@/lib/supabase/server', () => ({ requireAuth: jest.fn() }));
jest.mock('@/lib/supabase/queries', () => ({ deleteGmailConnection: jest.fn() }));

import { POST } from '@/app/api/gmail/disconnect/route';
import { requireAuth } from '@/lib/supabase/server';
import { deleteGmailConnection } from '@/lib/supabase/queries';
import { mockAuthSuccess, mockAuthFailure, expectError } from '@/tests/helpers';

const mockAuth = requireAuth as jest.MockedFunction<typeof requireAuth>;
const mockDelete = deleteGmailConnection as jest.MockedFunction<typeof deleteGmailConnection>;

beforeEach(() => jest.clearAllMocks());

describe('POST /api/gmail/disconnect', () => {
  it('returns 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue(mockAuthFailure());
    expect((await POST()).status).toBe(401);
  });

  it('returns success after disconnecting', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockDelete.mockResolvedValue({ data: null, error: null } as never);

    const body = await (await POST()).json();
    expect(body.success).toBe(true);
  });

  it('returns 500 on DB failure', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockDelete.mockResolvedValue({ data: null, error: { message: 'DB error' } } as never);

    await expectError(await POST(), 500, 'INTERNAL_ERROR');
  });
});
