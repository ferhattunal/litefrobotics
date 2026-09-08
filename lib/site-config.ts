import { colorFillCss, contrastOn, DEFAULT_FOOTER_FILL, DEFAULT_NAV_FILL, parseColorFill } from "./color-fill";
import type { ColorFill } from "./types";

export type HoverAnimation = "underline" | "color" | "background" | "none";

export type NavLink = {
  id: string;
  label: string;
  href: string;
  color: string;
};

export type FooterLink = {
  id: string;
  label: string;
  href: string;
};

export type FooterColumn =
  | {
      id: string;
      type: "links";
      title: string;
      links: FooterLink[];
    }
  | {
      id: string;
      type: "contact";
      title: string;
      locations: string[];
      hours: string;
    };

export type SiteConfig = {
  brandName: string;
  phone: string;
  whatsapp: string;
  email: string;
  quoteEmails: string;
  address: string;
  mapsEmbedUrl: string;
  logoUrl: string;
  faviconUrl: string;
  hoverAnimation: HoverAnimation;
  desktopLinks: NavLink[];
  mobileLinks: NavLink[];
  showPhoneButton: boolean;
  showWhatsappButton: boolean;
  navbarFill: ColorFill;
  navbarTextColor: string;
  footerFill: ColorFill;
  footerTextColor: string;
  navbarHtml: string;
  navbarCss: string;
  navbarJs: string;
  footerIntro: string;
  linkedinUrl: string;
  instagramUrl: string;
  footerColumns: FooterColumn[];
  copyright: string;
  footerLinks: FooterLink[];
  footerHtml: string;
  footerCss: string;
  footerJs: string;
};

const CFG_START = "<!--LFCFG:";
const CFG_END = "-->";

function nid() {
  return crypto.randomUUID();
}

function link(label: string, href: string): NavLink {
  return { id: nid(), label, href, color: "" };
}

export function defaultSiteConfig(): SiteConfig {
  const desktop = [
    link("Ana Sayfa", "/"),
    link("Kategori", "/kategoriler"),
    link("Kiralama", "/kiralama"),
    link("Kurumsal", "/hakkimizda"),
    link("Bayilerimiz", "/bayiler"),
    link("Hakkımızda", "/hakkimizda"),
    link("İletişim", "/iletisim"),
  ];

  return {
    brandName: "Litef Robotics",
    phone: "",
    whatsapp: "",
    email: "",
    quoteEmails: "",
    address: "",
    mapsEmbedUrl: "",
    logoUrl: "",
    faviconUrl: "",
    hoverAnimation: "underline",
    desktopLinks: desktop,
    mobileLinks: desktop.map((item) => ({ ...item, id: nid() })),
    showPhoneButton: false,
    showWhatsappButton: false,
    navbarFill: DEFAULT_NAV_FILL,
    navbarTextColor: "#111827",
    footerFill: DEFAULT_FOOTER_FILL,
    footerTextColor: "#1c1917",
    navbarHtml: "",
    navbarCss: "",
    navbarJs: "",
    footerIntro: "Litef Robotics, endüstriyel robotik sistemler için satış, kiralama ve teknik destek sunar.",
    linkedinUrl: "",
    instagramUrl: "",
    footerColumns: [
      {
        id: nid(),
        type: "links",
        title: "Ürünler & Hizmetler",
        links: [
          { id: nid(), label: "Kategoriler", href: "/kategoriler" },
          { id: nid(), label: "Kiralama", href: "/kiralama" },
          { id: nid(), label: "Teklif", href: "/teklif" },
        ],
      },
      {
        id: nid(),
        type: "contact",
        title: "İletişim & Lokasyon",
        locations: [],
        hours: "Hafta içi 08:30–18:00",
      },
    ],
    copyright: "© {year} Litef Robotics. Tüm hakları saklıdır.",
    footerLinks: [
      { id: nid(), label: "Gizlilik", href: "/hakkimizda" },
      { id: nid(), label: "İletişim", href: "/iletisim" },
    ],
    footerHtml: "",
    footerCss: "",
    footerJs: "",
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asBool(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function parseLinks(value: unknown): NavLink[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const row = isRecord(item) ? item : {};
    return {
      id: asString(row.id, nid()),
      label: asString(row.label),
      href: asString(row.href, "/"),
      color: asString(row.color),
    };
  });
}

function parseFooterLinks(value: unknown): FooterLink[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const row = isRecord(item) ? item : {};
    return {
      id: asString(row.id, nid()),
      label: asString(row.label),
      href: asString(row.href, "/"),
    };
  });
}

function parseColumns(value: unknown): FooterColumn[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const row = isRecord(item) ? item : {};
    if (row.type === "contact") {
      return {
        id: asString(row.id, nid()),
        type: "contact" as const,
        title: asString(row.title, "İletişim"),
        locations: Array.isArray(row.locations) ? row.locations.map((line) => String(line)) : [],
        hours: asString(row.hours),
      };
    }
    return {
      id: asString(row.id, nid()),
      type: "links" as const,
      title: asString(row.title, "Bağlantılar"),
      links: parseFooterLinks(row.links),
    };
  });
}

export function normalizeSiteConfig(raw?: Partial<SiteConfig> | null): SiteConfig {
  const base = defaultSiteConfig();
  if (!raw || !isRecord(raw)) return base;
  const hover = raw.hoverAnimation;
  return {
    ...base,
    ...raw,
    hoverAnimation:
      hover === "color" || hover === "background" || hover === "none" || hover === "underline"
        ? hover
        : base.hoverAnimation,
    desktopLinks: raw.desktopLinks?.length ? parseLinks(raw.desktopLinks) : base.desktopLinks,
    mobileLinks: raw.mobileLinks?.length ? parseLinks(raw.mobileLinks) : base.mobileLinks,
    footerColumns: raw.footerColumns?.length ? parseColumns(raw.footerColumns) : base.footerColumns,
    footerLinks: raw.footerLinks ? parseFooterLinks(raw.footerLinks) : base.footerLinks,
    showPhoneButton: asBool(raw.showPhoneButton, base.showPhoneButton),
    showWhatsappButton: asBool(raw.showWhatsappButton, base.showWhatsappButton),
    navbarFill: parseColorFill(raw.navbarFill, base.navbarFill),
    navbarTextColor: asString(raw.navbarTextColor, base.navbarTextColor) || contrastOn(parseColorFill(raw.navbarFill, base.navbarFill)),
    footerFill: parseColorFill(raw.footerFill, base.footerFill),
    footerTextColor: asString(raw.footerTextColor, base.footerTextColor) || contrastOn(parseColorFill(raw.footerFill, base.footerFill)),
  };
}

export function extractEmbeddedConfig(html?: string | null): Partial<SiteConfig> | null {
  if (!html) return null;
  const start = html.indexOf(CFG_START);
  const end = html.indexOf(CFG_END, start + CFG_START.length);
  if (start < 0 || end < 0) return null;
  try {
    return JSON.parse(html.slice(start + CFG_START.length, end)) as Partial<SiteConfig>;
  } catch {
    return null;
  }
}

export function parseSiteConfig(settings?: { config?: unknown; navbar_html?: string } | null): SiteConfig {
  const fromColumn = isRecord(settings?.config) ? (settings?.config as Partial<SiteConfig>) : null;
  return normalizeSiteConfig(fromColumn || extractEmbeddedConfig(settings?.navbar_html));
}

export function embedConfig(html: string, config: SiteConfig) {
  const clean = html.replace(/<!--LFCFG:[\s\S]*?-->\n?/, "");
  return `${CFG_START}${JSON.stringify(config)}${CFG_END}\n${clean}`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function brandMarkup(config: SiteConfig) {
  if (config.logoUrl) {
    return `<a class="lf-logo" href="/"><img src="${escapeHtml(config.logoUrl)}" alt="${escapeHtml(config.brandName || "Litef Robotics")}" /></a>`;
  }
  return `<a class="lf-logo" href="/">${escapeHtml(config.brandName || "Litef Robotics")}</a>`;
}

function actionButtons(config: SiteConfig) {
  const phone = config.phone.replace(/\s+/g, "");
  const whatsapp = (config.whatsapp || config.phone).replace(/\D/g, "");
  const bits: string[] = [];
  if (config.showPhoneButton && phone) {
    bits.push(`<a class="lf-action" href="tel:${escapeHtml(phone)}">Telefon</a>`);
  }
  if (config.showWhatsappButton && whatsapp) {
    bits.push(`<a class="lf-action lf-wa" href="https://wa.me/${escapeHtml(whatsapp)}" target="_blank" rel="noreferrer">WhatsApp</a>`);
  }
  bits.push(`<button type="button" class="lf-search">Ara</button>`);
  return bits.join("");
}

function linkStyle(item: NavLink) {
  return item.color ? ` style="color:${escapeHtml(item.color)}"` : "";
}

export function generateNavbarHtml(config: SiteConfig, device: "desktop" | "mobile" = "desktop") {
  const items = device === "mobile" ? config.mobileLinks : config.desktopLinks;
  const links = items
    .map((item) => `<a href="${escapeHtml(item.href)}"${linkStyle(item)}>${escapeHtml(item.label)}</a>`)
    .join("\n      ");
  return `<nav class="lf-nav lf-hover-${config.hoverAnimation}">
  ${brandMarkup(config)}
  <div class="lf-links">
      ${links}
  </div>
  <div class="lf-actions">${actionButtons(config)}</div>
</nav>`;
}

export function generateNavbarCss(config: SiteConfig) {
  const bg = colorFillCss(config.navbarFill);
  const fg = config.navbarTextColor || contrastOn(config.navbarFill);
  return `.lf-site-header { background: ${bg}; color: ${fg}; border-bottom: 1px solid color-mix(in srgb, ${fg} 12%, transparent); }
.lf-nav { display: flex; align-items: center; justify-content: space-between; gap: 20px; max-width: 1120px; width: 100%; margin: 0 auto; padding: 12px 20px; font-family: "MiSans Latin", system-ui, sans-serif; background: transparent; color: ${fg}; flex-wrap: nowrap; }
.lf-logo { font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: ${fg}; text-decoration: none; display: inline-flex; align-items: center; flex-shrink: 0; }
.lf-logo img { display: block; height: 40px; width: auto; max-width: 140px; object-fit: contain; }
.lf-links { display: flex; align-items: center; gap: 18px; flex-wrap: nowrap; min-width: 0; }
.lf-links a { color: ${fg}; text-decoration: none; font-size: 14px; font-weight: 500; position: relative; opacity: 0.88; white-space: nowrap; }
.lf-actions { display: flex; align-items: center; gap: 8px; }
.lf-search, .lf-action { border: 1px solid color-mix(in srgb, ${fg} 28%, transparent); border-radius: 8px; padding: 6px 10px; font-size: 13px; color: ${fg}; text-decoration: none; background: transparent; cursor: pointer; font-family: inherit; }
.lf-hover-underline .lf-links a::after { content: ""; position: absolute; left: 0; right: 0; bottom: -6px; height: 2px; background: ${fg}; transform: scaleX(0); transition: transform .2s; }
.lf-hover-underline .lf-links a:hover::after { transform: scaleX(1); }
.lf-hover-color .lf-links a:hover { opacity: 1; }
.lf-hover-background .lf-links a { padding: 6px 8px; border-radius: 8px; }
.lf-hover-background .lf-links a:hover { background: color-mix(in srgb, ${fg} 12%, transparent); opacity: 1; }
.lf-mobile-bar { color: ${fg}; }
.lf-mobile-menu .lf-nav { max-width: 100%; flex-direction: column; align-items: flex-start; gap: 8px; padding: 0; }
.lf-mobile-menu .lf-links { flex-direction: column; align-items: flex-start; gap: 0; width: 100%; }
.lf-mobile-menu .lf-logo img { height: 36px; max-width: 160px; }
${config.navbarCss}`;
}

function replaceYear(value: string) {
  return value.replaceAll("{year}", String(new Date().getFullYear()));
}

export function generateFooterHtml(config: SiteConfig) {
  const columns = config.footerColumns
    .map((column) => {
      if (column.type === "contact") {
        const locations = column.locations.filter(Boolean).map((line) => `<p>${escapeHtml(line)}</p>`).join("");
        return `<div class="lf-col">
      <h3>${escapeHtml(column.title)}</h3>
      ${config.phone ? `<p>${escapeHtml(config.phone)}</p>` : ""}
      ${config.email ? `<p>${escapeHtml(config.email)}</p>` : ""}
      ${config.address ? `<p>${escapeHtml(config.address)}</p>` : ""}
      ${locations}
      ${column.hours ? `<p>${escapeHtml(column.hours)}</p>` : ""}
    </div>`;
      }
      const links = column.links
        .map((item) => `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`)
        .join("");
      return `<div class="lf-col">
      <h3>${escapeHtml(column.title)}</h3>
      ${links}
    </div>`;
    })
    .join("\n");

  const social = [
    config.linkedinUrl ? `<a href="${escapeHtml(config.linkedinUrl)}" target="_blank" rel="noreferrer">LinkedIn</a>` : "",
    config.instagramUrl ? `<a href="${escapeHtml(config.instagramUrl)}" target="_blank" rel="noreferrer">Instagram</a>` : "",
  ]
    .filter(Boolean)
    .join("");

  const bottom = config.footerLinks
    .map((item) => `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`)
    .join("");

  return `<footer class="lf-footer">
  <div class="lf-footer-inner">
    <div class="lf-brand">
      ${brandMarkup(config)}
      <p>${escapeHtml(config.footerIntro)}</p>
      <div class="lf-social">${social}</div>
    </div>
    ${columns}
  </div>
  <div class="lf-footer-bottom">
    <p>${escapeHtml(replaceYear(config.copyright))}</p>
    <div class="lf-footer-links">${bottom}</div>
  </div>
</footer>`;
}

export function generateFooterCss(config: SiteConfig) {
  const bg = colorFillCss(config.footerFill);
  const fg = config.footerTextColor || contrastOn(config.footerFill);
  return `.lf-footer { background: ${bg}; color: ${fg}; border-top: 1px solid color-mix(in srgb, ${fg} 12%, transparent); font-family: "MiSans Latin", system-ui, sans-serif; }
.lf-footer-inner { max-width: 1120px; margin: 0 auto; padding: 48px 20px 28px; display: grid; gap: 28px; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
.lf-brand p { color: color-mix(in srgb, ${fg} 72%, transparent); font-size: 14px; line-height: 1.6; }
.lf-col h3 { margin: 0 0 12px; font-size: 15px; color: ${fg}; }
.lf-col a, .lf-social a, .lf-footer-links a { display: block; color: ${fg}; text-decoration: none; margin: 6px 0; font-size: 14px; opacity: 0.88; }
.lf-footer-bottom { max-width: 1120px; margin: 0 auto; padding: 0 20px 32px; display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; color: color-mix(in srgb, ${fg} 70%, transparent); font-size: 13px; }
.lf-footer .lf-logo { color: ${fg}; }
${config.footerCss}`;
}

export function publicNavbar(config: SiteConfig) {
  return {
    html: config.navbarHtml.trim() || generateNavbarHtml(config, "desktop"),
    css: generateNavbarCss(config),
    js: config.navbarJs,
  };
}

export function publicFooter(config: SiteConfig) {
  return {
    html: config.footerHtml.trim() || generateFooterHtml(config),
    css: generateFooterCss(config),
    js: config.footerJs,
  };
}
