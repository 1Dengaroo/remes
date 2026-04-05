jest.mock('@/lib/supabase/server', () => ({ requireAuth: jest.fn() }));
jest.mock('@/lib/validation', () => ({
  ...jest.requireActual('@/lib/validation'),
  requireEnvVars: jest.fn()
}));
jest.mock('@/lib/services/people/apollo', () => ({
  apolloPeopleSearch: jest.fn()
}));

import { POST } from '@/app/api/people/bulk/route';
import { requireAuth } from '@/lib/supabase/server';
import { requireEnvVars } from '@/lib/validation';
import { apolloPeopleSearch } from '@/lib/services/people/apollo';
import { mockAuthSuccess, mockAuthFailure, expectError } from '@/tests/helpers';

const mockAuth = requireAuth as jest.MockedFunction<typeof requireAuth>;
const mockEnvVars = requireEnvVars as jest.MockedFunction<typeof requireEnvVars>;
const mockSearch = apolloPeopleSearch as jest.MockedFunction<typeof apolloPeopleSearch>;

beforeEach(() => {
  jest.clearAllMocks();
  mockEnvVars.mockReturnValue(null);
});

describe('POST /api/people/bulk', () => {
  it('returns 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue(mockAuthFailure());
    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companies: [{ name: 'Acme', apollo_org_id: 'org1' }] })
    });
    expect((await POST(req as never)).status).toBe(401);
  });

  it('returns results mapped by company', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockSearch.mockResolvedValue(new Map());

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companies: [{ name: 'Acme', apollo_org_id: 'org1' }] })
    });

    const body = await (await POST(req as never)).json();
    expect(body.results).toHaveLength(1);
    expect(body.results[0].company_name).toBe('Acme');
    expect(body.results[0].people).toEqual([]);
  });

  it('returns 500 on service error', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockSearch.mockRejectedValue(new Error('fail'));

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companies: [{ name: 'A', apollo_org_id: '1' }] })
    });

    await expectError(await POST(req as never), 500, 'INTERNAL_ERROR');
  });
});
