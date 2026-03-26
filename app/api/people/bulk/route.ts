import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/supabase/server';
import { apolloPeopleSearch } from '@/lib/services/apollo-people';
import { peopleBulkBodySchema, parseBody } from '@/lib/validation';

export async function POST(req: NextRequest) {
  const { user } = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = parseBody(peopleBulkBodySchema, await req.json());
  if (!parsed.success) return parsed.response;

  const { companies } = parsed.data;

  if (!process.env.APOLLO_API_KEY) {
    return Response.json({ error: 'APOLLO_API_KEY is not set' }, { status: 500 });
  }

  try {
    const orgIds = companies.map((c) => c.apollo_org_id);
    const peopleByOrg = await apolloPeopleSearch(orgIds, 10);

    const results = companies.map((company) => ({
      company_name: company.name,
      people: peopleByOrg.get(company.name) ?? []
    }));

    return Response.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bulk people search failed';
    console.error('[People Bulk]', message);
    return Response.json({ error: message }, { status: 500 });
  }
}
