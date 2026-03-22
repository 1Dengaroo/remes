import type { SupabaseClient } from '@supabase/supabase-js';

export function listSessions(supabase: SupabaseClient, userId: string) {
  return supabase
    .from('research_sessions')
    .select('id, name, step, status, icp, candidates, created_at, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
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
    .update({ updated_at: new Date().toISOString(), ...data })
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

export function getSessionsForDashboard(supabase: SupabaseClient, userId: string) {
  return supabase
    .from('research_sessions')
    .select('id, status, results, candidates, created_at')
    .eq('user_id', userId);
}
