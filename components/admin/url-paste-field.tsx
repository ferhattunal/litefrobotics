"use client";

import { useState } from "react";

type Props = {
  label: string;
  onApply: (url: string) => void;
};

export function UrlPasteField({ label, onApply }: Props) {
  const [paste, setPaste] = useState("");
  return (
    <div>
      <span className="admin-label">{label}</span>
      <div className="mt-1 flex gap-2">
        <input
          className="admin-input"
          value={paste}
          placeholder="https://..."
          onChange={(event) => setPaste(event.target.value)}
        />
        <button
          type="button"
          className="rounded-lg border px-3 py-2 text-sm whitespace-nowrap"
          onClick={() => {
            if (!paste.trim()) return;
            onApply(paste.trim());
            setPaste("");
          }}
        >
          Yapıştır
        </button>
      </div>
    </div>
  );
}
