export const RESERVED_SLUGS = [
  "admin",
  "api",
  "blog",
  "haberler",
  "kategoriler",
  "urunler",
  "hakkimizda",
  "iletisim",
  "login",
  "teklif",
  "bayiler",
  "fiyat-listesi",
  "kiralama",
  "galeri",
  "referanslar",
  "sss",
] as const;

export const STORAGE_BUCKETS = [
  "product-images",
  "product-pdfs",
  "category-heroes",
  "blog-images",
  "page-assets",
  "media",
  "documents",
] as const;

export const FILE_MANAGER_BUCKETS = ["media", "documents"] as const;

export const FOLDER_PLACEHOLDER = ".keep";

export const IMAGE_RATIOS = ["1/1", "4/3", "16/9", "3/4", "auto"] as const;

export const COLOR_PALETTE = [
  "#ffffff",
  "#111827",
  "#1c1917",
  "#0f766e",
  "#c2410c",
  "#1d4ed8",
  "#7c3aed",
  "#be123c",
  "#f5f5f4",
  "#e7e5e4",
  "#fdba74",
  "#bbf7d0",
] as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[number];

export const SHADOW_PRESETS: Record<string, string> = {
  none: "none",
  sm: "0 1px 3px rgba(15, 23, 42, 0.08)",
  md: "0 4px 16px rgba(15, 23, 42, 0.10)",
  lg: "0 12px 32px rgba(15, 23, 42, 0.14)",
  xl: "0 20px 50px rgba(15, 23, 42, 0.18)",
};
