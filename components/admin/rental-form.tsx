"use client";

import { useState } from "react";
import { AssetField } from "@/components/admin/asset-field";
import { saveRental } from "@/lib/actions/content";
import { slugify } from "@/lib/utils";
import type { Rental } from "@/lib/types";

export function RentalForm({ item }: { item?: Rental }) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [image, setImage] = useState(item?.image_url ?? "");
  return (
    <form action={saveRental} className="grid max-w-2xl gap-4">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <label>
        <span className="admin-label">Başlık</span>
        <input
          className="admin-input"
          name="title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (!item) setSlug(slugify(event.target.value));
          }}
          required
        />
      </label>
      <label>
        <span className="admin-label">Slug</span>
        <input className="admin-input" name="slug" value={slug} onChange={(event) => setSlug(event.target.value)} />
      </label>
      <AssetField name="image_url" label="Görsel" value={image} onChange={setImage} />
      <label>
        <span className="admin-label">Açıklama</span>
        <textarea className="admin-textarea" name="description" defaultValue={item?.description} />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" value="1" defaultChecked={item?.published ?? true} />
        Yayınla
      </label>
      <button className="w-fit rounded-lg bg-stone-900 px-4 py-2 text-white">Kaydet</button>
    </form>
  );
}
