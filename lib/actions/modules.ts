"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "../auth";

export async function saveModule(formData: FormData) {
  const { admin } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    html: String(formData.get("html") ?? ""),
    css: String(formData.get("css") ?? ""),
    js: String(formData.get("js") ?? ""),
  };

  if (!payload.name) {
    throw new Error("Modül adı zorunludur.");
  }

  if (id) {
    const { error } = await admin.from("modules").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await admin.from("modules").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/", "layout");
  redirect("/admin/moduller");
}

export async function deleteModule(formData: FormData) {
  const { admin } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const { error } = await admin.from("modules").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  redirect("/admin/moduller");
}
