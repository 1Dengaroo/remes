import type { ResearchSession, ResearchSessionSummary } from '@/lib/types';
import { ApiError, postJson } from './client';

export async function listSessions(): Promise<ResearchSessionSummary[]> {
  const response = await fetch('/api/sessions');
  if (!response.ok) throw new ApiError('Failed to load sessions', response.status);
  const data = (await response.json()) as { sessions: ResearchSessionSummary[] };
  return data.sessions;
}

export async function createSession(initial?: Partial<ResearchSession>): Promise<ResearchSession> {
  const response = await postJson('/api/sessions', initial ?? {});
  return (await response.json()) as ResearchSession;
}

export async function updateSession(id: string, updates: Partial<ResearchSession>): Promise<void> {
  const response = await fetch(`/api/sessions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!response.ok) throw new ApiError('Failed to save session', response.status);
}

export async function deleteSession(id: string): Promise<void> {
  const response = await fetch(`/api/sessions/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new ApiError('Failed to delete session', response.status);
}

export async function listResearchedCompanies(excludeSessionId?: string): Promise<string[]> {
  const params = excludeSessionId ? `?exclude=${encodeURIComponent(excludeSessionId)}` : '';
  const response = await fetch(`/api/sessions/researched-companies${params}`);
  if (!response.ok) throw new ApiError('Failed to load researched companies', response.status);
  const data = (await response.json()) as { companies: string[] };
  return data.companies;
}
