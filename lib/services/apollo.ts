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

/**
 * Apollo Organization Search-based company discovery.
 *
 * Strategy: keep the Apollo query broad (employee size + keywords + job titles).
 * Claude scoring handles nuanced ICP ranking after results come back.
 */
export const apolloCompanyDiscovery: CompanyDiscovery = {
  async find(
    icp: ICPCriteria,
    onProgress?: (message: string) => void
  ): Promise<DiscoveredCompany[]> {
    const apiKey = process.env.APOLLO_API_KEY;
    if (!apiKey) throw new Error('APOLLO_API_KEY is not set');

    const payload: Record<string, unknown> = {
      per_page: serviceConfig.apolloPerPage,
      page: 1
    };

    if (icp.industry_keywords.length > 0) {
      payload.q_organization_keyword_tags = icp.industry_keywords;
    }

    const employeeRanges = buildEmployeeRangeFilters(icp.min_employees, icp.max_employees);
    if (employeeRanges) {
      payload.organization_num_employees_ranges = employeeRanges;
    }

    // q_organization_job_titles filters by ACTIVE job postings at the company
    if (icp.hiring_signals.length > 0) {
      payload.q_organization_job_titles = icp.hiring_signals;
    }

    if (icp.funding_stages.length > 0) {
      payload.organization_latest_funding_stage_cd = icp.funding_stages.map((s) =>
        s.toLowerCase().replace(/\s+/g, '_')
      );
    }

    if (icp.min_funding_amount) {
      payload['latest_funding_amount_range[min]'] = icp.min_funding_amount;
    }

    onProgress?.('Searching Apollo for matching companies...');
    console.log('[Apollo] Request payload:', JSON.stringify(payload, null, 2));

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
    console.log('[Apollo] Response status:', response.status);
    console.log('[Apollo] Response body:', responseText.slice(0, 2000));

    if (!response.ok) {
      throw new Error(`Apollo API error (${response.status}): ${responseText}`);
    }

    const data: unknown = JSON.parse(responseText);
    if (!isApolloSearchResponse(data)) {
      throw new Error('Unexpected Apollo response shape');
    }

    onProgress?.(
      `Apollo returned ${data.organizations.length} companies (${data.pagination?.total_entries ?? 0} total matches)`
    );

    if (data.organizations.length === 0) {
      return [];
    }

    return data.organizations.map((org) => ({
      name: org.name,
      website: org.website_url || undefined,
      description: org.short_description || undefined,
      linkedin_url: org.linkedin_url || undefined,
      logo_url: org.logo_url || undefined,
      match_context: JSON.stringify({
        employee_count: org.estimated_num_employees,
        industry: org.industry,
        keywords: org.keywords,
        funding_stage: org.latest_funding_stage,
        total_funding: org.total_funding_printed,
        departments: org.departments
      })
    }));
  }
};
