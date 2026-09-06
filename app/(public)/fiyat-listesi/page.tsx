import type { Metadata } from "next";
import { getPriceLists } from "@/lib/queries-content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Fiyat Listesi" };

export default async function PriceListPage() {
  const items = (await getPriceLists()).filter((item) => item.published);
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold">Fiyat Listesi</h1>
      <div className="mt-8 grid gap-3">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.file_url ?? "#"}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl bg-white px-5 py-4 hover:bg-stone-50"
          >
            {item.title}
          </a>
        ))}
        {!items.length ? <p className="text-stone-500">Henüz liste yok.</p> : null}
      </div>
    </section>
  );
}
