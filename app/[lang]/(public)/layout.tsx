import { notFound } from "next/navigation";
import { LocaleProvider } from "@/components/i18n/locale-provider";
import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import { JsonLd } from "@/components/public/json-ld";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { WhatsAppSticky } from "@/components/public/whatsapp-sticky";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localePath } from "@/lib/i18n/href";
import { absoluteUrl } from "@/lib/i18n/metadata";
import { getSiteSettings } from "@/lib/queries";
import { parseSiteConfig, publicFooter, publicNavbar } from "@/lib/site-config";

export const dynamic = "force-dynamic";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export default async function PublicLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const settings = await getSiteSettings();
  const config = parseSiteConfig(settings);
  const nav = publicNavbar(config, lang);
  const foot = publicFooter(config, lang);
  const copy = getDictionary(lang);
  const name = config.brandName || copy.brand;

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: absoluteUrl(localePath(lang, "home")),
    logo: config.logoUrl || undefined,
    email: config.email || undefined,
    telephone: config.phone || undefined,
    address: config.address ? { "@type": "PostalAddress", streetAddress: config.address } : undefined,
  };

  return (
    <LocaleProvider locale={lang}>
      <div className="lf-public flex min-h-screen flex-col bg-[var(--background)] font-sans">
        <JsonLd data={organization} />
        <LocaleSwitcher locale={lang} />
        <SiteHeader
          html={nav.html}
          css={nav.css}
          js={config.navbarJs}
          brandName={name}
          logoUrl={config.logoUrl}
          locale={lang}
          homeHref={localePath(lang, "home")}
          searchLabel={copy.search.button}
        />
        <main className="flex-1 bg-[var(--background)] pb-24 md:pb-0">{children}</main>
        <SiteFooter html={foot.html} css={foot.css} js={config.footerJs} />
        <WhatsAppSticky
          phone={config.whatsapp || config.phone}
          locale={lang}
          template={copy.whatsapp.message}
          label={copy.whatsapp.label}
        />
      </div>
    </LocaleProvider>
  );
}
