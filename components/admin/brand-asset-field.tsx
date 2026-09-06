"use client";

import { useState, type ChangeEvent } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
};

export function BrandAssetField({ label, value, onChange }: Props) {
  const [paste, setPaste] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    const body = new FormData();
    body.set("file", file);
    body.set("bucket", "page-assets");
    body.set("folder", "brand");
    const response = await fetch("/api/upload", { method: "POST", body });
    const data = (await response.json()) as { url?: string; error?: string };
    setBusy(false);
    if (!response.ok || !data.url) {
      setError(data.error || "Yükleme başarısız.");
      return;
    }
    onChange(data.url);
  }

  return (
    <div>
      <p className="settings-kicker">{label}</p>
      <div className="mt-2 flex items-start gap-3">
        <div className="relative flex h-24 w-28 items-center justify-center overflow-hidden rounded-lg border border-stone-200 bg-stone-50">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="text-xs text-stone-400">Önizleme</span>
          )}
          {value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs shadow"
            >
              ×
            </button>
          ) : null}
        </div>
        <label className="flex h-24 flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 text-sm text-stone-500 hover:border-orange-600 hover:text-stone-800">
          <input type="file" accept="image/*" className="hidden" onChange={upload} disabled={busy} />
          {busy ? "Yükleniyor…" : "Görsel seç (WebP)"}
        </label>
      </div>
      <p className="settings-kicker mt-3">Görsel URL yapıştır</p>
      <div className="mt-1 flex gap-2">
        <input
          className="settings-input"
          value={paste}
          placeholder="https://..."
          onChange={(event) => setPaste(event.target.value)}
        />
        <button type="button" className="settings-btn" onClick={() => paste.trim() && onChange(paste.trim())}>
          Kullan
        </button>
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
