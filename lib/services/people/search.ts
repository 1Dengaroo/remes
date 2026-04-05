import { apolloPeopleSearch, apolloPersonEnrich } from './apollo';
import { rankPeopleForCompany } from './ranking';
import type { ICPCriteria, PeopleSearchResult } from '@/lib/types';

/**
 * Search for people at companies via Apollo, rank them by ICP fit,
 * and auto-enrich the top-ranked contact per company.
 */
export async function searchAndRankPeople(
  orgIds: string[],
  icp: ICPCriteria,
  companies: { name: string; apollo_org_id: string }[]
): Promise<PeopleSearchResult[]> {
  const peopleByOrg = await apolloPeopleSearch(orgIds);

  const results: PeopleSearchResult[] = [];

  for (const company of companies) {
    const people = peopleByOrg.get(company.name) ?? [];

    if (people.length === 0) {
      results.push({
        company_name: company.name,
        apollo_org_id: company.apollo_org_id,
        ranked_people: []
      });
      continue;
    }

    let ranked = await rankPeopleForCompany(people, icp, company.name);

    // Auto-enrich the top-ranked person so the FE has one ready contact
    if (ranked.length > 0 && !ranked[0].is_enriched) {
      try {
        const enriched = await apolloPersonEnrich(ranked[0].apollo_person_id);
        ranked = ranked.map((p, i) =>
          i === 0
            ? {
                ...p,
                last_name: enriched.last_name,
                email: enriched.email ?? undefined,
                phone: enriched.phone ?? undefined,
                linkedin_url: enriched.linkedin_url ?? undefined,
                is_enriched: true
              }
            : p
        );
      } catch {
        // enrichment is best-effort, don't fail the whole search
      }
    }

    results.push({
      company_name: company.name,
      apollo_org_id: company.apollo_org_id,
      ranked_people: ranked
    });
  }

  return results;
}
