import type { SupabaseClient } from '@supabase/supabase-js';
import { now } from '@/lib/utils';

export function getGmailConnection(supabase: SupabaseClient, userId: string) {
  return supabase.from('gmail_connections').select('*').eq('user_id', userId).single();
}

export function getGmailEmail(supabase: SupabaseClient, userId: string) {
  return supabase.from('gmail_connections').select('gmail_email').eq('user_id', userId).single();
}

export function upsertGmailConnection(
  supabase: SupabaseClient,
  userId: string,
  data: {
    access_token: string;
    refresh_token: string;
    token_expiry: string | null;
    gmail_email: string;
  }
) {
  return supabase.from('gmail_connections').upsert(
    {
      user_id: userId,
      ...data,
      updated_at: now()
    },
    { onConflict: 'user_id' }
  );
}

export function deleteGmailConnection(supabase: SupabaseClient, userId: string) {
  return supabase.from('gmail_connections').delete().eq('user_id', userId);
}

export function refreshGmailToken(
  supabase: SupabaseClient,
  userId: string,
  accessToken: string,
  tokenExpiry: string | null
) {
  return supabase
    .from('gmail_connections')
    .update({
      access_token: accessToken,
      token_expiry: tokenExpiry,
      updated_at: now()
    })
    .eq('user_id', userId);
}
