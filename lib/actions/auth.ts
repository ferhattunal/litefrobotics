"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabase } from "../supabase/server";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  let supabase;
  try {
    supabase = await createServerSupabase();
  } catch {
    redirect(`/admin/login?error=${encodeURIComponent("Supabase bağlantısı kurulamadı. Env kayıtlarını kontrol edin.")}`);
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent("Giriş başarısız. Bilgileri kontrol edin.")}`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/admin/login?error=${encodeURIComponent("Oturum açılamadı.")}`);
  }

  const { data: admin } = await supabase.from("admin_users").select("id").eq("id", user.id).maybeSingle();
  if (!admin) {
    await supabase.auth.signOut();
    redirect(`/admin/login?error=${encodeURIComponent("Bu hesap admin olarak yetkilendirilmemiş.")}`);
  }

  redirect("/admin");
}

export async function logoutAction() {
  try {
    const supabase = await createServerSupabase();
    await supabase.auth.signOut();
  } catch {
    // Oturum kapatılamasa da giriş ekranına dön.
  }
  revalidatePath("/", "layout");
  redirect("/admin/login");
}
