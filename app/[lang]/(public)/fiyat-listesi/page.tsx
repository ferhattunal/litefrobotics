import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";
import { parseLang } from "@/lib/i18n/params";
import { getPriceLists } from "@/lib/queries-content";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await parseLang(params);
  return pageMetadata({ locale: lang, route: "priceList", title: getDictionary(lang).priceList.title });
}

export default async function PriceListPage({ params }: Props) {
  const lang = await parseLang(params);
  const copy = getDictionary(lang);
  const items = (await getPriceLists()).filter((item) => item.published);
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold">{copy.priceList.title}</h1>
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
        {!items.length ? <p className="text-stone-500">{copy.priceList.empty}</p> : null}
      </div>
    </section>
  );
}
