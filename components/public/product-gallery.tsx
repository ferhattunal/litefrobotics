"use client";

import { useState } from "react";
import type { ProductImage } from "@/lib/types";

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const sorted = images.slice().sort((a, b) => a.sort_order - b.sort_order);
  const [active, setActive] = useState(sorted[0]?.url ?? "");

  if (!sorted.length) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
        Görsel yok
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={active} alt={name} className="aspect-square w-full object-contain p-6" />
      </div>
      {sorted.length > 1 ? (
        <div className="grid grid-cols-5 gap-3">
          {sorted.map((image) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActive(image.url)}
              className={`overflow-hidden rounded-xl border bg-white ${
                active === image.url ? "border-orange-600" : "border-stone-200"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt="" className="aspect-square w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
