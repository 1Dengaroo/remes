jest.mock('@/lib/supabase/server', () => ({ requireAuth: jest.fn() }));
jest.mock('@/lib/validation', () => ({
  ...jest.requireActual('@/lib/validation'),
  requireEnvVars: jest.fn()
}));
jest.mock('@/lib/services/people/search', () => ({
  searchAndRankPeople: jest.fn()
}));

import { POST } from '@/app/api/people/search/route';
import { requireAuth } from '@/lib/supabase/server';
import { requireEnvVars } from '@/lib/validation';
import { searchAndRankPeople } from '@/lib/services/people/search';
import { mockAuthSuccess, mockAuthFailure, expectError, validIcp } from '@/tests/helpers';

const mockAuth = requireAuth as jest.MockedFunction<typeof requireAuth>;
const mockEnvVars = requireEnvVars as jest.MockedFunction<typeof requireEnvVars>;
const mockSearch = searchAndRankPeople as jest.MockedFunction<typeof searchAndRankPeople>;

const validBody = {
  org_ids: ['org1'],
  icp: validIcp,
  companies: [{ name: 'Acme', apollo_org_id: 'org1' }]
};

beforeEach(() => {
  jest.clearAllMocks();
  mockEnvVars.mockReturnValue(null);
});

describe('POST /api/people/search', () => {
  it('returns 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue(mockAuthFailure());
    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validBody)
    });
    expect((await POST(req as never)).status).toBe(401);
  });

  it('returns results on success', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockSearch.mockResolvedValue([
      { company_name: 'Acme', apollo_org_id: 'org1', ranked_people: [] }
    ]);

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validBody)
    });

    const body = await (await POST(req as never)).json();
    expect(body.results).toHaveLength(1);
    expect(body.results[0].company_name).toBe('Acme');
  });

  it('returns 500 on service error', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockSearch.mockRejectedValue(new Error('Apollo down'));

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validBody)
    });

    await expectError(await POST(req as never), 500, 'INTERNAL_ERROR');
  });
});
