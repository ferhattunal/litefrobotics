export const INTERNAL_USER_DOMAIN = "users.litef.local";

export function authEmailFromUsername(username: string) {
  const value = username.trim().toLowerCase();
  if (value.includes("@")) return value;
  return `${value}@${INTERNAL_USER_DOMAIN}`;
}

export function looksLikeEmail(value: string) {
  return value.includes("@");
}
