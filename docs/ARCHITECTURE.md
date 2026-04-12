# Architecture

4-step pipeline. Supabase for persistence (sessions, ICPs, contact tracking). Zustand for in-memory state, hydrated from server on load. No background jobs — real-time SSE streaming.

## Layers

```
/app                         Routing shell only (server-only)
├── (marketing)/             Public pages (landing, about, legal)
│   ├── page.tsx             Landing
│   ├── about/               About page
│   ├── privacy/             Privacy policy
│   └── terms/               Terms of service
├── (platform)/              Authenticated app (sidebar layout)
│   ├── research/            Sessions list (server-fetched)
│   │   └── [id]/            Session dashboard (server-fetched, hydrated to client)
│   ├── emails/              Sent emails history
│   ├── profiles/            Saved ICP profiles page
│   └── settings/            Settings page (Gmail OAuth redirect target)
├── auth/callback/           Supabase auth callback
└── api/                     API routes (SSE, REST)
    ├── icps/                Saved ICP CRUD + parse
    ├── sessions/            Session CRUD + auto-save + researched companies
    ├── signatures/          Email signature CRUD
    ├── contacts/            Contacted companies tracking
    ├── emails/              Generate + send emails
    ├── gmail/               OAuth authorize, callback, disconnect, status
    ├── people/              Apollo people search + enrich + bulk
    ├── profile/             User profile CRUD
    ├── research/            Research pipeline (SSE streaming)
    └── strategy/            AI outreach strategy generation

/components                  UI layer (feature-organized)
├── research/                Pipeline UI (steps 1-4), dashboard, sessions
├── emails/                  Sent emails page + detail view
├── settings/                Settings tabs + profile modal
├── auth/                    Login/signup modals + auth provider
├── landing/                 Marketing components (showcase, pricing, etc.)
├── shared/                  Cross-feature components (company-logo, page-banner)
└── ui/                      shadcn/ui primitives

/lib                         Core logic + state + data access
├── api/                     Client-side fetch wrappers (see below)
├── services/                Business logic organized by domain (see below)
├── store/                   Zustand state management
├── supabase/                Auth clients + queries/ (organized by domain)
├── theme/                   Theme + font system
├── types.ts                 All TypeScript interfaces
└── validation.ts            Zod schemas + route helpers

/tests                       Mirrors source structure
├── helpers.ts               Shared mock factories (auth, supabase, fixtures)
├── lib/                     Unit tests for lib/
│   ├── validation.test.ts
│   └── services/            Service domain tests
└── app/api/                 Route contract tests (auth, validation, error shape)
```

## Dependencies

```
/app → /components → /lib → external APIs
                  → /styles (CSS only)
```

## Three-Layer Backend

Each API request flows through three layers:

```
Route handler          HTTP concerns only: auth, validation, response formatting
       ↓
Service                Business logic: orchestration, side effects, AI calls
       ↓
Query / External API   Data access: Supabase queries, Apollo, Gmail
```

Routes never contain business logic. Services never return HTTP responses.

## Services (`lib/services/`)

Organized by domain. Each folder groups related business logic, prompts, and external API wrappers:

```
services/
├── anthropic.ts              Shared Anthropic client factory
├── config.ts                 Tunable constants (models, limits, thresholds)
├── interfaces.ts             Swappable service contracts
│
├── research/                 Company discovery pipeline
│   ├── pipeline.ts           Orchestrator (discoverCompanies, researchConfirmedCompanies)
│   ├── discovery.ts          Apollo organization search
│   ├── scoring.ts            Claude ICP scoring (prompt colocated)
│   └── research-agent.ts     Claude deep research with web search (prompt colocated)
│
├── people/                   Contact finding
│   ├── apollo.ts             Apollo people search + person enrichment
│   ├── ranking.ts            Claude people ranking by ICP fit (prompt colocated)
│   └── search.ts             Orchestrator: search → rank → auto-enrich top contact
│
├── email/                    Email generation + sending
│   ├── generation.ts         Claude email sequence streaming (prompt colocated)
│   └── sending.ts            Gmail send + audit trail (success/failure) + contact upsert
│
├── gmail/                    Gmail OAuth + transport
│   └── client.ts             OAuth flow, token refresh, MIME construction, send
│
├── icp/                      ICP parsing
│   └── parser.ts             Claude natural language → ICPCriteria (prompt colocated)
│
└── strategy/                 Strategy analysis
    └── stream.ts             Claude strategy streaming with web search (prompt colocated)
```

Four swappable interfaces in `interfaces.ts`:

```
ICPParser          → claudeICPParser (icp/parser.ts)
CompanyDiscovery   → apolloCompanyDiscovery (research/discovery.ts)
CompanyScorer      → claudeCompanyScorer (research/scoring.ts)
CompanyResearcher  → claudeResearchAgent (research/research-agent.ts)
```

## Client-Side API Layer (`lib/api/`)

Frontend fetch wrappers that components and Zustand stores use to call API routes. Handles JSON serialization, SSE streaming, and error handling. Components never call `fetch()` directly.

```
api/
├── client.ts          Shared utilities: postJson(), readSSEStream(), ApiError class
├── research.ts        discoverCompanies, researchCompanies, parseICP, searchPeople, enrichPerson
├── emails.ts          streamEmailSequence, sendEmail
├── gmail.ts           getGmailStatus, connectGmail, disconnectGmail
├── strategy.ts        streamStrategy
├── sessions.ts        Session CRUD + listResearchedCompanies
├── icps.ts            ICP CRUD
├── signatures.ts      Signature CRUD
├── contacts.ts        listContactedCompanies
└── index.ts           Barrel re-export (all FE consumers import from @/lib/api)
```

## API Error Shape

All API routes return errors in a consistent format:

```json
{ "error": { "code": "ERROR_CODE", "message": "Human-readable message" } }
```

Error codes: `UNAUTHORIZED` (401), `VALIDATION_ERROR` (400), `NOT_FOUND` (404), `SERVICE_UNAVAILABLE` (500), `SEND_FAILED` (500), `INTERNAL_ERROR` (500).

## Data Flow

```
User transcript
  → POST /api/icps/parse → Claude Haiku → ICPCriteria
    → POST /api/research (phase 1) → Apollo → Claude scoring → candidates[]
      → User confirms
        → POST /api/research (phase 2) → SSE stream:
            ├── Claude + web_search × 2/company → CompanyResult
            └── POST /api/people/search → Apollo People → Claude ranking → top 3
              → "Get Contact" → POST /api/people/enrich → 1 Apollo credit → full details
```

## External APIs

```
Claude Haiku             ICP parsing, scoring, research, ranking   ~$0.03/company
Apollo Organizations     Company discovery                         Free tier
Apollo People Search     Contact search (obfuscated)               Free
Apollo People Match      Contact enrichment                        1 credit/person
Supabase                 Auth + sessions + ICPs + contacts + emails + signatures Free tier
Gmail API                Email sending via OAuth (gmail.send)       Free
```
