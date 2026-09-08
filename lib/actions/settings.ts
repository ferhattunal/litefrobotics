"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "../auth";
import {
  embedConfig,
  generateFooterCss,
  generateFooterHtml,
  generateNavbarCss,
  generateNavbarHtml,
  normalizeSiteConfig,
  publicFooter,
  publicNavbar,
  type SiteConfig,
} from "../site-config";
import { extractMapsEmbedUrl } from "../utils";

export async function saveNavbarFooter(formData: FormData) {
  const { admin } = await requireAdmin();
  const { error } = await admin
    .from("site_settings")
    .update({
      navbar_html: String(formData.get("navbar_html") ?? ""),
      navbar_css: String(formData.get("navbar_css") ?? ""),
      footer_html: String(formData.get("footer_html") ?? ""),
      footer_css: String(formData.get("footer_css") ?? ""),
    })
    .eq("id", 1);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/", "layout");
}

export async function saveSiteSettings(formData: FormData) {
  const { admin } = await requireAdmin();
  let parsed: unknown = {};
  try {
    parsed = JSON.parse(String(formData.get("config") ?? "{}"));
  } catch {
    parsed = {};
  }
  const config = normalizeSiteConfig(parsed as Partial<SiteConfig>);
  const nav = publicNavbar(config);
  const foot = publicFooter(config);
  const navbarHtml = embedConfig(nav.html, config);
  const payload = {
    navbar_html: navbarHtml,
    navbar_css: nav.css || generateNavbarCss(config),
    footer_html: foot.html || generateFooterHtml(config),
    footer_css: foot.css || generateFooterCss(config),
    config,
  };

  const { error } = await admin.from("site_settings").update(payload).eq("id", 1);
  if (error) {
    const fallback = await admin
      .from("site_settings")
      .update({
        navbar_html: navbarHtml,
        navbar_css: payload.navbar_css,
        footer_html: payload.footer_html,
        footer_css: payload.footer_css,
      })
      .eq("id", 1);
    if (fallback.error) {
      throw new Error(fallback.error.message);
    }
  }

  await admin
    .from("contact_page")
    .update({
      address: config.address,
      phone: config.phone,
      email: config.email,
      maps_embed_url: extractMapsEmbedUrl(config.mapsEmbedUrl),
    })
    .eq("id", 1);

  revalidatePath("/", "layout");
  revalidatePath("/admin/ayarlar");
  revalidatePath("/admin/menuler");
  revalidatePath("/iletisim");
}
