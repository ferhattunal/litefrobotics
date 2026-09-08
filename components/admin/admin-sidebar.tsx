import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";
import { Icons } from "@/components/admin/admin-icons";
import type { UserRole } from "@/lib/types";

const TOP = [
  { href: "/admin", label: "Özet", icon: "grid" },
  { href: "/admin/landing", label: "Sayfa Düzeni", icon: "layers" },
  { href: "/admin/moduller", label: "Modül Oluşturma", icon: "grid" },
  { href: "/admin/menuler", label: "Menüler", icon: "menu" },
] as const;

const GROUPS = [
  {
    group: "E-TİCARET",
    items: [
      { href: "/admin/urunler", label: "Ürünler", icon: "box" },
      { href: "/admin/kategoriler", label: "Kategoriler", icon: "tag" },
    ],
  },
  {
    group: "İÇERİK",
    items: [
      { href: "/admin/teklif-talepleri", label: "Teklif Talepleri", icon: "handshake" },
      { href: "/admin/bayiler", label: "Bayiler", icon: "pin" },
      { href: "/admin/fiyat-listesi", label: "Fiyat Listesi", icon: "file" },
      { href: "/admin/kiralama", label: "Kiralama", icon: "key" },
      { href: "/admin/galeri", label: "Galeri", icon: "image" },
      { href: "/admin/blog", label: "Haberler", icon: "news" },
      { href: "/admin/referanslar", label: "Referanslar", icon: "award" },
      { href: "/admin/sss", label: "SSS", icon: "help" },
      { href: "/admin/slaytlar", label: "Slayt / Banner", icon: "slides" },
    ],
  },
  {
    group: "SİSTEM",
    items: [
      { href: "/admin/dosyalar", label: "Dosya Yöneticisi", icon: "folder" },
      { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: "users", adminOnly: true },
      { href: "/admin/ayarlar", label: "Sistem Ayarları", icon: "gear", adminOnly: true },
    ],
  },
] as const;

function Item({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: keyof typeof Icons;
}) {
  const Icon = Icons[icon];
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] text-stone-700 hover:bg-stone-100"
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

export function AdminSidebar({ role = "admin" }: { role?: UserRole }) {
  return (
    <aside className="flex max-h-screen flex-col border-r border-stone-200 bg-white lg:sticky lg:top-0">
      <Link href="/admin" className="flex items-center gap-3 px-4 py-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c2410c] text-[10px] font-bold tracking-wide text-white">
          LiTEF
        </span>
        <span>
          <span className="block text-[15px] font-semibold leading-tight text-stone-900">Litef Robotics</span>
          <span className="block text-[11px] tracking-[0.14em] text-stone-400">YÖNETİM PANELİ</span>
        </span>
      </Link>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-6">
        <div className="space-y-0.5">
          {TOP.map((item) => (
            <Item key={item.href} {...item} />
          ))}
        </div>
        {GROUPS.map((group) => {
          const items = group.items.filter((item) => !("adminOnly" in item && item.adminOnly) || role === "admin");
          if (!items.length) return null;
          return (
            <div key={group.group}>
              <p className="px-3 pb-1.5 text-[10px] font-semibold tracking-[0.18em] text-stone-400">{group.group}</p>
              <div className="space-y-0.5">
                {items.map((item) => (
                  <Item key={item.href} href={item.href} label={item.label} icon={item.icon} />
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      <form action={logoutAction} className="border-t border-stone-200 px-4 py-4">
        <button type="submit" className="text-sm text-stone-400 hover:text-stone-800">
          Çıkış yap
        </button>
      </form>
    </aside>
  );
}
