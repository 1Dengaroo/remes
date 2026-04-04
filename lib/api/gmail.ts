import { postJson } from './client';

/** Check Gmail connection status */
export async function getGmailStatus(): Promise<{ connected: boolean; email: string | null }> {
  const response = await fetch('/api/gmail/status');
  if (!response.ok) return { connected: false, email: null };
  return (await response.json()) as { connected: boolean; email: string | null };
}

/** Get Gmail OAuth URL and redirect to it */
export async function connectGmail(): Promise<void> {
  const response = await fetch('/api/gmail/authorize');
  if (!response.ok) throw new Error('Failed to get authorization URL');
  const data = (await response.json()) as { url: string };
  window.location.href = data.url;
}

/** Disconnect Gmail account */
export async function disconnectGmail(): Promise<void> {
  await postJson('/api/gmail/disconnect', {});
}
