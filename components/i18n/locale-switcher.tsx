"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeNames, locales, type Locale } from "@/lib/i18n/config";
import { switchLocalePath } from "@/lib/i18n/href";

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() || `/${locale}`;
  return (
    <nav aria-label="Language" className="flex items-center gap-1 px-4 py-2 text-[12px] font-semibold tracking-wide md:justify-end">
      {locales.map((item) => (
        <Link
          key={item}
          href={switchLocalePath(pathname, item)}
          hrefLang={item}
          className={`rounded-md px-2 py-1 uppercase ${
            item === locale ? "bg-[var(--lf-625)] text-white" : "text-stone-500 hover:text-stone-800"
          }`}
        >
          {item}
          <span className="sr-only">{localeNames[item]}</span>
        </Link>
      ))}
    </nav>
  );
}
