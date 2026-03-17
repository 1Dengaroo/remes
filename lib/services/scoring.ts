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

/**
 * Claude-based company scorer.
 * Scores and ranks discovered companies against the ICP, filtering out poor fits.
 */
export const claudeCompanyScorer: CompanyScorer = {
  async score(companies: DiscoveredCompany[], icp: ICPCriteria): Promise<DiscoveredCompany[]> {
    if (companies.length === 0) return [];

    const client = getClient();

    const message = await client.messages.create({
      model: serviceConfig.fastModel,
      max_tokens: serviceConfig.scoringMaxTokens,
      messages: [{ role: 'user', content: buildScoringPrompt(companies, icp) }]
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = text.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      // If scoring fails, return all companies unsorted rather than losing them
      return companies;
    }

    const parsed: unknown = JSON.parse(jsonMatch[0]);
    if (!isScoredEntryArray(parsed)) return companies;

    return parsed
      .filter((s) => s.index >= 0 && s.index < companies.length)
      .map((s) => ({
        ...companies[s.index],
        description: companies[s.index].description
          ? `${companies[s.index].description} (ICP score: ${s.score}/10 — ${s.reason})`
          : `ICP score: ${s.score}/10 — ${s.reason}`
      }));
  }
};
