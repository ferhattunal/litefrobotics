"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "../auth";
import { extractMapsEmbedUrl } from "../utils";

export async function saveAboutPage(formData: FormData) {
  const { admin } = await requireAdmin();
  const { error } = await admin
    .from("about_page")
    .update({
      title: String(formData.get("title") ?? "Hakkımızda"),
      content: String(formData.get("content") ?? ""),
      meta_description: String(formData.get("meta_description") ?? ""),
      meta_keywords: String(formData.get("meta_keywords") ?? ""),
    })
    .eq("id", 1);

  if (error) throw new Error(error.message);
  revalidatePath("/hakkimizda");
}

export async function saveContactPage(formData: FormData) {
  const { admin } = await requireAdmin();
  const { error } = await admin
    .from("contact_page")
    .update({
      title: String(formData.get("title") ?? "İletişim"),
      content: String(formData.get("content") ?? ""),
      address: String(formData.get("address") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      maps_embed_url: extractMapsEmbedUrl(String(formData.get("maps_embed_url") ?? "")),
      meta_description: String(formData.get("meta_description") ?? ""),
      meta_keywords: String(formData.get("meta_keywords") ?? ""),
    })
    .eq("id", 1);

  if (error) throw new Error(error.message);
  revalidatePath("/iletisim");
}
