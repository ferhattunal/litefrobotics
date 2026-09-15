import { locales, type Locale } from "./config";

export const routeKeys = [
  "home",
  "products",
  "categories",
  "quote",
  "contact",
  "about",
  "blog",
  "news",
  "rental",
  "gallery",
  "dealers",
  "faq",
  "priceList",
  "references",
] as const;

export type RouteKey = (typeof routeKeys)[number];

export const pathnames: Record<Exclude<RouteKey, "home">, Record<Locale, string>> = {
  products: { tr: "urunler", en: "products", bg: "produkti", az: "mehsullar" },
  categories: { tr: "kategoriler", en: "categories", bg: "kategorii", az: "kateqoriyalar" },
  quote: { tr: "teklif", en: "quote", bg: "oferti", az: "teklif" },
  contact: { tr: "iletisim", en: "contact", bg: "kontakt", az: "elaqe" },
  about: { tr: "hakkimizda", en: "about", bg: "za-nas", az: "haqqimizda" },
  blog: { tr: "blog", en: "blog", bg: "blog", az: "blog" },
  news: { tr: "haberler", en: "news", bg: "novini", az: "xeberler" },
  rental: { tr: "kiralama", en: "rental", bg: "naem", az: "icare" },
  gallery: { tr: "galeri", en: "gallery", bg: "galeriya", az: "qalereya" },
  dealers: { tr: "bayiler", en: "dealers", bg: "distibutori", az: "dilerler" },
  faq: { tr: "sss", en: "faq", bg: "chzv", az: "tss" },
  priceList: { tr: "fiyat-listesi", en: "price-list", bg: "cenova-lista", az: "qiymet-siyahisi" },
  references: { tr: "referanslar", en: "references", bg: "referentsii", az: "referanslar" },
};

const diskBySegment = new Map<string, Exclude<RouteKey, "home">>();
const keyByDisk = new Map<string, Exclude<RouteKey, "home">>();

for (const key of Object.keys(pathnames) as Exclude<RouteKey, "home">[]) {
  keyByDisk.set(pathnames[key].tr, key);
  for (const locale of locales) {
    diskBySegment.set(`${locale}:${pathnames[key][locale]}`, key);
    diskBySegment.set(pathnames[key][locale], key);
  }
}

export function diskSegment(key: Exclude<RouteKey, "home">) {
  return pathnames[key].tr;
}

export function localizedSegment(locale: Locale, key: Exclude<RouteKey, "home">) {
  return pathnames[key][locale];
}

export function routeKeyFromSegment(segment: string, locale?: Locale): Exclude<RouteKey, "home"> | null {
  if (locale) {
    return diskBySegment.get(`${locale}:${segment}`) ?? keyByDisk.get(segment) ?? null;
  }
  return diskBySegment.get(segment) ?? keyByDisk.get(segment) ?? null;
}

export function allPathSegments() {
  const values = new Set<string>(["admin", "api", "login"]);
  for (const key of Object.keys(pathnames) as Exclude<RouteKey, "home">[]) {
    for (const locale of locales) {
      values.add(pathnames[key][locale]);
    }
  }
  return [...values];
}
