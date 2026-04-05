jest.mock('@/lib/supabase/server', () => ({ requireAuth: jest.fn() }));
jest.mock('@/lib/supabase/queries', () => ({
  listSignatures: jest.fn(),
  createSignature: jest.fn()
}));

import { GET, POST } from '@/app/api/signatures/route';
import { requireAuth } from '@/lib/supabase/server';
import { listSignatures, createSignature } from '@/lib/supabase/queries';
import { mockAuthSuccess, mockAuthFailure, expectError } from '@/tests/helpers';

const mockAuth = requireAuth as jest.MockedFunction<typeof requireAuth>;
const mockList = listSignatures as jest.MockedFunction<typeof listSignatures>;
const mockCreate = createSignature as jest.MockedFunction<typeof createSignature>;

beforeEach(() => jest.clearAllMocks());

describe('GET /api/signatures', () => {
  it('returns 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue(mockAuthFailure());
    expect((await GET()).status).toBe(401);
  });

  it('returns signatures array', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockList.mockResolvedValue({ data: [{ id: '1', name: 'Default' }], error: null } as never);

    const body = await (await GET()).json();
    expect(body.signatures).toHaveLength(1);
  });
});

describe('POST /api/signatures', () => {
  it('returns 201 on creation', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockCreate.mockResolvedValue({ data: { id: '1', name: 'Sig' }, error: null } as never);

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Sig', body: 'Best regards' })
    });

    expect((await POST(req as never)).status).toBe(201);
  });

  it('returns 400 on empty name', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    mockAuth.mockResolvedValue(mockAuthSuccess());

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '', body: 'Best' })
    });

    await expectError(await POST(req as never), 400, 'VALIDATION_ERROR');
  });
});
