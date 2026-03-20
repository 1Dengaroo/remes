import Anthropic from '@anthropic-ai/sdk';
import type { ICPCriteria } from '@/lib/types';
import type { CompanyScorer, DiscoveredCompany } from './interfaces';
import { serviceConfig } from './config';

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
  return new Anthropic({ apiKey });
}

function buildScoringPrompt(companies: DiscoveredCompany[], icp: ICPCriteria): string {
  const companySummaries = companies
    .map((c, i) => {
      const context = c.match_context ? ` | metadata: ${c.match_context}` : '';
      return `${i}: ${c.name} — ${c.description || 'no description'}${context}`;
    })
    .join('\n');

  return `You are scoring companies against an Ideal Customer Profile (ICP).

**ICP:**
${icp.description}
- Industries: ${icp.industry_keywords.join(', ') || 'any'}
- Employee range: ${icp.min_employees ?? 'any'} to ${icp.max_employees ?? 'any'}
- Hiring signals: ${icp.hiring_signals.join(', ') || 'none specified'}
- Tech: ${icp.tech_keywords.join(', ') || 'any'}
- Funding: ${icp.funding_stages.join(', ') || 'any stage'}
- Locations: ${icp.locations.join(', ') || 'any'}

**Companies to score:**
${companySummaries}

Score each company 1-10 on ICP fit. A score of 7+ means strong fit. Consider:
- Does the company's industry/product match the ICP?
- Is the company size appropriate?
- Does it show the right hiring/growth signals?
- Is this a real, active company (not a shell or defunct)?

**AUTO-REJECT (score 0):** Recruiting agencies, staffing firms, headhunters, talent agencies, HR outsourcing companies, and any company whose core business is placing candidates or filling roles for other companies. These appear in results because they post jobs on behalf of clients, not because they match the ICP. Score them 0 so they are excluded.

Return ONLY a JSON array of objects, sorted by score descending. Include only companies scoring ${serviceConfig.scoringMinScore} or above:
[{"index": 0, "score": 8, "reason": "brief reason"}, ...]`;
}

interface ScoredEntry {
  index: number;
  score: number;
  reason: string;
}

function isScoredEntryArray(value: unknown): value is ScoredEntry[] {
  if (!Array.isArray(value)) return false;
  return value.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as Record<string, unknown>).index === 'number' &&
      typeof (item as Record<string, unknown>).score === 'number' &&
      typeof (item as Record<string, unknown>).reason === 'string'
  );
}

/** Max companies per scoring batch to keep prompt size manageable */
const SCORING_BATCH_SIZE = 30;

async function scoreBatch(
  client: Anthropic,
  companies: DiscoveredCompany[],
  icp: ICPCriteria
): Promise<{ company: DiscoveredCompany; score: number; reason: string }[]> {
  const message = await client.messages.create({
    model: serviceConfig.fastModel,
    max_tokens: serviceConfig.scoringMaxTokens,
    messages: [{ role: 'user', content: buildScoringPrompt(companies, icp) }]
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = text.match(/\[[\s\S]*\]/);

  if (!jsonMatch) {
    // If scoring fails, return all companies with a neutral score
    return companies.map((c) => ({
      company: c,
      score: serviceConfig.scoringMinScore,
      reason: 'scoring failed — included by default'
    }));
  }

  const parsed: unknown = JSON.parse(jsonMatch[0]);
  if (!isScoredEntryArray(parsed)) {
    return companies.map((c) => ({
      company: c,
      score: serviceConfig.scoringMinScore,
      reason: 'scoring failed — included by default'
    }));
  }

  return parsed
    .filter((s) => s.index >= 0 && s.index < companies.length)
    .map((s) => ({
      company: companies[s.index],
      score: s.score,
      reason: s.reason
    }));
}

/**
 * Claude-based company scorer.
 * Scores and ranks discovered companies against the ICP, filtering out poor fits.
 * Handles large candidate sets by batching scoring calls in parallel.
 */
export const claudeCompanyScorer: CompanyScorer = {
  async score(companies: DiscoveredCompany[], icp: ICPCriteria): Promise<DiscoveredCompany[]> {
    if (companies.length === 0) return [];

    const client = getClient();

    // Split into batches
    const batches: DiscoveredCompany[][] = [];
    for (let i = 0; i < companies.length; i += SCORING_BATCH_SIZE) {
      batches.push(companies.slice(i, i + SCORING_BATCH_SIZE));
    }

    // Score all batches in parallel
    const batchResults = await Promise.all(batches.map((batch) => scoreBatch(client, batch, icp)));

    // Merge, sort by score descending, and format
    const allScored = batchResults.flat();
    allScored.sort((a, b) => b.score - a.score);

    return allScored.map((s) => ({
      ...s.company,
      description: s.company.description
        ? `${s.company.description} (ICP score: ${s.score}/10 — ${s.reason})`
        : `ICP score: ${s.score}/10 — ${s.reason}`
    }));
  }
};
