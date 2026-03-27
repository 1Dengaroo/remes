import type { SupabaseClient } from '@supabase/supabase-js';

export function listContacts(supabase: SupabaseClient, userId: string) {
  return supabase
    .from('contacted_companies')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
}

export function upsertContact(supabase: SupabaseClient, data: Record<string, unknown>) {
  return supabase
    .from('contacted_companies')
    .upsert(data, { onConflict: 'user_id,company_name,contact_email' });
}
