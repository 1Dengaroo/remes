import Anthropic from '@anthropic-ai/sdk';
import type { ICPCriteria, CompanySignal } from '@/lib/types';
import type { CompanyResearcher, CompanyResearchResult } from '../interfaces';
import { serviceConfig } from '../config';
import { getAnthropicClient } from '../anthropic';
import { extractJson } from '@/lib/utils';

function buildResearchAgentPrompt(
  companyName: string,
  icp: ICPCriteria,
  context?: { description?: string; website?: string }
): string {
  const contextLine = context?.description ? ` Context: ${context.description}` : '';
  const signals = icp.hiring_signals.slice(0, 3).join(', ');

  return `Research "${companyName}" for outbound sales.${contextLine}

ICP: ${icp.description}
Signals: ${signals} | Tech: ${icp.tech_keywords.slice(0, 3).join(', ')}

You have 2 web searches:
1. "${companyName} funding raised series investors"
2. "${companyName} jobs hiring ${icp.hiring_signals[0] || 'engineering'} news"

Return ONLY JSON:
{"website":"domain (no https://)","linkedin_url":"exact LinkedIn URL from results or null","signals":[{"type":"job_posting"|"news"|"funding"|"product_launch"|"other","title":"desc","key_phrases":["phrases"],"source_url":"real URL or null"}],"match_reason":"one sentence with a concrete fact","company_overview":"2-3 sentences","industry":"industry","funding_stage":"stage or Unknown","amount_raised":"e.g. $150M Series C or Unknown","inferred_contacts":[],"sources":{"jobs":[{"title":"t","url":"u"}],"funding":[{"title":"t","url":"u"}],"news":[{"title":"t","url":"u"}]}}

Only use URLs from search results. For linkedin_url use exact URL found - do NOT guess. Leave inferred_contacts empty.`;
}

/**
 * Extract all verified URLs from web search result blocks and text citations.
 */
function extractVerifiedUrls(content: Anthropic.ContentBlock[]): Map<string, string> {
  const urls = new Map<string, string>();

  for (const block of content) {
    if (block.type === 'web_search_tool_result' && 'content' in block) {
      const searchContent = (block as { content: unknown[] }).content;
      if (Array.isArray(searchContent)) {
        for (const item of searchContent) {
          const entry = item as { type?: string; url?: string; title?: string };
          if (entry.type === 'web_search_result' && entry.url) {
            urls.set(entry.url, entry.title || '');
          }
        }
      }
    }

    if (block.type === 'text') {
      const textBlock = block as { citations?: Array<{ url?: string; title?: string }> };
      if (Array.isArray(textBlock.citations)) {
        for (const cite of textBlock.citations) {
          if (cite.url) {
            urls.set(cite.url, cite.title || '');
          }
        }
      }
    }
  }

  return urls;
}

function isUrlTrusted(url: string, verifiedUrls: Map<string, string>): boolean {
  if (verifiedUrls.has(url)) return true;
  const safePatterns = [
    'linkedin.com/jobs/search',
    'linkedin.com/search/results',
    'crunchbase.com/textsearch',
    'news.google.com/search'
  ];
  return safePatterns.some((p) => url.includes(p));
}

function categorizeUrl(url: string): 'jobs' | 'funding' | 'news' {
  if (/jobs?|careers?|hiring|lever\.co|greenhouse|ashby|workable|breezy/i.test(url)) {
    return 'jobs';
  }
  if (/funding|raised|series|crunchbase|pitchbook|techcrunch.*rais/i.test(url)) {
    return 'funding';
  }
  return 'news';
}

function buildFallbackSources(companyName: string): CompanyResearchResult['sources'] {
  const encodedName = encodeURIComponent(companyName);
  return {
    jobs: [
      {
        title: `${companyName} on LinkedIn Jobs`,
        url: `https://www.linkedin.com/jobs/search/?keywords=${encodedName}`
      }
    ],
    funding: [
      {
        title: `${companyName} on Crunchbase`,
        url: `https://www.crunchbase.com/textsearch?q=${encodedName}`
      }
    ],
    news: [
      {
        title: `${companyName} - recent news`,
        url: `https://news.google.com/search?q=${encodedName}`
      }
    ]
  };
}

export const claudeResearchAgent: CompanyResearcher = {
  async research(
    companyName: string,
    icp: ICPCriteria,
    context?: { description?: string; website?: string },
    onProgress?: (message: string) => void
  ): Promise<CompanyResearchResult> {
    const client = getAnthropicClient({ maxRetries: 0 });

    onProgress?.('Starting research...');

    const stream = await client.messages.create({
      model: serviceConfig.researchModel,
      max_tokens: serviceConfig.researchMaxTokens,
      stream: true,
      tools: [
        {
          type: 'web_search_20250305',
          name: 'web_search',
          max_uses: serviceConfig.maxSearchesPerCompany
        }
      ],
      messages: [
        {
          role: 'user',
          content: buildResearchAgentPrompt(companyName, icp, context)
        }
      ]
    });

    // Accumulate content blocks while surfacing progress
    let searchCount = 0;
    const contentBlocks: Anthropic.ContentBlock[] = [];
    let currentBlockIndex = -1;
    let currentTextParts: string[] = [];

    for await (const event of stream) {
      if (event.type === 'content_block_start') {
        currentBlockIndex = event.index;
        const block = event.content_block;

        if (block.type === 'server_tool_use' && block.name === 'web_search') {
          searchCount++;
          const input = block.input as { query?: string };
          onProgress?.(input.query ? `Searching: "${input.query}"` : `Searching the web...`);
        }

        // Seed the block for accumulation
        if (block.type === 'text') {
          currentTextParts = [];
        }
        contentBlocks[currentBlockIndex] = block;
      }

      if (event.type === 'content_block_delta') {
        const delta = event.delta as { type: string; text?: string };
        if (delta.type === 'text_delta' && delta.text) {
          currentTextParts.push(delta.text);
        }
      }

      if (event.type === 'content_block_stop') {
        const block = contentBlocks[currentBlockIndex];

        // Finalize text blocks with accumulated text
        if (block && block.type === 'text') {
          (block as { text: string }).text = currentTextParts.join('');
        }

        // Surface result count for search results
        if (block && block.type === 'web_search_tool_result') {
          const results = (block as { content?: unknown[] }).content;
          const count = Array.isArray(results)
            ? results.filter((r) => (r as { type?: string }).type === 'web_search_result').length
            : 0;
          onProgress?.(
            `Found ${count} results${searchCount < serviceConfig.maxSearchesPerCompany ? ', searching more...' : ', compiling research...'}`
          );
        }
      }
    }

    onProgress?.('Compiling results...');

    // Build citation index from actual search results
    const verifiedUrls = extractVerifiedUrls(contentBlocks);

    // Extract text
    let fullText = '';
    for (const block of contentBlocks) {
      if (block?.type === 'text') {
        fullText += block.text;
      }
    }

    // Strip all <cite> tags, keep inner text
    const cleanText = fullText.replace(/<cite[^>]*>([\s\S]*?)<\/cite>/g, '$1');

    interface RawResearch {
      signals?: Array<{
        type: CompanySignal['type'];
        title: string;
        key_phrases: string[];
        source_url?: string;
      }>;
      linkedin_url?: string;
      website?: string;
      match_reason?: string;
      company_overview?: string;
      industry?: string;
      funding_stage?: string;
      amount_raised?: string;
      inferred_contacts?: Array<{
        name: string;
        title: string;
        email: string | null;
        is_decision_maker: boolean;
      }>;
    }

    const parsed = extractJson<RawResearch>(cleanText);
    if (!parsed) {
      throw new Error(`Research agent failed for ${companyName}`);
    }

    // Strip citations from string fields too
    const stripCites = (s: string) => s.replace(/<cite[^>]*>([\s\S]*?)<\/cite>/g, '$1');

    // Strip hallucinated URLs from signals
    const signals: CompanySignal[] = (parsed.signals || []).map((s) => ({
      type: s.type,
      title: s.title,
      key_phrases: s.key_phrases || [],
      source_url:
        s.source_url && isUrlTrusted(s.source_url, verifiedUrls) ? s.source_url : undefined
    }));

    // Build sources from verified URLs
    const sources: CompanyResearchResult['sources'] = { jobs: [], funding: [], news: [] };
    for (const [url, title] of verifiedUrls) {
      const category = categorizeUrl(url);
      sources[category].push({ title, url });
    }

    // Fallbacks
    const fallbacks = buildFallbackSources(companyName);
    if (sources.jobs.length === 0) sources.jobs = fallbacks.jobs;
    if (sources.funding.length === 0) sources.funding = fallbacks.funding;
    if (sources.news.length === 0) sources.news = fallbacks.news;

    // Validate LinkedIn URL - must be a real linkedin.com/company/ URL from search results
    const rawLinkedin = parsed.linkedin_url || null;
    const linkedinUrl =
      typeof rawLinkedin === 'string' &&
      rawLinkedin.includes('linkedin.com/company/') &&
      verifiedUrls.has(rawLinkedin)
        ? rawLinkedin
        : null;

    // Extract website domain from research
    const rawWebsite = parsed.website || null;
    const website = typeof rawWebsite === 'string' && rawWebsite.length > 0 ? rawWebsite : null;

    return {
      website,
      linkedin_url: linkedinUrl,
      signals,
      match_reason: stripCites(parsed.match_reason || ''),
      company_overview: stripCites(parsed.company_overview || ''),
      industry: parsed.industry || 'Unknown',
      funding_stage: parsed.funding_stage || 'Unknown',
      amount_raised: parsed.amount_raised || 'Unknown',
      inferred_contacts: parsed.inferred_contacts || [],
      sources
    };
  }
};
