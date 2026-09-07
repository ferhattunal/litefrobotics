"use client";

import { useState, type ChangeEvent } from "react";
import { ImageDropzone } from "@/components/admin/image-dropzone";
import { UrlPasteField } from "@/components/admin/url-paste-field";

type Props = {
  values: string[];
  onChange: (urls: string[]) => void;
};

export function MultiImageUploader({ values, onChange }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function uploadFiles(files: File[]) {
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
  }

  function move(index: number, direction: -1 | 1) {
    const next = [...values];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="grid gap-4">
      <ImageDropzone
        label="Görsel yükle"
        hint="Bir veya birden fazla görsel seçin ya da sürükleyin. İlk görsel ana görseldir."
        multiple
        busy={busy}
        onFiles={uploadFiles}
      />
      <UrlPasteField
        label="veya görsel URL yapıştır"
        onApply={(url) => onChange([...values, url])}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="grid gap-3 sm:grid-cols-3">
        {values.map((url, index) => (
          <div key={`${url}-${index}`} className="overflow-hidden rounded-xl border border-stone-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-32 w-full object-cover" />
            <div className="flex gap-2 p-2 text-xs">
              {index === 0 ? <span className="rounded bg-stone-900 px-2 py-1 text-white">Ana</span> : null}
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
