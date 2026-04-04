import type {
  ICPCriteria,
  DiscoveredCompanyPreview,
  ResearchStreamEvent,
  PeopleSearchResult,
  ApolloPersonPreview
} from '@/lib/types';
import { postJson, readSSEStream } from './client';

export async function parseICP(input: string, signal?: AbortSignal): Promise<ICPCriteria> {
  const response = await postJson('/api/icps/parse', { input }, signal);
  const data = (await response.json()) as { icp: ICPCriteria };
  return data.icp;
}

/** Phase 1: Discover candidate companies for an ICP */
export async function discoverCompanies(
  icp: ICPCriteria,
  onEvent: (event: ResearchStreamEvent) => void,
  signal?: AbortSignal
): Promise<DiscoveredCompanyPreview[]> {
  const response = await postJson('/api/research', { icp }, signal);
  let candidates: DiscoveredCompanyPreview[] = [];

  await readSSEStream<ResearchStreamEvent>(response, (event) => {
    if (event.type === 'error') throw new Error(event.message);
    if (event.type === 'candidates') candidates = event.data;
    onEvent(event);
  });

  return candidates;
}

/** Phase 2: Research confirmed companies */
export async function researchCompanies(
  icp: ICPCriteria,
  companies: string[],
  onEvent: (event: ResearchStreamEvent) => void,
  signal?: AbortSignal,
  candidates?: DiscoveredCompanyPreview[]
): Promise<void> {
  const response = await postJson('/api/research', { icp, companies, candidates }, signal);

  await readSSEStream<ResearchStreamEvent>(response, (event) => {
    if (event.type === 'error') throw new Error(event.message);
    onEvent(event);
  });
}

/** Search for people at companies via Apollo */
export async function searchPeople(
  orgIds: string[],
  icp: ICPCriteria,
  companies: { name: string; apollo_org_id: string }[],
  signal?: AbortSignal
): Promise<PeopleSearchResult[]> {
  const response = await postJson(
    '/api/people/search',
    { org_ids: orgIds, icp, companies },
    signal
  );
  const data = (await response.json()) as { results: PeopleSearchResult[] };
  return data.results;
}

/** Fetch bulk contacts for outreach (free Apollo search, 10 per company) */
export async function fetchOutreachContacts(
  companies: { name: string; apollo_org_id: string }[],
  signal?: AbortSignal
): Promise<{ company_name: string; people: ApolloPersonPreview[] }[]> {
  const response = await postJson('/api/people/bulk', { companies }, signal);
  const data = (await response.json()) as {
    results: { company_name: string; people: ApolloPersonPreview[] }[];
  };
  return data.results;
}

/** Enrich a single person via Apollo (1 credit) */
export async function enrichPerson(
  personId: string,
  signal?: AbortSignal
): Promise<{
  first_name: string;
  last_name: string;
  title: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
}> {
  const response = await postJson('/api/people/enrich', { person_id: personId }, signal);
  const data = (await response.json()) as {
    person: {
      first_name: string;
      last_name: string;
      title: string | null;
      email: string | null;
      phone: string | null;
      linkedin_url: string | null;
    };
  };
  return data.person;
}
