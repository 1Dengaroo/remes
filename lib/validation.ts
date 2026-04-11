import { z } from 'zod';

// Re-export route utilities (canonical location: lib/route-utils.ts)
export { parseBody, requireEnvVars } from './route-utils';

// Re-export all domain schemas for backwards compatibility.
// New code should import from the domain directly (e.g., '@/lib/services/icp/schemas').
export {
  icpCriteriaSchema,
  createIcpBodySchema,
  updateIcpBodySchema,
  parseIcpBodySchema
} from './services/icp/schemas';
export { strategyMessageSchema, strategyBodySchema } from './services/strategy/schemas';
export { researchBodySchema } from './services/research/schemas';
export {
  peopleSearchBodySchema,
  peopleBulkBodySchema,
  peopleEnrichBodySchema
} from './services/people/schemas';
export { emailGenerateBodySchema, emailSendBodySchema } from './services/email/schemas';

// ---------------------------------------------------------------------------
// Schemas for domains without a service folder (profile, sessions, signatures)
// ---------------------------------------------------------------------------

const shortStr = z.string().max(500);
const mediumStr = z.string().max(5_000);
const longStr = z.string().max(50_000);
const urlStr = z.string().max(2_000);

function strArray(maxItems: number) {
  return z.array(shortStr).max(maxItems);
}

const recordKey = z.string().max(1_000);

// Re-import domain schemas needed for session body
import { icpCriteriaSchema } from './services/icp/schemas';
import { strategyMessageSchema } from './services/strategy/schemas';

const candidateLoose = z
  .object({
    name: shortStr,
    website: urlStr.optional(),
    description: mediumStr.optional(),
    linkedin_url: urlStr.optional(),
    logo_url: urlStr.optional(),
    apollo_org_id: shortStr.optional(),
    location: shortStr.optional()
  })
  .loose();

const apolloPersonLoose = z
  .object({
    apollo_person_id: shortStr,
    first_name: shortStr,
    last_name_obfuscated: shortStr,
    title: shortStr.nullable(),
    organization_name: shortStr,
    has_email: z.boolean(),
    has_direct_phone: z.boolean()
  })
  .loose();

const companySignalLoose = z
  .object({
    type: z.enum(['job_posting', 'news', 'funding', 'product_launch', 'other']),
    title: shortStr,
    key_phrases: strArray(20),
    source_url: urlStr.optional()
  })
  .loose();

const sourceLinkLoose = z.object({ title: shortStr, url: urlStr }).loose();

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
    match_reason: mediumStr,
    company_overview: mediumStr,
    contacts: z.array(targetContactLoose).max(50).optional().default([]),
    sources: z.object({
      jobs: z.array(sourceLinkLoose).max(50),
      funding: z.array(sourceLinkLoose).max(50),
      news: z.array(sourceLinkLoose).max(50)
    })
  })
  .loose();

const generatedEmailLoose = z.object({ subject: shortStr, body: longStr }).loose();

const emailSequenceLoose = z.object({
  emails: z.tuple([generatedEmailLoose, generatedEmailLoose, generatedEmailLoose])
});

export const sessionCreateBodySchema = z.object({
  name: shortStr.optional(),
  transcript: longStr.optional(),
  step: shortStr.optional(),
  icp: icpCriteriaSchema.optional(),
  strategy_messages: z.array(strategyMessageSchema).max(200).optional(),
  candidates: z.array(candidateLoose).max(200).optional(),
  selected_companies: strArray(200).optional(),
  results: z.array(companyResultLoose).max(200).optional(),
  people_results: z.record(recordKey, z.array(apolloPersonLoose).max(100)).optional(),
  email_sequences: z.record(recordKey, emailSequenceLoose).optional()
});

export const sessionUpdateBodySchema = z.object({
  name: shortStr.optional(),
  step: shortStr.optional(),
  transcript: longStr.optional(),
  icp: icpCriteriaSchema.nullable().optional(),
  strategy_messages: z.array(strategyMessageSchema).max(200).optional(),
  candidates: z.array(candidateLoose).max(200).optional(),
  selected_companies: strArray(200).optional(),
  results: z.array(companyResultLoose).max(200).optional(),
  people_results: z.record(recordKey, z.array(apolloPersonLoose).max(100)).optional(),
  email_sequences: z.record(recordKey, emailSequenceLoose).optional(),
  status: z.enum(['in_progress', 'completed']).optional()
});

export const profileUpdateBodySchema = z.object({
  full_name: shortStr,
  company_name: shortStr.optional()
});

export const signatureCreateBodySchema = z.object({
  name: shortStr.min(1),
  body: mediumStr.min(1)
});

export const signatureUpdateBodySchema = z.object({
  name: shortStr.optional(),
  body: mediumStr.optional(),
  is_default: z.boolean().optional()
});
