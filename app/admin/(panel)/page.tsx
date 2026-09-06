import Link from "next/link";
import { getDashboardCounts } from "@/lib/queries";

export default async function AdminHomePage() {
  const counts = await getDashboardCounts();
  const cards = [
    { href: "/admin/landing", label: "Sayfa Düzeni", value: counts.pages },
    { href: "/admin/moduller", label: "Modüller", value: counts.modules },
    { href: "/admin/kategoriler", label: "Kategoriler", value: counts.categories },
    { href: "/admin/urunler", label: "Ürünler", value: counts.products },
    { href: "/admin/blog", label: "Blog yazıları", value: counts.posts },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Özet</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-stone-500">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
