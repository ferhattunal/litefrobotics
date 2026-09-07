"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authEmailFromUsername, looksLikeEmail } from "../auth-email";
import { createAdminSupabase } from "../supabase/admin";
import { createQuerySupabase } from "../supabase/query";
import { createServerSupabase } from "../supabase/server";

function loginFail(message: string): never {
  redirect(`/admin/login?error=${encodeURIComponent(message)}`);
}

async function resolveLoginEmail(identifier: string) {
  try {
    const admin = createAdminSupabase();
    if (looksLikeEmail(identifier)) {
      const { data } = await admin.from("admin_users").select("email,status,username").eq("email", identifier.toLowerCase()).maybeSingle();
      if (data) return data;
    }
    const { data } = await admin.from("admin_users").select("email,status,username").eq("username", identifier).maybeSingle();
    if (data) return data;
  } catch {
    return null;
  }
  return null;
}

export async function loginAction(formData: FormData) {
  const identifier = String(formData.get("username") ?? formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!identifier || !password) {
    loginFail("Kullanıcı adı ve şifre gerekli.");
  }

  const profile = await resolveLoginEmail(identifier);
  if (profile?.status === "inactive") {
    loginFail("Bu hesap pasif.");
  }
  const email = profile?.email || (looksLikeEmail(identifier) ? identifier.toLowerCase() : authEmailFromUsername(identifier));

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

  const { data: admin } = await query.from("admin_users").select("id,status").eq("id", data.user.id).maybeSingle();
  if (!admin) {
    const username = looksLikeEmail(identifier) ? identifier.split("@")[0] : identifier;
    const { error: bootstrapError } = await query.from("admin_users").insert({
      id: data.user.id,
      email: data.user.email ?? email,
      username,
      first_name: "",
      last_name: "",
      status: "active",
      role: "admin",
    });
    if (bootstrapError) {
      loginFail("Bu hesap admin olarak yetkilendirilmemiş. schema.sql içindeki admin bootstrap politikasını çalıştırın.");
    }
  } else if ((admin as { status?: string }).status === "inactive") {
    loginFail("Bu hesap pasif.");
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
