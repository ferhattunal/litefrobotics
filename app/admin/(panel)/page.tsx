import Link from "next/link";

const MODULES = [
  { href: "/admin/landing", label: "Sayfa Düzeni", hint: "Landing page, title, slug, ana sayfa" },
  { href: "/admin/moduller", label: "Modül Oluşturma", hint: "HTML / CSS / JS section" },
  { href: "/admin/urunler", label: "Ürünler", hint: "Görsel, PDF, kart tasarımı" },
  { href: "/admin/kategoriler", label: "Kategoriler", hint: "Hero ve kart stili" },
  { href: "/admin/teklif-talepleri", label: "Teklif Talepleri", hint: "Gelen formlar" },
  { href: "/admin/bayiler", label: "Bayiler", hint: "Bayi listesi" },
  { href: "/admin/fiyat-listesi", label: "Fiyat Listesi", hint: "PDF kataloglar" },
  { href: "/admin/kiralama", label: "Kiralama", hint: "Kiralık ilanlar" },
  { href: "/admin/galeri", label: "Galeri", hint: "Görsel arşivi" },
  { href: "/admin/blog", label: "Haberler", hint: "Blog yazıları" },
  { href: "/admin/referanslar", label: "Referanslar", hint: "Referans logoları" },
  { href: "/admin/sss", label: "SSS", hint: "Sıkça sorulan sorular" },
  { href: "/admin/slaytlar", label: "Slayt / Banner", hint: "Ana sayfa görselleri" },
  { href: "/admin/dosyalar", label: "Dosya Yöneticisi", hint: "Yüklenen dosyalar" },
  { href: "/admin/kullanicilar", label: "Kullanıcılar", hint: "Admin hesapları" },
  { href: "/admin/ayarlar", label: "Sistem Ayarları", hint: "Navbar, hakkımızda, iletişim" },
];

export default function AdminHomePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Yönetim Paneli</h1>
      <p className="mt-2 text-sm text-stone-500">Soldaki menüden veya buradan bir modül açın.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {MODULES.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-2xl bg-white p-5 shadow-sm hover:bg-stone-50">
            <p className="font-semibold">{item.label}</p>
            <p className="mt-1 text-sm text-stone-500">{item.hint}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
