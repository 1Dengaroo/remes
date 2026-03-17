import type {
  ICPCriteria,
  CompanyResult,
  ResearchStreamEvent,
  DiscoveredCompanyPreview
} from '@/lib/types';
import type { ICPParser, CompanyDiscovery, CompanyScorer, CompanyResearcher } from './interfaces';

import { claudeICPParser } from './ai';
import { apolloCompanyDiscovery } from './apollo';
import { claudeCompanyScorer } from './scoring';
import { claudeResearchAgent } from './research-agent';

export interface PipelineConfig {
  icpParser: ICPParser;
  companyDiscovery: CompanyDiscovery;
  companyScorer: CompanyScorer;
  companyResearcher: CompanyResearcher;
}

const defaultConfig: PipelineConfig = {
  icpParser: claudeICPParser,
  companyDiscovery: apolloCompanyDiscovery,
  companyScorer: claudeCompanyScorer,
  companyResearcher: claudeResearchAgent
};

const TITLE_PREFIX_PATTERN =
  /^(VP|CTO|CEO|CFO|COO|Head|Director|Manager|Chief|President|SVP|EVP)\b/i;

function buildLinkedInSearchUrl(name: string, companyName?: string): string {
  const keywords = companyName ? `${name} ${companyName}` : name;
  return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(keywords)}&origin=GLOBAL_SEARCH_HEADER`;
}

function buildLinkedInCompanySearchUrl(companyName: string): string {
  return `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(companyName)}`;
}

function buildLogoUrl(website: string | null, companyName: string): string {
  const domain =
    website?.replace(/^https?:\/\//, '').replace(/\/.*$/, '') ||
    `${companyName.toLowerCase().replace(/\s+/g, '')}.com`;
  return `https://logo.clearbit.com/${domain}`;
}

function filterRealContacts(
  contacts: { name: string; title: string; email: string | null; is_decision_maker: boolean }[],
  companyName: string
) {
  return contacts
    .filter((c) => {
      const name = c.name.trim();
      if (!name || name.split(/\s+/).length < 2) return false;
      return !TITLE_PREFIX_PATTERN.test(name);
    })
    .map((c) => ({
      name: c.name,
      title: c.title,
      linkedin_url: buildLinkedInSearchUrl(c.name, companyName),
      email: c.email || null,
      is_decision_maker: c.is_decision_maker
    }));
}

/**
 * Phase 1: Discover companies matching the ICP.
 * Apollo search → Claude scoring → ranked candidates for user confirmation.
 */
export async function discoverCompanies(
  icp: ICPCriteria,
  send: (event: ResearchStreamEvent) => void,
  config: PipelineConfig = defaultConfig
): Promise<void> {
  send({ type: 'status', message: `Searching for companies matching: ${icp.description}` });

  const companies = await config.companyDiscovery.find(icp, (message) => {
    send({ type: 'status', message });
  });

  if (companies.length === 0) {
    send({ type: 'status', message: 'No companies found matching your criteria.' });
    send({ type: 'candidates', data: [] });
    return;
  }

  send({ type: 'status', message: `Scoring ${companies.length} companies against your ICP...` });
  const scored = await config.companyScorer.score(companies, icp);

  const candidates: DiscoveredCompanyPreview[] = scored.map((c) => ({
    name: c.name,
    website: c.website,
    description: c.description,
    linkedin_url: c.linkedin_url,
    logo_url: c.logo_url
  }));

  send({ type: 'candidates', data: candidates });
}

/**
 * Phase 2: Deep-research confirmed companies.
 * Takes company names the user approved, plus candidate previews
 * for pre-fetched metadata (logo, linkedin, website from discovery).
 */
export async function researchConfirmedCompanies(
  companyNames: string[],
  icp: ICPCriteria,
  send: (event: ResearchStreamEvent) => void,
  config: PipelineConfig = defaultConfig,
  candidateData?: DiscoveredCompanyPreview[]
): Promise<void> {
  let completedCount = 0;

  const candidateMap = new Map<string, DiscoveredCompanyPreview>();
  if (candidateData) {
    for (const c of candidateData) {
      candidateMap.set(c.name, c);
    }
  }

  const processCompany = async (companyName: string) => {
    try {
      const candidate = candidateMap.get(companyName);
      const research = await config.companyResearcher.research(companyName, icp, {
        description: candidate?.description,
        website: candidate?.website
      });

      const contacts = filterRealContacts(research.inferred_contacts, companyName);

      // Prefer discovery-provided URLs, fall back to research results
      const websiteUrl = candidate?.website || research.website || null;
      const linkedinUrl =
        candidate?.linkedin_url ||
        research.linkedin_url ||
        buildLinkedInCompanySearchUrl(companyName);
      const logoUrl = candidate?.logo_url || buildLogoUrl(websiteUrl, companyName);

      const result: CompanyResult = {
        company_name: companyName,
        industry: research.industry,
        funding_stage: research.funding_stage,
        amount_raised: research.amount_raised,
        website: websiteUrl,
        linkedin_url: linkedinUrl,
        logo_url: logoUrl,
        signals: research.signals,
        match_reason: research.match_reason,
        company_overview: research.company_overview,
        contacts,
        email_hook: research.email_hook,
        sources: research.sources
      };

      completedCount++;
      send({ type: 'company', data: result });
    } catch {
      send({ type: 'status', message: `Skipped ${companyName} due to an error.` });
    }
  };

  for (let i = 0; i < companyNames.length; i++) {
    send({
      type: 'status',
      message: `Researching ${companyNames[i]} (${i + 1}/${companyNames.length})...`
    });
    await processCompany(companyNames[i]);
  }
  send({ type: 'done', total: completedCount });
}
