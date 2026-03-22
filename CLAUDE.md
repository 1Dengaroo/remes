# Remes

AI-powered outbound sales platform for SMBs. Monitors the web for buying signals, finds contacts, generates personalized outreach.

**Stack:** Next.js App Router · TypeScript · Tailwind · shadcn/ui · Supabase · Anthropic API · Apollo API

## Docs

```
CLAUDE.md                          ← You are here
docs/
├── ARCHITECTURE.md                ← Domain layers, data flow, service interfaces
├── PRODUCT.md                     ← User flows, business domain, current limitations
├── CONVENTIONS.md                 ← SSR boundary, TypeScript, Tailwind, component rules
├── CODE-CLEANUP.md                ← Post-iteration cleanup checklist
├── PERSISTENCE.md                 ← Sessions, ICPs, contact tracking, auto-save
├── EMAIL-WORKFLOW.md              ← Email generation, signatures, sending
├── RESEARCH-PIPELINE.md           ← Pipeline deep-dive: types, APIs, config, Apollo integration
└── THEME-FRAMEWORK.md             ← Token system, adding themes, font system
```

## Key Files

```
lib/types.ts                       ← All TypeScript interfaces
lib/services/config.ts             ← Models, limits, thresholds, constants (one file to tune)
lib/services/interfaces.ts         ← Swappable service contracts
lib/services/pipeline.ts           ← Pipeline orchestrator
lib/services/gmail.ts              ← Gmail OAuth + sending
lib/store/research-store.ts        ← Zustand store (all state + actions + session persistence)
lib/store/icp-store.ts             ← Saved ICP library state
lib/store/signature-store.ts       ← Email signature CRUD state
lib/store/profile-store.ts         ← Profile modal state
lib/store/auth-store.ts            ← Auth modal state + user object
lib/api.ts                         ← Client-side fetch wrappers
lib/validation.ts                  ← Zod schemas for API request/response validation
lib/supabase/queries/              ← Database queries organized by domain
middleware.ts                      ← Supabase auth + route protection + rate limiting
```

## Rules

1. `/app` is routing only — zero `'use client'`, zero logic, `page.tsx` ≤ 40 lines
2. Interactivity → `<Name>.client.tsx` in `@/components`
3. No `any`, no `as`, no `enum`
4. Semantic tokens only — no hardcoded colors
5. `shadcn/ui` first — before custom primitives
6. Components organized by feature domain — never by type
7. Run `npx prettier --write .` after code changes

## File Placement

1. Page shell → `app/<route>/page.tsx` (≤40 lines, no `'use client'`)
2. API endpoint → `app/api/<resource>/<action>/route.ts`
3. shadcn primitive → `components/ui/`
4. TypeScript type/interface → `lib/types.ts`
5. Component for 1 feature → `components/<feature>/`
6. Component for 2+ features → `components/shared/`
7. Global infrastructure (layout, error, providers) → `components/` root
8. Tunable constant/config → `lib/services/config.ts`
9. Prompt template → `lib/prompts/<descriptive-name>.ts`
10. Service/business logic → `lib/services/`

## Principles

- Simplicity first — smallest change, touch only what's necessary
- No laziness — root causes, no temp fixes, staff engineer standards
- No side effects — changes must not introduce regressions

## Workflow

- Plan mode first for 2+ step tasks. Re-plan if something breaks.
- Use subagents freely. One task per subagent.
- Never mark complete without verification.

## Lessons

- `page.tsx` is a shell, composition only, never `'use client'`. Extract all logic into named components.
