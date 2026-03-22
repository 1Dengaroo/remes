import type { SupabaseClient } from '@supabase/supabase-js';

export function listICPs(supabase: SupabaseClient, userId: string) {
  return supabase
    .from('saved_icps')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
}

export function createICP(supabase: SupabaseClient, userId: string, name: string, icp: unknown) {
  return supabase.from('saved_icps').insert({ user_id: userId, name, icp }).select().single();
}

export function updateICP(
  supabase: SupabaseClient,
  id: string,
  userId: string,
  data: Record<string, unknown>
) {
  return supabase
    .from('saved_icps')
    .update({ updated_at: new Date().toISOString(), ...data })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();
}

export function deleteICP(supabase: SupabaseClient, id: string, userId: string) {
  return supabase.from('saved_icps').delete().eq('id', id).eq('user_id', userId);
}
