import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { getSiteSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

const FALLBACK_NAV = `<nav class="lf-nav">
  <a class="lf-logo" href="/">Litef Robotics</a>
  <div class="lf-links">
    <a href="/">Ana Sayfa</a>
    <a href="/kategoriler">Ürünler</a>
    <a href="/blog">Blog</a>
    <a href="/hakkimizda">Hakkımızda</a>
    <a href="/iletisim">İletişim</a>
  </div>
</nav>`;

const FALLBACK_NAV_CSS = `.lf-nav { display: flex; align-items: center; justify-content: space-between; gap: 24px; max-width: 1120px; margin: 0 auto; padding: 16px 20px; }
.lf-logo { font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: #111; text-decoration: none; }
.lf-links { display: flex; align-items: center; gap: 22px; }
.lf-links a { color: #334155; text-decoration: none; font-size: 14px; font-weight: 500; }`;

const FALLBACK_FOOTER = `<footer class="lf-footer"><div class="lf-footer-inner"><strong>Litef Robotics</strong></div></footer>`;
const FALLBACK_FOOTER_CSS = `.lf-footer { background: #111827; color: #e5e7eb; } .lf-footer-inner { max-width: 1120px; margin: 0 auto; padding: 40px 20px; }`;

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        html={settings?.navbar_html || FALLBACK_NAV}
        css={settings?.navbar_css || FALLBACK_NAV_CSS}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter
        html={settings?.footer_html || FALLBACK_FOOTER}
        css={settings?.footer_css || FALLBACK_FOOTER_CSS}
      />
    </div>
  );
}
