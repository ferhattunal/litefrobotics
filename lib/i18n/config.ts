export const locales = ["tr", "en", "bg", "az"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "tr";

export const localeHeader = "x-locale";

export const localeNames: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  bg: "Български",
  az: "Azərbaycan",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return locales.includes(value as Locale);
}

export function asLocale(value: string | undefined | null): Locale {
  return isLocale(value) ? value : defaultLocale;
}
