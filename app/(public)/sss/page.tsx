import type { Metadata } from "next";
import { getFaqs } from "@/lib/queries-content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "SSS" };

export default async function FaqPage() {
  const items = await getFaqs();
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold">Sıkça Sorulan Sorular</h1>
      <div className="mt-8 grid gap-4">
        {items.map((item) => (
          <article key={item.id} className="rounded-2xl bg-white p-5">
            <h2 className="font-semibold">{item.question}</h2>
            <p className="mt-2 text-stone-600">{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
