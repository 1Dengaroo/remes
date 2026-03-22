import type { SupabaseClient } from '@supabase/supabase-js';

export function getProfile(supabase: SupabaseClient, userId: string) {
  return supabase.from('user_profiles').select('full_name').eq('user_id', userId).single();
}

export function upsertProfile(supabase: SupabaseClient, userId: string, fullName: string) {
  return supabase
    .from('user_profiles')
    .upsert(
      { user_id: userId, full_name: fullName, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );
}
