import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { getSiteSettings } from "@/lib/queries";
import { parseSiteConfig, publicFooter, publicNavbar } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const config = parseSiteConfig(settings);
  const nav = publicNavbar(config);
  const foot = publicFooter(config);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <SiteHeader html={nav.html} css={nav.css} js={config.navbarJs} brandName={config.brandName} logoUrl={config.logoUrl} />
      <main className="flex-1 bg-[var(--background)]">{children}</main>
      <SiteFooter html={foot.html} css={foot.css} js={config.footerJs} />
    </div>
  );
}
