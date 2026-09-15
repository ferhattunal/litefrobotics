import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PageRenderer } from "@/components/public/page-renderer";
import { ProductShowcase } from "@/components/public/product-showcase";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localePath } from "@/lib/i18n/href";
import { pageMetadata } from "@/lib/i18n/metadata";
import { isReservedSlug } from "@/lib/utils";
import { getPageBySlug, getPageModules, getProductsForLandingPage } from "@/lib/queries";
import { parseLang } from "@/lib/i18n/params";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lang = await parseLang(params);
  const page = await getPageBySlug(slug);
  return pageMetadata({
    locale: lang,
    route: "cms",
    slug,
    title: page?.title ?? "Page",
    description: page?.meta_description,
    keywords: page?.meta_keywords,
  });
}

export default async function LandingSlugPage({ params }: Props) {
  const { slug } = await params;
  const lang = await parseLang(params);
  if (isReservedSlug(slug)) notFound();

  const page = await getPageBySlug(slug);
  if (!page) notFound();
  if (page.is_homepage) redirect(localePath(lang, "home"));

  const assigned = page.render_mode === "modules" ? await getPageModules(page.id) : [];
  const modules = assigned.map((item) => item.modules).filter(Boolean);
  const products = await getProductsForLandingPage(page.id);
  const copy = getDictionary(lang);

  return (
    <>
      <PageRenderer page={page} modules={modules} />
      <ProductShowcase title={copy.cms.products} products={products} locale={lang} />
    </>
  );
}
