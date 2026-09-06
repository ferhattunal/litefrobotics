import type { Metadata } from "next";
import Link from "next/link";
import { getRentals } from "@/lib/queries-content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Kiralama" };

export default async function RentalsPage() {
  const items = (await getRentals()).filter((item) => item.published);
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-semibold">Kiralama</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {items.map((item) => (
          <Link key={item.id} href={`/kiralama/${item.slug}`} className="overflow-hidden rounded-2xl bg-white">
            <div className="h-44 bg-stone-200">
              {item.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image_url} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="p-5">
              <h2 className="text-xl font-semibold">{item.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
