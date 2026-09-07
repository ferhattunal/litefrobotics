import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/public/product-card";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  return {
    title: category?.name ?? "Kategori",
    description: category?.hero_text || undefined,
  };
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getProductsByCategory(category.id);

  return (
    <div>
      <section className="relative min-h-[320px] overflow-hidden bg-stone-900 text-white">
        {category.hero_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={category.hero_image_url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
        ) : null}
        <div className="relative mx-auto max-w-6xl px-6 py-24">
          <p className="text-sm tracking-[0.2em] text-orange-300 uppercase">Kategori</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
            {category.hero_title || category.name}
          </h1>
          {category.hero_text ? <p className="mt-4 max-w-2xl text-lg text-stone-200">{category.hero_text}</p> : null}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} category={category} />
          ))}
        </div>
        {!products.length ? <p className="text-stone-500">Bu kategoride henüz ürün yok.</p> : null}
      </section>
    </div>
  );
}
