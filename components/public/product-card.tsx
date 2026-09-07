import Link from "next/link";
import { cardStyle, imageRatioStyle, resolveCardDesign } from "@/lib/card-design";
import { productPriceLabel, productStockLabel } from "@/lib/product-display";
import type { Category, Product, ProductImage } from "@/lib/types";

type Props = {
  product: Product & { product_images?: ProductImage[] };
  category?: Category | null;
};

export function ProductCard({ product, category }: Props) {
  const design = resolveCardDesign(product, category);
  const image = product.product_images?.slice().sort((a, b) => a.sort_order - b.sort_order)[0];
  const price = product.show_price_on_card !== false ? productPriceLabel(product) : "";
  const stock = product.show_stock_badge_on_card !== false ? productStockLabel(product) : "";

  return (
    <Link
      href={`/urunler/${product.slug}`}
      className={`lf-product-card block overflow-hidden ${design.hoverPan ? "lf-product-card-pan" : ""}`}
      style={cardStyle(design)}
    >
      <div className="lf-product-card-image relative overflow-hidden bg-stone-100" style={imageRatioStyle(design)}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image.url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-stone-400">Görsel yok</div>
        )}
        {product.featured ? (
          <span
            className="absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
            style={{ background: design.accentColor }}
          >
            Öne çıkan
          </span>
        ) : null}
        {stock ? (
          <span className="absolute top-2 right-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-stone-700">
            {stock}
          </span>
        ) : null}
      </div>
      <div style={{ padding: design.padding }}>
        <h3 className="font-semibold text-stone-900" style={{ fontSize: design.titleFontSize }}>
          {product.name}
        </h3>
        {price ? (
          <p className="mt-1 text-sm font-medium" style={{ color: design.accentColor }}>
            {price}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
