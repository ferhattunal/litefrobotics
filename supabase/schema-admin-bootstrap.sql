-- İlk giriş yapan Auth kullanıcısını admin yapar.
-- SQL Editor'de bir kez çalıştırın.

create or replace function public.admin_users_is_empty()
returns boolean
language sql
security definer
set search_path = public
as $$
  select not exists (select 1 from public.admin_users);
$$;

drop policy if exists "admin_users_first_insert" on public.admin_users;
create policy "admin_users_first_insert"
on public.admin_users for insert
to authenticated
with check (
  id = auth.uid()
  and public.admin_users_is_empty()
);
