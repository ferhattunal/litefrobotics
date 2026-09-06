function readEnv(name: string) {
  return process.env[name]?.trim().replace(/^["']|["']$/g, "").trim() ?? "";
}

export function getSupabaseUrl() {
  const value = readEnv("NEXT_PUBLIC_SUPABASE_URL");
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value.replace(/\/$/, "");
  return `https://${value.replace(/\/$/, "")}`;
}

export function getSupabaseAnonKey() {
  return readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export function getSupabaseServiceKey() {
  return readEnv("SUPABASE_SERVICE_ROLE_KEY");
}

export function getSupabaseAuthKey() {
  return getSupabaseAnonKey() || getSupabaseServiceKey();
}

export function getSupabaseQueryKey() {
  return getSupabaseServiceKey() || getSupabaseAnonKey();
}

export function hasSupabaseConfig() {
  return Boolean(getSupabaseUrl() && getSupabaseAuthKey());
}
