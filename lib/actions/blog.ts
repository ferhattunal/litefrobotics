"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "../auth";
import { slugify } from "../utils";

export async function savePost(formData: FormData) {
  const { admin } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "") || title);

  if (!title || !slug) {
    throw new Error("Başlık ve slug zorunludur.");
  }

  const payload = {
    title,
    slug,
    excerpt: String(formData.get("excerpt") ?? ""),
    content: String(formData.get("content") ?? ""),
    cover_url: String(formData.get("cover_url") ?? "") || null,
    published: String(formData.get("published") ?? "") === "1",
  };

  if (id) {
    const { error } = await admin.from("blog_posts").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await admin.from("blog_posts").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/", "layout");
  redirect("/admin/blog");
}

export async function deletePost(formData: FormData) {
  const { admin } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const { error } = await admin.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  redirect("/admin/blog");
}
