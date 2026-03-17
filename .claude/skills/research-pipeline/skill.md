# Research Pipeline — Architecture & Implementation Guide

## Pipeline Overview

The research pipeline takes an ICP (Ideal Customer Profile) and produces structured company research with signals, contacts, and personalized outreach hooks. It streams results to the UI via Server-Sent Events (SSE) as each company completes. There is **no database persistence** — all state lives in a Zustand store (browser memory).

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
    → Apollo Organizations Search (broad company discovery)
      → Claude Haiku (score + rank companies 1-10 against ICP)
        → User confirms company selection
          → Claude Haiku + web_search × N sequential (deep research per company)
            → Stream each CompanyResult to UI via SSE
```

## Four Service Interfaces

Defined in `lib/services/interfaces.ts` — all swappable:

1. **ICPParser** — Parses natural language into structured ICP criteria
   - Implementation: `claudeICPParser` in `lib/services/ai.ts`

2. **CompanyDiscovery** — Finds companies matching an ICP
   - Primary: `apolloCompanyDiscovery` in `lib/services/apollo.ts`
   - Alternative: `parallelCompanyDiscovery` in `lib/services/parallel.ts` (not active)

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
├── scoring.ts         # claudeCompanyScorer (Claude Haiku scores 1-10)
├── research-agent.ts  # claudeResearchAgent (Claude Haiku + web_search tool)
├── parallel.ts        # parallelCompanyDiscovery (inactive alternative)
└── config.ts          # All tunable parameters

lib/prompts/
├── parse-icp.ts       # ICP extraction prompt
└── research-agent.ts  # Research agent prompt (2-search strategy)

lib/store/
└── research-store.ts  # Zustand store — all pipeline state + actions

lib/api.ts             # Client-side fetch wrappers (parseICP, discoverCompanies, researchCompanies)
lib/types.ts           # ICPCriteria, CompanyResult, CompanySignal, TargetContact, etc.

app/api/parse-icp/
└── route.ts           # POST endpoint — ICP parsing

app/api/research/
└── route.ts           # POST endpoint — SSE stream for discovery + research phases

components/research/
├── research-dashboard.client.tsx  # Main orchestrator (keyboard shortcuts, step routing)
├── transcript-step.tsx            # Step 1: textarea input
├── review-step.tsx                # Step 2: ICP review/edit + AI regeneration
├── confirm-step.tsx               # Step 3: company checkbox list
├── results-step.tsx               # Step 4: results grid
├── company-card.tsx               # Grid row (company, contacts, signals, overview)
├── email-editor-panel.client.tsx  # Slide-out email composer
├── bottom-nav.tsx                 # Step progression + action buttons
├── signal-badge.tsx               # Signal type badge (job_posting, funding, news, etc.)
├── tag-editor.tsx                 # Tag input/edit component
└── copy-button.client.tsx         # Copy-to-clipboard
```

## Configuration

All tunable parameters in `lib/services/config.ts`:

| Parameter               | Value                       | Purpose                                      |
| ----------------------- | --------------------------- | -------------------------------------------- |
| `fastModel`             | `claude-haiku-4-5-20251001` | ICP parsing + scoring (lightweight)          |
| `researchModel`         | `claude-haiku-4-5-20251001` | Per-company research with web search         |
| `maxSearchesPerCompany` | 2                           | Cap on web searches per research agent call  |
| `researchMaxTokens`     | 4096                        | Max output tokens for research               |
| `parseMaxTokens`        | 1024                        | Max output tokens for ICP parsing            |
| `scoringMaxTokens`      | 2048                        | Max output tokens for company scoring        |
| `scoringMinScore`       | 5                           | Minimum score (1-10) to include a company    |
| `apolloPerPage`         | 25                          | Companies per Apollo API request             |
| `apolloBaseUrl`         | `https://api.apollo.io/...` | Apollo API base URL                          |

## Apollo Integration (Primary Discovery)

**File**: `lib/services/apollo.ts`

Apollo Organizations Search is the primary company discovery method. The strategy is: **broad Apollo search, Claude scoring narrows**.

### How Apollo Query is Built from ICP

| ICP Field            | Apollo Parameter                         | Notes                                        |
| -------------------- | ---------------------------------------- | -------------------------------------------- |
| `industry_keywords`  | `q_organization_keyword_tags`            | Tags matching what a company does            |
| Employee range       | `organization_num_employees_ranges`      | Mapped to Apollo's predefined ranges         |
| `hiring_signals`     | `q_organization_job_titles`              | Active job postings filter                   |
| `funding_stages`     | `organization_latest_funding_stage_cd`   | Apollo funding stage codes                   |
| `min_funding_amount` | `latest_funding_amount_range[min]`       | Minimum funding threshold                    |

### Apollo Response → DiscoveredCompany

Each Apollo org is transformed into a `DiscoveredCompany` with:
- `name`, `website`, `description`, `linkedin_url`, `logo_url`
- `match_context`: JSON string of Apollo metadata (employee count, keywords, funding, departments)

### Environment Variable
- `APOLLO_API_KEY` — required for discovery

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
  email_hook: string,             // Cold email opener referencing signal
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

- Contacts are **inferred by Claude** from research data (press releases, articles)
- Server-side filtering: must have real first+last name (2+ parts), not just titles
- LinkedIn search URLs generated per person (name + company)
- Emails inferred from domain patterns (first@domain.com, first.last@domain.com)

## API Routes

### POST `/api/parse-icp`
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

### SSE Event Types

```typescript
type ResearchStreamEvent =
  | { type: 'status'; message: string }
  | { type: 'icp'; data: ICPCriteria }
  | { type: 'candidates'; data: DiscoveredCompanyPreview[] }
  | { type: 'company'; data: CompanyResult }
  | { type: 'done'; total: number }
  | { type: 'error'; message: string }
```

## State Management (Zustand)

**File**: `lib/store/research-store.ts`

### Key State

| Field               | Type                        | Step    |
| ------------------- | --------------------------- | ------- |
| `step`              | `input/review/confirm/results` | Nav  |
| `transcript`        | `string`                    | Step 1  |
| `icp`               | `ICPCriteria \| null`       | Step 2  |
| `candidates`        | `DiscoveredCompanyPreview[]`| Step 3  |
| `selectedCompanies` | `string[]`                  | Step 3  |
| `results`           | `CompanyResult[]`           | Step 4  |
| `isExtracting`      | `boolean`                   | Loading |
| `isDiscovering`     | `boolean`                   | Loading |
| `isResearching`     | `boolean`                   | Loading |
| `abortController`   | `AbortController \| null`   | Cancel  |

### Key Actions
- `extractICP()` → POST `/api/parse-icp` → sets ICP, advances to review
- `discover()` → POST `/api/research` (phase 1) → sets candidates, advances to confirm
- `research()` → POST `/api/research` (phase 2) → streams results, advances to results
- `startOver()` → resets everything to step 1
- `toggleCompany()`, `selectAll()`, `deselectAll()` → company selection

## Core Types

**File**: `lib/types.ts`

### ICPCriteria
```typescript
{
  description: string
  industry_keywords: string[]
  min_employees: number | null
  max_employees: number | null
  min_funding_amount: number | null
  funding_stages: string[]          // ["Series A", "Series B", ...]
  hiring_signals: string[]          // ["SDR", "BDR", "Account Executive", ...]
  tech_keywords: string[]
  company_examples: string[]
}
```

### CompanySignal
```typescript
{
  type: 'job_posting' | 'news' | 'funding' | 'product_launch' | 'other'
  title: string
  key_phrases: string[]
  source_url?: string
}
```

### TargetContact
```typescript
{
  name: string
  title: string
  linkedin_url: string
  email: string | null
  is_decision_maker: boolean
}
```

## Environment Variables

| Variable           | Required | Purpose                          |
| ------------------ | -------- | -------------------------------- |
| `ANTHROPIC_API_KEY`| Yes      | All Claude AI tasks              |
| `APOLLO_API_KEY`   | Yes      | Apollo company discovery         |
| `PARALLEL_API_KEY` | No       | Alternative discovery (inactive) |

## Cost Breakdown (Current)

| Step              | Provider                   | Cost per request             |
| ----------------- | -------------------------- | ---------------------------- |
| ICP parsing       | Claude Haiku               | ~$0.001                      |
| Apollo discovery  | Apollo Organizations API   | Free tier / per-credit       |
| Company scoring   | Claude Haiku               | ~$0.005                      |
| Research × N      | Claude Haiku + web_search  | ~$0.03/company               |
| **Total (5 co.)** |                            | **~$0.16/request**           |

## Cost Optimization History

1. **Sonnet → Haiku for everything** — 20x cheaper, minimal quality loss for structured tasks
2. **Parallel FindAll → Apollo Organizations Search** — Apollo is the primary discovery now
3. **Added Claude scoring step** — broad Apollo search + Claude scoring handles nuance better than narrow API filters
4. **Parallel Search API → Claude web_search tool** — Claude decides what to search, iterates, follows threads — much better quality
5. **Apollo contact enrichment → Claude-inferred contacts** — Avoids $60/month Apollo People API subscription
6. **Max searches reduced to 2 per company** — Sufficient for funding + jobs/news coverage
7. **Sequential per-company research** — Enables streaming UX (results appear one at a time)

## Architecture Notes

- **No database/Supabase** — All in-memory via Zustand (MVP)
- **No Inngest/background jobs** — Pipeline is real-time streaming
- **No `'use client'` in /app** — All interactivity in `components/research/*.client.tsx`
- **SSE streaming** — Client gets real-time status + partial results
- **Abort support** — Research can be cancelled via AbortController
- **Keyboard shortcuts** — Cmd+Enter / Ctrl+Enter advances steps
