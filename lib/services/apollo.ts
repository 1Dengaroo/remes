import type { ICPCriteria } from '@/lib/types';
import type { CompanyDiscovery, DiscoveredCompany } from './interfaces';
import { serviceConfig } from './config';

interface ApolloOrganization {
  id: string;
  name: string;
  website_url: string | null;
  linkedin_url: string | null;
  logo_url: string | null;
  estimated_num_employees: number | null;
  industry: string | null;
  keywords: string[];
  short_description: string | null;
  annual_revenue_printed: string | null;
  total_funding_printed: string | null;
  latest_funding_stage: string | null;
  country: string | null;
  departments: { name: string; count: number }[];
}

interface ApolloSearchResponse {
  organizations: ApolloOrganization[];
  pagination: {
    page: number;
    per_page: number;
    total_entries: number;
    total_pages: number;
  };
}

/** Apollo's predefined employee count ranges */
const EMPLOYEE_RANGES: [number, number][] = [
  [1, 10],
  [11, 20],
  [21, 50],
  [51, 100],
  [101, 200],
  [201, 500],
  [501, 1000],
  [1001, 2000],
  [2001, 5000],
  [5001, 10000]
];

function buildEmployeeRangeFilters(min: number | null, max: number | null): string[] | undefined {
  if (min === null && max === null) return undefined;

  const effectiveMin = min ?? 1;
  const effectiveMax = max ?? Infinity;

  const matching = EMPLOYEE_RANGES.filter(([lo, hi]) => lo <= effectiveMax && hi >= effectiveMin);
  if (effectiveMax > 10000) {
    return [...matching.map(([lo, hi]) => `${lo},${hi}`), '10001,'];
  }
  return matching.map(([lo, hi]) => `${lo},${hi}`);
}

function isApolloSearchResponse(value: unknown): value is ApolloSearchResponse {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return Array.isArray(obj.organizations);
}

// ---------------------------------------------------------------------------
// Raw Apollo API call
// ---------------------------------------------------------------------------

async function apolloOrgSearch(
  apiKey: string,
  payload: Record<string, unknown>
): Promise<ApolloSearchResponse> {
  const response = await fetch(`${serviceConfig.apolloBaseUrl}/organizations/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'x-api-key': apiKey
    },
    body: JSON.stringify(payload)
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`Apollo API error (${response.status}): ${responseText}`);
  }

  const data: unknown = JSON.parse(responseText);
  if (!isApolloSearchResponse(data)) {
    throw new Error('Unexpected Apollo response shape');
  }

  return data;
}

function orgToCompany(org: ApolloOrganization): DiscoveredCompany {
  return {
    name: org.name,
    website: org.website_url || undefined,
    description: org.short_description || undefined,
    linkedin_url: org.linkedin_url || undefined,
    logo_url: org.logo_url || undefined,
    apollo_org_id: org.id,
    location: org.country ?? undefined,
    match_context: JSON.stringify({
      employee_count: org.estimated_num_employees,
      industry: org.industry,
      keywords: org.keywords,
      funding_stage: org.latest_funding_stage,
      total_funding: org.total_funding_printed,
      departments: org.departments
    })
  };
}

// ---------------------------------------------------------------------------
// Search strategy builder
// ---------------------------------------------------------------------------

interface SearchStrategy {
  label: string;
  payload: Record<string, unknown>;
}

/**
 * Build search strategies from the ICP.
 *
 * Default: 1 broad query combining all available filters (1 API call).
 * This maximizes results per credit. The Claude scorer handles ranking.
 */
function buildStrategies(icp: ICPCriteria): SearchStrategy[] {
  const employeeRanges = buildEmployeeRangeFilters(icp.min_employees, icp.max_employees);

  const payload: Record<string, unknown> = {
    per_page: serviceConfig.apolloPerPage
  };

  if (employeeRanges) {
    payload.organization_num_employees_ranges = employeeRanges;
  }

  // Combine industry + tech keywords into one keyword search for broader coverage
  const allKeywords = [...icp.industry_keywords, ...icp.tech_keywords];
  if (allKeywords.length > 0) {
    payload.q_organization_keyword_tags = allKeywords;
  }

  if (icp.hiring_signals.length > 0) {
    payload.q_organization_job_titles = icp.hiring_signals;
  }

  if (icp.funding_stages.length > 0) {
    payload.organization_latest_funding_stage_cd = icp.funding_stages.map((s) =>
      s.toLowerCase().replace(/\s+/g, '_')
    );
  }

  if (icp.locations.length > 0) {
    payload.organization_locations = icp.locations;
  }

  if (icp.min_funding_amount) {
    payload['latest_funding_amount_range[min]'] = icp.min_funding_amount;
  }

  return [{ label: 'combined', payload }];
}

// ---------------------------------------------------------------------------
// Multi-strategy paginated discovery
// ---------------------------------------------------------------------------

/**
 * Run a single strategy with pagination, returning all orgs found.
 */
async function runStrategy(
  apiKey: string,
  strategy: SearchStrategy,
  maxPages: number,
  onProgress?: (message: string) => void
): Promise<ApolloOrganization[]> {
  const allOrgs: ApolloOrganization[] = [];

  for (let page = 1; page <= maxPages; page++) {
    const payload = { ...strategy.payload, page };

    try {
      const data = await apolloOrgSearch(apiKey, payload);

      allOrgs.push(...data.organizations);

      const totalPages = data.pagination?.total_pages ?? 1;
      onProgress?.(
        `[${strategy.label}] Page ${page}: ${data.organizations.length} companies (${data.pagination?.total_entries ?? 0} total)`
      );

      // Stop if we've fetched all available pages
      if (page >= totalPages) break;
    } catch (err) {
      console.error(`[Apollo] Strategy "${strategy.label}" page ${page} failed:`, err);
      // Don't let one page failure kill the whole strategy
      break;
    }
  }

  return allOrgs;
}

/**
 * Deduplicate orgs by apollo_org_id, preferring the first occurrence.
 */
function deduplicateOrgs(orgs: ApolloOrganization[]): ApolloOrganization[] {
  const seen = new Map<string, ApolloOrganization>();
  for (const org of orgs) {
    if (!seen.has(org.id)) {
      seen.set(org.id, org);
    }
  }
  return [...seen.values()];
}

/**
 * Apollo Organization Search-based company discovery.
 *
 * Runs multiple search strategies in parallel, each with pagination,
 * then deduplicates and passes the merged set to scoring.
 */
export const apolloCompanyDiscovery: CompanyDiscovery = {
  async find(
    icp: ICPCriteria,
    onProgress?: (message: string) => void
  ): Promise<DiscoveredCompany[]> {
    const apiKey = process.env.APOLLO_API_KEY;
    if (!apiKey) throw new Error('APOLLO_API_KEY is not set');

    const strategies = buildStrategies(icp);
    const maxPages = serviceConfig.apolloPagesPerStrategy;

    onProgress?.(
      `Searching Apollo with ${strategies.length} ${strategies.length === 1 ? 'strategy' : 'strategies'}: ${strategies.map((s) => s.label).join(', ')}`
    );

    // Run all strategies in parallel
    const strategyResults = await Promise.all(
      strategies.map((strategy) => runStrategy(apiKey, strategy, maxPages, onProgress))
    );

    // Merge and deduplicate
    const allOrgs = strategyResults.flat();
    const uniqueOrgs = deduplicateOrgs(allOrgs);

    // Cap at max candidates to avoid overloading the scorer
    const capped = uniqueOrgs.slice(0, serviceConfig.apolloMaxCandidates);

    onProgress?.(
      `Found ${allOrgs.length} results across ${strategies.length} strategies → ${uniqueOrgs.length} unique companies${uniqueOrgs.length > capped.length ? ` (capped to ${capped.length})` : ''}`
    );

    if (capped.length === 0) {
      return [];
    }

    return capped.map(orgToCompany);
  }
};
