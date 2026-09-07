"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, requireStaff } from "../auth";
import { slugify } from "../utils";

async function save(
  table: string,
  formData: FormData,
  payload: Record<string, unknown>,
  path: string,
) {
  const { admin } = await requireStaff();
  const id = String(formData.get("id") ?? "");
  if (id) {
    const { error } = await admin.from(table).update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await admin.from(table).insert(payload);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/", "layout");
  redirect(path);
}

async function remove(table: string, formData: FormData, path: string) {
  const { admin } = await requireStaff();
  const { error } = await admin.from(table).delete().eq("id", String(formData.get("id") ?? ""));
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  redirect(path);
}

export async function submitQuote(formData: FormData) {
  const { createAdminSupabase } = await import("../supabase/admin");
  const admin = createAdminSupabase();
  const { error } = await admin.from("quote_requests").insert({
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
    product_name: String(formData.get("product_name") ?? "").trim(),
  });
  if (error) throw new Error(error.message);
  redirect("/teklif?ok=1");
}

export async function deleteQuote(formData: FormData) {
  await remove("quote_requests", formData, "/admin/teklif-talepleri");
}

export async function updateQuoteStatus(formData: FormData) {
  const { admin } = await requireStaff();
  const { error } = await admin
    .from("quote_requests")
    .update({ status: String(formData.get("status") ?? "yeni") })
    .eq("id", String(formData.get("id") ?? ""));
  if (error) throw new Error(error.message);
  revalidatePath("/admin/teklif-talepleri");
}

export async function saveDealer(formData: FormData) {
  await save(
    "dealers",
    formData,
    {
      name: String(formData.get("name") ?? "").trim(),
      city: String(formData.get("city") ?? ""),
      address: String(formData.get("address") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      published: String(formData.get("published") ?? "") === "1",
    },
    "/admin/bayiler",
  );
}

export async function deleteDealer(formData: FormData) {
  await remove("dealers", formData, "/admin/bayiler");
}

export async function savePriceList(formData: FormData) {
  await save(
    "price_lists",
    formData,
    {
      title: String(formData.get("title") ?? "").trim(),
      file_url: String(formData.get("file_url") ?? "") || null,
      published: String(formData.get("published") ?? "") === "1",
    },
    "/admin/fiyat-listesi",
  );
}

export async function deletePriceList(formData: FormData) {
  await remove("price_lists", formData, "/admin/fiyat-listesi");
}

export async function saveRental(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  await save(
    "rentals",
    formData,
    {
      title,
      slug: slugify(String(formData.get("slug") ?? "") || title),
      description: String(formData.get("description") ?? ""),
      image_url: String(formData.get("image_url") ?? "") || null,
      published: String(formData.get("published") ?? "") === "1",
    },
    "/admin/kiralama",
  );
}

export async function deleteRental(formData: FormData) {
  await remove("rentals", formData, "/admin/kiralama");
}

export async function saveGalleryItem(formData: FormData) {
  await save(
    "gallery_items",
    formData,
    {
      title: String(formData.get("title") ?? ""),
      image_url: String(formData.get("image_url") ?? ""),
      sort_order: Number(formData.get("sort_order") ?? 0),
    },
    "/admin/galeri",
  );
}

export async function deleteGalleryItem(formData: FormData) {
  await remove("gallery_items", formData, "/admin/galeri");
}

export async function saveReference(formData: FormData) {
  await save(
    "reference_items",
    formData,
    {
      name: String(formData.get("name") ?? "").trim(),
      logo_url: String(formData.get("logo_url") ?? "") || null,
      url: String(formData.get("url") ?? ""),
      sort_order: Number(formData.get("sort_order") ?? 0),
    },
    "/admin/referanslar",
  );
}

export async function deleteReference(formData: FormData) {
  await remove("reference_items", formData, "/admin/referanslar");
}

export async function saveFaq(formData: FormData) {
  await save(
    "faqs",
    formData,
    {
      question: String(formData.get("question") ?? "").trim(),
      answer: String(formData.get("answer") ?? ""),
      sort_order: Number(formData.get("sort_order") ?? 0),
    },
    "/admin/sss",
  );
}

export async function deleteFaq(formData: FormData) {
  await remove("faqs", formData, "/admin/sss");
}

export async function saveSlide(formData: FormData) {
  await save(
    "slides",
    formData,
    {
      title: String(formData.get("title") ?? ""),
      image_url: String(formData.get("image_url") ?? ""),
      link_url: String(formData.get("link_url") ?? ""),
      sort_order: Number(formData.get("sort_order") ?? 0),
      published: String(formData.get("published") ?? "") === "1",
    },
    "/admin/slaytlar",
  );
}

export async function deleteSlide(formData: FormData) {
  await remove("slides", formData, "/admin/slaytlar");
}

export async function addAdminUser(formData: FormData) {
  const { admin } = await requireAdmin();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();
  const status = String(formData.get("status") ?? "active") === "inactive" ? "inactive" : "active";
  const role = String(formData.get("role") ?? "editor") === "admin" ? "admin" : "editor";

  if (!username || !password) {
    throw new Error("Kullanıcı adı ve şifre zorunludur.");
  }
  if (password.length < 6) {
    throw new Error("Şifre en az 6 karakter olmalı.");
  }

  const { authEmailFromUsername } = await import("../auth-email");
  const email = authEmailFromUsername(username);
  const { data, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username, first_name: firstName, last_name: lastName },
  });
  if (createError || !data.user) {
    throw new Error(createError?.message || "Kullanıcı oluşturulamadı.");
  }

  const { error } = await admin.from("admin_users").insert({
    id: data.user.id,
    email,
    username,
    first_name: firstName,
    last_name: lastName,
    status,
    role,
  });
  if (error) {
    await admin.auth.admin.deleteUser(data.user.id);
    throw new Error(error.message);
  }

  revalidatePath("/admin/kullanicilar");
}

export async function deleteAdminUser(formData: FormData) {
  const { admin, user } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id === user.id) {
    throw new Error("Kendi hesabınızı silemezsiniz.");
  }
  const { error } = await admin.from("admin_users").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await admin.auth.admin.deleteUser(id);
  revalidatePath("/", "layout");
  redirect("/admin/kullanicilar");
}
