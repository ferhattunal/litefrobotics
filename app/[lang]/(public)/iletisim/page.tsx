import type { Metadata } from "next";
import { LeadForm } from "@/components/public/lead-form";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";
import { parseLang } from "@/lib/i18n/params";
import { getContactPage } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await parseLang(params);
  const page = await getContactPage();
  const copy = getDictionary(lang);
  return pageMetadata({
    locale: lang,
    route: "contact",
    title: page?.title ?? copy.contact.title,
    description: page?.meta_description,
    keywords: page?.meta_keywords,
  });
}

export default async function ContactPage({ params }: Props) {
  const lang = await parseLang(params);
  const copy = getDictionary(lang);
  const page = await getContactPage();

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">{page?.title ?? copy.contact.title}</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <div
            className="prose-litef space-y-4 text-stone-700"
            dangerouslySetInnerHTML={{ __html: page?.content ?? "" }}
          />
          <dl className="mt-8 grid gap-3 text-sm">
            {page?.address ? (
              <div>
                <dt className="font-semibold">{copy.common.address}</dt>
                <dd className="text-stone-600">{page.address}</dd>
              </div>
            ) : null}
            {page?.phone ? (
              <div>
                <dt className="font-semibold">{copy.common.phone}</dt>
                <dd className="text-stone-600">{page.phone}</dd>
              </div>
            ) : null}
            {page?.email ? (
              <div>
                <dt className="font-semibold">{copy.common.email}</dt>
                <dd className="text-stone-600">{page.email}</dd>
              </div>
            ) : null}
          </dl>
          <div className="mt-10">
            <h2 className="text-xl font-semibold">{getDictionary(lang).quote.title}</h2>
            <div className="mt-4">
              <LeadForm locale={lang} />
            </div>
          </div>
        </div>
        {page?.maps_embed_url ? (
          <iframe
            src={page.maps_embed_url}
            title={copy.contact.mapTitle}
            className="min-h-[360px] w-full rounded-2xl border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="flex min-h-[240px] items-center justify-center rounded-2xl bg-stone-200 text-stone-500">
            {copy.contact.mapMissing}
          </div>
        )}
      </div>
    </section>
  );
}
