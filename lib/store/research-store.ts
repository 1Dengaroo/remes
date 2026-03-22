import { create } from 'zustand';
import { toast } from 'sonner';
import {
  parseICP,
  streamStrategy,
  discoverCompanies,
  researchCompanies,
  searchPeople,
  enrichPerson,
  updateSession,
  listContactedCompanies,
  listResearchedCompanies
} from '@/lib/api';
import type {
  ICPCriteria,
  CompanyResult,
  DiscoveredCompanyPreview,
  ApolloPersonPreview,
  StrategyMessage,
  GeneratedEmailSequence
} from '@/lib/types';

type Step = 'input' | 'review' | 'confirm' | 'results';

const EMPTY_ICP: ICPCriteria = {
  description: '',
  industry_keywords: [],
  min_employees: null,
  max_employees: null,
  min_funding_amount: null,
  funding_stages: [],
  hiring_signals: [],
  tech_keywords: [],
  company_examples: [],
  locations: []
};

interface ResearchState {
  step: Step;
  transcript: string;
  isExtracting: boolean;
  icp: ICPCriteria | null;
  strategyMessages: StrategyMessage[];
  isStrategizing: boolean;
  isDiscovering: boolean;
  candidates: DiscoveredCompanyPreview[];
  selectedCompanies: string[];
  isResearching: boolean;
  results: CompanyResult[];
  researchingCompany: string | null;
  peopleResults: Record<string, ApolloPersonPreview[]>;
  allPeopleResults: Record<string, ApolloPersonPreview[]>;
  isPeopleSearching: boolean;
  enrichingPersonIds: string[];
  statusMessage: string;
  error: string | null;
  emailSequences: Record<string, GeneratedEmailSequence>;
  abortController: AbortController | null;
  sessionId: string | null;
  sessionName: string;
  isSaving: boolean;
  lastSavedAt: string | null;
  contactedCompanies: Map<string, string[]>;
  previouslyResearched: Set<string>;
  icpChangedSinceDiscovery: boolean;
}

interface ResearchActions {
  setStep: (step: Step) => void;
  setTranscript: (transcript: string) => void;
  extractICP: () => Promise<void>;
  updateIcp: <K extends keyof ICPCriteria>(field: K, value: ICPCriteria[K]) => void;
  generateStrategy: () => Promise<void>;
  sendStrategyMessage: (message: string) => Promise<void>;
  approveStrategy: () => void;
  discover: () => Promise<void>;
  setSelectedCompanies: (companies: string[]) => void;
  research: () => Promise<void>;
  reResearchCompany: (companyName: string) => Promise<void>;
  searchPeopleAction: () => Promise<void>;
  enrichPersonAction: (personId: string, companyName: string) => Promise<void>;
  setError: (error: string | null) => void;
  startOver: () => void;
  skipToReview: () => void;
  saveEmailSequence: (
    companyName: string,
    contactEmail: string,
    sequence: GeneratedEmailSequence
  ) => void;
  getEmailSequence: (companyName: string, contactEmail: string) => GeneratedEmailSequence | null;
  saveSession: () => Promise<void>;
  setSessionName: (name: string) => void;
  loadContactedCompanies: () => Promise<void>;
  getContactedEmails: (companyName: string) => string[];
  loadPreviouslyResearched: () => Promise<void>;
}

export type ResearchStore = ResearchState & ResearchActions;

function buildStrategyCallbacks(
  set: (partial: Partial<ResearchState>) => void,
  get: () => ResearchStore,
  priorMessages: StrategyMessage[]
): {
  onChunk: (text: string) => void;
  onStatus: (message: string) => void;
  onIcpUpdate: (updates: Partial<ICPCriteria>) => void;
} {
  return {
    onChunk: (text) => {
      set({
        strategyMessages: [...priorMessages, { role: 'assistant', content: text }]
      });
    },
    onStatus: (message) => {
      set({ statusMessage: message });
    },
    onIcpUpdate: (updates) => {
      const current = get().icp;
      if (current) set({ icp: { ...current, ...updates } });
    }
  };
}

export const useResearchStore = create<ResearchStore>((set, get) => ({
  step: 'input',
  transcript: '',
  isExtracting: false,
  icp: null,
  strategyMessages: [],
  isStrategizing: false,
  isDiscovering: false,
  candidates: [],
  selectedCompanies: [],
  isResearching: false,
  results: [],
  researchingCompany: null,
  peopleResults: {},
  allPeopleResults: {},
  isPeopleSearching: false,
  enrichingPersonIds: [],
  statusMessage: '',
  error: null,
  emailSequences: {},
  abortController: null,
  sessionId: null,
  sessionName: 'Untitled Session',
  isSaving: false,
  lastSavedAt: null,
  contactedCompanies: new Map(),
  previouslyResearched: new Set(),
  icpChangedSinceDiscovery: false,

  setStep: (step) => set({ step }),
  setTranscript: (transcript) => set({ transcript }),

  extractICP: async () => {
    const { transcript, isExtracting } = get();
    if (!transcript.trim() || isExtracting) return;

    set({ isExtracting: true, error: null });

    try {
      const data = await parseICP(transcript.trim());
      set({
        icp: { ...data, description: transcript.trim() },
        step: 'review',
        isExtracting: false,
        strategyMessages: []
      });
      const { sessionId } = get();
      if (sessionId) {
        const name = transcript.trim().slice(0, 60) || 'Untitled Session';
        set({ sessionName: name });
      }
      get().saveSession();
      get().generateStrategy();
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to extract ICP',
        isExtracting: false
      });
    }
  },

  updateIcp: (field, value) => {
    const current = get().icp;
    if (current) set({ icp: { ...current, [field]: value } });
  },

  generateStrategy: async () => {
    const { icp, isStrategizing } = get();
    if (!icp || isStrategizing) return;

    set({ isStrategizing: true, error: null, strategyMessages: [] });

    try {
      const cleanText = await streamStrategy(icp, [], buildStrategyCallbacks(set, get, []));
      set({ strategyMessages: [{ role: 'assistant', content: cleanText }] });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Strategy generation failed'
      });
    } finally {
      set({ isStrategizing: false, statusMessage: '' });
    }
  },

  sendStrategyMessage: async (message: string) => {
    const { icp, isStrategizing, strategyMessages } = get();
    if (!icp || isStrategizing || !message.trim()) return;

    const icpBefore = JSON.stringify(icp);

    const updatedMessages: StrategyMessage[] = [
      ...strategyMessages,
      { role: 'user', content: message.trim() }
    ];

    set({
      isStrategizing: true,
      error: null,
      strategyMessages: updatedMessages
    });

    try {
      const cleanText = await streamStrategy(
        icp,
        updatedMessages,
        buildStrategyCallbacks(set, get, updatedMessages)
      );
      set({
        strategyMessages: [...updatedMessages, { role: 'assistant', content: cleanText }]
      });
      const icpAfter = JSON.stringify(get().icp);
      if (icpBefore !== icpAfter) {
        set({ icpChangedSinceDiscovery: true });
      }
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Strategy update failed'
      });
    } finally {
      set({ isStrategizing: false, statusMessage: '' });
    }
  },

  approveStrategy: () => {
    get().discover();
  },

  discover: async () => {
    const { icp, isDiscovering } = get();
    if (!icp || isDiscovering) return;

    set({
      isDiscovering: true,
      statusMessage: '',
      error: null,
      step: 'confirm',
      icpChangedSinceDiscovery: false
    });

    try {
      const found = await discoverCompanies(icp, (event) => {
        if (event.type === 'status') {
          set({ statusMessage: event.message });
        }
      });
      const { candidates: existing, selectedCompanies: existingSelected } = get();
      const merged = new Map<string, DiscoveredCompanyPreview>();
      for (const c of existing) merged.set(c.name, c);
      for (const c of found) merged.set(c.name, c);
      const MAX_AUTO_SELECTED = 5;
      const mergedCandidates = [...merged.values()];
      const newNames = found.map((c) => c.name);
      const selectedSet = new Set([...existingSelected, ...newNames]);
      const cappedSelected = [...selectedSet].slice(0, MAX_AUTO_SELECTED);
      set({
        candidates: mergedCandidates,
        selectedCompanies: cappedSelected,
        isDiscovering: false
      });
      get().saveSession();
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Discovery failed',
        isDiscovering: false
      });
    }
  },

  setSelectedCompanies: (companies) => set({ selectedCompanies: companies }),

  research: async () => {
    const { icp, isResearching, selectedCompanies, candidates, results: existingResults } = get();
    if (!icp || isResearching || selectedCompanies.length === 0) return;

    const alreadyResearched = new Set(existingResults.map((r) => r.company_name));
    const newCompanies = selectedCompanies.filter((name) => !alreadyResearched.has(name));

    if (newCompanies.length === 0) {
      set({ step: 'results' });
      return;
    }

    const abortController = new AbortController();

    set({
      isResearching: true,
      statusMessage: '',
      researchingCompany: null,
      error: null,
      step: 'results',
      abortController
    });

    get().searchPeopleAction();

    try {
      await researchCompanies(
        icp,
        newCompanies,
        (event) => {
          switch (event.type) {
            case 'status': {
              set({ statusMessage: event.message });
              const match = event.message.match(/^Researching (.+?) \(/);
              if (match) {
                set({ researchingCompany: match[1] });
              }
              break;
            }
            case 'company':
              set((state) => ({
                results: [...state.results, event.data],
                researchingCompany: null
              }));
              get().saveSession();
              break;
            case 'done': {
              const totalCount = get().results.length;
              set({
                statusMessage: `Research complete. ${totalCount} companies researched.`,
                researchingCompany: null
              });
              break;
            }
          }
        },
        abortController.signal,
        candidates
      );
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      set({
        error: err instanceof Error ? err.message : 'Something went wrong'
      });
    } finally {
      set({ isResearching: false, researchingCompany: null, abortController: null });
      const { sessionId } = get();
      if (sessionId) {
        updateSession(sessionId, { status: 'completed' }).catch(() => {});
      }
      get().saveSession();
    }
  },

  reResearchCompany: async (companyName: string) => {
    const { icp, isResearching, candidates } = get();
    if (!icp || isResearching) return;

    set((state) => ({
      results: state.results.filter((r) => r.company_name !== companyName),
      isResearching: true,
      statusMessage: '',
      researchingCompany: null,
      error: null
    }));

    const candidateData = candidates.filter((c) => c.name === companyName);

    try {
      await researchCompanies(
        icp,
        [companyName],
        (event) => {
          switch (event.type) {
            case 'status': {
              set({ statusMessage: event.message });
              const match = event.message.match(/^Researching (.+?) \(/);
              if (match) set({ researchingCompany: match[1] });
              break;
            }
            case 'company':
              set((state) => ({
                results: [...state.results, event.data],
                researchingCompany: null
              }));
              get().saveSession();
              break;
            case 'done':
              set({ statusMessage: 'Re-research complete.', researchingCompany: null });
              break;
          }
        },
        undefined,
        candidateData
      );
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      set({ error: err instanceof Error ? err.message : 'Re-research failed' });
    } finally {
      set({ isResearching: false, researchingCompany: null });
      get().saveSession();
    }
  },

  searchPeopleAction: async () => {
    const { icp, candidates, selectedCompanies } = get();
    if (!icp) return;

    const selectedSet = new Set(selectedCompanies);
    const companiesWithOrgIds = candidates
      .filter((c) => selectedSet.has(c.name) && c.apollo_org_id)
      .map((c) => ({ name: c.name, apollo_org_id: c.apollo_org_id! }));

    const existingPeople = get().peopleResults;
    const newCompaniesWithOrgIds = companiesWithOrgIds.filter((c) => !existingPeople[c.name]);

    if (newCompaniesWithOrgIds.length === 0) return;

    set({ isPeopleSearching: true });

    try {
      const orgIds = newCompaniesWithOrgIds.map((c) => c.apollo_org_id);
      const results = await searchPeople(orgIds, icp, newCompaniesWithOrgIds);

      const newPeopleResults = Object.fromEntries(
        results.map((r) => [r.company_name, r.ranked_people])
      );
      const newAllPeopleResults = Object.fromEntries(
        results.map((r) => [r.company_name, r.all_people])
      );
      set((state) => ({
        peopleResults: { ...state.peopleResults, ...newPeopleResults },
        allPeopleResults: { ...state.allPeopleResults, ...newAllPeopleResults },
        isPeopleSearching: false
      }));
      get().saveSession();
    } catch (err) {
      console.error('People search failed:', err);
      set({ isPeopleSearching: false });
    }
  },

  enrichPersonAction: async (personId: string, companyName: string) => {
    const { enrichingPersonIds, peopleResults } = get();
    if (enrichingPersonIds.includes(personId)) return;

    // Skip API call if already enriched (saves Apollo credits)
    const existingPerson =
      peopleResults[companyName]?.find((p) => p.apollo_person_id === personId) ??
      get().allPeopleResults[companyName]?.find((p) => p.apollo_person_id === personId);
    if (existingPerson?.is_enriched) return;

    set({ enrichingPersonIds: [...enrichingPersonIds, personId] });

    try {
      const enriched = await enrichPerson(personId);

      set((state) => {
        const enrichData = {
          last_name: enriched.last_name,
          email: enriched.email ?? undefined,
          phone: enriched.phone ?? undefined,
          linkedin_url: enriched.linkedin_url ?? undefined,
          is_enriched: true as const
        };
        const applyEnrich = (p: ApolloPersonPreview) =>
          p.apollo_person_id === personId ? { ...p, ...enrichData } : p;

        const rankedPeople = (state.peopleResults[companyName] ?? []).map(applyEnrich);
        const allPeople = (state.allPeopleResults[companyName] ?? []).map(applyEnrich);

        // If enriched person isn't in rankedPeople (e.g. from contacts modal), append them
        const inRanked = rankedPeople.some((p) => p.apollo_person_id === personId);
        const enrichedPerson = allPeople.find((p) => p.apollo_person_id === personId);
        const finalRanked =
          !inRanked && enrichedPerson ? [...rankedPeople, enrichedPerson] : rankedPeople;

        return {
          peopleResults: { ...state.peopleResults, [companyName]: finalRanked },
          allPeopleResults: { ...state.allPeopleResults, [companyName]: allPeople },
          enrichingPersonIds: state.enrichingPersonIds.filter((id) => id !== personId)
        };
      });
      toast.success('Contact unlocked');
      get().saveSession();
    } catch (err) {
      console.error('Person enrichment failed:', err);
      toast.error('Failed to unlock contact');
      set((state) => ({
        enrichingPersonIds: state.enrichingPersonIds.filter((id) => id !== personId)
      }));
    }
  },

  setError: (error) => set({ error }),

  startOver: () =>
    set({
      step: 'input',
      icp: null,
      strategyMessages: [],
      isStrategizing: false,
      candidates: [],
      selectedCompanies: [],
      results: [],
      researchingCompany: null,
      peopleResults: {},
      allPeopleResults: {},
      isPeopleSearching: false,
      enrichingPersonIds: [],
      error: null,
      statusMessage: '',
      emailSequences: {},
      sessionId: null,
      sessionName: 'Untitled Session',
      isSaving: false,
      lastSavedAt: null
    }),

  skipToReview: () => {
    const { icp } = get();
    if (!icp) set({ icp: { ...EMPTY_ICP } });
    set({ step: 'review', strategyMessages: [] });
  },

  saveEmailSequence: (companyName, contactEmail, sequence) => {
    const key = `${companyName}::${contactEmail}`;
    set((state) => ({
      emailSequences: { ...state.emailSequences, [key]: sequence }
    }));
    get().saveSession();
  },

  getEmailSequence: (companyName, contactEmail) => {
    const key = `${companyName}::${contactEmail}`;
    return get().emailSequences[key] ?? null;
  },

  saveSession: async () => {
    const {
      sessionId,
      isSaving,
      transcript,
      step,
      icp,
      strategyMessages,
      candidates,
      selectedCompanies,
      results,
      peopleResults,
      emailSequences,
      sessionName
    } = get();
    if (!sessionId || isSaving) return;

    set({ isSaving: true });
    try {
      await updateSession(sessionId, {
        name: sessionName,
        transcript,
        step,
        icp,
        strategy_messages: strategyMessages,
        candidates,
        selected_companies: selectedCompanies,
        results,
        people_results: peopleResults,
        email_sequences: emailSequences
      });
      set({ lastSavedAt: new Date().toISOString() });
    } catch (err) {
      console.error('Failed to save session:', err);
    } finally {
      set({ isSaving: false });
    }
  },

  setSessionName: (name: string) => set({ sessionName: name }),

  loadContactedCompanies: async () => {
    try {
      const contacts = await listContactedCompanies();
      const map = new Map<string, string[]>();
      for (const c of contacts) {
        const existing = map.get(c.company_name) ?? [];
        existing.push(c.contact_email);
        map.set(c.company_name, existing);
      }
      set({ contactedCompanies: map });
    } catch (err) {
      console.error('Failed to load contacted companies:', err);
    }
  },

  getContactedEmails: (companyName: string) => {
    return get().contactedCompanies.get(companyName) ?? [];
  },

  loadPreviouslyResearched: async () => {
    try {
      const { sessionId } = get();
      const companies = await listResearchedCompanies(sessionId ?? undefined);
      set({ previouslyResearched: new Set(companies) });
    } catch (err) {
      console.error('Failed to load previously researched:', err);
    }
  }
}));
