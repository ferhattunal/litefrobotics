import type { Metadata } from "next";
import { LeadForm } from "@/components/public/lead-form";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";
import { parseLang } from "@/lib/i18n/params";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ ok?: string; utm_source?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await parseLang(params);
  const copy = getDictionary(lang);
  return pageMetadata({ locale: lang, route: "quote", title: copy.quote.title });
}

export default async function QuotePage({ params, searchParams }: Props) {
  const lang = await parseLang(params);
  const copy = getDictionary(lang);
  const { ok, utm_source } = await searchParams;
  return (
    <section className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-4xl font-semibold">{copy.quote.title}</h1>
      {ok ? <p className="mt-4 text-emerald-700">{copy.quote.success}</p> : null}
      <div className="mt-8">
        <LeadForm locale={lang} utmSource={utm_source} />
      </div>
    </section>
  );
}
