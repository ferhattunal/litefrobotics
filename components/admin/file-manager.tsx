"use client";

import { useState } from "react";
import { FileUploader } from "@/components/admin/file-uploader";

type Props = {
  files: { name: string; created_at?: string }[];
};

export function FileManager({ files }: Props) {
  const [lastUrl, setLastUrl] = useState("");
  return (
    <div className="grid gap-6">
      <div className="rounded-2xl bg-white p-5">
        <FileUploader
          bucket="page-assets"
          folder="uploads"
          accept="image/*,application/pdf"
          label="Dosya yükle (görsel WebP'ye çevrilir)"
          onChange={setLastUrl}
        />
        {lastUrl ? (
          <p className="mt-3 break-all text-sm text-stone-500">
            URL: <a href={lastUrl} className="text-orange-700 underline" target="_blank" rel="noreferrer">{lastUrl}</a>
          </p>
        ) : null}
      </div>
      <div className="rounded-2xl bg-white p-5">
        <h2 className="font-medium">Yüklenenler</h2>
        <ul className="mt-3 grid gap-2 text-sm">
          {files.map((file) => (
            <li key={file.name} className="text-stone-600">
              {file.name}
            </li>
          ))}
          {!files.length ? <li className="text-stone-400">Henüz dosya yok veya bucket boş.</li> : null}
        </ul>
      </div>
    </div>
  );
}
