jest.mock('@/lib/supabase/server', () => ({ requireAuth: jest.fn() }));
jest.mock('@/lib/supabase/queries', () => ({ listContacts: jest.fn() }));

import { GET } from '@/app/api/contacts/route';
import { requireAuth } from '@/lib/supabase/server';
import { listContacts } from '@/lib/supabase/queries';
import { mockAuthSuccess, mockAuthFailure, expectError } from '@/tests/helpers';

const mockAuth = requireAuth as jest.MockedFunction<typeof requireAuth>;
const mockList = listContacts as jest.MockedFunction<typeof listContacts>;

beforeEach(() => jest.clearAllMocks());

describe('GET /api/contacts', () => {
  it('returns 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue(mockAuthFailure());
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('returns contacts on success', async () => {
    const contacts = [{ id: '1', company_name: 'Acme' }];
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockList.mockResolvedValue({ data: contacts, error: null } as never);

    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.contacts).toEqual(contacts);
  });

  it('returns 500 with error shape on DB failure', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockList.mockResolvedValue({ data: null, error: { message: 'DB down' } } as never);

    const res = await GET();
    await expectError(res, 500, 'INTERNAL_ERROR');
  });
});
