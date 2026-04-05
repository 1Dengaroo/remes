import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/supabase/server';
import { profileUpdateBodySchema, parseBody } from '@/lib/validation';
import { getProfile, upsertProfile } from '@/lib/supabase/queries';

export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  const { supabase, user } = auth;

  const { data } = await getProfile(supabase, user.id);

  return Response.json({
    full_name: data?.full_name ?? '',
    company_name: data?.company_name ?? ''
  });
}

export async function PUT(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  const { supabase, user } = auth;

  const parsed = parseBody(profileUpdateBodySchema, await req.json());
  if (!parsed.success) return parsed.response;

  const fullName = parsed.data.full_name.trim();
  const companyName = (parsed.data.company_name ?? '').trim();

  const { error } = await upsertProfile(supabase, user.id, fullName, companyName);

  if (error) {
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    );
  }

  return Response.json({ full_name: fullName, company_name: companyName });
}
