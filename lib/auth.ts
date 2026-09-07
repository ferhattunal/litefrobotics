import { redirect } from "next/navigation";
import { createAdminSupabase } from "./supabase/admin";
import { createServerSupabase } from "./supabase/server";
import type { AdminUser, UserRole } from "./types";

function asStaff(row: Record<string, unknown> | null): AdminUser | null {
  if (!row || typeof row.id !== "string") return null;
  return {
    id: row.id,
    email: String(row.email ?? ""),
    username: String(row.username ?? ""),
    first_name: String(row.first_name ?? ""),
    last_name: String(row.last_name ?? ""),
    status: row.status === "inactive" ? "inactive" : "active",
    role: row.role === "editor" ? "editor" : "admin",
    created_at: String(row.created_at ?? ""),
  };
}

export async function getSessionUser() {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

export async function getStaffByUserId(userId: string) {
  try {
    const supabase = await createServerSupabase();
    const { data } = await supabase.from("admin_users").select("*").eq("id", userId).maybeSingle();
    return asStaff((data as Record<string, unknown> | null) ?? null);
  } catch {
    return null;
  }
}

export async function isAdminUser(userId: string) {
  const staff = await getStaffByUserId(userId);
  return Boolean(staff && staff.status === "active");
}

export async function requireAdminSession() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/admin/login");
  }

  const staff = await getStaffByUserId(user.id);
  if (!staff || staff.status !== "active") {
    redirect("/admin/login");
  }

  return { user, staff };
}

export async function requireStaff() {
  const { user, staff } = await requireAdminSession();
  return {
    user,
    staff,
    admin: createAdminSupabase(),
  };
}

export async function requireAdmin() {
  const session = await requireStaff();
  if (session.staff.role !== "admin") {
    redirect("/admin");
  }
  return session;
}

export function canAccessSystem(role: UserRole) {
  return role === "admin";
}
