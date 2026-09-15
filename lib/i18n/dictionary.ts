import { asLocale, type Locale } from "./config";
import { az } from "./dictionaries/az";
import { bg } from "./dictionaries/bg";
import { en } from "./dictionaries/en";
import { tr } from "./dictionaries/tr";

export type Dictionary = typeof tr;

const dictionaries: Record<Locale, Dictionary> = { tr, en, bg, az };

export function getDictionary(locale: string | undefined | null): Dictionary {
  return dictionaries[asLocale(locale)];
}
