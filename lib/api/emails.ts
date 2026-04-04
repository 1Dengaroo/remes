import type {
  CompanyResult,
  TargetContact,
  ICPCriteria,
  GeneratedEmailSequence,
  SendEmailRequest
} from '@/lib/types';
import { extractJson } from '@/lib/utils';
import { ApiError, postJson } from './client';

/** Stream a 3-step personalized email sequence via AI, calling onDelta for each text chunk */
export async function streamEmailSequence(
  company: CompanyResult,
  contact: TargetContact,
  icp: ICPCriteria,
  onDelta: (text: string) => void,
  signal?: AbortSignal
): Promise<GeneratedEmailSequence> {
  const response = await postJson('/api/emails/generate', { company, contact, icp }, signal);

  const reader = response.body?.getReader();
  if (!reader) throw new ApiError('No response body', 0);

  const decoder = new TextDecoder();
  let accumulated = '';
  let buffer = '';

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const payload = JSON.parse(line.slice(6));

      if (payload.type === 'delta') {
        accumulated += payload.text;
        onDelta(payload.text);
      } else if (payload.type === 'error') {
        throw new ApiError(payload.message, 0);
      }
    }
  }

  const sequence = extractJson<GeneratedEmailSequence>(accumulated);
  if (!sequence) throw new ApiError('Failed to parse email response', 0);
  if (!sequence.emails || sequence.emails.length !== 3) {
    throw new ApiError('Invalid email sequence format', 0);
  }

  return sequence;
}

/** Send an email via connected Gmail */
export async function sendEmail(
  params: SendEmailRequest,
  signal?: AbortSignal
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const response = await postJson('/api/emails/send', params, signal);
  return (await response.json()) as { success: boolean; messageId?: string; error?: string };
}
