import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";
import { parseLang } from "@/lib/i18n/params";
import { getFaqs } from "@/lib/queries-content";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await parseLang(params);
  return pageMetadata({ locale: lang, route: "faq", title: getDictionary(lang).faq.title });
}

export default async function FaqPage({ params }: Props) {
  const lang = await parseLang(params);
  const copy = getDictionary(lang);
  const items = await getFaqs();
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold">{copy.faq.title}</h1>
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
