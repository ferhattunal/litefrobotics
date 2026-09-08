import Link from "next/link";
import { getDashboardCounts } from "@/lib/queries";
import { getQuotes } from "@/lib/queries-content";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [counts, quotes] = await Promise.all([getDashboardCounts(), getQuotes()]);
  const recent = quotes.slice(0, 8);
  const cards = [
    { label: "Ürün", value: counts.products, href: "/admin/urunler" },
    { label: "Yeni talep", value: counts.quotesNew, href: "/admin/teklif-talepleri" },
    { label: "Sayfa", value: counts.pages, href: "/admin/landing" },
    { label: "Kategori", value: counts.categories, href: "/admin/kategoriler" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Özet</h1>
      <p className="mt-2 text-sm text-stone-500">Mağaza ve talep durumuna hızlı bakış.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="rounded-2xl bg-white p-5 shadow-sm hover:bg-stone-50">
            <p className="text-sm text-stone-500">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{card.value}</p>
          </Link>
        ))}
      </div>

      <section className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="font-semibold">Son teklif talepleri</h2>
          <Link href="/admin/teklif-talepleri" className="text-sm text-orange-700 hover:underline">
            Tümünü gör
          </Link>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500">
            <tr>
              <th className="px-5 py-3">Tarih</th>
              <th className="px-5 py-3">Ad</th>
              <th className="px-5 py-3">Ürün</th>
              <th className="px-5 py-3">Durum</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((quote) => (
              <tr key={quote.id} className="border-t border-stone-100">
                <td className="px-5 py-3 text-stone-500">{formatDate(quote.created_at)}</td>
                <td className="px-5 py-3">
                  <p className="font-medium">{quote.name}</p>
                  <p className="text-xs text-stone-400">{quote.company}</p>
                </td>
                <td className="px-5 py-3">{quote.product_name || "—"}</td>
                <td className="px-5 py-3 capitalize">{quote.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!recent.length ? <p className="px-5 py-8 text-sm text-stone-400">Henüz teklif talebi yok.</p> : null}
      </section>
    </div>
  );
}
