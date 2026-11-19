-- ============================================================================
-- Storage buckets
-- logos-jpg : PUBLIC read (published previews) — paths are random/un guessable
-- logos-ai  : PRIVATE — accessible only via signed URLs for admins/judges
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('logos-jpg', 'logos-jpg', true, 5242880, array['image/jpeg', 'image/jpg', 'image/png'])
on conflict (id) do update set public = true, file_size_limit = 5242880;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('logos-ai', 'logos-ai', false, 26214400, array['application/postscript', 'application/illustrator', 'application/octet-stream'])
on conflict (id) do update set public = false, file_size_limit = 26214400;

-- JPG: anyone can read --------------------------------------------------------
drop policy if exists "jpg_public_read" on storage.objects;
create policy "jpg_public_read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'logos-jpg');

drop policy if exists "jpg_service_write" on storage.objects;
create policy "jpg_service_write" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'logos-jpg' and public.is_admin());

drop policy if exists "jpg_service_delete" on storage.objects;
create policy "jpg_service_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'logos-jpg' and public.is_admin());

-- AI: private, staff only -----------------------------------------------------
drop policy if exists "ai_staff_read" on storage.objects;
create policy "ai_staff_read" on storage.objects
  for select to authenticated
  using (bucket_id = 'logos-ai' and (public.is_admin() or public.is_judge()));

drop policy if exists "ai_admin_write" on storage.objects;
create policy "ai_admin_write" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'logos-ai' and public.is_admin());

drop policy if exists "ai_admin_delete" on storage.objects;
create policy "ai_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'logos-ai' and public.is_admin());
