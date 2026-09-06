export const RESERVED_SLUGS = [
  "admin",
  "api",
  "blog",
  "kategoriler",
  "urunler",
  "hakkimizda",
  "iletisim",
  "login",
] as const;

export const STORAGE_BUCKETS = [
  "product-images",
  "product-pdfs",
  "category-heroes",
  "blog-images",
  "page-assets",
] as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[number];

export const SHADOW_PRESETS: Record<string, string> = {
  none: "none",
  sm: "0 1px 3px rgba(15, 23, 42, 0.08)",
  md: "0 4px 16px rgba(15, 23, 42, 0.10)",
  lg: "0 12px 32px rgba(15, 23, 42, 0.14)",
  xl: "0 20px 50px rgba(15, 23, 42, 0.18)",
};
