import type { ReactNode } from "react";
import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";

const LINKS = [
  { href: "/admin", label: "Özet" },
  { href: "/admin/moduller", label: "Modüller" },
  { href: "/admin/landing", label: "Landing page" },
  { href: "/admin/navbar-footer", label: "Navbar / Footer" },
  { href: "/admin/kategoriler", label: "Kategoriler" },
  { href: "/admin/urunler", label: "Ürünler" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/sayfalar/hakkimizda", label: "Hakkımızda" },
  { href: "/admin/sayfalar/iletisim", label: "İletişim" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-100 lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="bg-stone-950 text-stone-100">
        <div className="px-5 py-6">
          <p className="text-xs tracking-[0.2em] text-orange-300 uppercase">Admin</p>
          <p className="mt-1 text-lg font-semibold">Litef Robotics</p>
        </div>
        <nav className="grid gap-1 px-3 pb-6">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-stone-300 hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction} className="px-5 pb-6">
          <button type="submit" className="text-sm text-stone-400 hover:text-white">
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
