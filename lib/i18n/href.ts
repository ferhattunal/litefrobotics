import { defaultLocale, isLocale, type Locale } from "./config";
import { diskSegment, localizedSegment, routeKeyFromSegment, type RouteKey } from "./pathnames";

function splitHref(href: string) {
  const hashIndex = href.indexOf("#");
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const queryIndex = withoutHash.indexOf("?");
  const query = queryIndex >= 0 ? withoutHash.slice(queryIndex) : "";
  const pathname = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;
  return { pathname, query, hash };
}

function shouldSkip(href: string) {
  return (
    !href.startsWith("/") ||
    href.startsWith("//") ||
    href.startsWith("/admin") ||
    href.startsWith("/api") ||
    href.startsWith("/login")
  );
}

export function localePath(locale: Locale, key: RouteKey | "cms", slug?: string) {
  if (key === "home") return `/${locale}`;
  if (key === "cms") return slug ? `/${locale}/${slug}` : `/${locale}`;
  const segment = localizedSegment(locale, key);
  return slug ? `/${locale}/${segment}/${slug}` : `/${locale}/${segment}`;
}

export function localizeKnownHref(locale: Locale, href: string) {
  const trimmed = href.trim() || "/";
  if (shouldSkip(trimmed)) return trimmed;
  const { pathname, query, hash } = splitHref(trimmed);
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] && isLocale(parts[0])) {
    parts.shift();
  }
  if (!parts.length) return `/${locale}${query}${hash}`;
  const key = routeKeyFromSegment(parts[0]);
  if (!key) {
    return `/${locale}/${parts.join("/")}${query}${hash}`;
  }
  const rest = parts.slice(1);
  const base = localePath(locale, key, rest[0]);
  const extra = rest.slice(1).join("/");
  return `${extra ? `${base}/${extra}` : base}${query}${hash}`;
}

export function toDiskPath(locale: Locale, pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] !== locale) return pathname;
  const segment = parts[1];
  if (!segment) return pathname;
  const key = routeKeyFromSegment(segment, locale);
  if (!key) return pathname;
  const disk = diskSegment(key);
  if (segment === disk) return pathname;
  const rest = parts.slice(2).join("/");
  return rest ? `/${locale}/${disk}/${rest}` : `/${locale}/${disk}`;
}

export function canonicalPublicPath(locale: Locale, pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] !== locale) return localizeKnownHref(locale, pathname);
  const segment = parts[1];
  if (!segment) return `/${locale}`;
  const key = routeKeyFromSegment(segment, locale) ?? routeKeyFromSegment(segment);
  if (!key) return pathname;
  const rest = parts.slice(2).join("/");
  const localized = localizedSegment(locale, key);
  return rest ? `/${locale}/${localized}/${rest}` : `/${locale}/${localized}`;
}

export function rewriteHtmlHrefs(html: string, locale: Locale) {
  return html.replace(/href=(["'])([^"']+)\1/g, (full, quote: string, href: string) => {
    if (shouldSkip(href) && href !== "/") return full;
    return `href=${quote}${localizeKnownHref(locale, href)}${quote}`;
  });
}

export function switchLocalePath(pathname: string, nextLocale: Locale) {
  const { pathname: path, query, hash } = splitHref(pathname);
  const parts = path.split("/").filter(Boolean);
  const current = parts[0] && isLocale(parts[0]) ? parts[0] : defaultLocale;
  if (parts[0] && isLocale(parts[0])) parts.shift();
  const rest = parts.length ? `/${parts.join("/")}` : "/";
  return `${localizeKnownHref(nextLocale, rest)}${query}${hash}`;
}
