import type { PriceDisplay, Product } from "./types";

function formatMoney(value: number, currency: "TRY" | "USD") {
  return new Intl.NumberFormat(currency === "TRY" ? "tr-TR" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function productPriceLabel(product: Pick<Product, "price_try" | "price_usd" | "price_display">) {
  const display: PriceDisplay = product.price_display || "try";
  const parts: string[] = [];
  if ((display === "try" || display === "both") && product.price_try != null) {
    parts.push(formatMoney(Number(product.price_try), "TRY"));
  }
  if ((display === "usd" || display === "both") && product.price_usd != null) {
    parts.push(formatMoney(Number(product.price_usd), "USD"));
  }
  return parts.join(" · ");
}

export function productStockLabel(product: Pick<Product, "in_stock" | "stock_qty">) {
  if (!product.in_stock || product.stock_qty <= 0) return "Stokta yok";
  return `Stokta ${product.stock_qty}`;
}
