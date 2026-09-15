"use client";

import { useState } from "react";
import { PublicImage } from "@/components/public/public-image";
import { getDictionary } from "@/lib/i18n/dictionary";
import { asLocale, type Locale } from "@/lib/i18n/config";
import type { ProductImage } from "@/lib/types";

export function ProductGallery({
  images,
  name,
  locale = "tr",
}: {
  images: ProductImage[];
  name: string;
  locale?: Locale | string;
}) {
  const copy = getDictionary(asLocale(locale));
  const sorted = images.slice().sort((a, b) => a.sort_order - b.sort_order);
  const [active, setActive] = useState(sorted[0]?.url ?? "");

  if (!sorted.length) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
        {copy.common.noImage}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-sm">
        <PublicImage src={active} alt={name} fill className="object-contain p-6" sizes="(max-width: 1024px) 100vw, 50vw" priority />
      </div>
      {sorted.length > 1 ? (
        <div className="grid grid-cols-5 gap-3">
          {sorted.map((image) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActive(image.url)}
              className={`relative aspect-square overflow-hidden rounded-xl border bg-white ${
                active === image.url ? "border-orange-600" : "border-stone-200"
              }`}
            >
              <PublicImage src={image.url} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
