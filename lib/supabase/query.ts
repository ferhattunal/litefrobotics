import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseQueryKey, getSupabaseUrl } from "./env";

export function createQuerySupabase(): SupabaseClient {
  const url = getSupabaseUrl();
  const key = getSupabaseQueryKey();
  if (!url || !key) {
    throw new Error("Supabase ortam değişkenleri eksik.");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
