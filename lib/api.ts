import type {
  ICPCriteria,
  DiscoveredCompanyPreview,
  ResearchStreamEvent,
  PeopleSearchResult,
  StrategyMessage
} from '@/lib/types';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function post<T>(url: string, body: unknown, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal
  });

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const data = await response.json();
      if (data.error) message = data.error;
    } catch {}
    throw new ApiError(message, response.status);
  }

  return (await response.json()) as T;
}

async function streamSSE(
  url: string,
  body: unknown,
  onEvent: (event: ResearchStreamEvent) => void,
  signal?: AbortSignal
): Promise<void> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal
  });

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const data = await response.json();
      if (data.error) message = data.error;
    } catch {}
    throw new ApiError(message, response.status);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response stream');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split('\n\n');
    buffer = chunks.pop() || '';

    for (const chunk of chunks) {
      if (!chunk.startsWith('data: ')) continue;
      try {
        const event: ResearchStreamEvent = JSON.parse(chunk.slice(6));
        if (event.type === 'error') {
          throw new Error(event.message);
        }
        onEvent(event);
      } catch (e) {
        if (e instanceof Error && !(e instanceof SyntaxError)) throw e;
      }
    }
  }
}

interface StrategyCallbacks {
  onChunk: (text: string) => void;
  onStatus?: (message: string) => void;
  onIcpUpdate?: (updates: Partial<ICPCriteria>) => void;
}

/** Extract and strip <icp_update> block from text, returning clean text and parsed updates */
function extractIcpUpdate(text: string): {
  cleanText: string;
  updates: Partial<ICPCriteria> | null;
} {
  // Match the block with flexible whitespace, also handle ```json fencing the AI might add
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

/** Stream strategy analysis from the AI agent */
export async function streamStrategy(
  icp: ICPCriteria,
  messages: StrategyMessage[],
  callbacks: StrategyCallbacks,
  signal?: AbortSignal
): Promise<string> {
  const response = await fetch('/api/strategy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ icp, messages: messages.length > 0 ? messages : undefined }),
    signal
  });

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const data = await response.json();
      if (data.error) message = data.error;
    } catch {}
    throw new ApiError(message, response.status);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response stream');

  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split('\n\n');
    buffer = chunks.pop() || '';

    for (const chunk of chunks) {
      if (!chunk.startsWith('data: ')) continue;
      try {
        const event = JSON.parse(chunk.slice(6)) as
          | { type: 'text'; content: string }
          | { type: 'status'; message: string }
          | { type: 'done' }
          | { type: 'error'; message: string };

        if (event.type === 'text') {
          fullText += event.content;
          // Strip any partial/complete <icp_update> block from display
          const displayText = fullText
            .replace(/<icp_update>[\s\S]*?<\/icp_update>/g, '')
            .replace(/<icp_update>[\s\S]*$/g, '')
            .trimEnd();
          callbacks.onChunk(displayText);
        } else if (event.type === 'status') {
          callbacks.onStatus?.(event.message);
        } else if (event.type === 'error') {
          throw new Error(event.message);
        }
      } catch (e) {
        if (e instanceof Error && !(e instanceof SyntaxError)) throw e;
      }
    }
  }

  // Parse ICP updates from the final text
  const { cleanText, updates } = extractIcpUpdate(fullText);
  if (updates) {
    callbacks.onIcpUpdate?.(updates);
  }

  return cleanText;
}

export async function parseICP(input: string, signal?: AbortSignal): Promise<ICPCriteria> {
  const data = await post<{ icp: ICPCriteria }>('/api/parse-icp', { input }, signal);
  return data.icp;
}

/** Phase 1: Discover candidate companies for an ICP */
export async function discoverCompanies(
  icp: ICPCriteria,
  onEvent: (event: ResearchStreamEvent) => void,
  signal?: AbortSignal
): Promise<DiscoveredCompanyPreview[]> {
  let candidates: DiscoveredCompanyPreview[] = [];

  await streamSSE(
    '/api/research',
    { icp },
    (event) => {
      if (event.type === 'candidates') {
        candidates = event.data;
      }
      onEvent(event);
    },
    signal
  );

  return candidates;
}

/** Search for people at companies via Apollo */
export async function searchPeople(
  orgIds: string[],
  icp: ICPCriteria,
  companies: { name: string; apollo_org_id: string }[],
  signal?: AbortSignal
): Promise<PeopleSearchResult[]> {
  const data = await post<{ results: PeopleSearchResult[] }>(
    '/api/people/search',
    { org_ids: orgIds, icp, companies },
    signal
  );
  return data.results;
}

/** Enrich a single person via Apollo (1 credit) */
export async function enrichPerson(
  personId: string,
  signal?: AbortSignal
): Promise<{
  first_name: string;
  last_name: string;
  title: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
}> {
  const data = await post<{
    person: {
      first_name: string;
      last_name: string;
      title: string | null;
      email: string | null;
      phone: string | null;
      linkedin_url: string | null;
    };
  }>('/api/people/enrich', { person_id: personId }, signal);
  return data.person;
}

/** Phase 2: Research confirmed companies */
export async function researchCompanies(
  icp: ICPCriteria,
  companies: string[],
  onEvent: (event: ResearchStreamEvent) => void,
  signal?: AbortSignal,
  candidates?: DiscoveredCompanyPreview[]
): Promise<void> {
  await streamSSE('/api/research', { icp, companies, candidates }, onEvent, signal);
}
