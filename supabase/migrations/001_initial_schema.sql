-- JG Talent CRM — Initial Schema
-- Run this in Supabase SQL Editor to set up the database

-- ── Companies ──
create table companies (
  id text primary key,
  name text not null,
  domain text,
  industry text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── People ──
create table people (
  id text primary key,
  name text not null,
  email text,
  role text,
  company_id text references companies(id),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── Deals ──
create table deals (
  id text primary key,
  name text not null,
  company_id text references companies(id),
  contact_id text references people(id),
  pipeline text not null check (pipeline in ('content', 'partnership', 'service')),
  stage text not null,
  type text not null,
  priority text not null check (priority in ('High', 'Medium', 'Low')),
  value integer,
  closed_value integer,
  platforms text[], -- postgres array
  deliverables text,
  terms text,
  notes text,
  jamey_uses_product boolean default false,
  owner text not null check (owner in ('justin', 'jamey', 'both')),
  created_at timestamptz default now(),
  last_activity_at timestamptz default now(),
  expected_close_date date,
  closed_at timestamptz,
  updated_at timestamptz default now()
);

-- ── Tasks ──
create table tasks (
  id text primary key,
  title text not null,
  description text,
  status text not null check (status in ('To Do', 'In Progress', 'Waiting', 'Done', 'Cancelled')),
  priority text not null check (priority in ('Urgent', 'High', 'Normal', 'Low')),
  assignee text not null check (assignee in ('justin', 'jamey', 'agent')),
  deal_id text references deals(id),
  company_id text references companies(id),
  due_date date,
  created_at timestamptz default now(),
  created_by text not null check (created_by in ('justin', 'jamey', 'agent')),
  updated_at timestamptz default now()
);

-- ── Activities ──
create table activities (
  id text primary key,
  type text not null check (type in ('email_sent', 'email_received', 'meeting', 'call', 'note', 'task_created', 'stage_change', 'agent_alert')),
  title text not null,
  description text,
  deal_id text references deals(id),
  company_id text references companies(id),
  person_id text references people(id),
  created_by text not null check (created_by in ('justin', 'jamey', 'agent', 'system')),
  timestamp timestamptz not null default now()
);

-- ── Deal Scores (JSONB for flexibility) ──
create table deal_scores (
  id text primary key,
  deal_id text references deals(id) unique,
  overall_grade text not null,
  dimensions jsonb not null default '[]',
  upgrade_moves jsonb not null default '[]',
  viability_paths jsonb not null default '[]',
  positioning_angles jsonb not null default '[]',
  recommendation text,
  evaluated_at timestamptz default now()
);

-- ── Email Messages ──
create table email_messages (
  id text primary key,
  thread_id text not null, -- groups messages in a thread
  deal_id text references deals(id),
  activity_id text references activities(id),
  from_addr text not null,
  to_addr text not null,
  subject text,
  body text,
  direction text not null check (direction in ('inbound', 'outbound')),
  timestamp timestamptz not null,
  gmail_thread_id text, -- real Gmail thread ID for syncing
  created_at timestamptz default now()
);

-- ── Deliverables ──
create table deliverables (
  id text primary key,
  title text not null,
  deal_id text references deals(id),
  status text not null check (status in ('Not Started', 'In Progress', 'In Review', 'Revisions', 'Approved', 'Published')),
  content_type text,
  due_date date,
  publish_date date,
  invoice_amount integer,
  invoice_status text check (invoice_status in ('Not Invoiced', 'Invoiced', 'Paid', 'Overdue')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── Indexes ──
create index idx_deals_pipeline on deals(pipeline);
create index idx_deals_company on deals(company_id);
create index idx_tasks_deal on tasks(deal_id);
create index idx_tasks_assignee on tasks(assignee);
create index idx_activities_deal on activities(deal_id);
create index idx_activities_company on activities(company_id);
create index idx_activities_timestamp on activities(timestamp desc);
create index idx_email_messages_thread on email_messages(thread_id);
create index idx_email_messages_deal on email_messages(deal_id);

-- ── Updated-at triggers ──
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger companies_updated_at before update on companies for each row execute function update_updated_at();
create trigger people_updated_at before update on people for each row execute function update_updated_at();
create trigger deals_updated_at before update on deals for each row execute function update_updated_at();
create trigger tasks_updated_at before update on tasks for each row execute function update_updated_at();
create trigger deliverables_updated_at before update on deliverables for each row execute function update_updated_at();

-- ── RLS (permissive for now — tighten later) ──
alter table companies enable row level security;
alter table people enable row level security;
alter table deals enable row level security;
alter table tasks enable row level security;
alter table activities enable row level security;
alter table deal_scores enable row level security;
alter table email_messages enable row level security;
alter table deliverables enable row level security;

-- Allow anon access for now (we'll add auth later)
create policy "Allow all" on companies for all using (true) with check (true);
create policy "Allow all" on people for all using (true) with check (true);
create policy "Allow all" on deals for all using (true) with check (true);
create policy "Allow all" on tasks for all using (true) with check (true);
create policy "Allow all" on activities for all using (true) with check (true);
create policy "Allow all" on deal_scores for all using (true) with check (true);
create policy "Allow all" on email_messages for all using (true) with check (true);
create policy "Allow all" on deliverables for all using (true) with check (true);

-- Enable realtime for key tables
alter publication supabase_realtime add table deals;
alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table activities;
