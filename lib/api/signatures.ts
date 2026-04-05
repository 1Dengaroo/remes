import type { EmailSignature } from '@/lib/types';
import { ApiError, postJson } from './client';

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
