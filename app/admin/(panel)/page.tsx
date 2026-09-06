import Link from "next/link";

const MODULES = [
  { href: "/admin/landing", label: "Sayfa Düzeni" },
  { href: "/admin/moduller", label: "Modül Oluşturma" },
  { href: "/admin/urunler", label: "Ürünler" },
  { href: "/admin/kategoriler", label: "Kategoriler" },
  { href: "/admin/teklif-talepleri", label: "Teklif Talepleri" },
  { href: "/admin/bayiler", label: "Bayiler" },
  { href: "/admin/fiyat-listesi", label: "Fiyat Listesi" },
  { href: "/admin/kiralama", label: "Kiralama" },
  { href: "/admin/galeri", label: "Galeri" },
  { href: "/admin/blog", label: "Haberler" },
  { href: "/admin/referanslar", label: "Referanslar" },
  { href: "/admin/sss", label: "SSS" },
  { href: "/admin/slaytlar", label: "Slayt / Banner" },
  { href: "/admin/dosyalar", label: "Dosya Yöneticisi" },
  { href: "/admin/kullanicilar", label: "Kullanıcılar" },
  { href: "/admin/ayarlar", label: "Sistem Ayarları" },
];

export default function AdminHomePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Yönetim Paneli</h1>
      <p className="mt-2 text-sm text-stone-500">Örnekteki tüm menü maddeleri solda.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {MODULES.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-2xl bg-white p-5 shadow-sm hover:bg-stone-50">
            <p className="font-semibold">{item.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
