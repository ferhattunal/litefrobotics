import type { ModuleType } from "./types";

export const MODULE_TYPES: { id: ModuleType; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "features", label: "Özellikler" },
  { id: "cta", label: "Çağrı (CTA)" },
  { id: "richtext", label: "Metin" },
  { id: "custom", label: "Özel / HTML" },
];

export type ModuleFields = {
  eyebrow: string;
  title: string;
  text: string;
  buttonLabel: string;
  buttonHref: string;
  feature1: string;
  feature1Text: string;
  feature2: string;
  feature2Text: string;
  feature3: string;
  feature3Text: string;
};

export const EMPTY_MODULE_FIELDS: ModuleFields = {
  eyebrow: "",
  title: "",
  text: "",
  buttonLabel: "",
  buttonHref: "/",
  feature1: "",
  feature1Text: "",
  feature2: "",
  feature2Text: "",
  feature3: "",
  feature3Text: "",
};

function esc(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function buildModuleMarkup(type: ModuleType, fields: ModuleFields): { html: string; css: string } {
  const f = {
    ...EMPTY_MODULE_FIELDS,
    ...fields,
    buttonHref: fields.buttonHref || "/",
  };

  if (type === "hero") {
    return {
      html: `<section class="lf-mod-hero">
  <div class="lf-mod-hero-inner">
    ${f.eyebrow ? `<p class="lf-mod-eyebrow">${esc(f.eyebrow)}</p>` : ""}
    <h1>${esc(f.title || "Başlık")}</h1>
    ${f.text ? `<p class="lf-mod-lead">${esc(f.text)}</p>` : ""}
    ${f.buttonLabel ? `<a class="lf-mod-btn" href="${esc(f.buttonHref)}">${esc(f.buttonLabel)}</a>` : ""}
  </div>
</section>`,
      css: `.lf-mod-hero { background: linear-gradient(135deg, #111827, #1f2937); color: #fff; }
.lf-mod-hero-inner { max-width: 1120px; margin: 0 auto; padding: 88px 20px; }
.lf-mod-eyebrow { letter-spacing: .16em; text-transform: uppercase; color: #fdba74; font-size: 12px; margin: 0 0 12px; }
.lf-mod-hero h1 { font-size: clamp(32px, 5vw, 52px); line-height: 1.1; margin: 0 0 16px; }
.lf-mod-lead { max-width: 52ch; color: #d1d5db; font-size: 18px; }
.lf-mod-btn { display: inline-block; margin-top: 24px; background: #c2410c; color: #fff; padding: 12px 22px; text-decoration: none; border-radius: 999px; font-weight: 600; }`,
    };
  }

  if (type === "features") {
    return {
      html: `<section class="lf-mod-features">
  <article><h2>${esc(f.feature1 || "Özellik")}</h2><p>${esc(f.feature1Text)}</p></article>
  <article><h2>${esc(f.feature2 || "Özellik")}</h2><p>${esc(f.feature2Text)}</p></article>
  <article><h2>${esc(f.feature3 || "Özellik")}</h2><p>${esc(f.feature3Text)}</p></article>
</section>`,
      css: `.lf-mod-features { max-width: 1120px; margin: 0 auto; padding: 56px 20px; display: grid; gap: 20px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); background: var(--background, #f0f0f0); }
.lf-mod-features article { background: #fff; padding: 24px; border-radius: 16px; box-shadow: 0 8px 24px rgba(15,23,42,.06); }
.lf-mod-features h2 { margin: 0 0 8px; font-size: 20px; }
.lf-mod-features p { margin: 0; color: #64748b; }`,
    };
  }

  if (type === "cta") {
    return {
      html: `<section class="lf-mod-cta">
  <h2>${esc(f.title || "Başlık")}</h2>
  ${f.text ? `<p>${esc(f.text)}</p>` : ""}
  ${f.buttonLabel ? `<a class="lf-mod-btn" href="${esc(f.buttonHref)}">${esc(f.buttonLabel)}</a>` : ""}
</section>`,
      css: `.lf-mod-cta { max-width: 1120px; margin: 32px auto; padding: 48px 24px; background: #111827; color: #fff; border-radius: 24px; text-align: center; }
.lf-mod-cta h2 { margin: 0 0 12px; font-size: 28px; }
.lf-mod-cta p { margin: 0 auto 20px; max-width: 48ch; color: #d1d5db; }
.lf-mod-btn { display: inline-block; background: #c2410c; color: #fff; padding: 12px 22px; text-decoration: none; border-radius: 999px; font-weight: 600; }`,
    };
  }

  if (type === "richtext") {
    return {
      html: `<section class="lf-mod-text"><h2>${esc(f.title || "Başlık")}</h2><p>${esc(f.text)}</p></section>`,
      css: `.lf-mod-text { max-width: 800px; margin: 0 auto; padding: 56px 20px; background: var(--background, #f0f0f0); }
.lf-mod-text h2 { margin: 0 0 16px; font-size: 28px; }
.lf-mod-text p { margin: 0; color: #57534e; line-height: 1.7; }`,
    };
  }

  return { html: "", css: "" };
}

export const SAMPLE_MODULES: { name: string; module_type: ModuleType; fields: ModuleFields }[] = [
  {
    name: "Hero",
    module_type: "hero",
    fields: {
      ...EMPTY_MODULE_FIELDS,
      eyebrow: "Litef Robotics",
      title: "Endüstriyel robotikte güvenilir çözümler",
      text: "Üretim hatlarınız için tasarlanmış robotik sistemler, yedek parçalar ve teknik destek.",
      buttonLabel: "Ürünleri incele",
      buttonHref: "/kategoriler",
    },
  },
  {
    name: "Özellikler",
    module_type: "features",
    fields: {
      ...EMPTY_MODULE_FIELDS,
      feature1: "Ürün kataloğu",
      feature1Text: "Kategorilere göre düzenlenmiş robotik ürünler.",
      feature2: "Teknik döküman",
      feature2Text: "Her ürün için indirilebilir PDF katalog.",
      feature3: "Uzman destek",
      feature3Text: "Kurulum ve entegrasyon süreçlerinde yanınızdayız.",
    },
  },
  {
    name: "Kiralama / Teklif CTA",
    module_type: "cta",
    fields: {
      ...EMPTY_MODULE_FIELDS,
      title: "Projeniz için teklif alın",
      text: "İhtiyacınıza uygun ürün ve kiralama seçeneklerini birlikte planlayalım.",
      buttonLabel: "Teklif iste",
      buttonHref: "/teklif",
    },
  },
  {
    name: "Hakkımızda",
    module_type: "richtext",
    fields: {
      ...EMPTY_MODULE_FIELDS,
      title: "Hakkımızda",
      text: "Litef Robotics, endüstriyel robotik ve depo otomasyonunda güvenilir çözümler sunar.",
    },
  },
];
