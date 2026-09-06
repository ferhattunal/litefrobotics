-- Mevcut projeye yeni admin modüllerini ekler.
-- SQL Editor'de bir kez çalıştırın.

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null default '',
  phone text not null default '',
  company text not null default '',
  message text not null default '',
  product_name text not null default '',
  status text not null default 'yeni',
  created_at timestamptz not null default now()
);

create table if not exists public.dealers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null default '',
  address text not null default '',
  phone text not null default '',
  email text not null default '',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.price_lists (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  file_url text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rentals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  image_url text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.reference_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  url text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.slides (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  image_url text not null,
  link_url text not null default '',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.quote_requests enable row level security;
alter table public.dealers enable row level security;
alter table public.price_lists enable row level security;
alter table public.rentals enable row level security;
alter table public.gallery_items enable row level security;
alter table public.reference_items enable row level security;
alter table public.faqs enable row level security;
alter table public.slides enable row level security;

drop policy if exists "quote_requests_public_insert" on public.quote_requests;
create policy "quote_requests_public_insert"
on public.quote_requests for insert with check (true);

drop policy if exists "dealers_public_read" on public.dealers;
create policy "dealers_public_read" on public.dealers for select using (published = true or auth.uid() is not null);

drop policy if exists "price_lists_public_read" on public.price_lists;
create policy "price_lists_public_read" on public.price_lists for select using (published = true or auth.uid() is not null);

drop policy if exists "rentals_public_read" on public.rentals;
create policy "rentals_public_read" on public.rentals for select using (published = true or auth.uid() is not null);

drop policy if exists "gallery_public_read" on public.gallery_items;
create policy "gallery_public_read" on public.gallery_items for select using (true);

drop policy if exists "references_public_read" on public.reference_items;
create policy "references_public_read" on public.reference_items for select using (true);

drop policy if exists "faqs_public_read" on public.faqs;
create policy "faqs_public_read" on public.faqs for select using (true);

drop policy if exists "slides_public_read" on public.slides;
create policy "slides_public_read" on public.slides for select using (published = true or auth.uid() is not null);

drop trigger if exists dealers_updated_at on public.dealers;
create trigger dealers_updated_at before update on public.dealers
for each row execute function public.set_updated_at();

drop trigger if exists price_lists_updated_at on public.price_lists;
create trigger price_lists_updated_at before update on public.price_lists
for each row execute function public.set_updated_at();

drop trigger if exists rentals_updated_at on public.rentals;
create trigger rentals_updated_at before update on public.rentals
for each row execute function public.set_updated_at();
