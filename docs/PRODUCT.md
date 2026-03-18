# Product

AI-powered outbound sales for SMBs. Natural language → structured ICP → matching companies with buying signals → right contacts → personalized outreach hooks.

## User Flow

```
Step 1: Transcript Input    User describes ideal customer (free text, transcript, notes)
Step 2: ICP Review          Claude extracts structured ICP, user edits/regenerates
Step 3: Company Confirm     Apollo finds companies, Claude scores 1-10, user selects
Step 4: Deep Research       Claude researches each company (web search), streams via SSE
                            → signals, overview, email hook, top 3 contacts per company
                            → "Get Contact" for full details (1 Apollo credit)
```

Navigation: Cmd+Enter advances steps. Bottom nav. "New Research" navigates to sessions list. Cancel mid-stream.

Sessions live at `/research` (list) and `/research/[id]` (individual). Sessions are created upfront, state is auto-saved, and loaded server-side on revisit (no loading flash).

## Domain

```
Buying Signals     Job postings, funding rounds, news, tech stack changes
ICP                Industry, company size, funding stage, hiring patterns, tech usage
Outreach Hooks     Signal-specific email openers referencing real company activity
```

## Limitations (MVP)

- No team collaboration
- Sequential company research (streaming UX)
