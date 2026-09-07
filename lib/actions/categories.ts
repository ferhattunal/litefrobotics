"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaff } from "../auth";
import { decodeDesignCode, normalizeCardDesign } from "../card-design";
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
  return normalizeCardDesign(JSON.parse(raw) as Partial<CardDesign>);
}

export async function saveCategory(formData: FormData) {
  const { admin } = await requireStaff();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "") || name);

  if (!name || !slug) {
    throw new Error("Kategori adı ve slug zorunludur.");
  }

  const payload = {
    name,
    slug,
    hero_image_url: String(formData.get("hero_image_url") ?? "") || null,
    hero_title: String(formData.get("hero_title") ?? ""),
    hero_text: String(formData.get("hero_text") ?? ""),
    card_design: parseCardDesign(formData),
  };

  if (id) {
    const { error } = await admin.from("categories").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await admin.from("categories").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/", "layout");
  redirect("/admin/kategoriler");
}

export async function deleteCategory(formData: FormData) {
  const { admin } = await requireStaff();
  const id = String(formData.get("id") ?? "");
  const { error } = await admin.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  redirect("/admin/kategoriler");
}
