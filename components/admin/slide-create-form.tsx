"use client";

import { useState } from "react";
import { AdminForm } from "@/components/admin/admin-form";
import { AssetField } from "@/components/admin/asset-field";
import { saveSlide } from "@/lib/actions/content";

export function SlideCreateForm() {
  const [image, setImage] = useState("");
  return (
    <AdminForm action={saveSlide} className="grid max-w-xl gap-4 rounded-2xl bg-white p-5" label="Ekle">
      <label>
        <span className="admin-label">Başlık</span>
        <input className="admin-input" name="title" />
      </label>
      <label>
        <span className="admin-label">Link</span>
        <input className="admin-input" name="link_url" />
      </label>
      <label>
        <span className="admin-label">Sıra</span>
        <input className="admin-input" name="sort_order" type="number" defaultValue={0} />
      </label>
      <AssetField name="image_url" label="Banner görseli" value={image} onChange={setImage} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" value="1" defaultChecked />
        Yayınla
      </label>
    </AdminForm>
  );
}
