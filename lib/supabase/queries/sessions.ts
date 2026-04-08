import type { SupabaseClient } from '@supabase/supabase-js';
import type { ResearchSessionSummary } from '@/lib/types';
import { now } from '@/lib/utils';

export function listSessions(supabase: SupabaseClient, userId: string) {
  return supabase
    .from('research_sessions')
    .select('id, name, step, status, icp, candidates, created_at, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
}

/** List sessions as lightweight summaries (no full data payloads). */
export async function listSessionSummaries(
  supabase: SupabaseClient,
  userId: string
): Promise<{ data: ResearchSessionSummary[]; error: { message: string } | null }> {
  const { data, error } = await listSessions(supabase, userId);

  if (error) return { data: [], error };

  const sessions: ResearchSessionSummary[] = (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    step: row.step,
    status: row.status,
    icp_description: row.icp?.description ?? null,
    company_count: Array.isArray(row.candidates) ? row.candidates.length : 0,
    created_at: row.created_at,
    updated_at: row.updated_at
  }));

  return { data: sessions, error: null };
}

export function getSession(supabase: SupabaseClient, id: string, userId: string) {
  return supabase.from('research_sessions').select('*').eq('id', id).eq('user_id', userId).single();
}

export function createSession(supabase: SupabaseClient, data: Record<string, unknown>) {
  return supabase.from('research_sessions').insert(data).select().single();
}

export function updateSession(
  supabase: SupabaseClient,
  id: string,
  userId: string,
  data: Record<string, unknown>
) {
  return supabase
    .from('research_sessions')
    .update({ updated_at: now(), ...data })
    .eq('id', id)
    .eq('user_id', userId);
}

export function deleteSession(supabase: SupabaseClient, id: string, userId: string) {
  return supabase.from('research_sessions').delete().eq('id', id).eq('user_id', userId);
}

export function getResearchedCompanyResults(
  supabase: SupabaseClient,
  userId: string,
  excludeSessionId?: string
) {
  let query = supabase
    .from('research_sessions')
    .select('results')
    .eq('user_id', userId)
    .not('results', 'is', null);

  if (excludeSessionId) {
    query = query.neq('id', excludeSessionId);
  }

  return query;
}

/** Extract unique company names from all sessions' research results. */
export async function listResearchedCompanyNames(
  supabase: SupabaseClient,
  userId: string,
  excludeSessionId?: string
): Promise<{ data: string[]; error: { message: string } | null }> {
  const { data, error } = await getResearchedCompanyResults(supabase, userId, excludeSessionId);

  if (error) return { data: [], error };

  const companies = new Set<string>();
  for (const row of data ?? []) {
    const results: unknown = row.results;
    if (!Array.isArray(results)) continue;
    for (const r of results) {
      if (r && typeof r === 'object' && 'company_name' in r && typeof r.company_name === 'string') {
        companies.add(r.company_name);
      }
    }
  }

  return { data: [...companies], error: null };
}
