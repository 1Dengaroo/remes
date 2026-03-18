# Persistence Layer

Saves ICPs, research sessions, and tracks contacted companies in Supabase.

## Schema

Three tables added via `supabase/migrations/20260318_persistence_tables.sql`:

- **`saved_icps`** — User's saved ICP profiles. Fields: `id`, `user_id`, `name`, `icp` (jsonb), timestamps.
- **`research_sessions`** — Full pipeline state snapshots. Fields: `id`, `user_id`, `name`, `step`, `transcript`, `icp`, `strategy_messages`, `candidates`, `selected_companies`, `results`, `people_results`, `status`, timestamps.
- **`contacted_companies`** — Tracks which contacts have been emailed. Fields: `id`, `user_id`, `company_name`, `contact_email`, `contact_name`, `session_id`, `sent_email_id`, timestamps. Unique on `(user_id, company_name, contact_email)`.

All tables have RLS policies scoped to `auth.uid() = user_id`.

## Auto-Save Behavior

Sessions are created upfront from the sessions list (`/research`), then saved automatically at key pipeline moments:

1. **After ICP extraction** — Updates session name from ICP description, saves state (`PATCH /api/sessions/:id`)
2. **After company discovery** — Saves candidates and selections
3. **After each company research result** — Saves incrementally
4. **After research completes** — Marks session `status: 'completed'`

Save state is shown via a `SaveIndicator` component (spinner while saving, checkmark when saved).

## Session Lifecycle

1. User clicks "New Research" on `/research` → session created via `POST /api/sessions` → navigates to `/research/[id]`
2. Session data is fetched server-side and passed as a prop — store is hydrated synchronously (no loading flash)
3. ICP extracted → session name updated, state auto-saved
4. Pipeline progresses → session auto-saved at each major step
5. Research completes → session marked as completed
6. User can resume any session from `/research` (sessions list) → `/research/[id]`
7. "New Research" in bottom nav resets store and navigates back to `/research`
8. Invalid session IDs show a not-found page via Next.js `notFound()`

## ICP Library

- **Save**: Strategy step has "Save ICP" button in the ICP panel header. Prompts for name, saves via `POST /api/icps`.
- **Load**: Transcript step has "Load saved ICP" dropdown. Selecting an ICP populates the transcript and ICP fields, jumps to review step, and auto-generates strategy.
- **Store**: `lib/store/icp-store.ts` — `useICPStore` with `loadICPs()`, `saveICP()`, `renameICP()`, `deleteICP()`.

## Contact Tracking

- When an email is sent via `/api/emails/send`, the route upserts into `contacted_companies`.
- On dashboard mount, `loadContactedCompanies()` fetches all contacts and builds a `Map<company_name, email[]>`.
- `CompanyRow` receives `contactedEmails` prop — shows "Contacted" badge on company header, "Sent" indicator on specific contacts.

## API Routes

| Route                | Methods            | Purpose                                     |
| -------------------- | ------------------ | ------------------------------------------- |
| `/api/icps`          | GET, POST          | List all ICPs, create new ICP               |
| `/api/icps/[id]`     | PATCH, DELETE      | Update or delete ICP                        |
| `/api/sessions`      | GET, POST          | List session summaries, create session      |
| `/api/sessions/[id]` | GET, PATCH, DELETE | Load full session, auto-save, delete        |
| `/api/contacts`      | GET                | List all contacted companies for user       |
| `/api/emails/send`   | POST               | (Modified) Also upserts contacted_companies |
