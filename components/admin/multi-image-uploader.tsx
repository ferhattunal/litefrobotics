"use client";

import { useState, type ChangeEvent } from "react";
import { UrlPasteField } from "@/components/admin/url-paste-field";

type Props = {
  values: string[];
  onChange: (urls: string[]) => void;
};

export function MultiImageUploader({ values, onChange }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    setBusy(true);
    setError("");
    const uploaded: string[] = [];
    for (const file of files) {
      const body = new FormData();
      body.set("file", file);
      body.set("bucket", "product-images");
      body.set("folder", "products");
      const response = await fetch("/api/upload", { method: "POST", body });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        setError(data.error || "Görsel yüklenemedi.");
        setBusy(false);
        return;
      }
      uploaded.push(data.url);
    }
    onChange([...values, ...uploaded]);
    setBusy(false);
    event.target.value = "";
  }

  function move(index: number, direction: -1 | 1) {
    const next = [...values];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="grid gap-3">
      <label className="admin-label">Ürün görselleri (WebP olarak kaydedilir)</label>
      <input type="file" accept="image/*" multiple onChange={handleChange} disabled={busy} />
      <UrlPasteField
        label="Görsel URL yapıştır"
        onApply={(url) => onChange([...values, url])}
      />
      {busy ? <p className="text-sm text-stone-500">Dönüştürülüp yükleniyor…</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="grid gap-3 sm:grid-cols-3">
        {values.map((url, index) => (
          <div key={`${url}-${index}`} className="overflow-hidden rounded-xl border border-stone-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-32 w-full object-cover" />
            <div className="flex gap-2 p-2 text-xs">
              <button type="button" onClick={() => move(index, -1)} className="rounded border px-2 py-1">
                Yukarı
              </button>
              <button type="button" onClick={() => move(index, 1)} className="rounded border px-2 py-1">
                Aşağı
              </button>
              <button
                type="button"
                onClick={() => onChange(values.filter((_, i) => i !== index))}
                className="ml-auto rounded border border-red-200 px-2 py-1 text-red-700"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
