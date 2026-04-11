/**
 * Centralized configuration for all service providers.
 * Change models, limits, or providers in one place.
 */
export const serviceConfig = {
  /** Model used for lightweight tasks: ICP parsing, scoring */
  fastModel: 'claude-haiku-4-5-20251001',

  /** Model used for deep research with tool use */
  researchModel: 'claude-haiku-4-5-20251001',

  /** Max web searches per company research agent call */
  maxSearchesPerCompany: 2,

  /** Max tokens for research agent output */
  researchMaxTokens: 2048,

  /** Max tokens for ICP parsing */
  parseMaxTokens: 1024,

  /** Max tokens for Claude batch scoring */
  scoringMaxTokens: 2048,

  /** Minimum ICP score (1-10) to include a company in results */
  scoringMinScore: 5,

  /** Apollo results per page (max 100) */
  apolloPerPage: 100,

  /** Number of pages to fetch per Apollo search strategy */
  apolloPagesPerStrategy: 1,

  /** Max companies to pass to scoring after dedup across all strategies */
  apolloMaxCandidates: 75,

  /** Apollo API base URL */
  apolloBaseUrl: 'https://api.apollo.io/api/v1',

  /** Model used for email generation */
  emailModel: 'claude-haiku-4-5-20251001',

  /** Max tokens for email sequence generation (3 emails) */
  emailMaxTokens: 2048
} as const;

/** Contact emails by purpose */
export const CONTACT_EMAILS = {
  support: 'support@remes.so',
  legal: 'legal@remes.so',
  privacy: 'privacy@remes.so'
} as const;
/** Example customer description shown in the ICP input placeholder */
export const EXAMPLE_CUSTOMER_INPUT = `We sell GPU scheduling and orchestration software for ML teams. Our ideal customer is an AI-intensive startup that's scaling past the point where manual GPU management works. They've typically raised $30M+ and are hiring for MLOps, ML Platform, or GPU infrastructure roles. Key signals we look for are job postings mentioning Kubernetes GPU scheduling, distributed training, or compute cost optimization. Companies like Modal, Anyscale, and Replicate are good examples of the type of company we sell to, though they're also competitors in some ways. We mainly target VP of Infrastructure, Head of ML Platform, or CTO as the buyer.`;
