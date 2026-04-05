import { validIcp } from '@/tests/helpers';

jest.mock('@/lib/services/people/apollo', () => ({
  apolloPeopleSearch: jest.fn(),
  apolloPersonEnrich: jest.fn()
}));

jest.mock('@/lib/services/people/ranking', () => ({
  rankPeopleForCompany: jest.fn()
}));

import { searchAndRankPeople } from '@/lib/services/people/search';
import { apolloPeopleSearch, apolloPersonEnrich } from '@/lib/services/people/apollo';
import { rankPeopleForCompany } from '@/lib/services/people/ranking';

const mockPeopleSearch = apolloPeopleSearch as jest.MockedFunction<typeof apolloPeopleSearch>;
const mockEnrich = apolloPersonEnrich as jest.MockedFunction<typeof apolloPersonEnrich>;
const mockRank = rankPeopleForCompany as jest.MockedFunction<typeof rankPeopleForCompany>;

const person = {
  apollo_person_id: 'p1',
  first_name: 'Alice',
  last_name_obfuscated: 'S.',
  title: 'VP Engineering',
  organization_name: 'Acme',
  has_email: true,
  has_direct_phone: false
};

const companies = [{ name: 'Acme', apollo_org_id: 'org1' }];

beforeEach(() => jest.clearAllMocks());

describe('searchAndRankPeople', () => {
  it('returns empty ranked_people when no people found', async () => {
    mockPeopleSearch.mockResolvedValue(new Map());

    const results = await searchAndRankPeople(['org1'], validIcp, companies);

    expect(results).toHaveLength(1);
    expect(results[0].company_name).toBe('Acme');
    expect(results[0].ranked_people).toEqual([]);
    expect(mockRank).not.toHaveBeenCalled();
  });

  it('ranks people and auto-enriches top contact', async () => {
    const peopleMap = new Map([['Acme', [person]]]);
    mockPeopleSearch.mockResolvedValue(peopleMap);
    mockRank.mockResolvedValue([{ ...person, is_enriched: false }]);
    mockEnrich.mockResolvedValue({
      first_name: 'Alice',
      last_name: 'Smith',
      title: 'VP Engineering',
      email: 'alice@acme.com',
      phone: null,
      linkedin_url: 'https://linkedin.com/in/alice'
    });

    const results = await searchAndRankPeople(['org1'], validIcp, companies);

    expect(mockRank).toHaveBeenCalledWith([person], validIcp, 'Acme');
    expect(mockEnrich).toHaveBeenCalledWith('p1');
    expect(results[0].ranked_people[0].is_enriched).toBe(true);
    expect(results[0].ranked_people[0].email).toBe('alice@acme.com');
  });

  it('continues gracefully when enrichment fails', async () => {
    const peopleMap = new Map([['Acme', [person]]]);
    mockPeopleSearch.mockResolvedValue(peopleMap);
    mockRank.mockResolvedValue([{ ...person, is_enriched: false }]);
    mockEnrich.mockRejectedValue(new Error('Apollo down'));

    const results = await searchAndRankPeople(['org1'], validIcp, companies);

    expect(results[0].ranked_people).toHaveLength(1);
    expect(results[0].ranked_people[0].is_enriched).toBeFalsy();
  });
});
