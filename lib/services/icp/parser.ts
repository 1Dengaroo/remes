import type { ICPCriteria } from '@/lib/types';
import type { ICPParser } from '../interfaces';
import { serviceConfig } from '../config';
import { getAnthropicClient } from '../anthropic';
import { extractJson } from '@/lib/utils';

function buildParseICPPrompt(input: string): string {
  return `Extract the Ideal Customer Profile from this input (transcript, notes, or description).

Think broadly about the BUYER, not the product being sold:
- "sales automation for B2B SaaS" → industry_keywords should cover diverse SaaS verticals (fintech, HR tech, devtools, etc.)
- industry_keywords = company's core business/sector
- hiring_signals = job titles being hired (e.g. "SDR", "Account Executive") - NOT narrative phrases
- If input mentions "scaling SDR teams", extract role titles into hiring_signals, not industry_keywords
- locations = geographic focus as country names (e.g. ["United States"]). Use [] if not specified.

Employee size mappings: "small" ≈ 1-50, "mid-size" ≈ 50-500, "enterprise" ≈ 500+. Use null for unspecified bounds.

Return ONLY valid JSON:
{
  "description": "one sentence describing the ideal BUYER",
  "industry_keywords": ["5-10 diverse verticals where buyers exist"],
  "min_employees": null,
  "max_employees": null,
  "min_funding_amount": null,
  "funding_stages": [],
  "hiring_signals": ["clean job titles"],
  "tech_keywords": ["technologies the buyer uses"],
  "company_examples": ["mentioned companies"],
  "locations": []
}

Input:
${input}`;
}

function isICPCriteria(value: unknown): value is ICPCriteria {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.description === 'string' &&
    Array.isArray(obj.industry_keywords) &&
    Array.isArray(obj.hiring_signals) &&
    Array.isArray(obj.tech_keywords) &&
    Array.isArray(obj.company_examples)
  );
}

/**
 * Claude-based ICP parser.
 */
export const claudeICPParser: ICPParser = {
  async parse(input: string): Promise<ICPCriteria> {
    const client = getAnthropicClient();

    const message = await client.messages.create({
      model: serviceConfig.fastModel,
      max_tokens: serviceConfig.parseMaxTokens,
      messages: [{ role: 'user', content: buildParseICPPrompt(input) }]
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';

    const parsed: unknown = extractJson(text);
    if (!parsed) throw new Error('Failed to parse ICP from input');
    if (!isICPCriteria(parsed)) throw new Error('Invalid ICP shape from AI');

    // Default fields the model may omit
    parsed.min_employees = parsed.min_employees ?? null;
    parsed.max_employees = parsed.max_employees ?? null;
    parsed.min_funding_amount = parsed.min_funding_amount ?? null;
    parsed.funding_stages = parsed.funding_stages ?? [];
    parsed.locations = parsed.locations ?? [];

    return parsed;
  }
};
