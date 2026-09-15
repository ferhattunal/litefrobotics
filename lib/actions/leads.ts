"use server";

import { createAdminSupabase } from "../supabase/admin";
import { leadSchema } from "../leads";
import { asLocale } from "../i18n/config";

export async function submitLead(input: unknown) {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message || "invalid" };
  }

  try {
    const admin = createAdminSupabase();
    const { error } = await admin.from("leads").insert({
      full_name: parsed.data.full_name,
      phone: parsed.data.phone,
      company: parsed.data.company || "",
      interested_product: parsed.data.interested_product || "",
      language: asLocale(parsed.data.language),
      utm_source: parsed.data.utm_source || "",
    });
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, error: error instanceof Error ? error.message : "failed" };
  }
}
