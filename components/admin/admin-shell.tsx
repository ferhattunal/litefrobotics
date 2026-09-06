"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/actions/auth";

type NavLinkItem = { href: string; label: string };
type NavGroup = { group: string; items: NavLinkItem[] };
type NavEntry = NavLinkItem | NavGroup;

const NAV: NavEntry[] = [
  { href: "/admin", label: "Özet" },
  { href: "/admin/landing", label: "Sayfa Düzeni" },
  { href: "/admin/moduller", label: "Modül Oluşturma" },
  {
    group: "E-TİCARET",
    items: [
      { href: "/admin/urunler", label: "Ürünler" },
      { href: "/admin/kategoriler", label: "Kategoriler" },
    ],
  },
  {
    group: "İÇERİK",
    items: [
      { href: "/admin/teklif-talepleri", label: "Teklif Talepleri" },
      { href: "/admin/bayiler", label: "Bayiler" },
      { href: "/admin/fiyat-listesi", label: "Fiyat Listesi" },
      { href: "/admin/kiralama", label: "Kiralama" },
      { href: "/admin/galeri", label: "Galeri" },
      { href: "/admin/blog", label: "Haberler" },
      { href: "/admin/referanslar", label: "Referanslar" },
      { href: "/admin/sss", label: "SSS" },
      { href: "/admin/slaytlar", label: "Slayt / Banner" },
    ],
  },
  {
    group: "SİSTEM",
    items: [
      { href: "/admin/dosyalar", label: "Dosya Yöneticisi" },
      { href: "/admin/kullanicilar", label: "Kullanıcılar" },
      { href: "/admin/ayarlar", label: "Sistem Ayarları" },
    ],
  },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      className={`block rounded-md px-3 py-2 text-sm ${
        active ? "bg-white/15 text-white" : "text-emerald-50/80 hover:bg-white/10 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-100 lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="bg-[#163a2a] text-white">
        <div className="px-5 py-6">
          <p className="text-lg font-semibold tracking-wide">LiTEF</p>
          <p className="text-xs uppercase tracking-[0.16em] text-emerald-200/80">Yönetim Paneli</p>
        </div>
        <nav className="grid gap-4 px-3 pb-8">
          {NAV.map((item) =>
            "group" in item ? (
              <div key={item.group}>
                <p className="px-3 pb-1 text-[11px] font-semibold tracking-[0.14em] text-emerald-200/70">
                  {item.group}
                </p>
                <div className="grid gap-0.5">
                  {item.items.map((link) => (
                    <NavLink key={link.href} href={link.href} label={link.label} />
                  ))}
                </div>
              </div>
            ) : (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ),
          )}
        </nav>
        <form action={logoutAction} className="px-5 pb-6">
          <button type="submit" className="text-sm text-emerald-100/70 hover:text-white">
            Çıkış yap
          </button>
        </form>
      </aside>
      <div className="min-w-0">
        <div className="flex items-center justify-between border-b border-stone-200 bg-white px-6 py-4">
          <p className="text-sm text-stone-500">İçerik yönetim paneli</p>
          <Link href="/" className="text-sm text-orange-700 hover:underline" target="_blank">
            Siteyi gör
          </Link>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
