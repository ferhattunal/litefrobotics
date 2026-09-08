"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaff } from "../auth";
import { rewriteWarmCss } from "../css-theme";

export async function saveModule(formData: FormData) {
  const { admin } = await requireStaff();
  const id = String(formData.get("id") ?? "");
  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    module_type: String(formData.get("module_type") ?? "custom") || "custom",
    html: String(formData.get("html") ?? ""),
    css: rewriteWarmCss(String(formData.get("css") ?? "")),
    js: String(formData.get("js") ?? ""),
  };

  if (!payload.name) {
    throw new Error("Modül adı zorunludur.");
  }

  if (id) {
    const { error } = await admin.from("modules").update(payload).eq("id", id);
    if (error) {
      const fallback = await admin
        .from("modules")
        .update({ name: payload.name, html: payload.html, css: payload.css, js: payload.js })
        .eq("id", id);
      if (fallback.error) throw new Error(fallback.error.message);
    }
  } else {
    const { error } = await admin.from("modules").insert(payload);
    if (error) {
      const fallback = await admin
        .from("modules")
        .insert({ name: payload.name, html: payload.html, css: payload.css, js: payload.js });
      if (fallback.error) throw new Error(fallback.error.message);
    }
  }

  revalidatePath("/", "layout");
  redirect("/admin/moduller");
}

export async function deleteModule(formData: FormData) {
  const { admin } = await requireStaff();
  const id = String(formData.get("id") ?? "");
  const { error } = await admin.from("modules").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  redirect("/admin/moduller");
}
