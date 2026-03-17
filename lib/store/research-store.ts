import { create } from 'zustand';
import { parseICP, discoverCompanies, researchCompanies } from '@/lib/api';
import type {
  ICPCriteria,
  CompanyResult,
  ComposeEmailParams,
  DiscoveredCompanyPreview
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
  company_examples: []
};

interface ResearchState {
  // Navigation
  step: Step;

  // Step 1: Transcript
  transcript: string;
  isExtracting: boolean;

  // Step 2: ICP
  icp: ICPCriteria | null;

  // Step 3: Discovery
  isDiscovering: boolean;
  candidates: DiscoveredCompanyPreview[];
  selectedCompanies: string[];

  // Step 4: Research
  isResearching: boolean;
  results: CompanyResult[];
  researchingCompany: string | null;

  // Shared
  statusMessage: string;
  error: string | null;

  // Email composer
  composeParams: ComposeEmailParams | null;

  // Abort controller (not serializable, but fine for zustand)
  abortController: AbortController | null;
}

interface ResearchActions {
  // Navigation
  setStep: (step: Step) => void;

  // Step 1
  setTranscript: (transcript: string) => void;
  extractICP: () => Promise<void>;

  // Step 2
  setIcp: (icp: ICPCriteria) => void;

  // Step 3
  discover: () => Promise<void>;
  setSelectedCompanies: (companies: string[]) => void;
  toggleCompany: (name: string) => void;
  selectAll: () => void;
  deselectAll: () => void;

  // Step 4
  research: () => Promise<void>;

  // Shared
  setError: (error: string | null) => void;
  startOver: () => void;
  skipToReview: () => void;

  // Email
  setComposeParams: (params: ComposeEmailParams | null) => void;

  // Derived getters
  selectedCandidates: () => DiscoveredCompanyPreview[];
}

export type ResearchStore = ResearchState & ResearchActions;

export const useResearchStore = create<ResearchStore>((set, get) => ({
  // Initial state
  step: 'input',
  transcript: '',
  isExtracting: false,
  icp: null,
  isDiscovering: false,
  candidates: [],
  selectedCompanies: [],
  isResearching: false,
  results: [],
  researchingCompany: null,
  statusMessage: '',
  error: null,
  composeParams: null,
  abortController: null,

  // Navigation
  setStep: (step) => set({ step }),

  // Step 1: Transcript
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
        isExtracting: false
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to extract ICP',
        isExtracting: false
      });
    }
  },

  // Step 2: ICP
  setIcp: (icp) => set({ icp }),

  // Step 3: Discovery
  discover: async () => {
    const { icp, isDiscovering } = get();
    if (!icp || isDiscovering) return;

    set({
      isDiscovering: true,
      statusMessage: '',
      candidates: [],
      selectedCompanies: [],
      error: null,
      step: 'confirm'
    });

    try {
      const found = await discoverCompanies(icp, (event) => {
        if (event.type === 'status') {
          set({ statusMessage: event.message });
        }
      });
      set({
        candidates: found,
        selectedCompanies: found.map((c) => c.name),
        isDiscovering: false
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Discovery failed',
        isDiscovering: false
      });
    }
  },

  setSelectedCompanies: (companies) => set({ selectedCompanies: companies }),

  toggleCompany: (name) => {
    const { selectedCompanies } = get();
    const selected = new Set(selectedCompanies);
    if (selected.has(name)) {
      selected.delete(name);
    } else {
      selected.add(name);
    }
    set({ selectedCompanies: [...selected] });
  },

  selectAll: () => {
    const { candidates } = get();
    set({ selectedCompanies: candidates.map((c) => c.name) });
  },

  deselectAll: () => set({ selectedCompanies: [] }),

  // Step 4: Research
  research: async () => {
    const { icp, isResearching, selectedCompanies, candidates } = get();
    if (!icp || isResearching || selectedCompanies.length === 0) return;

    const abortController = new AbortController();

    set({
      isResearching: true,
      statusMessage: '',
      results: [],
      researchingCompany: null,
      error: null,
      step: 'results',
      abortController
    });

    try {
      await researchCompanies(
        icp,
        selectedCompanies,
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
              break;
            case 'done':
              set({
                statusMessage: `Research complete. Found ${event.total} companies.`,
                researchingCompany: null
              });
              break;
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
    }
  },

  // Shared
  setError: (error) => set({ error }),

  startOver: () =>
    set({
      step: 'input',
      icp: null,
      candidates: [],
      selectedCompanies: [],
      results: [],
      researchingCompany: null,
      error: null,
      statusMessage: '',
      composeParams: null
    }),

  skipToReview: () => {
    const { icp } = get();
    if (!icp) set({ icp: { ...EMPTY_ICP } });
    set({ step: 'review' });
  },

  // Email
  setComposeParams: (params) => set({ composeParams: params }),

  // Derived
  selectedCandidates: () => {
    const { candidates, selectedCompanies } = get();
    const selectedSet = new Set(selectedCompanies);
    return candidates.filter((c) => selectedSet.has(c.name));
  }
}));
