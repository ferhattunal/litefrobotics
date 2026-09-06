import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";
import { Icons } from "@/components/admin/admin-icons";

const TOP = [
  { href: "/admin/landing", label: "Sayfa Düzeni", icon: "layers" },
  { href: "/admin/moduller", label: "Modül Oluşturma", icon: "grid" },
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
      { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: "users" },
      { href: "/admin/ayarlar", label: "Sistem Ayarları", icon: "gear" },
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
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] text-white/90 hover:bg-white/10"
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

export function AdminSidebar() {
  return (
    <aside className="flex max-h-screen flex-col bg-[#1b4332] text-white lg:sticky lg:top-0">
      <Link href="/admin" className="flex items-center gap-3 px-4 py-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c2410c] text-[10px] font-bold tracking-wide">
          LiTEF
        </span>
        <span>
          <span className="block text-[15px] font-semibold leading-tight">Litef Robotics</span>
          <span className="block text-[11px] tracking-[0.14em] text-white/70">YÖNETİM PANELİ</span>
        </span>
      </Link>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-6">
        <div className="space-y-0.5">
          {TOP.map((item) => (
            <Item key={item.href} {...item} />
          ))}
        </div>
        {GROUPS.map((group) => (
          <div key={group.group}>
            <p className="px-3 pb-1.5 text-[10px] font-semibold tracking-[0.18em] text-white/45">
              {group.group}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <Item key={item.href} {...item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <form action={logoutAction} className="border-t border-white/10 px-4 py-4">
        <button type="submit" className="text-sm text-white/60 hover:text-white">
          Çıkış yap
        </button>
      </form>
    </aside>
  );
}
