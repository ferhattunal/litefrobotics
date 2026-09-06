import type { Metadata } from "next";
import { getReferences } from "@/lib/queries-content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Referanslar" };

export default async function ReferencesPage() {
  const items = await getReferences();
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-semibold">Referanslar</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {items.map((item) => {
          const inner = (
            <>
              {item.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.logo_url} alt={item.name} className="mx-auto h-16 object-contain" />
              ) : null}
              <p className="mt-3 font-medium">{item.name}</p>
            </>
          );
          return item.url ? (
            <a key={item.id} href={item.url} target="_blank" rel="noreferrer" className="rounded-2xl bg-white p-6 text-center">
              {inner}
            </a>
          ) : (
            <div key={item.id} className="rounded-2xl bg-white p-6 text-center">
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}
