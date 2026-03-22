import type { SupabaseClient } from '@supabase/supabase-js';

export function listSentEmails(supabase: SupabaseClient, userId: string) {
  return supabase
    .from('sent_emails')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
}

export function insertSentEmail(supabase: SupabaseClient, data: Record<string, unknown>) {
  return supabase.from('sent_emails').insert(data).select('id').single();
}

export function insertFailedEmail(supabase: SupabaseClient, data: Record<string, unknown>) {
  return supabase.from('sent_emails').insert(data);
}

export function getSentEmailsForDashboard(supabase: SupabaseClient, userId: string) {
  return supabase
    .from('sent_emails')
    .select('id, status, company_name, created_at')
    .eq('user_id', userId);
}
