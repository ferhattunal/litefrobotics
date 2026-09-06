"use client";

import { useState } from "react";
import { AssetField } from "@/components/admin/asset-field";
import { saveReference } from "@/lib/actions/content";

export function ReferenceCreateForm() {
  const [logo, setLogo] = useState("");
  return (
    <form action={saveReference} className="grid max-w-xl gap-4 rounded-2xl bg-white p-5">
      <label>
        <span className="admin-label">Firma / referans adı</span>
        <input className="admin-input" name="name" required />
      </label>
      <label>
        <span className="admin-label">Web sitesi</span>
        <input className="admin-input" name="url" />
      </label>
      <label>
        <span className="admin-label">Sıra</span>
        <input className="admin-input" name="sort_order" type="number" defaultValue={0} />
      </label>
      <AssetField name="logo_url" label="Logo" value={logo} onChange={setLogo} />
      <button className="w-fit rounded-lg bg-stone-900 px-4 py-2 text-white">Ekle</button>
    </form>
  );
}
