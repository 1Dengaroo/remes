jest.mock('@/lib/supabase/server', () => ({ requireAuth: jest.fn() }));
jest.mock('@/lib/validation', () => ({
  ...jest.requireActual('@/lib/validation'),
  requireEnvVars: jest.fn()
}));
jest.mock('@/lib/services/people/apollo', () => ({
  apolloPersonEnrich: jest.fn()
}));

import { POST } from '@/app/api/people/enrich/route';
import { requireAuth } from '@/lib/supabase/server';
import { requireEnvVars } from '@/lib/validation';
import { apolloPersonEnrich } from '@/lib/services/people/apollo';
import { mockAuthSuccess, mockAuthFailure, expectError } from '@/tests/helpers';

const mockAuth = requireAuth as jest.MockedFunction<typeof requireAuth>;
const mockEnvVars = requireEnvVars as jest.MockedFunction<typeof requireEnvVars>;
const mockEnrich = apolloPersonEnrich as jest.MockedFunction<typeof apolloPersonEnrich>;

beforeEach(() => {
  jest.clearAllMocks();
  mockEnvVars.mockReturnValue(null);
});

describe('POST /api/people/enrich', () => {
  it('returns 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue(mockAuthFailure());
    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ person_id: 'p1' })
    });
    expect((await POST(req as never)).status).toBe(401);
  });

  it('returns enriched person on success', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    const enriched = {
      first_name: 'Alice',
      last_name: 'Smith',
      title: 'VP Eng',
      email: 'alice@acme.com',
      phone: null,
      linkedin_url: null
    };
    mockEnrich.mockResolvedValue(enriched);

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ person_id: 'p1' })
    });

    const body = await (await POST(req as never)).json();
    expect(body.person.email).toBe('alice@acme.com');
  });

  it('returns 400 on empty person_id', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    mockAuth.mockResolvedValue(mockAuthSuccess());

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ person_id: '' })
    });

    await expectError(await POST(req as never), 400, 'VALIDATION_ERROR');
  });

  it('returns 500 on enrichment failure', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockEnrich.mockRejectedValue(new Error('Apollo down'));

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ person_id: 'p1' })
    });

    await expectError(await POST(req as never), 500, 'INTERNAL_ERROR');
  });
});
