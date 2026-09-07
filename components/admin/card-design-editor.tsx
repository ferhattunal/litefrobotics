"use client";

import { useMemo, useState } from "react";
import { DEFAULT_CARD, decodeDesignCode, encodeDesignCode, imageRatioStyle } from "@/lib/card-design";
import { IMAGE_RATIOS, SHADOW_PRESETS } from "@/lib/constants";
import type { CardDesign } from "@/lib/types";

type Preview = {
  name: string;
  image?: string;
  price?: string;
  stock?: string;
  featured?: boolean;
};

type Props = {
  value: CardDesign | null;
  fallback: CardDesign;
  onChange: (design: CardDesign | null) => void;
  resetLabel: string;
  allowCode: boolean;
  preview?: Preview;
};

export function CardDesignEditor({ value, fallback, onChange, resetLabel, allowCode, preview }: Props) {
  const [paste, setPaste] = useState("");
  const [message, setMessage] = useState("");
  const active = value ?? fallback;
  const isOverride = Boolean(value);

  const presetKey = useMemo(() => {
    const match = Object.entries(SHADOW_PRESETS).find(([, shadow]) => shadow === active.shadow);
    return match?.[0] ?? "custom";
  }, [active.shadow]);

  const hoverPreset = useMemo(() => {
    const match = Object.entries(SHADOW_PRESETS).find(([, shadow]) => shadow === active.hoverShadow);
    return match?.[0] ?? "custom";
  }, [active.hoverShadow]);

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
    <div className="grid gap-6 rounded-2xl border border-stone-200 bg-white p-5 lg:grid-cols-[1fr_280px]">
      <div className="grid gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold">Ürün kartı tasarımı</h3>
            <p className="text-sm text-stone-500">
              {isOverride ? "Özel tasarım aktif." : "Şu an varsayılan / üst seviye tasarım kullanılıyor."}
            </p>
          </div>
          <button type="button" onClick={() => onChange(null)} className="rounded-lg border border-stone-300 px-3 py-2 text-sm">
            {resetLabel}
          </button>
        </div>

        <label className="grid gap-1 text-sm">
          Köşe yuvarlağı ({active.radius}px)
          <input type="range" min={0} max={40} value={active.radius} onChange={(event) => update({ radius: Number(event.target.value) })} />
        </label>

        <label className="grid gap-1 text-sm">
          Arka plan
          <input type="color" value={active.background} onChange={(event) => update({ background: event.target.value })} className="h-10 w-20" />
        </label>

        <label className="grid gap-1 text-sm">
          Başlık boyutu ({active.titleFontSize}px)
          <input type="range" min={12} max={36} value={active.titleFontSize} onChange={(event) => update({ titleFontSize: Number(event.target.value) })} />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            Kenarlık ({active.borderWidth}px)
            <input type="range" min={0} max={8} value={active.borderWidth} onChange={(event) => update({ borderWidth: Number(event.target.value) })} />
          </label>
          <label className="grid gap-1 text-sm">
            Kenarlık rengi
            <input type="color" value={active.borderColor} onChange={(event) => update({ borderColor: event.target.value })} className="h-10 w-20" />
          </label>
        </div>

        <label className="grid gap-1 text-sm">
          Gölge
          <select className="admin-input" value={presetKey} onChange={(event) => { const next = SHADOW_PRESETS[event.target.value]; if (next) update({ shadow: next }); }}>
            {Object.keys(SHADOW_PRESETS).map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm">
          Hover gölge
          <select className="admin-input" value={hoverPreset} onChange={(event) => { const next = SHADOW_PRESETS[event.target.value]; if (next) update({ hoverShadow: next }); }}>
            {Object.keys(SHADOW_PRESETS).map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm">
          Vurgu rengi
          <input type="color" value={active.accentColor} onChange={(event) => update({ accentColor: event.target.value })} className="h-10 w-20" />
        </label>

        <label className="grid gap-1 text-sm">
          İç boşluk ({active.padding}px)
          <input type="range" min={8} max={36} value={active.padding} onChange={(event) => update({ padding: Number(event.target.value) })} />
        </label>

        <label className="grid gap-1 text-sm">
          Görsel oranı
          <select className="admin-input" value={active.imageRatio} onChange={(event) => update({ imageRatio: event.target.value as CardDesign["imageRatio"] })}>
            {IMAGE_RATIOS.map((ratio) => (
              <option key={ratio} value={ratio}>{ratio === "auto" ? `otomatik (${active.imageHeight}px)` : ratio}</option>
            ))}
          </select>
        </label>

        {active.imageRatio === "auto" ? (
          <label className="grid gap-1 text-sm">
            Görsel yüksekliği ({active.imageHeight}px)
            <input type="range" min={120} max={420} value={active.imageHeight} onChange={(event) => update({ imageHeight: Number(event.target.value) })} />
          </label>
        ) : null}

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={active.hoverPan} onChange={(event) => update({ hoverPan: event.target.checked })} />
          Hover kaydırma
        </label>

        {allowCode ? (
          <div className="grid gap-2 rounded-xl bg-stone-50 p-3">
            <button type="button" onClick={copyCode} disabled={!value} className="w-fit rounded-lg bg-stone-900 px-3 py-2 text-sm text-white disabled:opacity-40">
              Tasarım kodunu kopyala
            </button>
            <textarea className="admin-textarea min-h-20" placeholder="Başka bir karttan kopyalanan tasarım kodunu yapıştırın" value={paste} onChange={(event) => setPaste(event.target.value)} />
            <button type="button" onClick={applyCode} className="w-fit rounded-lg border px-3 py-2 text-sm">
              Kodu uygula
            </button>
          </div>
        ) : null}
        {message ? <p className="text-sm text-orange-700">{message}</p> : null}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-stone-500">Ürün kartı önizleme</p>
        <div
          className={`lf-product-card overflow-hidden ${active.hoverPan ? "lf-product-card-pan" : ""}`}
          style={{
            background: active.background,
            boxShadow: active.shadow,
            borderRadius: active.radius,
            border: active.borderWidth ? `${active.borderWidth}px solid ${active.borderColor}` : "none",
            ["--card-hover-shadow" as string]: active.hoverShadow,
          }}
        >
          <div className="lf-product-card-image relative overflow-hidden bg-[#eef1f4]" style={imageRatioStyle(active)}>
            {preview?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview.image} alt="" className="h-full w-full object-contain p-3" />
            ) : null}
            <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5">
              {preview?.stock ? (
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                  style={{ background: preview.stock.includes("yok") ? "#78716c" : "var(--lf-625)" }}
                >
                  {preview.stock}
                </span>
              ) : null}
              {preview?.price ? (
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold shadow-sm">{preview.price}</span>
              ) : null}
            </div>
          </div>
          <div style={{ padding: active.padding }}>
            <p className="text-[10px] font-semibold tracking-[0.14em] uppercase" style={{ color: "var(--lf-625)" }}>
              Kategori
            </p>
            <p className="mt-1 text-[11px] text-stone-500">MARKA · SERİ</p>
            <div className="mt-1 font-semibold" style={{ fontSize: active.titleFontSize }}>
              {preview?.name || "Örnek ürün"}
            </div>
            <div className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full py-2 text-[10px] font-semibold tracking-[0.12em] text-white uppercase" style={{ background: "var(--lf-625)" }}>
              Ürünü incele
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { DEFAULT_CARD };
