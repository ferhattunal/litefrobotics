# Litef Robotics CMS

Admin panelli katalog ve landing page sistemi. Next.js (App Router), Supabase ve Vercel üzerine kuruludur.

## Yerel geliştirme

```bash
cp .env.example .env.local
npm install
npm run dev
```

`.env.local` içine Supabase ve site URL değerlerini yazın.

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 1) GitHub

Proje klasöründe (Cursor terminali):

```bash
cd /Users/ferhat/Desktop/litefrobotics
git add .
git commit -m "Initial Litef Robotics CMS"
gh repo create litefrobotics --private --source=. --remote=origin --push
```

Repo zaten varsa ve uzak bağlantı yoksa:

```bash
git remote add origin https://github.com/<kullanici>/litefrobotics.git
git push -u origin HEAD
```

Sonraki güncellemeler:

```bash
git add .
git commit -m "Mesaj"
git push
```

**Vercel repository access:** GitHub → Settings → Applications → Vercel → Configure. *Only select repositories* açıksa **litefrobotics** ekleyin veya *All repositories* seçin.

---

## 2) Supabase

1. [supabase.com](https://supabase.com) → New project
2. **SQL Editor** → `supabase/schema.sql` dosyasının tamamını yapıştırın → **Run**
   - Tablolar, RLS, tetikleyiciler, storage bucket’ları ve varsayılan navbar/footer/ana sayfa oluşur
   - Şema daha önce çalıştırıldıysa yalnızca `supabase/schema-addon.sql` dosyasını çalıştırın (teklif, bayi, galeri, SSS vb.)
3. **Authentication → Users → Add user** ile admin e-posta/şifre oluşturun
4. Kullanıcının UUID değerini kopyalayıp SQL Editor’de çalıştırın:

```sql
insert into public.admin_users (id, email)
values ('BURAYA-USER-UUID', 'admin@ornek.com');
```

5. **Project Settings → API**
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role → `SUPABASE_SERVICE_ROLE_KEY` (yalnızca sunucu / Vercel env)

Bucket’lar SQL ile oluşmazsa Dashboard → Storage içinden public olarak açın:

- `product-images`
- `product-pdfs`
- `category-heroes`
- `blog-images`
- `page-assets`

---

## 3) Vercel

1. [vercel.com](https://vercel.com) → Add New Project → `litefrobotics` import
2. Framework: Next.js (otomatik)
3. Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://<proje>.vercel.app
```

4. Deploy. Özel domain bağlarsanız `NEXT_PUBLIC_SITE_URL` değerini güncelleyin.

---

## Kurulum checklist

**GitHub**

- [ ] Repo `litefrobotics` açıldı
- [ ] Cursor terminalinden `origin` bağlandı, push çalışıyor
- [ ] Vercel GitHub access içinde repo seçili

**Vercel**

- [ ] Repo import edildi
- [ ] Dört env kaydı girildi
- [ ] İlk deploy yeşil

**Supabase**

- [ ] `supabase/schema.sql` SQL Editor’de çalıştırıldı
- [ ] Admin user oluşturuldu ve `admin_users` satırı eklendi
- [ ] Bucket’lar ve API anahtarları hazır

---

## Admin

`/admin/login` — yalnızca `admin_users` tablosundaki hesaplar girebilir.

- Modül: HTML/CSS/JS section
- Landing: kod yapıştırarak veya modül istifleyerek; title, slug, meta, ana sayfa radio
- Navbar / footer: tüm vitrin sayfalarında sabit layout
- Kategori hero + kart tasarımı
- Ürün: çoklu görsel (WebP), PDF, kart tasarımı
- Kart kodu: `LFCARD1.` ile başlar; default kart kod üretmez
- Hakkımızda / İletişim (Maps embed URL)
- Blog
