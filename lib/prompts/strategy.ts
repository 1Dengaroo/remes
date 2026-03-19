import type { ICPCriteria } from '@/lib/types';

function formatIcp(icp: ICPCriteria): string {
  return `## ICP
- Description: ${icp.description}
- Industries: ${icp.industry_keywords.join(', ') || 'Not specified'}
- Tech: ${icp.tech_keywords.join(', ') || 'Not specified'}
- Hiring signals: ${icp.hiring_signals.join(', ') || 'Not specified'}
- Funding: ${icp.funding_stages.join(', ') || 'Not specified'} / Min ${icp.min_funding_amount ? `$${(icp.min_funding_amount / 1_000_000).toFixed(0)}M` : 'any'}
- Employees: ${icp.min_employees ?? '?'}–${icp.max_employees ?? '?'}
- Examples: ${icp.company_examples.join(', ') || 'None'}`;
}

const ICP_UPDATE_INSTRUCTIONS = `
## ICP Updates
When feedback changes targeting criteria, append an <icp_update> block at the VERY END (machine-parsed, not shown to user). Only include changed fields. Arrays must be complete (not deltas).

Format:
<icp_update>
{"funding_stages": ["Series A", "Series B"]}
</icp_update>

Valid fields: description, industry_keywords, tech_keywords, hiring_signals, funding_stages, min_funding_amount, min_employees, max_employees, company_examples.
If nothing changed, omit the block.`;

export function buildStrategyPrompt(icp: ICPCriteria): string {
  return `You are a senior sales strategist. Analyze this ICP and present a research strategy.

${formatIcp(icp)}

You have web search — use it if the user asks you to look at URLs or gather external info.

Keep your ENTIRE response under 150 words. Three short sections, markdown formatted:

### 1. Company Search
2-3 sentences: what companies, which signals, non-obvious niches.

### 2. Contact Targeting
1-2 sentences: which roles, why.

### 3. Email Approach
1-2 sentences: hooks and signals to reference.

End with one short question asking if they want to adjust. Do NOT say "go" or "proceed" — there's a button for that. No bullet points. Short, confident sentences.`;
}

export function buildStrategyRevisionPrompt(icp: ICPCriteria): string {
  return `You are a senior sales strategist refining a research strategy.

${formatIcp(icp)}

You have web search — use it if asked to look at a website.
${ICP_UPDATE_INSTRUCTIONS}

Respond to the user's feedback in under 100 words. Minor feedback → 1-2 sentences. Major changes → brief updated strategy. URL request → search and summarize.

End with one line asking about further adjustments. No bullet points. Short sentences.`;
}
