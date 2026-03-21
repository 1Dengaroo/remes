# Remes

AI-powered outbound sales platform for SMBs. Remes monitors the web for buying signals, finds decision-makers, and generates personalized outreach — automatically.

## How it works

1. **Detect signals** — Job postings, funding rounds, hiring surges, and product launches
2. **Find contacts** — Match signals to decision-makers with verified emails via Apollo
3. **Draft outreach** — Personalized emails grounded in the exact signal detected

## Stack

- **Framework:** Next.js App Router, TypeScript, Tailwind, shadcn/ui
- **Auth & Database:** Supabase
- **AI:** Anthropic Claude API
- **Data:** Apollo API
- **Email:** Gmail OAuth

## Getting started

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm test` | Run tests |
| `npm run lint` | Lint with ESLint |
