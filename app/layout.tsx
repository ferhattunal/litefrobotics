import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/queries";
import { parseSiteConfig } from "@/lib/site-config";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const config = parseSiteConfig(settings);
  const name = config.brandName || "Litef Robotics";
  return {
    title: {
      default: name,
      template: `%s | ${name}`,
    },
    description: "Endüstriyel robotik çözümler",
    icons: config.faviconUrl ? { icon: config.faviconUrl } : undefined,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="h-full antialiased" style={{ colorScheme: "light" }}>
      <body className="min-h-full bg-[var(--background)] font-sans text-[var(--foreground)]">{children}</body>
    </html>
  );
}
