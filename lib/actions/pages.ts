"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaff } from "../auth";
import { isReservedSlug, slugify } from "../utils";
import type { RenderMode } from "../types";

export async function savePage(formData: FormData) {
  const { admin } = await requireStaff();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim() || slugify(title);
  const slug = slugify(slugRaw);
  const renderMode = (String(formData.get("render_mode") ?? "code") as RenderMode) || "code";
  const isHomepage = String(formData.get("is_homepage") ?? "") === "yes";

  if (!title || !slug) {
    throw new Error("Başlık ve slug zorunludur.");
  }
  if (isReservedSlug(slug)) {
    throw new Error("Bu slug sistem sayfaları için ayrılmıştır.");
  }

  const payload = {
    title,
    slug,
    meta_description: String(formData.get("meta_description") ?? ""),
    meta_keywords: String(formData.get("meta_keywords") ?? ""),
    is_homepage: isHomepage,
    render_mode: renderMode,
    html: String(formData.get("html") ?? ""),
    css: String(formData.get("css") ?? ""),
    js: String(formData.get("js") ?? ""),
  };

  let pageId = id;

  if (id) {
    const { error } = await admin.from("pages").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await admin.from("pages").insert(payload).select("id").single();
    if (error) throw new Error(error.message);
    pageId = data.id;
  }

  if (renderMode === "modules") {
    const moduleIds = String(formData.get("module_ids") ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    await admin.from("page_modules").delete().eq("page_id", pageId);

    if (moduleIds.length) {
      const rows = moduleIds.map((moduleId, index) => ({
        page_id: pageId,
        module_id: moduleId,
        sort_order: index,
      }));
      const { error } = await admin.from("page_modules").insert(rows);
      if (error) throw new Error(error.message);
    }
  }

  revalidatePath("/", "layout");
  redirect("/admin/landing");
}

export async function deletePage(formData: FormData) {
  const { admin } = await requireStaff();
  const id = String(formData.get("id") ?? "");
  const { error } = await admin.from("pages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  redirect("/admin/landing");
}
