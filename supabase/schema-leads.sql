-- Litef leads (B2B teklif formu)
-- Supabase SQL Editor içinde bir kez çalıştırın.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null default '',
  company text not null default '',
  interested_product text not null default '',
  language text not null default 'tr',
  utm_source text not null default '',
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

drop policy if exists "leads_public_insert" on public.leads;
drop policy if exists "leads_public_read" on public.leads;
