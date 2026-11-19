-- Exposes storage consumption for the admin dashboard (service role only).
create or replace function public.get_storage_usage()
returns jsonb
language sql
security definer
set search_path = public, storage
as $$
  select jsonb_build_object(
    'jpg_bytes', coalesce((select sum((metadata->>'size')::bigint) from storage.objects where bucket_id = 'logos-jpg'), 0),
    'jpg_files', (select count(*) from storage.objects where bucket_id = 'logos-jpg'),
    'ai_bytes', coalesce((select sum((metadata->>'size')::bigint) from storage.objects where bucket_id = 'logos-ai'), 0),
    'ai_files', (select count(*) from storage.objects where bucket_id = 'logos-ai')
  );
$$;

revoke all on function public.get_storage_usage() from public, anon, authenticated;
grant execute on function public.get_storage_usage() to service_role;
