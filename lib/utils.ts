import { RESERVED_SLUGS } from "./constants";

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replaceAll("ş", "s")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replaceAll("ı", "i")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isReservedSlug(slug: string) {
  return RESERVED_SLUGS.includes(slug as (typeof RESERVED_SLUGS)[number]);
}

export function extractMapsEmbedUrl(input: string) {
  const value = input.trim();
  if (!value) return "";
  const iframeSrc = value.match(/src=["']([^"']+)["']/i);
  if (iframeSrc?.[1]) return iframeSrc[1];
  return value;
}

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
}

export function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
