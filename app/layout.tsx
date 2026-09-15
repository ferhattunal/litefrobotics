import { headers } from "next/headers";
import type { Metadata } from "next";
import { asLocale, defaultLocale, localeHeader } from "@/lib/i18n/config";
import { getSiteSettings } from "@/lib/queries";
import { parseSiteConfig } from "@/lib/site-config";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const config = parseSiteConfig(settings);
  const name = config.brandName || "Litef Robotics";
  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: name,
      template: `%s | ${name}`,
    },
    description: "Endüstriyel robotik çözümler",
    icons: config.faviconUrl ? { icon: config.faviconUrl } : undefined,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const lang = asLocale(headerList.get(localeHeader) || defaultLocale);
  return (
    <html lang={lang} className="h-full antialiased" style={{ colorScheme: "light" }}>
      <body className="min-h-full bg-[var(--background)] font-sans text-[var(--foreground)]">{children}</body>
    </html>
  );
}
