"use client";

import { useState, type ChangeEvent } from "react";
import { ImageDropzone } from "@/components/admin/image-dropzone";
import type { StorageBucket } from "@/lib/constants";

type Props = {
  bucket: StorageBucket;
  value?: string;
  accept?: string;
  label?: string;
  folder?: string;
  onChange: (url: string) => void;
};

export function FileUploader({
  bucket,
  value,
  accept = "image/*",
  label = "Dosya yükle",
  folder = "uploads",
  onChange,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const isImage = accept.includes("image");

  async function upload(file: File) {
    setBusy(true);
    setError("");
    const body = new FormData();
    body.set("file", file);
    body.set("bucket", bucket);
    body.set("folder", folder);
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
    <div className="grid gap-2">
      {isImage ? (
        <ImageDropzone
          label={label}
          busy={busy}
          accept={accept}
          onFiles={(files) => {
            const file = files[0];
            if (file) void upload(file);
          }}
        />
      ) : (
        <label>
          <span className="admin-label">{label}</span>
          <input
            type="file"
            accept={accept}
            disabled={busy}
            className="mt-1 block w-full text-sm"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const file = event.target.files?.[0];
              if (file) void upload(file);
            }}
          />
        </label>
      )}
      {busy ? <p className="text-sm text-stone-500">Yükleniyor…</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {value ? (
        accept.includes("pdf") ? (
          <a href={value} target="_blank" rel="noreferrer" className="text-sm text-orange-700 underline">
            Yüklü dosyayı aç
          </a>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-28 rounded-lg object-cover" />
        )
      ) : null}
    </div>
  );
}
