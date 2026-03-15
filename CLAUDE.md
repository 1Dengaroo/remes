# Project Outline

- A dead-simple UI where you drop in a company name and it runs a mini version of the research pipeline — funding, hiring signals, tech stack, recent news — and outputs a structured brief.
- We are using parallel AI to do deep research. Currently this is just a test.

## Patterns

- Keep files small, focused, and independently testable — one component or concern per file
- `/app` is for routing structure only — no logic, minimal JSX, just page/layout shells that compose components
- All components live in `@/components` — organized by feature or domain, not by type (avoid `@/components/buttons/`, prefer `@/components/checkout/`)
- Optimize for SSR by default — keep `'use client'` isolated to leaf components in their own files, never mixed into server component files
- Extract repeated UI patterns into reusable components early — if JSX is duplicated more than twice, it's a component
- Colocate component logic: `<component>.tsx`, `<component>.types.ts`, `<component>.test.tsx`, `<component>.utils.ts` as needed
- Fetch data at the server component level and pass down as props — avoid client-side fetching unless interactivity requires it
- Use `loading.tsx` and `error.tsx` at the route level for streaming and error boundaries rather than wrapping every component
- Prefer `async/await` in server components over `useEffect` + `useState` for data fetching
- Prefer shadcn/ui components over building from scratch — run `npx shadcn@latest add <component>` before writing custom UI primitives
- All styling must be themeable — never hardcode colors, radii, shadows, or spacing that should vary by theme; always trace back to a CSS variable or Tailwind semantic token

## TypeScript

- Avoid type casting with `as` — use type guards or proper inference instead
- Avoid `enum` — use `as const` objects instead:

```ts
const Direction = { Up: 'up', Down: 'down' } as const;
type Direction = (typeof Direction)[keyof typeof Direction];
```

- Avoid `any` — prefer `unknown` with narrowing, or a proper type/interface
- Prefer `interface` for object shapes, `type` for unions, intersections, and primitives
- Infer return types where obvious; annotate explicitly for public-facing functions and hooks
- Create types in `<component>.types.ts` for any non-trivial component; co-locate simple inline types if they're single-use and under ~2 lines

## Tailwind

- Prefer canonical Tailwind utility classes over arbitrary values — use `w-16` not `w-[64px]`, `text-sm` not `text-[14px]`, `gap-4` not `gap-[16px]`
- Only use arbitrary values (e.g. `w-[37px]`) when no standard class maps to the design requirement
- Use semantic color tokens (`bg-primary`, `text-muted-foreground`) over raw hex or rgb arbitrary values
- If no suitable token exists, add one to `@/styles/globals.css` as a CSS variable pair (`:root` + `.dark`)
- Avoid inline `style` props for anything Tailwind can express
- Prefer responsive variants (`md:flex`, `lg:w-1/2`) over conditional class logic in JS

## Workflow Orchestration

### Plan Node Default

- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately – don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### Subagent Strategy

- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### Self-Improvement Loop

- After ANY correction from the user: update the lessons section in`CLAUDE.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### Verification Before Done

- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### Demand Elegance (Balanced)

- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes – don't over-engineer
- Challenge your own work before presenting it

### Autonomous Bug Fixing

- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests – then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Core Principles

- Simplicity First: Make every change as simple as possible. Impact minimal code.
- No Laziness: Find root causes. No temporary fixes. Senior developer standards.
- Minimal Impact: Changes should only touch what's necessary. Avoid introducing bugs.
- Run `npx prettier --write .` after every response that includes code changes

## Guardrails

- DO NOT modify anything in this file other than the lessons.

## Lessons

-
