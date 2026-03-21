import { discoverCompanies, researchConfirmedCompanies } from '@/lib/services/pipeline';
import type { ICPCriteria, ResearchStreamEvent } from '@/lib/types';
import type { PipelineConfig } from '@/lib/services/pipeline';

const mockIcp: ICPCriteria = {
  description: 'B2B SaaS companies',
  industry_keywords: ['saas'],
  min_employees: 10,
  max_employees: 500,
  min_funding_amount: null,
  funding_stages: [],
  hiring_signals: [],
  tech_keywords: [],
  company_examples: [],
  locations: []
};

function collectEvents(fn: (send: (e: ResearchStreamEvent) => void) => Promise<void>) {
  const events: ResearchStreamEvent[] = [];
  return fn((e) => events.push(e)).then(() => events);
}

// ---------------------------------------------------------------------------
// discoverCompanies
// ---------------------------------------------------------------------------

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
        location: 'SF'
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

// ---------------------------------------------------------------------------
// researchConfirmedCompanies
// ---------------------------------------------------------------------------

describe('researchConfirmedCompanies', () => {
  it('researches companies and sends results', async () => {
    const mockResearch = {
      industry: 'SaaS',
      funding_stage: 'Series A',
      amount_raised: '$10M',
      website: 'https://acme.com',
      linkedin_url: 'https://linkedin.com/company/acme',
      signals: [],
      match_reason: 'Good fit',
      company_overview: 'A company',
      sources: { jobs: [], funding: [], news: [] }
    };

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

  it('handles research errors gracefully', async () => {
    const config: PipelineConfig = {
      icpParser: { parse: jest.fn() },
      companyDiscovery: { find: jest.fn() },
      companyScorer: { score: jest.fn() },
      companyResearcher: { research: jest.fn().mockRejectedValue(new Error('API down')) }
    };

    const events = await collectEvents((send) =>
      researchConfirmedCompanies(['BadCo'], mockIcp, send, config)
    );

    const companyEvents = events.filter((e) => e.type === 'company');
    expect(companyEvents).toHaveLength(0);

    const doneEvent = events.find((e) => e.type === 'done');
    if (doneEvent?.type === 'done') {
      expect(doneEvent.total).toBe(0);
    }
  });

  it('uses candidate data for pre-fetched metadata', async () => {
    const mockResearch = {
      industry: 'SaaS',
      funding_stage: 'Series A',
      amount_raised: '$10M',
      website: null,
      linkedin_url: null,
      signals: [],
      match_reason: 'Good fit',
      company_overview: 'A company',
      sources: { jobs: [], funding: [], news: [] }
    };

    const config: PipelineConfig = {
      icpParser: { parse: jest.fn() },
      companyDiscovery: { find: jest.fn() },
      companyScorer: { score: jest.fn() },
      companyResearcher: { research: jest.fn().mockResolvedValue(mockResearch) }
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
