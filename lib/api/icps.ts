import type { ICPCriteria, SavedICP } from '@/lib/types';
import { ApiError, postJson } from './client';

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
