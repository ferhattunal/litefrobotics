import type { Metadata } from "next";
import { getDealers } from "@/lib/queries-content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Bayiler" };

export default async function DealersPage() {
  const dealers = await getDealers();
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-semibold">Bayiler</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {dealers.filter((item) => item.published).map((item) => (
          <article key={item.id} className="rounded-2xl bg-white p-6">
            <h2 className="text-xl font-semibold">{item.name}</h2>
            <p className="mt-2 text-stone-600">{item.city}</p>
            <p className="text-stone-600">{item.address}</p>
            <p className="mt-3 text-sm">{item.phone}</p>
            <p className="text-sm">{item.email}</p>
          </article>
        ))}
        {!dealers.length ? <p className="text-stone-500">Henüz bayi eklenmedi.</p> : null}
      </div>
    </section>
  );
}
