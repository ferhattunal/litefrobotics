"use client";

import { useState } from "react";
import { AssetField } from "@/components/admin/asset-field";
import { saveGalleryItem } from "@/lib/actions/content";

export function GalleryCreateForm() {
  const [image, setImage] = useState("");
  return (
    <form action={saveGalleryItem} className="grid max-w-xl gap-4 rounded-2xl bg-white p-5">
      <label>
        <span className="admin-label">Başlık</span>
        <input className="admin-input" name="title" />
      </label>
      <label>
        <span className="admin-label">Sıra</span>
        <input className="admin-input" name="sort_order" type="number" defaultValue={0} />
      </label>
      <AssetField name="image_url" label="Görsel" value={image} onChange={setImage} />
      <button className="w-fit rounded-lg bg-stone-900 px-4 py-2 text-white">Ekle</button>
    </form>
  );
}
