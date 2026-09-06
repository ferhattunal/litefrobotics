-- Litef Robotics CMS şeması
-- Supabase Dashboard > SQL Editor içine yapıştırıp Run edin.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tablolar
-- ---------------------------------------------------------------------------

create table if not exists public.admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  html text not null default '',
  css text not null default '',
  js text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  meta_description text not null default '',
  meta_keywords text not null default '',
  is_homepage boolean not null default false,
  render_mode text not null default 'code' check (render_mode in ('code', 'modules')),
  html text not null default '',
  css text not null default '',
  js text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.page_modules (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages (id) on delete cascade,
  module_id uuid not null references public.modules (id) on delete cascade,
  sort_order integer not null default 0
);

create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  navbar_html text not null default '',
  navbar_css text not null default '',
  footer_html text not null default '',
  footer_css text not null default '',
  homepage_page_id uuid references public.pages (id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  hero_image_url text,
  hero_title text not null default '',
  hero_text text not null default '',
  card_design jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text not null default '',
  pdf_url text,
  card_design jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  url text not null,
  sort_order integer not null default 0
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  cover_url text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.about_page (
  id integer primary key default 1 check (id = 1),
  title text not null default 'Hakkımızda',
  content text not null default '',
  meta_description text not null default '',
  meta_keywords text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_page (
  id integer primary key default 1 check (id = 1),
  title text not null default 'İletişim',
  content text not null default '',
  address text not null default '',
  phone text not null default '',
  email text not null default '',
  maps_embed_url text not null default '',
  meta_description text not null default '',
  meta_keywords text not null default '',
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at tetikleyicisi
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists modules_updated_at on public.modules;
create trigger modules_updated_at before update on public.modules
for each row execute function public.set_updated_at();

drop trigger if exists pages_updated_at on public.pages;
create trigger pages_updated_at before update on public.pages
for each row execute function public.set_updated_at();

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists categories_updated_at on public.categories;
create trigger categories_updated_at before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists blog_posts_updated_at on public.blog_posts;
create trigger blog_posts_updated_at before update on public.blog_posts
for each row execute function public.set_updated_at();

drop trigger if exists about_page_updated_at on public.about_page;
create trigger about_page_updated_at before update on public.about_page
for each row execute function public.set_updated_at();

drop trigger if exists contact_page_updated_at on public.contact_page;
create trigger contact_page_updated_at before update on public.contact_page
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Tek ana sayfa
-- ---------------------------------------------------------------------------

create or replace function public.ensure_single_homepage()
returns trigger
language plpgsql
as $$
begin
  if new.is_homepage then
    update public.pages
    set is_homepage = false
    where id <> new.id and is_homepage = true;

    update public.site_settings
    set homepage_page_id = new.id
    where id = 1;
  elsif old.is_homepage and not new.is_homepage then
    update public.site_settings
    set homepage_page_id = null
    where id = 1 and homepage_page_id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists pages_single_homepage on public.pages;
create trigger pages_single_homepage
after insert or update of is_homepage on public.pages
for each row execute function public.ensure_single_homepage();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.admin_users enable row level security;
alter table public.modules enable row level security;
alter table public.pages enable row level security;
alter table public.page_modules enable row level security;
alter table public.site_settings enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.blog_posts enable row level security;
alter table public.about_page enable row level security;
alter table public.contact_page enable row level security;

drop policy if exists "admin_users_self_read" on public.admin_users;
create policy "admin_users_self_read"
on public.admin_users for select
to authenticated
using (id = auth.uid());

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

drop policy if exists "modules_public_read" on public.modules;
create policy "modules_public_read" on public.modules for select using (true);

drop policy if exists "pages_public_read" on public.pages;
create policy "pages_public_read" on public.pages for select using (true);

drop policy if exists "page_modules_public_read" on public.page_modules;
create policy "page_modules_public_read" on public.page_modules for select using (true);

drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read" on public.site_settings for select using (true);

drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories for select using (true);

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products for select using (true);

drop policy if exists "product_images_public_read" on public.product_images;
create policy "product_images_public_read" on public.product_images for select using (true);

drop policy if exists "blog_posts_public_read" on public.blog_posts;
create policy "blog_posts_public_read"
on public.blog_posts for select
using (published = true or auth.uid() is not null);

drop policy if exists "about_page_public_read" on public.about_page;
create policy "about_page_public_read" on public.about_page for select using (true);

drop policy if exists "contact_page_public_read" on public.contact_page;
create policy "contact_page_public_read" on public.contact_page for select using (true);

-- Yazma işlemleri service_role ile yapılır (RLS bypass). Anon/authenticated insert/update/delete yok.

-- ---------------------------------------------------------------------------
-- Storage
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit)
values
  ('product-images', 'product-images', true, 10485760),
  ('product-pdfs', 'product-pdfs', true, 26214400),
  ('category-heroes', 'category-heroes', true, 10485760),
  ('blog-images', 'blog-images', true, 10485760),
  ('page-assets', 'page-assets', true, 10485760)
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
    'page-assets'
  )
);

-- ---------------------------------------------------------------------------
-- Varsayılan içerik
-- ---------------------------------------------------------------------------

insert into public.site_settings (id, navbar_html, navbar_css, footer_html, footer_css)
values (
  1,
  $nav$<nav class="lf-nav">
  <a class="lf-logo" href="/">Litef Robotics</a>
  <div class="lf-links">
    <a href="/">Ana Sayfa</a>
    <a href="/kategoriler">Ürünler</a>
    <a href="/blog">Blog</a>
    <a href="/hakkimizda">Hakkımızda</a>
    <a href="/iletisim">İletişim</a>
  </div>
</nav>$nav$,
  $navcss$.lf-nav { display: flex; align-items: center; justify-content: space-between; gap: 24px; max-width: 1120px; margin: 0 auto; padding: 16px 20px; }
.lf-logo { font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: #111; text-decoration: none; }
.lf-links { display: flex; align-items: center; gap: 22px; }
.lf-links a { color: #334155; text-decoration: none; font-size: 14px; font-weight: 500; }
.lf-links a:hover { color: #c2410c; }$navcss$,
  $foot$<footer class="lf-footer">
  <div class="lf-footer-inner">
    <strong>Litef Robotics</strong>
    <p>Endüstriyel robotik çözümler.</p>
    <div class="lf-footer-links">
      <a href="/hakkimizda">Hakkımızda</a>
      <a href="/iletisim">İletişim</a>
    </div>
  </div>
</footer>$foot$,
  $footcss$.lf-footer { background: #111827; color: #e5e7eb; }
.lf-footer-inner { max-width: 1120px; margin: 0 auto; padding: 40px 20px; display: grid; gap: 12px; }
.lf-footer a { color: #fdba74; text-decoration: none; margin-right: 16px; }
.lf-footer p { margin: 0; color: #9ca3af; font-size: 14px; }$footcss$
)
on conflict (id) do nothing;

insert into public.pages (
  title, slug, meta_description, meta_keywords, is_homepage, render_mode, html, css, js
)
select
  'Ana Sayfa',
  'ana-sayfa',
  'Litef Robotics endüstriyel robotik çözümleri.',
  'robotik, endüstriyel robot, otomasyon',
  true,
  'code',
  $html$<section class="hero">
  <div class="hero-inner">
    <p class="eyebrow">Litef Robotics</p>
    <h1>Endüstriyel robotikte güvenilir çözümler</h1>
    <p class="lead">Üretim hatlarınız için tasarlanmış robotik sistemler, yedek parçalar ve teknik destek.</p>
    <a class="btn" href="/kategoriler">Ürünleri incele</a>
  </div>
</section>
<section class="features">
  <article><h2>Ürün kataloğu</h2><p>Kategorilere göre düzenlenmiş robotik ürünler.</p></article>
  <article><h2>Teknik doküman</h2><p>Her ürün için indirilebilir PDF katalog.</p></article>
  <article><h2>Uzman destek</h2><p>Kurulum ve entegrasyon süreçlerinde yanınızdayız.</p></article>
</section>$html$,
  $css$.hero { background: linear-gradient(135deg, #111827, #1f2937); color: white; }
.hero-inner { max-width: 1120px; margin: 0 auto; padding: 96px 20px; }
.eyebrow { letter-spacing: 0.16em; text-transform: uppercase; color: #fdba74; font-size: 12px; margin: 0 0 12px; }
.hero h1 { font-size: clamp(32px, 5vw, 56px); line-height: 1.1; margin: 0 0 16px; max-width: 16ch; }
.lead { max-width: 52ch; color: #d1d5db; font-size: 18px; }
.btn { display: inline-block; margin-top: 28px; background: #c2410c; color: white; padding: 12px 22px; text-decoration: none; border-radius: 999px; font-weight: 600; }
.features { max-width: 1120px; margin: 0 auto; padding: 64px 20px; display: grid; gap: 20px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.features article { background: white; padding: 24px; border-radius: 16px; box-shadow: 0 8px 24px rgba(15,23,42,0.06); }
.features h2 { margin: 0 0 8px; font-size: 20px; }
.features p { margin: 0; color: #64748b; }$css$,
  ''
where not exists (select 1 from public.pages);

insert into public.about_page (id, title, content, meta_description, meta_keywords)
values (
  1,
  'Hakkımızda',
  '<p>Litef Robotics, endüstriyel otomasyon ve robotik sistemler alanında çözüm üretir.</p>',
  'Litef Robotics hakkında',
  'litef, robotik, hakkımızda'
)
on conflict (id) do nothing;

insert into public.contact_page (id, title, content, address, phone, email, maps_embed_url, meta_description, meta_keywords)
values (
  1,
  'İletişim',
  '<p>Projeleriniz için bizimle iletişime geçin.</p>',
  '',
  '',
  'info@litefrobotics.com',
  '',
  'Litef Robotics iletişim',
  'iletişim, litef robotics'
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- İçerik ve sistem modülleri
-- ---------------------------------------------------------------------------

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

-- ---------------------------------------------------------------------------
-- İlk admin kullanıcısı
-- ---------------------------------------------------------------------------
-- 1) Authentication > Users üzerinden e-posta/şifre ile kullanıcı oluşturun.
-- 2) Kullanıcının UUID değerini kopyalayın.
-- 3) Aşağıdaki satırların yorumunu kaldırıp değerleri doldurun:
--
-- insert into public.admin_users (id, email)
-- values ('00000000-0000-0000-0000-000000000000', 'admin@ornek.com');
