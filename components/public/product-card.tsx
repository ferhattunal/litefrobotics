import Link from "next/link";
import { cardStyle, imageRatioStyle, resolveCardDesign } from "@/lib/card-design";
import { productPriceLabel, productStockBadge } from "@/lib/product-display";
import type { Category, Product, ProductImage } from "@/lib/types";

type Props = {
  product: Product & { product_images?: ProductImage[] };
  category?: Category | null;
};

export function ProductCard({ product, category }: Props) {
  const design = resolveCardDesign(product, category);
  const image = product.product_images?.slice().sort((a, b) => a.sort_order - b.sort_order)[0];
  const price = product.show_price_on_card !== false ? productPriceLabel(product) : "";
  const stock = product.show_stock_badge_on_card !== false ? productStockBadge(product) : "";
  const inStock = product.in_stock && product.stock_qty > 0;
  const brandLine = [product.brand, product.series || product.model].filter(Boolean).join(" · ");

  return (
    <Link
      href={`/urunler/${product.slug}`}
      className={`lf-product-card flex h-full min-w-0 flex-col overflow-hidden ${design.hoverPan ? "lf-product-card-pan" : ""}`}
      style={cardStyle(design)}
    >
      <div className="lf-product-card-image relative w-full overflow-hidden bg-[#eef1f4]" style={imageRatioStyle(design)}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image.url} alt={product.name} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-stone-400">Görsel yok</div>
        )}
        <div className="absolute top-2 right-2 z-10 flex max-w-[calc(100%-1rem)] flex-col items-end gap-1.5">
          {stock ? (
            <span
              className="rounded-full px-2.5 py-1 text-[10px] font-semibold text-white"
              style={{ background: inStock ? "var(--lf-625)" : "#78716c" }}
            >
              {stock}
            </span>
          ) : null}
          {price ? (
            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-stone-900 shadow-sm">
              {price}
            </span>
          ) : null}
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col" style={{ padding: design.padding }}>
        {category?.name ? (
          <p className="text-[11px] font-semibold tracking-[0.14em] uppercase" style={{ color: "var(--lf-625)" }}>
            {category.name}
          </p>
        ) : null}
        {brandLine ? <p className="mt-1 truncate text-sm text-stone-500">{brandLine}</p> : null}
        <h3
          className="mt-1 line-clamp-3 font-semibold tracking-tight text-stone-900"
          style={{ fontSize: `${design.titleFontSize}px` }}
        >
          {product.name}
        </h3>
        <span
          className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold tracking-[0.12em] text-white uppercase"
          style={{ background: "var(--lf-625)", marginTop: 12 }}
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3-3" />
          </svg>
          Ürünü incele
        </span>
      </div>
    </Link>
  );
}
