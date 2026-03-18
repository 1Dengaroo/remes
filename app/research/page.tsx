import { createClient } from '@/lib/supabase/server';
import { SessionsPage } from '@/components/research/sessions-page.client';
import type { ResearchSessionSummary } from '@/lib/types';

export default async function Research() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  let sessions: ResearchSessionSummary[] = [];

  if (user) {
    const { data } = await supabase
      .from('research_sessions')
      .select('id, name, step, status, icp, candidates, created_at, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    sessions = (data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      step: row.step,
      status: row.status as 'in_progress' | 'completed',
      icp_description: row.icp?.description ?? null,
      company_count: Array.isArray(row.candidates) ? row.candidates.length : 0,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  }

  return <SessionsPage sessions={sessions} />;
}
