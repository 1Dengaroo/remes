import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/supabase/server';
import { listResearchedCompanyNames } from '@/lib/supabase/queries';

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  const { supabase, user } = auth;

  const excludeSessionId = req.nextUrl.searchParams.get('exclude') ?? undefined;

  const { data: companies, error } = await listResearchedCompanyNames(
    supabase,
    user.id,
    excludeSessionId
  );

  if (error) {
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }

  return Response.json({ companies });
}
