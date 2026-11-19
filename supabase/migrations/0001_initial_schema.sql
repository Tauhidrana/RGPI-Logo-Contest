-- ============================================================================
-- RGPI Logo Contest — initial schema
-- ============================================================================

create extension if not exists pgcrypto;

-- Roles ----------------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('admin', 'judge');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.submission_status as enum (
    'submitted', 'under_review', 'shortlisted', 'winner',
    'first_runner_up', 'second_runner_up', 'rejected'
  );
exception when duplicate_object then null; end $$;

-- profiles -------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role public.user_role not null default 'judge',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- settings (single JSON document per key) ------------------------------------
create table if not exists public.settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- departments ----------------------------------------------------------------
create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  name_bn text not null,
  name_en text not null,
  is_active boolean not null default true,
  sort_order integer not null default 99
);

-- submissions ----------------------------------------------------------------
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  submission_code text not null unique,
  full_name text not null,
  department_id uuid references public.departments(id) on delete set null,
  semester text not null,
  roll text not null,
  session text not null,
  phone text not null,
  email text not null,
  logo_title text not null,
  concept text not null,
  jpg_path text not null,
  ai_path text not null,
  status public.submission_status not null default 'submitted',
  is_deleted boolean not null default false,
  admin_note text,
  created_at timestamptz not null default now(),
  ip_hash text
);

create index if not exists idx_submissions_created_at on public.submissions(created_at desc);
create index if not exists idx_submissions_status on public.submissions(status);
create index if not exists idx_submissions_department on public.submissions(department_id);
create index if not exists idx_submissions_email on public.submissions(email);
create index if not exists idx_submissions_phone on public.submissions(phone);
create index if not exists idx_submissions_roll on public.submissions(roll);
create index if not exists idx_submissions_code on public.submissions(submission_code);
create index if not exists idx_submissions_active on public.submissions(is_deleted) where is_deleted = false;

-- scores ---------------------------------------------------------------------
create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  judge_id uuid not null references public.profiles(id) on delete cascade,
  creativity smallint not null check (creativity between 1 and 10),
  theme smallint not null check (theme between 1 and 10),
  simplicity smallint not null check (simplicity between 1 and 10),
  color_typography smallint not null check (color_typography between 1 and 10),
  required_text smallint not null check (required_text between 1 and 10),
  total numeric(5,2) not null default 0,
  comment text not null default '',
  is_final boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (submission_id, judge_id)
);

create index if not exists idx_scores_submission on public.scores(submission_id);
create index if not exists idx_scores_judge on public.scores(judge_id);

-- audit_logs -----------------------------------------------------------------
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  actor_email text,
  action text not null,
  target text,
  details jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_audit_created on public.audit_logs(created_at desc);

-- submission code generator --------------------------------------------------
create sequence if not exists public.submission_code_seq start 1 increment 1;

create or replace function public.next_submission_code()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare n bigint;
begin
  select nextval('submission_code_seq') into n;
  return 'RGPI-LOGO-' || lpad(n::text, 4, '0');
end;
$$;

revoke all on function public.next_submission_code() from public, anon, authenticated;
grant execute on function public.next_submission_code() to service_role;

-- auto-profile on signup ------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role, is_active)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'judge'),
    true
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
