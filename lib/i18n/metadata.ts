import type { Metadata } from "next";
import { locales, type Locale } from "./config";
import { localePath } from "./href";
import type { RouteKey } from "./pathnames";
import { siteUrl } from "../utils";

export function absoluteUrl(path: string) {
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export function localeAlternates(locale: Locale, key: RouteKey | "cms", slug?: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = absoluteUrl(localePath(loc, key, slug));
  }
  languages["x-default"] = languages.tr;
  return {
    canonical: languages[locale],
    languages,
  };
}

export function pageMetadata({
  locale,
  route,
  slug,
  title,
  description,
  keywords,
}: {
  locale: Locale;
  route: RouteKey | "cms";
  slug?: string;
  title: string;
  description?: string;
  keywords?: string;
}): Metadata {
  return {
    title,
    description: description || undefined,
    keywords: keywords || undefined,
    alternates: localeAlternates(locale, route, slug),
  };
}
