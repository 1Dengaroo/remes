import { getAuthUser } from '@/lib/supabase/server';
import { SentEmailsPage } from '@/components/emails/sent-emails-page.client';
import { listSentEmails } from '@/lib/supabase/queries';
import type { SentEmail } from '@/lib/types';

export default async function Emails() {
  const { supabase, user } = await getAuthUser();

  let emails: SentEmail[] = [];

  if (user) {
    const { data } = await listSentEmails(supabase, user.id);
    emails = (data ?? []) as SentEmail[];
  }

  return <SentEmailsPage emails={emails} />;
}
