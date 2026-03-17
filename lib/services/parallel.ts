import Parallel from 'parallel-web';
import type { ICPCriteria } from '@/lib/types';
import type { CompanyDiscovery, DiscoveredCompany } from './interfaces';
import { serviceConfig } from './config';

function getClient(): Parallel {
  const apiKey = process.env.PARALLEL_API_KEY;
  if (!apiKey) throw new Error('PARALLEL_API_KEY is not set');
  return new Parallel({ apiKey });
}

/**
 * Parallel FindAll-based company discovery.
 * Implements CompanyDiscovery interface.
 */
export const parallelCompanyDiscovery: CompanyDiscovery = {
  async find(
    icp: ICPCriteria,
    onProgress?: (message: string) => void
  ): Promise<DiscoveredCompany[]> {
    const client = getClient();

    const conditions: { name: string; description: string }[] = [];

    if (icp.min_employees !== null || icp.max_employees !== null) {
      const sizeParts: string[] = [];
      if (icp.min_employees !== null) sizeParts.push(`at least ${icp.min_employees}`);
      if (icp.max_employees !== null) sizeParts.push(`no more than ${icp.max_employees}`);
      conditions.push({
        name: 'Company size',
        description: `The company should have ${sizeParts.join(' and ')} employees.`
      });
    }

    if (icp.industry_keywords.length > 0) {
      conditions.push({
        name: 'Industry fit',
        description: `The company operates in one of these industries or verticals: ${icp.industry_keywords.join(', ')}.`
      });
    }

    if (icp.hiring_signals.length > 0) {
      conditions.push({
        name: 'Hiring and growth signals',
        description: `The company shows these behavioral signals: ${icp.hiring_signals.join(', ')}.`
      });
    }

    if (icp.min_funding_amount || icp.funding_stages.length > 0) {
      const fundingParts: string[] = [];
      if (icp.funding_stages.length > 0) {
        fundingParts.push(`funding stage: ${icp.funding_stages.join(' or ')}`);
      }
      if (icp.min_funding_amount) {
        fundingParts.push(`raised at least $${icp.min_funding_amount / 1_000_000}M`);
      }
      conditions.push({
        name: 'Funding profile',
        description: `The company has ${fundingParts.join(' and ')}.`
      });
    }

    if (icp.tech_keywords.length > 0) {
      conditions.push({
        name: 'Tech stack',
        description: `The company uses or is adopting: ${icp.tech_keywords.join(', ')}.`
      });
    }

    conditions.push({
      name: 'Company legitimacy',
      description:
        'The company must be an established, reputable business — not a shell company, personal project, or ghost profile. It should have at least 200 followers on LinkedIn and show signs of real activity (employees, posts, website).'
    });

    // Fallback if no structured conditions were generated
    if (conditions.length === 0) {
      conditions.push({
        name: 'ICP fit',
        description: icp.description
      });
    }

    // Build objective with size constraints for reinforcement
    const objectiveParts = [icp.description];
    if (icp.min_employees !== null || icp.max_employees !== null) {
      const sizeStr =
        icp.min_employees !== null && icp.max_employees !== null
          ? `${icp.min_employees}-${icp.max_employees} employees`
          : icp.max_employees !== null
            ? `under ${icp.max_employees} employees`
            : `at least ${icp.min_employees} employees`;
      objectiveParts.push(`Target company size: ${sizeStr}.`);
    }

    const run = await client.beta.findall.create({
      objective: objectiveParts.join(' '),
      entity_type: 'companies',
      match_conditions: conditions,
      generator: serviceConfig.findAllGenerator,
      match_limit: serviceConfig.findAllLimit
    });

    const findallId = run.findall_id;
    let runStatus = run.status.status;
    let attempts = 0;
    let lastMatchedCount = 0;

    while (
      runStatus !== 'completed' &&
      runStatus !== 'failed' &&
      attempts < serviceConfig.findAllMaxAttempts
    ) {
      await new Promise((r) => setTimeout(r, serviceConfig.findAllPollInterval));
      const check = await client.beta.findall.retrieve(findallId);
      runStatus = check.status.status;
      attempts++;

      if (onProgress) {
        const generated = check.status.metrics?.generated_candidates_count ?? 0;
        const matched = check.status.metrics?.matched_candidates_count ?? 0;

        if (matched > lastMatchedCount) {
          onProgress(
            `Found ${matched} matching ${matched === 1 ? 'company' : 'companies'} so far (${generated} evaluated)...`
          );
          lastMatchedCount = matched;
        } else if (generated > 0) {
          onProgress(`Evaluating companies... ${generated} scanned, ${matched} matched so far`);
        }
      }
    }

    if (runStatus !== 'completed') {
      throw new Error(`FindAll run ${findallId} ended with status: ${runStatus}`);
    }

    const result = await client.beta.findall.result(findallId);

    return result.candidates
      .filter((c) => c.match_status === 'matched')
      .map((c) => ({
        name: c.name,
        website: c.url || undefined,
        description: c.description || undefined,
        match_context: c.output ? JSON.stringify(c.output) : ''
      }));
  }
};
