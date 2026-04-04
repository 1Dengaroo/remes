import { getAuthUser } from '@/lib/supabase/server';
import { Dashboard } from '@/components/research/dashboard.client';
import {
  listSessions,
  listICPs,
  listSentEmails,
  listContacts,
  getProfile
} from '@/lib/supabase/queries';
import type { SavedICP, SentEmail, ContactedCompany } from '@/lib/types';

export default async function Research() {
  const { supabase, user } = await getAuthUser();

  if (!user) {
    return <Dashboard sessions={[]} emails={[]} contacts={[]} icps={[]} userName={null} />;
  }

  const [sessionsRes, icpsRes, emailsRes, contactsRes, profileRes] = await Promise.all([
    listSessions(supabase, user.id),
    listICPs(supabase, user.id),
    listSentEmails(supabase, user.id),
    listContacts(supabase, user.id),
    getProfile(supabase, user.id)
  ]);

  const sessions = (sessionsRes.data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    step: row.step,
    status: row.status,
    icp_description: row.icp?.description ?? null,
    company_count: Array.isArray(row.candidates) ? row.candidates.length : 0,
    created_at: row.created_at,
    updated_at: row.updated_at
  }));

  return (
    <Dashboard
      sessions={sessions}
      emails={(emailsRes.data ?? []) as SentEmail[]}
      contacts={(contactsRes.data ?? []) as ContactedCompany[]}
      icps={(icpsRes.data ?? []) as SavedICP[]}
      userName={profileRes.data?.full_name ?? null}
    />
  );
}
