"use client";

import { useState, type ChangeEvent, type DragEvent } from "react";

type Props = {
  label: string;
  hint?: string;
  multiple?: boolean;
  busy?: boolean;
  accept?: string;
  onFiles: (files: File[]) => void;
};

export function ImageDropzone({
  label,
  hint = "Dosya seçin veya buraya sürükleyin. Görseller WebP olarak kaydedilir.",
  multiple = false,
  busy = false,
  accept = "image/*",
  onFiles,
}: Props) {
  const [over, setOver] = useState(false);

  function take(files: FileList | File[] | null) {
    const list = files ? Array.from(files) : [];
    if (list.length) onFiles(list);
  }

  return (
    <label
      className={`flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
        over ? "border-orange-600 bg-orange-50" : "border-stone-300 bg-stone-50 hover:border-orange-500"
      } ${busy ? "pointer-events-none opacity-60" : ""}`}
      onDragOver={(event: DragEvent) => {
        event.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(event: DragEvent) => {
        event.preventDefault();
        setOver(false);
        take(event.dataTransfer.files);
      }}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        disabled={busy}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          take(event.target.files);
          event.target.value = "";
        }}
      />
      <span className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white">
        {busy ? "Yükleniyor…" : label}
      </span>
      <span className="mt-3 max-w-sm text-xs text-stone-500">{hint}</span>
    </label>
  );
}
