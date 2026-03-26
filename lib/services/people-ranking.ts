import Anthropic from '@anthropic-ai/sdk';
import type { ICPCriteria, ApolloPersonPreview } from '@/lib/types';
import { serviceConfig } from './config';

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
  return new Anthropic({ apiKey });
}

function buildRankingPrompt(
  people: ApolloPersonPreview[],
  icp: ICPCriteria,
  companyName: string
): string {
  const peopleSummaries = people
    .map(
      (p, i) =>
        `${i}: ${p.first_name} ${p.last_name_obfuscated} — ${p.title ?? 'Unknown title'} (has_email: ${p.has_email}, has_phone: ${p.has_direct_phone})`
    )
    .join('\n');

  return `You are selecting the best people to contact at "${companyName}" for outbound sales.

**ICP:**
${icp.description}
- Hiring signals: ${icp.hiring_signals.join(', ') || 'none specified'}
- Tech: ${icp.tech_keywords.join(', ') || 'any'}

**People at ${companyName}:**
${peopleSummaries}

Pick the top 5 people most likely to be decision makers or influencers for this ICP. Prefer:
1. Titles that match hiring signals (e.g. if hiring for "data engineer", the VP of Data is ideal)
2. C-suite, VP, Director, Head of relevant departments
3. People with verified emails over those without

Return ONLY a JSON array of indices, sorted by best fit first:
[0, 5, 2]`;
}

function isIndexArray(value: unknown): value is number[] {
  if (!Array.isArray(value)) return false;
  return value.every((item) => typeof item === 'number');
}

/**
 * Uses Claude (Haiku) to rank people at a company by ICP fit.
 * Returns top 5 sorted by relevance.
 */
export async function rankPeopleForCompany(
  people: ApolloPersonPreview[],
  icp: ICPCriteria,
  companyName: string
): Promise<ApolloPersonPreview[]> {
  if (people.length <= 5) return people;

  const client = getClient();

  const message = await client.messages.create({
    model: serviceConfig.fastModel,
    max_tokens: 256,
    messages: [{ role: 'user', content: buildRankingPrompt(people, icp, companyName) }]
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = text.match(/\[[\s\S]*\]/);

  if (!jsonMatch) {
    return people.slice(0, 5);
  }

  const parsed: unknown = JSON.parse(jsonMatch[0]);
  if (!isIndexArray(parsed)) {
    return people.slice(0, 5);
  }

  const ranked = parsed
    .filter((idx) => idx >= 0 && idx < people.length)
    .slice(0, 5)
    .map((idx) => people[idx]);

  return ranked.length > 0 ? ranked : people.slice(0, 5);
}
