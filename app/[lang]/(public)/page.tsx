import type { Metadata } from "next";
import { PageRenderer } from "@/components/public/page-renderer";
import { ProductShowcase } from "@/components/public/product-showcase";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";
import { parseLang } from "@/lib/i18n/params";
import { getHomepage, getPageModules, getShowcaseProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await parseLang(params);
  const page = await getHomepage();
  const copy = getDictionary(lang);
  return pageMetadata({
    locale: lang,
    route: "home",
    title: page?.title ?? copy.home.fallbackTitle,
    description: page?.meta_description,
    keywords: page?.meta_keywords,
  });
}

export default async function HomePage({ params }: Props) {
  const lang = await parseLang(params);
  const copy = getDictionary(lang);
  const [page, products] = await Promise.all([getHomepage(), getShowcaseProducts()]);

  if (!page) {
    return (
      <>
        <section className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="text-4xl font-semibold">{copy.home.fallbackTitle}</h1>
          <p className="mt-4 text-stone-600">{copy.home.fallbackLead}</p>
        </section>
        <ProductShowcase title={copy.home.showcase} products={products} locale={lang} />
      </>
    );
  }

  const assigned = page.render_mode === "modules" ? await getPageModules(page.id) : [];
  const modules = assigned.map((item) => item.modules).filter(Boolean);

  return (
    <>
      <PageRenderer page={page} modules={modules} />
      <ProductShowcase title={copy.home.showcase} products={products} locale={lang} />
    </>
  );
}
