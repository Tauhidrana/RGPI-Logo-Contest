-- ============================================================================
-- Row Level Security
-- The Next.js server uses the service-role key (bypasses RLS). These policies
-- also make the tables safe if an anon/authenticated client is used directly.
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.settings enable row level security;
alter table public.departments enable row level security;
alter table public.submissions enable row level security;
alter table public.scores enable row level security;
alter table public.audit_logs enable row level security;

-- Role helper functions (avoid recursive policy lookups) ---------------------
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and is_active = true
  );
$$;

create or replace function public.is_judge()
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'judge' and is_active = true
  );
$$;

-- profiles --------------------------------------------------------------------
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_admin_write" on public.profiles;
create policy "profiles_admin_write" on public.profiles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- settings --------------------------------------------------------------------
drop policy if exists "settings_admin_all" on public.settings;
create policy "settings_admin_all" on public.settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- departments -----------------------------------------------------------------
drop policy if exists "departments_public_read" on public.departments;
create policy "departments_public_read" on public.departments
  for select to anon, authenticated using (true);

drop policy if exists "departments_admin_write" on public.departments;
create policy "departments_admin_write" on public.departments
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- submissions -----------------------------------------------------------------
-- Public INSERT is intentionally NOT granted (students submit via /api/submit
-- with the service-role key on the server — no client can write directly).
drop policy if exists "submissions_staff_read" on public.submissions;
create policy "submissions_staff_read" on public.submissions
  for select to authenticated using (public.is_admin() or public.is_judge());

drop policy if exists "submissions_admin_insert" on public.submissions;
create policy "submissions_admin_insert" on public.submissions
  for insert to authenticated with check (public.is_admin());

drop policy if exists "submissions_admin_update" on public.submissions;
create policy "submissions_admin_update" on public.submissions
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "submissions_admin_delete" on public.submissions;
create policy "submissions_admin_delete" on public.submissions
  for delete to authenticated using (public.is_admin());

-- scores ----------------------------------------------------------------------
drop policy if exists "scores_staff_read" on public.scores;
create policy "scores_staff_read" on public.scores
  for select to authenticated using (public.is_admin() or public.is_judge());

drop policy if exists "scores_judge_insert_own" on public.scores;
create policy "scores_judge_insert_own" on public.scores
  for insert to authenticated with check (judge_id = auth.uid() and public.is_judge());

drop policy if exists "scores_judge_update_own" on public.scores;
create policy "scores_judge_update_own" on public.scores
  for update to authenticated using (judge_id = auth.uid() and public.is_judge())
  with check (judge_id = auth.uid() and public.is_judge());

drop policy if exists "scores_judge_delete_own" on public.scores;
create policy "scores_judge_delete_own" on public.scores
  for delete to authenticated using (judge_id = auth.uid() and public.is_judge());

-- audit_logs ------------------------------------------------------------------
drop policy if exists "audit_admin_read" on public.audit_logs;
create policy "audit_admin_read" on public.audit_logs
  for select to authenticated using (public.is_admin());

drop policy if exists "audit_admin_insert" on public.audit_logs;
create policy "audit_admin_insert" on public.audit_logs
  for insert to authenticated with check (public.is_admin());
