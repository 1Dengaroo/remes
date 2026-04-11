import { z } from 'zod';
import { icpCriteriaSchema } from '../icp/schemas';

const shortStr = z.string().max(500);
const longStr = z.string().max(50_000);
const urlStr = z.string().max(2_000);

function strArray(maxItems: number) {
  return z.array(shortStr).max(maxItems);
}

// Loose schemas for server-produced data (don't strip unknown fields)
const sourceLinkLoose = z.object({ title: shortStr, url: urlStr }).loose();

const companySignalLoose = z
  .object({
    type: z.enum(['job_posting', 'news', 'funding', 'product_launch', 'other']),
    title: shortStr,
    key_phrases: strArray(20),
    source_url: urlStr.optional()
  })
  .loose();

const targetContactLoose = z
  .object({
    name: shortStr,
    title: shortStr,
    linkedin_url: urlStr,
    email: shortStr.nullable(),
    is_decision_maker: z.boolean()
  })
  .loose();

const companyResultLoose = z
  .object({
    company_name: shortStr,
    industry: shortStr,
    funding_stage: shortStr,
    amount_raised: shortStr,
    website: urlStr.nullable(),
    linkedin_url: urlStr,
    logo_url: urlStr,
    signals: z.array(companySignalLoose).max(50),
    match_reason: z.string().max(5_000),
    company_overview: z.string().max(5_000),
    contacts: z.array(targetContactLoose).max(50).optional().default([]),
    sources: z.object({
      jobs: z.array(sourceLinkLoose).max(50),
      funding: z.array(sourceLinkLoose).max(50),
      news: z.array(sourceLinkLoose).max(50)
    })
  })
  .loose();

export const emailGenerateBodySchema = z.object({
  company: companyResultLoose,
  contact: targetContactLoose,
  icp: icpCriteriaSchema
});

export const emailSendBodySchema = z.object({
  to: z.string().email().max(320),
  subject: shortStr.min(1),
  body: longStr.min(1),
  companyName: shortStr,
  contactName: shortStr,
  sessionId: shortStr.optional()
});
