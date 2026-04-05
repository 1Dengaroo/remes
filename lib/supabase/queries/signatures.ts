import type { SupabaseClient } from '@supabase/supabase-js';

export function listSignatures(supabase: SupabaseClient, userId: string) {
  return supabase
    .from('email_signatures')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
}

export function createSignature(
  supabase: SupabaseClient,
  userId: string,
  name: string,
  body: string
) {
  return supabase
    .from('email_signatures')
    .insert({ user_id: userId, name, body })
    .select()
    .single();
}

export function updateSignature(
  supabase: SupabaseClient,
  id: string,
  userId: string,
  data: Record<string, unknown>
) {
  return supabase
    .from('email_signatures')
    .update({ updated_at: new Date().toISOString(), ...data })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();
}

export function clearDefaultSignatures(
  supabase: SupabaseClient,
  userId: string,
  excludeId: string
) {
  return supabase
    .from('email_signatures')
    .update({ is_default: false, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .neq('id', excludeId);
}

export function deleteSignature(supabase: SupabaseClient, id: string, userId: string) {
  return supabase.from('email_signatures').delete().eq('id', id).eq('user_id', userId);
}

/** Update a signature, clearing other defaults first if this one is being set as default. */
export async function updateSignatureWithDefault(
  supabase: SupabaseClient,
  id: string,
  userId: string,
  updates: { name?: string; body?: string; is_default?: boolean }
) {
  if (updates.is_default) {
    await clearDefaultSignatures(supabase, userId, id);
  }

  const dbUpdates: Record<string, unknown> = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.body !== undefined) dbUpdates.body = updates.body;
  if (updates.is_default !== undefined) dbUpdates.is_default = updates.is_default;

  return updateSignature(supabase, id, userId, dbUpdates);
}
