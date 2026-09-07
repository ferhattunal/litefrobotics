import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PageRenderer } from "@/components/public/page-renderer";
import { ProductShowcase } from "@/components/public/product-showcase";
import { RESERVED_SLUGS } from "@/lib/constants";
import { getPageBySlug, getPageModules, getProductsForLandingPage } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  return {
    title: page?.title ?? "Sayfa",
    description: page?.meta_description || undefined,
    keywords: page?.meta_keywords || undefined,
  };
}

export default async function LandingSlugPage({ params }: Props) {
  const { slug } = await params;
  if (RESERVED_SLUGS.includes(slug as (typeof RESERVED_SLUGS)[number])) {
    notFound();
  }

  const page = await getPageBySlug(slug);
  if (!page) notFound();
  if (page.is_homepage) redirect("/");

  const assigned = page.render_mode === "modules" ? await getPageModules(page.id) : [];
  const modules = assigned.map((item) => item.modules).filter(Boolean);
  const products = await getProductsForLandingPage(page.id);

  return (
    <>
      <PageRenderer page={page} modules={modules} />
      <ProductShowcase title="Ürünler" products={products} />
    </>
  );
}
