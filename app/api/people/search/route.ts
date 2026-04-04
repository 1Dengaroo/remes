import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/supabase/server';
import { apolloPeopleSearch, apolloPersonEnrich } from '@/lib/services/apollo-people';
import { rankPeopleForCompany } from '@/lib/services/people-ranking';
import { peopleSearchBodySchema, parseBody, requireEnvVars } from '@/lib/validation';
import type { PeopleSearchResult } from '@/lib/types';

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;

  const parsed = parseBody(peopleSearchBodySchema, await req.json());
  if (!parsed.success) return parsed.response;

  const { org_ids: orgIds, icp, companies } = parsed.data;

  const envError = requireEnvVars('APOLLO_API_KEY', 'ANTHROPIC_API_KEY');
  if (envError) return envError;

  try {
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

    return Response.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'People search failed';
    console.error('[People Search]', message);
    return Response.json({ error: message }, { status: 500 });
  }
}
