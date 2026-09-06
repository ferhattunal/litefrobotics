"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "../auth";

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
