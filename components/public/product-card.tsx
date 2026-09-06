import Link from "next/link";
import { cardStyle, resolveCardDesign } from "@/lib/card-design";
import type { Category, Product, ProductImage } from "@/lib/types";

type Props = {
  product: Product & { product_images?: ProductImage[] };
  category?: Category | null;
};

export function ProductCard({ product, category }: Props) {
  const design = resolveCardDesign(product, category);
  const image = product.product_images?.slice().sort((a, b) => a.sort_order - b.sort_order)[0];

  return (
    <Link
      href={`/urunler/${product.slug}`}
      className="block overflow-hidden transition hover:-translate-y-0.5"
      style={cardStyle(design)}
    >
      <div className="overflow-hidden bg-stone-100" style={{ height: design.imageHeight }}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image.url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-stone-400">Görsel yok</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-stone-900" style={{ fontSize: design.titleFontSize }}>
          {product.name}
        </h3>
      </div>
    </Link>
  );
}
