jest.mock('@/lib/supabase/server', () => ({ requireAuth: jest.fn() }));
jest.mock('@/lib/supabase/queries', () => ({
  listSessionSummaries: jest.fn(),
  createSession: jest.fn()
}));

import { GET, POST } from '@/app/api/sessions/route';
import { requireAuth } from '@/lib/supabase/server';
import { listSessionSummaries, createSession } from '@/lib/supabase/queries';
import { mockAuthSuccess, mockAuthFailure, expectError } from '@/tests/helpers';

const mockAuth = requireAuth as jest.MockedFunction<typeof requireAuth>;
const mockList = listSessionSummaries as jest.MockedFunction<typeof listSessionSummaries>;
const mockCreate = createSession as jest.MockedFunction<typeof createSession>;

beforeEach(() => jest.clearAllMocks());

describe('GET /api/sessions', () => {
  it('returns 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue(mockAuthFailure());
    expect((await GET()).status).toBe(401);
  });

  it('returns session summaries', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockList.mockResolvedValue({ data: [{ id: '1', name: 'Test' }], error: null } as never);

    const body = await (await GET()).json();
    expect(body.sessions).toHaveLength(1);
  });
});

describe('POST /api/sessions', () => {
  it('returns 201 on creation', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockCreate.mockResolvedValue({ data: { id: '1' }, error: null } as never);

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });

    expect((await POST(req as never)).status).toBe(201);
  });

  it('returns 500 on DB failure', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockCreate.mockResolvedValue({ data: null, error: { message: 'fail' } } as never);

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });

    await expectError(await POST(req as never), 500, 'INTERNAL_ERROR');
  });
});
