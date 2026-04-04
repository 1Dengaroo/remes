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

Saved ICP profiles are managed at `/profiles` and can also be created inline during the research flow via the Create ICP modal.

## Domain

```
Buying Signals     Job postings, funding rounds, news, tech stack changes
ICP                Industry, company size, funding stage, hiring patterns, tech usage
Outreach Hooks     Signal-specific email openers referencing real company activity
```

## Email Workflow

- **Generation**: 3-email sequence generated via Claude, personalized per contact + signals. Sender's first name from auth profile replaces `[Your name]`.
- **Persistence**: Sequences cached in store and persisted to session (`email_sequences` column). Reopening editor restores previous sequence without re-generating.
- **Signatures**: Managed in Settings → Signatures. One default auto-selected. Appended to email body on send.
- **Sending**: Gmail OAuth. Sent emails link back to originating session via "View Session" in sent emails page.

## Limitations (MVP)

- No team collaboration
- Sequential company research (streaming UX)
