"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaff } from "../auth";
import { rewriteWarmCss } from "../css-theme";
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
    css: rewriteWarmCss(String(formData.get("css") ?? "")),
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
  redirect(`/admin/landing?page=${pageId}`);
}

export async function deletePage(formData: FormData) {
  const { admin } = await requireStaff();
  const id = String(formData.get("id") ?? "");
  const { error } = await admin.from("pages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  redirect("/admin/landing");
}

export async function savePageLayout(formData: FormData) {
  const { admin } = await requireStaff();
  const pageId = String(formData.get("page_id") ?? "");
  if (!pageId) throw new Error("Sayfa seçilmedi.");
  const moduleIds = String(formData.get("module_ids") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const { error: pageError } = await admin.from("pages").update({ render_mode: "modules" }).eq("id", pageId);
  if (pageError) throw new Error(pageError.message);

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

  revalidatePath("/", "layout");
  revalidatePath("/admin/landing");
}

export async function addSampleBlocks(formData: FormData) {
  const { admin } = await requireStaff();
  const pageId = String(formData.get("page_id") ?? "");
  if (!pageId) throw new Error("Sayfa seçilmedi.");

  const { SAMPLE_MODULES, buildModuleMarkup } = await import("../module-templates");
  const { data: existing } = await admin.from("modules").select("id,name");
  const byName = new Map((existing ?? []).map((row) => [String(row.name), String(row.id)]));
  const ids: string[] = [];

  for (const sample of SAMPLE_MODULES) {
    const found = byName.get(sample.name);
    if (found) {
      ids.push(found);
      continue;
    }
    const markup = buildModuleMarkup(sample.module_type, sample.fields);
    const payload = {
      name: sample.name,
      module_type: sample.module_type,
      html: markup.html,
      css: markup.css,
      js: "",
    };
    const inserted = await admin.from("modules").insert(payload).select("id").single();
    if (inserted.error) {
      const fallback = await admin
        .from("modules")
        .insert({ name: payload.name, html: payload.html, css: payload.css, js: "" })
        .select("id")
        .single();
      if (fallback.error || !fallback.data) throw new Error(inserted.error.message);
      ids.push(fallback.data.id);
    } else if (inserted.data) {
      ids.push(inserted.data.id);
    }
  }

  const { data: current } = await admin.from("page_modules").select("module_id").eq("page_id", pageId).order("sort_order");
  const currentIds = (current ?? []).map((row) => String(row.module_id));
  const merged = [...currentIds];
  for (const id of ids) {
    if (!merged.includes(id)) merged.push(id);
  }

  await admin.from("pages").update({ render_mode: "modules" }).eq("id", pageId);
  await admin.from("page_modules").delete().eq("page_id", pageId);
  if (merged.length) {
    const rows = merged.map((moduleId, index) => ({ page_id: pageId, module_id: moduleId, sort_order: index }));
    const { error } = await admin.from("page_modules").insert(rows);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/landing");
  revalidatePath("/admin/moduller");
}
