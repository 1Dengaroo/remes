import { discoverCompanies, researchConfirmedCompanies } from '@/lib/services/research/pipeline';
import type { ICPCriteria, ResearchStreamEvent } from '@/lib/types';
import type { PipelineConfig } from '@/lib/services/research/pipeline';
import { validIcp } from '@/tests/helpers';

const mockIcp: ICPCriteria = validIcp;

function collectEvents(fn: (send: (e: ResearchStreamEvent) => void) => Promise<void>) {
  const events: ResearchStreamEvent[] = [];
  return fn((e) => events.push(e)).then(() => events);
}

describe('discoverCompanies', () => {
  it('sends empty candidates when discovery returns nothing', async () => {
    const config: PipelineConfig = {
      icpParser: { parse: jest.fn() },
      companyDiscovery: { find: jest.fn().mockResolvedValue([]) },
      companyScorer: { score: jest.fn() },
      companyResearcher: { research: jest.fn() }
    };

    const events = await collectEvents((send) => discoverCompanies(mockIcp, send, config));

    expect(config.companyDiscovery.find).toHaveBeenCalledTimes(1);
    expect(config.companyScorer.score).not.toHaveBeenCalled();

    const candidateEvent = events.find((e) => e.type === 'candidates');
    expect(candidateEvent).toBeDefined();
    if (candidateEvent?.type === 'candidates') {
      expect(candidateEvent.data).toEqual([]);
    }
  });

  it('scores and returns discovered companies', async () => {
    const companies = [
      {
        name: 'Acme',
        website: 'https://acme.com',
        description: 'A SaaS company',
        linkedin_url: 'https://linkedin.com/company/acme',
        logo_url: 'https://logo.clearbit.com/acme.com',
        apollo_org_id: '123',
        location: 'SF',
        match_context: ''
      }
    ];

    const config: PipelineConfig = {
      icpParser: { parse: jest.fn() },
      companyDiscovery: { find: jest.fn().mockResolvedValue(companies) },
      companyScorer: { score: jest.fn().mockResolvedValue(companies) },
      companyResearcher: { research: jest.fn() }
    };

    const events = await collectEvents((send) => discoverCompanies(mockIcp, send, config));

    expect(config.companyScorer.score).toHaveBeenCalledWith(companies, mockIcp);

    const candidateEvent = events.find((e) => e.type === 'candidates');
    expect(candidateEvent).toBeDefined();
    if (candidateEvent?.type === 'candidates') {
      expect(candidateEvent.data).toHaveLength(1);
      expect(candidateEvent.data[0].name).toBe('Acme');
    }
  });
});

describe('researchConfirmedCompanies', () => {
  const mockResearch = {
    industry: 'SaaS',
    funding_stage: 'Series A',
    amount_raised: '$10M',
    website: 'https://acme.com',
    linkedin_url: 'https://linkedin.com/company/acme',
    signals: [],
    match_reason: 'Good fit',
    company_overview: 'A company',
    inferred_contacts: [],
    sources: { jobs: [], funding: [], news: [] }
  };

  it('researches companies and sends results with done event', async () => {
    const config: PipelineConfig = {
      icpParser: { parse: jest.fn() },
      companyDiscovery: { find: jest.fn() },
      companyScorer: { score: jest.fn() },
      companyResearcher: { research: jest.fn().mockResolvedValue(mockResearch) }
    };

    const events = await collectEvents((send) =>
      researchConfirmedCompanies(['Acme'], mockIcp, send, config)
    );

    expect(config.companyResearcher.research).toHaveBeenCalledTimes(1);

    const companyEvent = events.find((e) => e.type === 'company');
    expect(companyEvent).toBeDefined();
    if (companyEvent?.type === 'company') {
      expect(companyEvent.data.company_name).toBe('Acme');
    }

    const doneEvent = events.find((e) => e.type === 'done');
    expect(doneEvent).toBeDefined();
    if (doneEvent?.type === 'done') {
      expect(doneEvent.total).toBe(1);
    }
  });

  it('handles research errors gracefully without crashing', async () => {
    const config: PipelineConfig = {
      icpParser: { parse: jest.fn() },
      companyDiscovery: { find: jest.fn() },
      companyScorer: { score: jest.fn() },
      companyResearcher: { research: jest.fn().mockRejectedValue(new Error('API down')) }
    };

    const events = await collectEvents((send) =>
      researchConfirmedCompanies(['BadCo'], mockIcp, send, config)
    );

    expect(events.filter((e) => e.type === 'company')).toHaveLength(0);

    const doneEvent = events.find((e) => e.type === 'done');
    if (doneEvent?.type === 'done') {
      expect(doneEvent.total).toBe(0);
    }
  });

  it('uses candidate data for pre-fetched metadata', async () => {
    const config: PipelineConfig = {
      icpParser: { parse: jest.fn() },
      companyDiscovery: { find: jest.fn() },
      companyScorer: { score: jest.fn() },
      companyResearcher: {
        research: jest
          .fn()
          .mockResolvedValue({ ...mockResearch, website: null, linkedin_url: null })
      }
    };

    const candidates = [
      {
        name: 'Acme',
        website: 'https://acme.com',
        linkedin_url: 'https://linkedin.com/company/acme',
        logo_url: 'https://logo.clearbit.com/acme.com'
      }
    ];

    const events = await collectEvents((send) =>
      researchConfirmedCompanies(['Acme'], mockIcp, send, config, candidates)
    );

    const companyEvent = events.find((e) => e.type === 'company');
    if (companyEvent?.type === 'company') {
      expect(companyEvent.data.website).toBe('https://acme.com');
      expect(companyEvent.data.linkedin_url).toBe('https://linkedin.com/company/acme');
      expect(companyEvent.data.logo_url).toBe('https://logo.clearbit.com/acme.com');
    }
  });
});
