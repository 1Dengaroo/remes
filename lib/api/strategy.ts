import type { ICPCriteria, StrategyMessage } from '@/lib/types';
import { postJson, readSSEStream } from './client';

interface StrategyCallbacks {
  onChunk: (text: string) => void;
  onStatus?: (message: string) => void;
  onIcpUpdate?: (updates: Partial<ICPCriteria>) => void;
  onSessionName?: (name: string) => void;
}

type StrategyEvent =
  | { type: 'text'; content: string }
  | { type: 'status'; message: string }
  | { type: 'done' }
  | { type: 'error'; message: string };

/** Extract and strip <icp_update> block from text */
function extractIcpUpdate(text: string): {
  cleanText: string;
  updates: Partial<ICPCriteria> | null;
} {
  const match = text.match(
    /<icp_update>\s*(?:```(?:json)?\s*)?([\s\S]*?)(?:\s*```)?\s*<\/icp_update>/
  );
  if (!match) return { cleanText: text, updates: null };

  try {
    const parsed: unknown = JSON.parse(match[1].trim());
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return { cleanText: text, updates: null };
    }
    const cleanText = text.replace(/<icp_update>[\s\S]*?<\/icp_update>/g, '').trimEnd();
    return { cleanText, updates: parsed as Partial<ICPCriteria> };
  } catch {
    return { cleanText: text, updates: null };
  }
}

/** Extract and strip <session_name> tag from text */
function extractSessionName(text: string): { cleanText: string; sessionName: string | null } {
  const match = text.match(/<session_name>\s*([\s\S]*?)\s*<\/session_name>/);
  if (!match) return { cleanText: text, sessionName: null };
  const cleanText = text.replace(/<session_name>[\s\S]*?<\/session_name>/g, '').trimEnd();
  return { cleanText, sessionName: match[1].trim() || null };
}

/** Strip machine-parsed blocks (complete or partial) for display during streaming */
function stripIcpUpdateForDisplay(text: string): string {
  return text
    .replace(/<icp_update>[\s\S]*?<\/icp_update>/g, '')
    .replace(/<icp_update>[\s\S]*$/g, '')
    .replace(/<session_name>[\s\S]*?<\/session_name>/g, '')
    .replace(/<session_name>[\s\S]*$/g, '')
    .trimEnd();
}

/** Stream strategy analysis from the AI agent */
export async function streamStrategy(
  icp: ICPCriteria,
  messages: StrategyMessage[],
  callbacks: StrategyCallbacks,
  signal?: AbortSignal
): Promise<string> {
  const response = await postJson(
    '/api/strategy',
    { icp, messages: messages.length > 0 ? messages : undefined },
    signal
  );

  let fullText = '';

  await readSSEStream<StrategyEvent>(response, (event) => {
    if (event.type === 'text') {
      fullText += event.content;
      callbacks.onChunk(stripIcpUpdateForDisplay(fullText));
    } else if (event.type === 'status') {
      callbacks.onStatus?.(event.message);
    } else if (event.type === 'error') {
      throw new Error(event.message);
    }
  });

  const { cleanText: afterIcp, updates } = extractIcpUpdate(fullText);
  if (updates) {
    callbacks.onIcpUpdate?.(updates);
  }

  const { cleanText, sessionName } = extractSessionName(afterIcp);
  if (sessionName) {
    callbacks.onSessionName?.(sessionName);
  }

  return cleanText;
}
