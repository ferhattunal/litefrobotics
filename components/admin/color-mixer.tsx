"use client";

import { COLOR_PALETTE } from "@/lib/constants";
import { contrastOn } from "@/lib/color-fill";
import type { ColorFill } from "@/lib/types";

type Props = {
  label: string;
  value: ColorFill;
  textColor: string;
  onChange: (fill: ColorFill, textColor?: string) => void;
  onTextColor: (color: string) => void;
};

export function ColorMixer({ label, value, textColor, onChange, onTextColor }: Props) {
  const gradient = value.mode === "gradient";
  const solid = value.mode === "solid" ? value.color : value.from;

  return (
    <div>
      <p className="settings-kicker">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {COLOR_PALETTE.map((color) => (
          <button
            key={color}
            type="button"
            title={color}
            className="h-8 w-8 rounded-full border border-stone-200"
            style={{ background: color }}
            onClick={() => {
              const next: ColorFill = gradient
                ? { mode: "gradient", from: color, to: value.to, angle: value.angle }
                : { mode: "solid", color };
              onChange(next, contrastOn(next));
            }}
          />
        ))}
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <label>
          <span className="settings-help">Ana renk</span>
          <div className="mt-1 flex gap-2">
            <input
              type="color"
              className="h-10 w-14 cursor-pointer rounded border"
              value={solid}
              onChange={(event) => {
                const color = event.target.value;
                const next: ColorFill = gradient
                  ? { mode: "gradient", from: color, to: value.to, angle: value.angle }
                  : { mode: "solid", color };
                onChange(next, contrastOn(next));
              }}
            />
            <input
              className="settings-input"
              value={solid}
              onChange={(event) => {
                const color = event.target.value;
                const next: ColorFill = gradient
                  ? { mode: "gradient", from: color, to: value.to, angle: value.angle }
                  : { mode: "solid", color };
                onChange(next);
              }}
            />
          </div>
        </label>
        <label>
          <span className="settings-help">Yazı rengi</span>
          <div className="mt-1 flex gap-2">
            <input
              type="color"
              className="h-10 w-14 cursor-pointer rounded border"
              value={textColor || "#111827"}
              onChange={(event) => onTextColor(event.target.value)}
            />
            <input className="settings-input" value={textColor} onChange={(event) => onTextColor(event.target.value)} />
          </div>
        </label>
      </div>
      <label className="mt-3 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={gradient}
          onChange={(event) => {
            if (event.target.checked) {
              const next: ColorFill = { mode: "gradient", from: solid, to: "#1f2937", angle: 135 };
              onChange(next, contrastOn(next));
            } else {
              const next: ColorFill = { mode: "solid", color: solid };
              onChange(next, contrastOn(next));
            }
          }}
        />
        Gradient kullan
      </label>
      {gradient ? (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <label>
            <span className="settings-help">İkinci renk</span>
            <div className="mt-1 flex gap-2">
              <input
                type="color"
                className="h-10 w-14 cursor-pointer rounded border"
                value={value.to}
                onChange={(event) => onChange({ ...value, to: event.target.value })}
              />
              <input
                className="settings-input"
                value={value.to}
                onChange={(event) => onChange({ ...value, to: event.target.value })}
              />
            </div>
          </label>
          <label>
            <span className="settings-help">Açı ({value.angle}°)</span>
            <input
              type="range"
              min={0}
              max={360}
              className="mt-3 w-full"
              value={value.angle}
              onChange={(event) => onChange({ ...value, angle: Number(event.target.value) })}
            />
          </label>
        </div>
      ) : null}
      <div
        className="mt-3 h-12 rounded-xl border border-stone-200"
        style={{
          background: gradient ? `linear-gradient(${value.angle}deg, ${value.from}, ${value.to})` : solid,
        }}
      />
    </div>
  );
}
