-- Saved ICPs
create table saved_icps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  icp jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_saved_icps_user on saved_icps(user_id);
alter table saved_icps enable row level security;
create policy "Users manage own ICPs" on saved_icps for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Research Sessions
create table research_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Untitled Session',
  step text not null default 'input',
  transcript text not null default '',
  icp jsonb,
  strategy_messages jsonb not null default '[]'::jsonb,
  candidates jsonb not null default '[]'::jsonb,
  selected_companies jsonb not null default '[]'::jsonb,
  results jsonb not null default '[]'::jsonb,
  people_results jsonb not null default '{}'::jsonb,
  status text not null default 'in_progress',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_research_sessions_user on research_sessions(user_id);
alter table research_sessions enable row level security;
create policy "Users manage own sessions" on research_sessions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Contacted Companies
create table contacted_companies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company_name text not null,
  contact_email text not null,
  contact_name text not null,
  session_id uuid references research_sessions(id) on delete set null,
  sent_email_id uuid references sent_emails(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(user_id, company_name, contact_email)
);
create index idx_contacted_lookup on contacted_companies(user_id, company_name);
alter table contacted_companies enable row level security;
create policy "Users manage own contacts" on contacted_companies for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
