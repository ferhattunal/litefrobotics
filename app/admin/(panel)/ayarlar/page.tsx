import Link from "next/link";

const LINKS = [
  { href: "/admin/navbar-footer", label: "Navbar / Footer" },
  { href: "/admin/sayfalar/hakkimizda", label: "Hakkımızda" },
  { href: "/admin/sayfalar/iletisim", label: "İletişim" },
];

export default function SettingsAdminPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Sistem Ayarları</h1>
      <div className="grid max-w-xl gap-3">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-2xl bg-white px-5 py-4 hover:bg-stone-50">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
