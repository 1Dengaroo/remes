/**
 * Shared test utilities — mock factories for auth, supabase, and request helpers.
 */

import type { SupabaseClient, User } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Mock user / auth
// ---------------------------------------------------------------------------

export const mockUser: User = {
  id: 'user-123',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: { full_name: 'Test User' },
  created_at: '2025-01-01T00:00:00Z'
} as User;

/** Returns the shape that requireAuth() resolves to on success */
export function mockAuthSuccess(supabase?: Partial<SupabaseClient>) {
  return { supabase: (supabase ?? mockSupabase()) as SupabaseClient, user: mockUser };
}

/** Returns a 401 Response matching requireAuth() failure */
export function mockAuthFailure() {
  return Response.json(
    { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
    { status: 401 }
  );
}

// ---------------------------------------------------------------------------
// Mock Supabase client
// ---------------------------------------------------------------------------

type SupabaseResult = { data: unknown; error: null } | { data: null; error: { message: string } };

/** Create a chainable mock supabase client */
export function mockSupabase(overrides?: Record<string, SupabaseResult>): SupabaseClient {
  const defaultResult: SupabaseResult = { data: [], error: null };

  const chain = (tableName?: string): Record<string, jest.Mock> => {
    const result: SupabaseResult =
      (tableName ? overrides?.[tableName] : undefined) ?? defaultResult;
    const self: Record<string, jest.Mock> = {};
    const methods = [
      'select',
      'insert',
      'update',
      'upsert',
      'delete',
      'eq',
      'neq',
      'not',
      'order',
      'single',
      'limit'
    ];
    for (const m of methods) {
      self[m] = jest.fn().mockReturnValue(self);
    }
    // Make thenable so `await supabase.from(...).select(...)` resolves
    Object.defineProperty(self, 'then', {
      value: (resolve: (v: SupabaseResult) => void) => {
        resolve(result);
        return self;
      }
    });
    // Direct access for awaitable
    Object.assign(self, result);
    return self;
  };

  return {
    from: jest.fn((table: string) => chain(table)),
    auth: { getUser: jest.fn().mockResolvedValue({ data: { user: mockUser } }) }
  } as unknown as SupabaseClient;
}

// ---------------------------------------------------------------------------
// Request / response helpers
// ---------------------------------------------------------------------------

/** Parse JSON from a Response, typed as T */
export async function parseJson<T = Record<string, unknown>>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

/** Assert that a response has the standard error shape */
export async function expectError(response: Response, status: number, code: string): Promise<void> {
  expect(response.status).toBe(status);
  const body = await parseJson<{ error: { code: string; message: string } }>(response);
  expect(body.error).toBeDefined();
  expect(body.error.code).toBe(code);
  expect(typeof body.error.message).toBe('string');
}

// ---------------------------------------------------------------------------
// ICP fixture
// ---------------------------------------------------------------------------

export const validIcp = {
  description: 'B2B SaaS companies',
  industry_keywords: ['saas'],
  min_employees: 10,
  max_employees: 500,
  min_funding_amount: null,
  funding_stages: [],
  hiring_signals: [],
  tech_keywords: [],
  company_examples: [],
  locations: []
};
