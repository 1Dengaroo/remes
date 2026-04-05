import Anthropic from '@anthropic-ai/sdk';

/** Shared Anthropic client factory. Throws if ANTHROPIC_API_KEY is not set. */
export function getAnthropicClient(options?: { maxRetries?: number }): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
  return new Anthropic({ apiKey, maxRetries: options?.maxRetries });
}
