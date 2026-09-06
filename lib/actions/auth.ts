"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createQuerySupabase } from "../supabase/query";
import { createServerSupabase } from "../supabase/server";

function loginFail(message: string): never {
  redirect(`/admin/login?error=${encodeURIComponent(message)}`);
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  let query;
  try {
    query = createQuerySupabase();
  } catch {
    loginFail("Supabase ortam değişkenleri eksik. Vercel'de URL ve anon/service key değerlerini kontrol edin.");
  }

  const { data, error } = await query.auth.signInWithPassword({ email, password });
  if (error || !data.user || !data.session) {
    loginFail("Giriş başarısız. Bilgileri kontrol edin.");
  }

  const { data: admin } = await query.from("admin_users").select("id").eq("id", data.user.id).maybeSingle();
  if (!admin) {
    const { error: bootstrapError } = await query.from("admin_users").insert({
      id: data.user.id,
      email: data.user.email ?? email,
    });
    if (bootstrapError) {
      loginFail("Bu hesap admin olarak yetkilendirilmemiş. schema.sql içindeki admin bootstrap politikasını çalıştırın.");
    }
  }

  let persistFailed = false;
  try {
    const supabase = await createServerSupabase();
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });
    persistFailed = Boolean(sessionError);
  } catch {
    persistFailed = true;
  }
  if (persistFailed) {
    loginFail("Oturum çerezi yazılamadı. NEXT_PUBLIC_SUPABASE_ANON_KEY değerini kontrol edin.");
  }

  revalidatePath("/", "layout");
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
