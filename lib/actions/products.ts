"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "../auth";
import { decodeDesignCode } from "../card-design";
import { slugify } from "../utils";
import type { CardDesign } from "../types";

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
  return JSON.parse(raw) as CardDesign;
}

export async function saveProduct(formData: FormData) {
  const { admin } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "") || name);
  const categoryId = String(formData.get("category_id") ?? "");

  if (!name || !slug || !categoryId) {
    throw new Error("Ürün adı, slug ve kategori zorunludur.");
  }

  const payload = {
    name,
    slug,
    category_id: categoryId,
    description: String(formData.get("description") ?? ""),
    pdf_url: String(formData.get("pdf_url") ?? "") || null,
    card_design: parseCardDesign(formData),
  };

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

  revalidatePath("/", "layout");
  redirect("/admin/urunler");
}

export async function deleteProduct(formData: FormData) {
  const { admin } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const { error } = await admin.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  redirect("/admin/urunler");
}
