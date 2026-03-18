-- Gmail connections: stores OAuth tokens per user
create table gmail_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  access_token text not null,
  refresh_token text not null,
  token_expiry timestamptz,
  gmail_email text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: users can only manage their own row
alter table gmail_connections enable row level security;

create policy "Users can read their own gmail connection"
  on gmail_connections for select
  using (auth.uid() = user_id);

create policy "Users can insert their own gmail connection"
  on gmail_connections for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own gmail connection"
  on gmail_connections for update
  using (auth.uid() = user_id);

create policy "Users can delete their own gmail connection"
  on gmail_connections for delete
  using (auth.uid() = user_id);

-- Sent emails: stores every email sent
create table sent_emails (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recipient_email text not null,
  recipient_name text not null default '',
  subject text not null,
  body text not null,
  company_name text not null default '',
  contact_name text not null default '',
  status text not null check (status in ('sent', 'failed')),
  error_message text,
  gmail_message_id text,
  created_at timestamptz default now()
);

-- RLS: users can only read/insert their own rows
alter table sent_emails enable row level security;

create policy "Users can read their own sent emails"
  on sent_emails for select
  using (auth.uid() = user_id);

create policy "Users can insert their own sent emails"
  on sent_emails for insert
  with check (auth.uid() = user_id);
