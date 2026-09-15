import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";
import { parseLang } from "@/lib/i18n/params";
import { getAboutPage } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await parseLang(params);
  const page = await getAboutPage();
  const copy = getDictionary(lang);
  return pageMetadata({
    locale: lang,
    route: "about",
    title: page?.title ?? copy.about.title,
    description: page?.meta_description,
    keywords: page?.meta_keywords,
  });
}

export default async function AboutPage({ params }: Props) {
  const lang = await parseLang(params);
  const copy = getDictionary(lang);
  const page = await getAboutPage();

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">{page?.title ?? copy.about.title}</h1>
      <div
        className="prose-litef mt-8 space-y-4 text-stone-700 [&_p]:leading-7"
        dangerouslySetInnerHTML={{ __html: page?.content ?? "" }}
      />
    </section>
  );
}
