# Research Pipeline

## Pipeline Overview

The research pipeline takes an ICP (Ideal Customer Profile) and produces structured company research with signals, contacts, and personalized outreach hooks. It streams results to the UI via Server-Sent Events (SSE) as each company completes. State is persisted to Supabase (sessions, ICPs, contacts) and hydrated into a Zustand store on load.

### 4-Step User Flow

```
STEP 1: TRANSCRIPT INPUT → User describes their ideal customer
STEP 2: ICP REVIEW       → AI extracts structured ICP, user edits
STEP 3: COMPANY DISCOVERY → Apollo finds companies, Claude scores them, user confirms
STEP 4: DEEP RESEARCH    → Claude researches each company with web search, streams results
```

### Pipeline Sequence

```
User Input (transcript)
  → Claude Haiku (ICP extraction)
    → Apollo Organizations Search (broad company discovery, returns apollo_org_id per company)
      → Claude Haiku (score + rank companies 1-10 against ICP)
        → User confirms company selection
          → IN PARALLEL:
            ├── Stream A: Claude Haiku + web_search x N (deep research per company → SSE)
            └── Stream B: Apollo People Search → Claude Haiku ranking → top 3 people per company
          → On "Get Contact" click: Apollo People Match (1 credit) → full name, email, phone, LinkedIn
```

## Four Service Interfaces

Defined in `lib/services/interfaces.ts` — all swappable:

1. **ICPParser** — Parses natural language into structured ICP criteria
   - Implementation: `claudeICPParser` in `lib/services/ai.ts`

2. **CompanyDiscovery** — Finds companies matching an ICP
   - Implementation: `apolloCompanyDiscovery` in `lib/services/apollo.ts`

3. **CompanyScorer** — Scores and ranks discovered companies against ICP
   - Implementation: `claudeCompanyScorer` in `lib/services/scoring.ts`

4. **CompanyResearcher** — Deep-researches a single company
   - Implementation: `claudeResearchAgent` in `lib/services/research-agent.ts`

To swap a provider, implement the interface and pass it via the config object to `discoverCompanies()` or `researchConfirmedCompanies()` in `lib/services/pipeline.ts`.

## Key Files

```
lib/services/
├── interfaces.ts      # ICPParser, CompanyDiscovery, CompanyScorer, CompanyResearcher
├── config.ts          # Models, limits, tuning params — one file to tune
├── pipeline.ts        # Orchestrator — two phases: discoverCompanies() + researchConfirmedCompanies()
├── ai.ts              # claudeICPParser (Claude Haiku)
├── apollo.ts          # apolloCompanyDiscovery (Apollo Organizations Search)
├── apollo-people.ts   # apolloPeopleSearch() + apolloPersonEnrich() (Apollo People API)
├── people-ranking.ts  # rankPeopleForCompany() (Claude Haiku ranks top 3 by ICP fit)
├── scoring.ts         # claudeCompanyScorer (Claude Haiku scores 1-10)
└── research-agent.ts  # claudeResearchAgent (Claude Haiku + web_search tool)

lib/prompts/
├── parse-icp.ts              # ICP extraction prompt
├── research-agent-prompt.ts  # Research agent prompt (2-search strategy)
├── email-generation.ts       # Email sequence generation prompt
└── strategy.ts               # Strategy analysis prompt

lib/store/
└── research-store.ts  # Zustand store — all pipeline state + actions + session persistence

lib/api.ts             # Client-side fetch wrappers
lib/types.ts           # ICPCriteria, CompanyResult, CompanySignal, TargetContact, etc.

app/api/icps/parse/
└── route.ts           # POST endpoint — ICP parsing

app/api/research/
└── route.ts           # POST endpoint — SSE stream for discovery + research phases

app/api/people/search/
└── route.ts           # POST endpoint — Apollo people search + Claude ranking

app/api/people/enrich/
└── route.ts           # POST endpoint — Apollo person enrichment (1 credit)

components/research/
├── research-hub.client.tsx          # Sessions list page
├── research-dashboard.client.tsx    # Main orchestrator (keyboard shortcuts, step routing)
├── transcript-step.tsx              # Step 1: textarea input
├── icp-panel-editable.tsx           # Step 2: ICP review/edit
├── strategy-step.tsx                # Strategy analysis panel
├── strategy-chat.client.tsx         # Strategy conversation UI
├── confirm-step.tsx                 # Step 3: company checkbox list
├── results-step.tsx                 # Step 4: results grid
├── company-card.tsx                 # Grid row (company, contacts, signals, overview)
├── contact-screen.client.tsx        # Contact panel for a company
├── contact-list.client.tsx          # People list with enrichment
├── email-editor-inline.client.tsx   # Inline email composer
├── email-editor-dialog.client.tsx   # Dialog email composer
├── sessions-list.client.tsx         # Sessions CRUD list
├── icp-list.client.tsx              # Saved ICP library
├── loading-status.tsx               # Pipeline loading indicator
├── bottom-nav.tsx                   # Step progression + action buttons
├── signal-badge.tsx                 # Signal type badge
└── copy-button.client.tsx           # Copy-to-clipboard
```

## Configuration

All tunable parameters in `lib/services/config.ts`:

| Parameter                | Value                       | Purpose                                      |
| ------------------------ | --------------------------- | -------------------------------------------- |
| `fastModel`              | `claude-haiku-4-5-20251001` | ICP parsing + scoring (lightweight)          |
| `researchModel`          | `claude-haiku-4-5-20251001` | Per-company research with web search         |
| `emailModel`             | `claude-haiku-4-5-20251001` | Email sequence generation                    |
| `maxSearchesPerCompany`  | 2                           | Cap on web searches per research agent call  |
| `researchMaxTokens`      | 2048                        | Max output tokens for research               |
| `parseMaxTokens`         | 1024                        | Max output tokens for ICP parsing            |
| `scoringMaxTokens`       | 2048                        | Max output tokens for company scoring        |
| `emailMaxTokens`         | 2048                        | Max output tokens for email generation       |
| `scoringMinScore`        | 5                           | Minimum score (1-10) to include a company    |
| `apolloPerPage`          | 100                         | Companies per Apollo API request             |
| `apolloPagesPerStrategy` | 1                           | Pages to fetch per search strategy           |
| `apolloMaxCandidates`    | 75                          | Max companies to pass to scoring after dedup |
| `apolloBaseUrl`          | `https://api.apollo.io/...` | Apollo API base URL                          |

## Apollo Integration (Primary Discovery)

**File**: `lib/services/apollo.ts`

Apollo Organizations Search is the primary company discovery method. The strategy is: **broad Apollo search, Claude scoring narrows**.

### How Apollo Query is Built from ICP

| ICP Field            | Apollo Parameter                       | Notes                                |
| -------------------- | -------------------------------------- | ------------------------------------ |
| `industry_keywords`  | `q_organization_keyword_tags`          | Tags matching what a company does    |
| Employee range       | `organization_num_employees_ranges`    | Mapped to Apollo's predefined ranges |
| `hiring_signals`     | `q_organization_job_titles`            | Active job postings filter           |
| `funding_stages`     | `organization_latest_funding_stage_cd` | Apollo funding stage codes           |
| `min_funding_amount` | `latest_funding_amount_range[min]`     | Minimum funding threshold            |

### Apollo Response → DiscoveredCompany

Each Apollo org is transformed into a `DiscoveredCompany` with:

- `name`, `website`, `description`, `linkedin_url`, `logo_url`
- `match_context`: JSON string of Apollo metadata (employee count, keywords, funding, departments)
- `apollo_org_id`: Apollo organization ID (threaded through to `DiscoveredCompanyPreview` for people search)

### Environment Variable

- `APOLLO_API_KEY` — required for discovery and people search

## Company Scoring (Claude)

**File**: `lib/services/scoring.ts`

After Apollo returns raw companies, Claude Haiku scores each 1-10 against ICP fit:

- **AUTO-REJECT (score 0)**: Recruiting agencies, staffing firms, headhunters
- **Minimum score**: 5 (configurable via `scoringMinScore`)
- **Output**: `[{"index": 0, "score": 8, "reason": "..."}]`
- **Fallback**: If scoring fails, returns all companies unsorted

## Research Agent (Claude + Web Search)

**File**: `lib/services/research-agent.ts`

For each confirmed company, Claude Haiku performs deep research:

- **Tool**: `web_search_20250305` (built-in Anthropic tool)
- **Max searches**: 2 per company
- **Strategy**: Search 1 for funding + overview, Search 2 for jobs + news
- **Processing**: Sequential (one company at a time for streaming UX)

### Output per Company (CompanyResearchResult)

```typescript
{
  website, linkedin_url,
  signals: CompanySignal[],       // job_posting, funding, news, product_launch, other
  match_reason: string,           // 1 sentence concrete fact
  company_overview: string,       // 2-3 sentences
  industry, funding_stage, amount_raised,
  inferred_contacts: [{name, title, email, is_decision_maker}],
  sources: {jobs: [], funding: [], news: []}
}
```

### URL Verification

Claude can hallucinate URLs. Defenses:

1. **Server-side verification** — Extract URLs from `web_search_tool_result` blocks. Strip any URL not in this verified set.
2. **Fallback links** — If a source category has no verified URLs, generate safe search URLs (LinkedIn Jobs, Crunchbase, Google News).
3. **Prompt instruction** — "ONLY use URLs from search results, set null if unsure."

### Contact Handling

Contacts are sourced from **Apollo People API**, not Claude inference. The research agent prompt returns `inferred_contacts: []` (empty) to save tokens.

## Apollo People Integration

**Files**: `lib/services/apollo-people.ts`, `lib/services/people-ranking.ts`

### People Search Flow (parallel with company research)

```
Step 4 starts → in parallel:
  ├── Company research (existing SSE stream)
  └── People search:
      candidates[selected].apollo_org_id
        → POST /api/people/search
          → apolloPeopleSearch(orgIds) — Apollo mixed_people/api_search endpoint
            → Groups people by organization name
          → rankPeopleForCompany(people, icp, companyName) — Claude Haiku picks top 3
        → Store in peopleResults[companyName]
```

### Person Enrichment Flow (on-demand, 1 Apollo credit)

```
User clicks "Get Contact"
  → POST /api/people/enrich { person_id }
    → apolloPersonEnrich(personId) — Apollo people/match endpoint
      → Returns: first_name, last_name, title, email, phone, linkedin_url
    → Updates person in peopleResults with is_enriched: true
```

### Apollo API Response Shapes

**mixed_people/api_search** returns obfuscated data:

- `first_name`, `last_name_obfuscated` (e.g. "Hu\*\*\*n")
- `has_email: boolean`, `has_direct_phone: "Yes" | "No"`
- `organization.name` (nested, not flat `organization_name`)
- No `email`, `phone_numbers`, or `linkedin_url` on this endpoint

**people/match** returns full data:

- `first_name`, `last_name`, `email`, `linkedin_url`
- Phone via `person.contact.phone_numbers[].raw_number` (nested under contact)

### Edge Cases

- Custom-added companies (no `apollo_org_id`): skip in people search, show "No contacts available"
- Empty people results: show "No contacts found"
- Enrichment failure: error logged, loading state cleared

## API Routes

### POST `/api/icps/parse`

- **Input**: `{ input: string }`
- **Output**: `{ icp: ICPCriteria }`
- Calls `claudeICPParser.parse()`

### POST `/api/research` (SSE Stream)

- **maxDuration**: 300s
- **Two phases based on request body**:

**Phase 1 — Discovery** (no `companies` in body):

- Input: `{ icp }`
- Calls `discoverCompanies()` → Apollo search → Claude scoring
- Streams: `status`, `candidates`, `done`

**Phase 2 — Research** (`companies` in body):

- Input: `{ icp, companies: string[], candidates? }`
- Calls `researchConfirmedCompanies()` → Claude research per company
- Streams: `status`, `company` (per result), `done`

### POST `/api/people/search`

- **Input**: `{ org_ids: string[], icp: ICPCriteria, companies: { name: string, apollo_org_id: string }[] }`
- **Output**: `{ results: PeopleSearchResult[] }`
- Calls `apolloPeopleSearch()` → groups by org name → `rankPeopleForCompany()` per company

### POST `/api/people/enrich`

- **Input**: `{ person_id: string }`
- **Output**: `{ person: { first_name, last_name, title, email, phone, linkedin_url } }`
- Calls `apolloPersonEnrich()` — costs 1 Apollo credit

### SSE Event Types

```typescript
type ResearchStreamEvent =
  | { type: 'status'; message: string }
  | { type: 'icp'; data: ICPCriteria }
  | { type: 'candidates'; data: DiscoveredCompanyPreview[] }
  | { type: 'company'; data: CompanyResult }
  | { type: 'done'; total: number }
  | { type: 'error'; message: string };
```

## State Management (Zustand)

**File**: `lib/store/research-store.ts`

### Key State

| Field                | Type                                    | Step    |
| -------------------- | --------------------------------------- | ------- |
| `step`               | `input/review/confirm/results`          | Nav     |
| `transcript`         | `string`                                | Step 1  |
| `icp`                | `ICPCriteria \| null`                   | Step 2  |
| `candidates`         | `DiscoveredCompanyPreview[]`            | Step 3  |
| `selectedCompanies`  | `string[]`                              | Step 3  |
| `results`            | `CompanyResult[]`                       | Step 4  |
| `isExtracting`       | `boolean`                               | Loading |
| `isDiscovering`      | `boolean`                               | Loading |
| `isResearching`      | `boolean`                               | Loading |
| `peopleResults`      | `Record<string, ApolloPersonPreview[]>` | Step 4  |
| `isPeopleSearching`  | `boolean`                               | Loading |
| `enrichingPersonIds` | `string[]`                              | Loading |
| `abortController`    | `AbortController \| null`               | Cancel  |

### Key Actions

- `extractICP()` → POST `/api/icps/parse` → sets ICP, advances to review
- `discover()` → POST `/api/research` (phase 1) → sets candidates, advances to confirm
- `research()` → POST `/api/research` (phase 2) → streams results + fires `searchPeopleAction()` in parallel
- `searchPeopleAction()` → POST `/api/people/search` → stores top 3 people per company
- `enrichPersonAction(personId, companyName)` → POST `/api/people/enrich` → updates person with full contact details
- `startOver()` → resets everything to step 1
- `toggleCompany()`, `selectAll()`, `deselectAll()` → company selection

## Environment Variables

| Variable            | Required | Purpose                  |
| ------------------- | -------- | ------------------------ |
| `ANTHROPIC_API_KEY` | Yes      | All Claude AI tasks      |
| `APOLLO_API_KEY`    | Yes      | Apollo company discovery |

## Cost Breakdown (Current)

| Step              | Provider                  | Cost per request                |
| ----------------- | ------------------------- | ------------------------------- |
| ICP parsing       | Claude Haiku              | ~$0.001                         |
| Apollo discovery  | Apollo Organizations API  | Free tier / per-credit          |
| Company scoring   | Claude Haiku              | ~$0.005                         |
| Research x N      | Claude Haiku + web_search | ~$0.03/company                  |
| People search     | Apollo mixed_people API   | Free (obfuscated data)          |
| People ranking    | Claude Haiku              | ~$0.001/company                 |
| Person enrich     | Apollo people/match       | 1 credit per person (on-demand) |
| **Total (5 co.)** |                           | **~$0.17/request** + credits    |

## Architecture Notes

- **Supabase persistence** — Sessions, ICPs, contacts, emails, signatures stored in Supabase with RLS
- **No background jobs** — Pipeline is real-time SSE streaming
- **No `'use client'` in /app** — All interactivity in `components/research/*.client.tsx`
- **SSE streaming** — Client gets real-time status + partial results
- **Abort support** — Research can be cancelled via AbortController
- **Keyboard shortcuts** — Cmd+Enter / Ctrl+Enter advances steps
