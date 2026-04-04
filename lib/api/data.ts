import type {
  ICPCriteria,
  SavedICP,
  ResearchSession,
  ContactedCompany,
  EmailSignature
} from '@/lib/types';
import { ApiError, postJson } from './client';

// ---------------------------------------------------------------------------
// Saved ICPs
// ---------------------------------------------------------------------------

export async function listICPs(): Promise<SavedICP[]> {
  const response = await fetch('/api/icps');
  if (!response.ok) throw new ApiError('Failed to load ICPs', response.status);
  const data = (await response.json()) as { icps: SavedICP[] };
  return data.icps;
}

export async function createICP(name: string, icp: ICPCriteria): Promise<SavedICP> {
  const response = await postJson('/api/icps', { name, icp });
  return (await response.json()) as SavedICP;
}

export async function updateICP(
  id: string,
  updates: { name?: string; icp?: ICPCriteria }
): Promise<SavedICP> {
  const response = await fetch(`/api/icps/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!response.ok) throw new ApiError('Failed to update ICP', response.status);
  return (await response.json()) as SavedICP;
}

export async function deleteICP(id: string): Promise<void> {
  const response = await fetch(`/api/icps/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new ApiError('Failed to delete ICP', response.status);
}

// ---------------------------------------------------------------------------
// Research Sessions
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Previously Researched Companies
// ---------------------------------------------------------------------------

export async function listResearchedCompanies(excludeSessionId?: string): Promise<string[]> {
  const params = excludeSessionId ? `?exclude=${encodeURIComponent(excludeSessionId)}` : '';
  const response = await fetch(`/api/sessions/researched-companies${params}`);
  if (!response.ok) throw new ApiError('Failed to load researched companies', response.status);
  const data = (await response.json()) as { companies: string[] };
  return data.companies;
}

// ---------------------------------------------------------------------------
// Email Signatures
// ---------------------------------------------------------------------------

export async function listSignatures(): Promise<EmailSignature[]> {
  const response = await fetch('/api/signatures');
  if (!response.ok) throw new ApiError('Failed to load signatures', response.status);
  const data = (await response.json()) as { signatures: EmailSignature[] };
  return data.signatures;
}

export async function createSignature(name: string, body: string): Promise<EmailSignature> {
  const response = await postJson('/api/signatures', { name, body });
  return (await response.json()) as EmailSignature;
}

export async function updateSignature(
  id: string,
  updates: Partial<Pick<EmailSignature, 'name' | 'body' | 'is_default'>>
): Promise<EmailSignature> {
  const response = await fetch(`/api/signatures/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!response.ok) throw new ApiError('Failed to update signature', response.status);
  return (await response.json()) as EmailSignature;
}

export async function deleteSignature(id: string): Promise<void> {
  const response = await fetch(`/api/signatures/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new ApiError('Failed to delete signature', response.status);
}

// ---------------------------------------------------------------------------
// Contacted Companies
// ---------------------------------------------------------------------------

export async function listContactedCompanies(): Promise<ContactedCompany[]> {
  const response = await fetch('/api/contacts');
  if (!response.ok) throw new ApiError('Failed to load contacts', response.status);
  const data = (await response.json()) as { contacts: ContactedCompany[] };
  return data.contacts;
}
