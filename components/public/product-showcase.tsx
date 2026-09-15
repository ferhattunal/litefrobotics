import { ProductCard } from "@/components/public/product-card";
import type { Locale } from "@/lib/i18n/config";
import type { ProductWithRelations } from "@/lib/types";

export function ProductShowcase({
  title,
  products,
  locale = "tr",
}: {
  title: string;
  products: ProductWithRelations[];
  locale?: Locale | string;
}) {
  if (!products.length) return null;
  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} category={product.categories} locale={locale} />
        ))}
      </div>
    </section>
  );
}
