import { z } from 'zod';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/supabase/server';

/** Wrap a route handler with auth - returns 401 if unauthenticated. */
export async function withAuth(
  handler: (supabase: SupabaseClient, user: User) => Promise<Response>
): Promise<Response> {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  return handler(auth.supabase, auth.user);
}

/** Build a structured error response matching the standard { error: { code, message } } shape. */
export function jsonError(code: string, message: string, status: number): Response {
  return Response.json({ error: { code, message } }, { status });
}

/** Parse request body against a Zod schema. Returns 400 on failure. */
export function parseBody<T>(
  schema: z.ZodType<T>,
  data: unknown
): { success: true; data: T } | { success: false; response: Response } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const issues = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
  console.error('[Validation]', issues);
  return {
    success: false,
    response: jsonError('VALIDATION_ERROR', `Validation failed: ${issues}`, 400)
  };
}

/** Check that required env vars are set. Returns 500 on missing, null on success. */
export function requireEnvVars(...vars: string[]): Response | null {
  const missing = vars.filter((v) => !process.env[v]);
  if (missing.length === 0) return null;
  console.error('[Config] Missing environment variables:', missing.join(', '));
  return jsonError('SERVICE_UNAVAILABLE', 'Required service configuration is missing', 500);
}
