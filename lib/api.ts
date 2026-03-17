import type { ICPCriteria, DiscoveredCompanyPreview, ResearchStreamEvent } from '@/lib/types';

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
