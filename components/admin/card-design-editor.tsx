"use client";

import { useMemo, useState } from "react";
import { DEFAULT_CARD, decodeDesignCode, encodeDesignCode } from "@/lib/card-design";
import { SHADOW_PRESETS } from "@/lib/constants";
import type { CardDesign } from "@/lib/types";

type Props = {
  value: CardDesign | null;
  fallback: CardDesign;
  onChange: (design: CardDesign | null) => void;
  resetLabel: string;
  allowCode: boolean;
};

export function CardDesignEditor({ value, fallback, onChange, resetLabel, allowCode }: Props) {
  const [paste, setPaste] = useState("");
  const [message, setMessage] = useState("");
  const active = value ?? fallback;
  const isOverride = Boolean(value);

  const presetKey = useMemo(() => {
    const match = Object.entries(SHADOW_PRESETS).find(([, shadow]) => shadow === active.shadow);
    return match?.[0] ?? "custom";
  }, [active.shadow]);

  function update(partial: Partial<CardDesign>) {
    onChange({ ...active, ...partial });
  }

  function applyCode() {
    const decoded = decodeDesignCode(paste);
    if (!decoded) {
      setMessage("Kod okunamadı. LFCARD1. ile başlayan geçerli bir kod yapıştırın.");
      return;
    }
    onChange(decoded);
    setMessage("Tasarım kodu uygulandı.");
    setPaste("");
  }

  async function copyCode() {
    if (!value) return;
    await navigator.clipboard.writeText(encodeDesignCode(value));
    setMessage("Tasarım kodu kopyalandı.");
  }

  return (
    <div className="grid gap-6 rounded-2xl border border-stone-200 bg-white p-5 lg:grid-cols-[1fr_260px]">
      <div className="grid gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold">Ürün kartı tasarımı</h3>
            <p className="text-sm text-stone-500">
              {isOverride ? "Özel tasarım aktif." : "Şu an varsayılan / üst seviye tasarım kullanılıyor."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
          >
            {resetLabel}
          </button>
        </div>

        <label className="grid gap-1 text-sm">
          Görsel alanı yüksekliği ({active.imageHeight}px)
          <input
            type="range"
            min={120}
            max={420}
            value={active.imageHeight}
            onChange={(event) => update({ imageHeight: Number(event.target.value) })}
          />
        </label>

        <label className="grid gap-1 text-sm">
          Başlık büyüklüğü ({active.titleFontSize}px)
          <input
            type="range"
            min={12}
            max={36}
            value={active.titleFontSize}
            onChange={(event) => update({ titleFontSize: Number(event.target.value) })}
          />
        </label>

        <label className="grid gap-1 text-sm">
          Kart arka planı
          <input
            type="color"
            value={active.background}
            onChange={(event) => update({ background: event.target.value })}
            className="h-10 w-20"
          />
        </label>

        <label className="grid gap-1 text-sm">
          Gölge
          <select
            className="admin-input"
            value={presetKey}
            onChange={(event) => {
              const next = SHADOW_PRESETS[event.target.value];
              if (next) update({ shadow: next });
            }}
          >
            {Object.keys(SHADOW_PRESETS).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
            <option value="custom">özel</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm">
          Köşe yuvarlaklığı ({active.radius}px)
          <input
            type="range"
            min={0}
            max={40}
            value={active.radius}
            onChange={(event) => update({ radius: Number(event.target.value) })}
          />
        </label>

        {allowCode ? (
          <div className="grid gap-2 rounded-xl bg-stone-50 p-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={copyCode}
                disabled={!value}
                className="rounded-lg bg-stone-900 px-3 py-2 text-sm text-white disabled:opacity-40"
              >
                Tasarım kodunu kopyala
              </button>
            </div>
            <textarea
              className="admin-textarea min-h-20"
              placeholder="Başka bir karttan kopyalanan tasarım kodunu yapıştırın"
              value={paste}
              onChange={(event) => setPaste(event.target.value)}
            />
            <button type="button" onClick={applyCode} className="w-fit rounded-lg border px-3 py-2 text-sm">
              Kodu uygula
            </button>
            <p className="text-xs text-stone-500">
              Default kart kod üretmez. Kod yalnızca kategori veya ürün özel tasarımından alınır.
            </p>
          </div>
        ) : null}
        {message ? <p className="text-sm text-orange-700">{message}</p> : null}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-stone-500">Önizleme</p>
        <div
          className="overflow-hidden"
          style={{
            background: active.background,
            boxShadow: active.shadow,
            borderRadius: active.radius,
          }}
        >
          <div className="bg-stone-200" style={{ height: active.imageHeight }} />
          <div className="p-4">
            <div className="font-semibold" style={{ fontSize: active.titleFontSize }}>
              Örnek ürün
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { DEFAULT_CARD };
