import { serviceConfig } from '../config';
import type { ApolloPersonPreview } from '@/lib/types';
import { extractJson } from '@/lib/utils';

interface ApolloPersonResult {
  id: string;
  first_name: string;
  last_name_obfuscated: string;
  title: string | null;
  has_email: boolean;
  has_direct_phone: string; // "Yes" or "No"
  organization?: {
    name: string;
  };
}

interface ApolloPeopleSearchResponse {
  people: ApolloPersonResult[];
  total_entries: number;
}

interface ApolloPersonMatchResponse {
  person: {
    id: string;
    first_name: string;
    last_name: string;
    title: string | null;
    email: string | null;
    linkedin_url: string | null;
    contact?: {
      phone_numbers?: { raw_number: string }[];
    };
  };
}

function isApolloPeopleSearchResponse(value: unknown): value is ApolloPeopleSearchResponse {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return Array.isArray(obj.people);
}

function isApolloPersonMatchResponse(value: unknown): value is ApolloPersonMatchResponse {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.person === 'object' && obj.person !== null;
}

/**
 * Search for people at a single organization via Apollo mixed_people search.
 */
async function searchPeopleForOrg(
  orgId: string,
  apiKey: string,
  perPage: number = 25
): Promise<ApolloPersonPreview[]> {
  const response = await fetch(`${serviceConfig.apolloBaseUrl}/mixed_people/api_search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'x-api-key': apiKey
    },
    body: JSON.stringify({
      organization_ids: [orgId],
      per_page: perPage,
      page: 1
    })
  });

  const responseText = await response.text();

  if (!response.ok) {
    console.error(
      `[Apollo] People search failed for org ${orgId} (${response.status}):`,
      responseText
    );
    return [];
  }

  let data: unknown;
  try {
    data = extractJson(responseText);
    if (!data) throw new Error('No JSON object found');
  } catch {
    console.error(`[Apollo] People search returned invalid JSON for org ${orgId}`);
    return [];
  }

  if (!isApolloPeopleSearchResponse(data)) return [];

  return data.people.map(
    (person): ApolloPersonPreview => ({
      apollo_person_id: person.id,
      first_name: person.first_name,
      last_name_obfuscated: person.last_name_obfuscated,
      title: person.title,
      organization_name: person.organization?.name ?? 'Unknown',
      has_email: person.has_email === true,
      has_direct_phone: person.has_direct_phone === 'Yes'
    })
  );
}

/**
 * Search for people at given organizations via Apollo mixed_people search.
 * Makes one request per org so each company gets a full page of results.
 */
export async function apolloPeopleSearch(
  orgIds: string[],
  perPage: number = 25
): Promise<Map<string, ApolloPersonPreview[]>> {
  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) throw new Error('APOLLO_API_KEY is not set');

  const results = await Promise.all(orgIds.map((id) => searchPeopleForOrg(id, apiKey, perPage)));

  const grouped = new Map<string, ApolloPersonPreview[]>();
  for (const people of results) {
    for (const person of people) {
      const existing = grouped.get(person.organization_name) ?? [];
      existing.push(person);
      grouped.set(person.organization_name, existing);
    }
  }

  return grouped;
}

/**
 * Enrich a single person via Apollo people/match endpoint (1 credit).
 * Returns full contact details.
 */
export async function apolloPersonEnrich(personId: string): Promise<{
  first_name: string;
  last_name: string;
  title: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
}> {
  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) throw new Error('APOLLO_API_KEY is not set');

  const response = await fetch(`${serviceConfig.apolloBaseUrl}/people/match`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'x-api-key': apiKey
    },
    body: JSON.stringify({
      id: personId,
      reveal_personal_emails: true
    })
  });

  const responseText = await response.text();

  if (!response.ok) {
    console.error(`[Apollo] People match failed (${response.status}):`, responseText);
    throw new Error('Person enrichment failed. Please try again.');
  }

  let data: unknown;
  try {
    data = extractJson(responseText);
    if (!data) throw new Error('No JSON object found');
  } catch {
    console.error(
      `[Apollo] People match returned invalid JSON (${response.status}):`,
      responseText.slice(0, 200)
    );
    throw new Error('Person enrichment returned an unexpected response. Please try again.');
  }
  if (!isApolloPersonMatchResponse(data)) {
    throw new Error('Unexpected Apollo People Match response shape');
  }

  const p = data.person;
  return {
    first_name: p.first_name,
    last_name: p.last_name,
    title: p.title,
    email: p.email,
    phone: p.contact?.phone_numbers?.[0]?.raw_number ?? null,
    linkedin_url: p.linkedin_url
  };
}
