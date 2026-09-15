import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, localeHeader } from "@/lib/i18n/config";
import { canonicalPublicPath, toDiskPath } from "@/lib/i18n/href";

const FILE = /\.[a-zA-Z0-9]+$/;

function isBypassed(pathname: string) {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/fonts") ||
    pathname === "/favicon.ico" ||
    FILE.test(pathname)
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isBypassed(pathname)) {
    const headers = new Headers(request.headers);
    headers.set(localeHeader, defaultLocale);
    return NextResponse.next({ request: { headers } });
  }

  const parts = pathname.split("/").filter(Boolean);
  const first = parts[0];

  if (!isLocale(first)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url, 301);
  }

  const canonical = canonicalPublicPath(first, pathname);
  if (canonical !== pathname) {
    const url = request.nextUrl.clone();
    url.pathname = canonical;
    return NextResponse.redirect(url, 301);
  }

  const headers = new Headers(request.headers);
  headers.set(localeHeader, first);
  const disk = toDiskPath(first, pathname);
  if (disk !== pathname) {
    const url = request.nextUrl.clone();
    url.pathname = disk;
    return NextResponse.rewrite(url, { request: { headers } });
  }

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
