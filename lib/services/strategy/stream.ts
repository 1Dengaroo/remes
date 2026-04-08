import Anthropic from '@anthropic-ai/sdk';
import { serviceConfig } from '../config';
import { getAnthropicClient } from '../anthropic';
import { getErrorMessage } from '@/lib/utils';
import type { ICPCriteria, StrategyMessage } from '@/lib/types';

function formatIcp(icp: ICPCriteria): string {
  return `## ICP
- Description: ${icp.description}
- Industries: ${icp.industry_keywords.join(', ') || 'Not specified'}
- Tech: ${icp.tech_keywords.join(', ') || 'Not specified'}
- Hiring signals: ${icp.hiring_signals.join(', ') || 'Not specified'}
- Funding: ${icp.funding_stages.join(', ') || 'Not specified'} / Min ${icp.min_funding_amount ? `$${(icp.min_funding_amount / 1_000_000).toFixed(0)}M` : 'any'}
- Employees: ${icp.min_employees ?? '?'}–${icp.max_employees ?? '?'}
- Locations: ${icp.locations.join(', ') || 'Global'}
- Examples: ${icp.company_examples.join(', ') || 'None'}`;
}

const ICP_UPDATE_INSTRUCTIONS = `
## ICP Updates
When feedback changes targeting criteria, append an <icp_update> block at the VERY END (machine-parsed, not shown to user). Only include changed fields. Arrays must be complete (not deltas).

Format:
<icp_update>
{"funding_stages": ["Series A", "Series B"]}
</icp_update>

Valid fields: description, industry_keywords, tech_keywords, hiring_signals, funding_stages, min_funding_amount, min_employees, max_employees, company_examples, locations.
If nothing changed, omit the block.`;

function buildStrategyPrompt(icp: ICPCriteria): string {
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

End with one short question asking if they want to adjust. Do NOT say "go" or "proceed" — there's a button for that. No bullet points. Short, confident sentences.

At the VERY END of your response, append a session name tag (machine-parsed, not shown to user). It should be a concise 3-6 word label summarizing this search target (e.g. "Series B Fintech CFOs", "Mid-Market HR Tech Leaders").
<session_name>Your Session Name Here</session_name>`;
}

function buildStrategyRevisionPrompt(icp: ICPCriteria): string {
  return `You are a senior sales strategist refining a research strategy.

${formatIcp(icp)}

You have web search — use it if asked to look at a website.
${ICP_UPDATE_INSTRUCTIONS}

Respond to the user's feedback in under 100 words. Minor feedback → 1-2 sentences. Major changes → brief updated strategy. URL request → search and summarize.

End with one line asking about further adjustments. No bullet points. Short sentences.`;
}

function getContentBlockType(event: Anthropic.MessageStreamEvent): string | null {
  if (
    event.type === 'content_block_start' &&
    'content_block' in event &&
    typeof event.content_block === 'object' &&
    event.content_block !== null &&
    'type' in event.content_block
  ) {
    return String(event.content_block.type);
  }
  return null;
}

/** Build an SSE ReadableStream that streams strategy analysis from Claude with web search. */
export function streamStrategy(icp: ICPCriteria, messages?: StrategyMessage[]): ReadableStream {
  const isRevision = messages && messages.length > 0;
  const systemPrompt = isRevision ? buildStrategyRevisionPrompt(icp) : buildStrategyPrompt(icp);

  const anthropicMessages: Anthropic.MessageParam[] = isRevision
    ? messages.map((m) => ({ role: m.role, content: m.content }))
    : [{ role: 'user', content: 'Analyze my ICP and present a research strategy.' }];

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        const client = getAnthropicClient();

        const stream = await client.messages.stream({
          model: serviceConfig.fastModel,
          max_tokens: 4096,
          system: systemPrompt,
          messages: anthropicMessages,
          tools: [
            {
              type: 'web_search_20250305',
              name: 'web_search',
              max_uses: 5
            }
          ]
        });

        let searchInProgress = false;

        for await (const event of stream) {
          const blockType = getContentBlockType(event);
          if (blockType === 'web_search_tool_result') {
            searchInProgress = false;
          }
          if (blockType === 'tool_use') {
            searchInProgress = true;
            const chunk = `data: ${JSON.stringify({ type: 'status', message: 'Searching the web...' })}\n\n`;
            controller.enqueue(encoder.encode(chunk));
          }

          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            if (searchInProgress) continue;
            const chunk = `data: ${JSON.stringify({ type: 'text', content: event.delta.text })}\n\n`;
            controller.enqueue(encoder.encode(chunk));
          }
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
        controller.close();
      } catch (err) {
        const message = getErrorMessage(err, 'Strategy generation failed');
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'error', message })}\n\n`)
        );
        controller.close();
      }
    }
  });
}
