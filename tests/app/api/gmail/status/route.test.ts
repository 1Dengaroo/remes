jest.mock('@/lib/supabase/server', () => ({ requireAuth: jest.fn() }));
jest.mock('@/lib/supabase/queries', () => ({ getGmailEmail: jest.fn() }));

import { GET } from '@/app/api/gmail/status/route';
import { requireAuth } from '@/lib/supabase/server';
import { getGmailEmail } from '@/lib/supabase/queries';
import { mockAuthSuccess, mockAuthFailure } from '@/tests/helpers';

const mockAuth = requireAuth as jest.MockedFunction<typeof requireAuth>;
const mockEmail = getGmailEmail as jest.MockedFunction<typeof getGmailEmail>;

beforeEach(() => jest.clearAllMocks());

describe('GET /api/gmail/status', () => {
  it('returns 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue(mockAuthFailure());
    expect((await GET()).status).toBe(401);
  });

  it('returns connected true with email when connected', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockEmail.mockResolvedValue({ data: { gmail_email: 'me@gmail.com' }, error: null } as never);

    const body = await (await GET()).json();
    expect(body.connected).toBe(true);
    expect(body.email).toBe('me@gmail.com');
  });

  it('returns connected false when no connection', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockEmail.mockResolvedValue({ data: null, error: null } as never);

    const body = await (await GET()).json();
    expect(body.connected).toBe(false);
    expect(body.email).toBeNull();
  });
});
