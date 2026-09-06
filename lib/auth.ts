import { redirect } from "next/navigation";
import { createAdminSupabase } from "./supabase/admin";
import { createServerSupabase } from "./supabase/server";

export async function getSessionUser() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function isAdminUser(userId: string) {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("admin_users").select("id").eq("id", userId).maybeSingle();
  return Boolean(data);
}

export async function requireAdminSession() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/admin/login");
  }

  const allowed = await isAdminUser(user.id);
  if (!allowed) {
    redirect("/admin/login");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireAdminSession();
  return {
    user,
    admin: createAdminSupabase(),
  };
}
