// Re-export all domain types from their canonical locations.
// New code should import from the domain directly (e.g., '@/lib/services/icp/types').

export type { ICPCriteria, SavedICP } from './services/icp/types';
export type {
  SourceLink,
  CompanySignal,
  TargetContact,
  CompanyResult,
  DiscoveredCompanyPreview,
  ResearchStreamEvent
} from './services/research/types';
export type { ApolloPersonPreview, PeopleSearchResult } from './services/people/types';
export type {
  GeneratedEmail,
  GeneratedEmailSequence,
  SentEmail,
  SendEmailRequest,
  ComposeEmailParams
} from './services/email/types';
export type { StrategyMessage } from './services/strategy/types';

// ---------------------------------------------------------------------------
// Persistence - shared DB row shapes (not domain-specific)
// ---------------------------------------------------------------------------

import type { ICPCriteria } from './services/icp/types';
import type { DiscoveredCompanyPreview, CompanyResult } from './services/research/types';
import type { ApolloPersonPreview } from './services/people/types';
import type { GeneratedEmailSequence } from './services/email/types';
import type { StrategyMessage } from './services/strategy/types';

export interface ResearchSession {
  id: string;
  user_id: string;
  name: string;
  step: string;
  transcript: string;
  icp: ICPCriteria | null;
  strategy_messages: StrategyMessage[];
  candidates: DiscoveredCompanyPreview[];
  selected_companies: string[];
  results: CompanyResult[];
  people_results: Record<string, ApolloPersonPreview[]>;
  email_sequences: Record<string, GeneratedEmailSequence>;
  status: 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface ResearchSessionSummary {
  id: string;
  name: string;
  step: string;
  status: 'in_progress' | 'completed';
  icp_description: string | null;
  company_count: number;
  created_at: string;
  updated_at: string;
}

export interface EmailSignature {
  id: string;
  user_id: string;
  name: string;
  body: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactedCompany {
  id: string;
  user_id: string;
  company_name: string;
  contact_email: string;
  contact_name: string;
  session_id: string | null;
  sent_email_id: string | null;
  created_at: string;
}
