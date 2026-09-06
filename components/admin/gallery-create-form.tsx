"use client";

import { useState } from "react";
import { AdminForm } from "@/components/admin/admin-form";
import { AssetField } from "@/components/admin/asset-field";
import { saveGalleryItem } from "@/lib/actions/content";

export function GalleryCreateForm() {
  const [image, setImage] = useState("");
  return (
    <AdminForm action={saveGalleryItem} className="grid max-w-xl gap-4 rounded-2xl bg-white p-5" label="Ekle">
      <label>
        <span className="admin-label">Başlık</span>
        <input className="admin-input" name="title" />
      </label>
      <label>
        <span className="admin-label">Sıra</span>
        <input className="admin-input" name="sort_order" type="number" defaultValue={0} />
      </label>
      <AssetField name="image_url" label="Görsel" value={image} onChange={setImage} />
    </AdminForm>
  );
}
