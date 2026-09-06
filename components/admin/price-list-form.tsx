"use client";

import { useState } from "react";
import { AdminForm } from "@/components/admin/admin-form";
import { AssetField } from "@/components/admin/asset-field";
import { savePriceList } from "@/lib/actions/content";
import type { PriceList } from "@/lib/types";

export function PriceListForm({ item }: { item?: PriceList }) {
  const [file, setFile] = useState(item?.file_url ?? "");
  return (
    <AdminForm action={savePriceList} className="grid max-w-2xl gap-4">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <label>
        <span className="admin-label">Başlık</span>
        <input className="admin-input" name="title" defaultValue={item?.title} required />
      </label>
      <AssetField name="file_url" label="PDF / dosya" value={file} onChange={setFile} accept="application/pdf" bucket="page-assets" />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" value="1" defaultChecked={item?.published ?? true} />
        Yayınla
      </label>
    </AdminForm>
  );
}
