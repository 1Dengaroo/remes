# Architecture

4-step pipeline. Supabase for persistence (sessions, ICPs, contact tracking). Zustand for in-memory state, hydrated from server on load. No background jobs — real-time SSE streaming.

## Layers

```
/app                         Routing shell only (server-only)
├── (marketing)/             Public pages (landing, about, pricing, legal)
│   ├── page.tsx             Landing
│   ├── about/               About page
│   ├── pricing/             Pricing page
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

/lib                         Core business logic
├── api/                     Client-side fetch wrappers (modular)
├── services/                Pipeline services (swappable) + config
├── prompts/                 Claude prompt templates
├── store/                   Zustand state management
├── supabase/                Auth clients + queries/ (organized by domain)
└── theme/                   Theme + font system

/styles                      Visual layer
├── globals.css              Tailwind bridge + base
└── themes/                  Per-theme token files
```

## Dependencies

```
/app → /components → /lib → external APIs
                  → /styles (CSS only)
```

## Services

Four swappable interfaces in `lib/services/interfaces.ts`:

```
ICPParser          → claudeICPParser (ai.ts)
CompanyDiscovery   → apolloCompanyDiscovery (apollo.ts)
CompanyScorer      → claudeCompanyScorer (scoring.ts)
CompanyResearcher  → claudeResearchAgent (research-agent.ts)
```

Orchestrator: `lib/services/pipeline.ts`

- `discoverCompanies()` — Apollo search → Claude scoring
- `researchConfirmedCompanies()` — Claude research per company (sequential for streaming)
- People search in parallel via `apollo-people.ts` + `people-ranking.ts`

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
