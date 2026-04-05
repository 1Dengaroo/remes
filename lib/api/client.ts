export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Shared: POST JSON and throw on error */
export async function postJson(
  url: string,
  body: unknown,
  signal?: AbortSignal
): Promise<Response> {
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
      if (data.error?.message) message = data.error.message;
      else if (typeof data.error === 'string') message = data.error;
    } catch {}
    throw new ApiError(message, response.status);
  }

  return response;
}

/** Shared: read an SSE stream, calling onEvent for each parsed `data:` line */
export async function readSSEStream<T>(
  response: Response,
  onEvent: (event: T) => void
): Promise<void> {
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
        const event = JSON.parse(chunk.slice(6)) as T;
        onEvent(event);
      } catch (e) {
        if (e instanceof Error && !(e instanceof SyntaxError)) throw e;
      }
    }
  }
}
