import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseAuthKey, getSupabaseUrl } from "./env";

export async function createServerSupabase() {
  const url = getSupabaseUrl();
  const key = getSupabaseAuthKey();
  if (!url || !key) {
    throw new Error("Supabase ortam değişkenleri eksik.");
  }

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Component içinde set edilemeyebilir.
        }
      },
    },
  });
}
