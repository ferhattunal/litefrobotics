import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicImage } from "@/components/public/public-image";
import { ProductCard } from "@/components/public/product-card";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";
import { parseLang } from "@/lib/i18n/params";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lang = await parseLang(params);
  const category = await getCategoryBySlug(slug);
  return pageMetadata({
    locale: lang,
    route: "categories",
    slug,
    title: category?.name ?? getDictionary(lang).categories.kicker,
    description: category?.hero_text,
  });
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const lang = await parseLang(params);
  const copy = getDictionary(lang);
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getProductsByCategory(category.id);

  return (
    <div>
      <section className="relative min-h-[320px] overflow-hidden bg-stone-900 text-white">
        {category.hero_image_url ? (
          <PublicImage src={category.hero_image_url} alt="" fill className="object-cover opacity-40" sizes="100vw" />
        ) : null}
        <div className="relative mx-auto max-w-6xl px-6 py-24">
          <p className="text-sm tracking-[0.2em] text-orange-300 uppercase">{copy.categories.kicker}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
            {category.hero_title || category.name}
          </h1>
          {category.hero_text ? <p className="mt-4 max-w-2xl text-lg text-stone-200">{category.hero_text}</p> : null}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} category={category} locale={lang} />
          ))}
        </div>
        {!products.length ? <p className="text-stone-500">{copy.categories.none}</p> : null}
      </section>
    </div>
  );
}
