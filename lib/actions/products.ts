"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaff } from "../auth";
import { decodeDesignCode, normalizeCardDesign } from "../card-design";
import { slugify } from "../utils";
import type { CardDesign, PriceDisplay } from "../types";

function parseCardDesign(formData: FormData): CardDesign | null {
  const reset = String(formData.get("card_reset") ?? "") === "1";
  if (reset) return null;

  const pasted = String(formData.get("design_code") ?? "").trim();
  if (pasted) {
    const decoded = decodeDesignCode(pasted);
    if (!decoded) throw new Error("Geçersiz kart tasarım kodu.");
    return decoded;
  }

  const raw = String(formData.get("card_design") ?? "");
  if (!raw) return null;
  return normalizeCardDesign(JSON.parse(raw) as Partial<CardDesign>);
}

function num(formData: FormData, key: string) {
  const raw = String(formData.get(key) ?? "").trim().replace(",", ".");
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function checked(formData: FormData, key: string) {
  return String(formData.get(key) ?? "") === "1";
}

export async function saveProduct(formData: FormData) {
  const { admin } = await requireStaff();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "") || name);
  const categoryId = String(formData.get("category_id") ?? "");

  if (!name || !slug || !categoryId) {
    throw new Error("Ürün adı, slug ve kategori zorunludur.");
  }

  const displayRaw = String(formData.get("price_display") ?? "try");
  const priceDisplay: PriceDisplay = displayRaw === "usd" || displayRaw === "both" ? displayRaw : "try";

  const payload: Record<string, unknown> = {
    name,
    slug,
    category_id: categoryId,
    description: String(formData.get("description") ?? ""),
    pdf_url: String(formData.get("pdf_url") ?? "") || null,
    card_design: parseCardDesign(formData),
    brand: String(formData.get("brand") ?? "").trim(),
    series: String(formData.get("series") ?? "").trim(),
    model: String(formData.get("model") ?? "").trim(),
    price_try: num(formData, "price_try"),
    price_usd: num(formData, "price_usd"),
    price_display: priceDisplay,
    show_on_homepage: checked(formData, "show_on_homepage"),
    show_price_on_card: checked(formData, "show_price_on_card"),
    show_stock_badge_on_card: checked(formData, "show_stock_badge_on_card"),
    featured: checked(formData, "featured"),
    stock_qty: Math.max(0, Math.floor(num(formData, "stock_qty") ?? 0)),
    in_stock: checked(formData, "in_stock"),
    about_heading: String(formData.get("about_heading") ?? "").trim(),
    about_html: String(formData.get("about_html") ?? ""),
    about_image_url: String(formData.get("about_image_url") ?? "") || null,
    specs_xml: String(formData.get("specs_xml") ?? ""),
    meta_title: String(formData.get("meta_title") ?? "").trim(),
    meta_description: String(formData.get("meta_description") ?? "").trim(),
  };

  if (!id) {
    const { data: last } = await admin
      .from("products")
      .select("id")
      .eq("category_id", categoryId);
    payload.sort_order = (last?.length ?? 0) + 1;
  }

  let productId = id;

  if (id) {
    const { error } = await admin.from("products").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await admin.from("products").insert(payload).select("id").single();
    if (error) throw new Error(error.message);
    productId = data.id;
  }

  const images = String(formData.get("image_urls") ?? "")
    .split("\n")
    .map((value) => value.trim())
    .filter(Boolean);

  await admin.from("product_images").delete().eq("product_id", productId);
  if (images.length) {
    const rows = images.map((url, index) => ({
      product_id: productId,
      url,
      sort_order: index,
    }));
    const { error } = await admin.from("product_images").insert(rows);
    if (error) throw new Error(error.message);
  }

  const landingIds = String(formData.get("landing_page_ids") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  await admin.from("product_landing_pages").delete().eq("product_id", productId);
  if (landingIds.length) {
    const rows = landingIds.map((page_id) => ({ product_id: productId, page_id }));
    const { error } = await admin.from("product_landing_pages").insert(rows);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/", "layout");
  redirect("/admin/urunler");
}

export async function moveProduct(formData: FormData) {
  const { admin } = await requireStaff();
  const id = String(formData.get("id") ?? "");
  const direction = String(formData.get("direction") ?? "") === "1" ? 1 : -1;
  const { data: current } = await admin
    .from("products")
    .select("id, category_id, sort_order")
    .eq("id", id)
    .maybeSingle();
  if (!current) return;

  const { data: siblings } = await admin
    .from("products")
    .select("id, sort_order")
    .eq("category_id", current.category_id)
    .order("sort_order")
    .order("name");
  const list = siblings ?? [];
  const index = list.findIndex((row) => row.id === id);
  const swap = list[index + direction];
  if (index < 0 || !swap) return;

  const currentOrder = current.sort_order ?? index;
  const swapOrder = swap.sort_order ?? index + direction;
  await admin.from("products").update({ sort_order: swapOrder }).eq("id", id);
  await admin.from("products").update({ sort_order: currentOrder }).eq("id", swap.id);
  revalidatePath("/admin/urunler");
}

export async function deleteProduct(formData: FormData) {
  const { admin } = await requireStaff();
  const id = String(formData.get("id") ?? "");
  const { error } = await admin.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  redirect("/admin/urunler");
}
