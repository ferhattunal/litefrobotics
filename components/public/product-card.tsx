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
      className={`lf-product-card flex h-full flex-col overflow-hidden ${design.hoverPan ? "lf-product-card-pan" : ""}`}
      style={cardStyle(design)}
    >
      <div className="lf-product-card-image relative overflow-hidden bg-[#eef1f4]" style={imageRatioStyle(design)}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image.url} alt={product.name} className="h-full w-full object-contain p-4" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-stone-400">Görsel yok</div>
        )}
        <div className="absolute top-3 right-3 flex max-w-[calc(100%-1.5rem)] flex-col items-end gap-2">
          {stock ? (
            <span
              className="rounded-full px-3 py-1 text-[11px] font-semibold text-white"
              style={{ background: inStock ? "var(--lf-625)" : "#78716c" }}
            >
              {stock}
            </span>
          ) : null}
          {price ? (
            <span className="rounded-full bg-white px-3 py-1 text-[12px] font-bold text-stone-900 shadow-sm">
              {price}
            </span>
          ) : null}
        </div>
      </div>
      <div className="flex flex-1 flex-col" style={{ padding: design.padding }}>
        {category?.name ? (
          <p className="text-[11px] font-semibold tracking-[0.14em] uppercase" style={{ color: "var(--lf-625)" }}>
            {category.name}
          </p>
        ) : null}
        {brandLine ? <p className="mt-1 text-sm text-stone-500">{brandLine}</p> : null}
        <h3 className="mt-2 font-semibold tracking-tight text-stone-900" style={{ fontSize: design.titleFontSize }}>
          {product.name}
        </h3>
        <span
          className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-[12px] font-semibold tracking-[0.12em] text-white uppercase"
          style={{ background: "var(--lf-625)", marginTop: 16 }}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3-3" />
          </svg>
          Ürünü incele
        </span>
      </div>
    </Link>
  );
}
