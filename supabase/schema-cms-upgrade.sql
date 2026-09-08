-- Litef Robotics CMS genişletmesi
-- Mevcut projede Supabase SQL Editor içinde bir kez çalıştırın.

-- ---------------------------------------------------------------------------
-- Admin kullanıcıları
-- ---------------------------------------------------------------------------

alter table public.admin_users
  add column if not exists username text,
  add column if not exists first_name text not null default '',
  add column if not exists last_name text not null default '',
  add column if not exists status text not null default 'active',
  add column if not exists role text not null default 'admin';

update public.admin_users
set username = split_part(email, '@', 1) || '-' || substr(id::text, 1, 8)
where username is null or btrim(username) = '';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'admin_users_status_check'
  ) then
    alter table public.admin_users
      add constraint admin_users_status_check check (status in ('active', 'inactive'));
  end if;
  if not exists (
    select 1 from pg_constraint where conname = 'admin_users_role_check'
  ) then
    alter table public.admin_users
      add constraint admin_users_role_check check (role in ('admin', 'editor'));
  end if;
end $$;

create unique index if not exists admin_users_username_key on public.admin_users (username);

alter table public.admin_users alter column username set not null;

-- ---------------------------------------------------------------------------
-- Ürünler
-- ---------------------------------------------------------------------------

alter table public.products
  add column if not exists brand text not null default '',
  add column if not exists series text not null default '',
  add column if not exists model text not null default '',
  add column if not exists price_try numeric,
  add column if not exists price_usd numeric,
  add column if not exists price_display text not null default 'try',
  add column if not exists show_on_homepage boolean not null default false,
  add column if not exists show_price_on_card boolean not null default true,
  add column if not exists show_stock_badge_on_card boolean not null default true,
  add column if not exists featured boolean not null default false,
  add column if not exists stock_qty integer not null default 0,
  add column if not exists in_stock boolean not null default true,
  add column if not exists about_heading text not null default '',
  add column if not exists about_html text not null default '',
  add column if not exists about_image_url text,
  add column if not exists specs_xml text not null default '',
  add column if not exists meta_title text not null default '',
  add column if not exists meta_description text not null default '',
  add column if not exists sort_order integer not null default 0;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'products_price_display_check'
  ) then
    alter table public.products
      add constraint products_price_display_check check (price_display in ('try', 'usd', 'both'));
  end if;
end $$;

create table if not exists public.product_landing_pages (
  product_id uuid not null references public.products (id) on delete cascade,
  page_id uuid not null references public.pages (id) on delete cascade,
  primary key (product_id, page_id)
);

alter table public.product_landing_pages enable row level security;

drop policy if exists "product_landing_pages_public_read" on public.product_landing_pages;
create policy "product_landing_pages_public_read"
on public.product_landing_pages for select using (true);

-- ---------------------------------------------------------------------------
-- Storage
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit)
values
  ('media', 'media', true, 20971520),
  ('documents', 'documents', true, 52428800)
on conflict (id) do nothing;

drop policy if exists "storage_public_read" on storage.objects;
create policy "storage_public_read"
on storage.objects for select
using (
  bucket_id in (
    'product-images',
    'product-pdfs',
    'category-heroes',
    'blog-images',
    'page-assets',
    'media',
    'documents'
  )
);

alter table public.modules
  add column if not exists module_type text not null default 'custom';

-- Krem/bej CMS zeminlerini kirli beyaza çek
update public.pages
set css = replace(replace(replace(replace(replace(replace(
  css,
  '#f3f0e8', '#f0f0f0'),
  '#F3F0E8', '#f0f0f0'),
  '#f4f4f1', '#f0f0f0'),
  '#F4F4F1', '#f0f0f0'),
  '#faf6ee', '#f0f0f0'),
  '#f5f0e6', '#f0f0f0')
where css ~* '#(f3f0e8|f4f4f1|faf6ee|f5f0e6)';

update public.modules
set css = replace(replace(replace(replace(replace(replace(
  css,
  '#f3f0e8', '#f0f0f0'),
  '#F3F0E8', '#f0f0f0'),
  '#f4f4f1', '#f0f0f0'),
  '#F4F4F1', '#f0f0f0'),
  '#faf6ee', '#f0f0f0'),
  '#f5f0e6', '#f0f0f0')
where css ~* '#(f3f0e8|f4f4f1|faf6ee|f5f0e6)';

