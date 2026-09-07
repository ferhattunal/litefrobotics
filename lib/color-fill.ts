import type { ColorFill } from "./types";

export const DEFAULT_NAV_FILL: ColorFill = { mode: "solid", color: "#ffffff" };
export const DEFAULT_FOOTER_FILL: ColorFill = { mode: "solid", color: "#f5f5f4" };

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function parseColorFill(value: unknown, fallback: ColorFill): ColorFill {
  if (!isRecord(value)) return fallback;
  if (value.mode === "gradient") {
    return {
      mode: "gradient",
      from: typeof value.from === "string" ? value.from : fallback.mode === "gradient" ? fallback.from : "#111827",
      to: typeof value.to === "string" ? value.to : fallback.mode === "gradient" ? fallback.to : "#1f2937",
      angle: typeof value.angle === "number" ? value.angle : 135,
    };
  }
  if (value.mode === "solid" || typeof value.color === "string") {
    return {
      mode: "solid",
      color: typeof value.color === "string" ? value.color : fallback.mode === "solid" ? fallback.color : "#ffffff",
    };
  }
  return fallback;
}

export function colorFillCss(fill: ColorFill) {
  if (fill.mode === "gradient") {
    return `linear-gradient(${fill.angle}deg, ${fill.from}, ${fill.to})`;
  }
  return fill.color;
}

export function contrastOn(fill: ColorFill) {
  const hex = fill.mode === "solid" ? fill.color : fill.from;
  const raw = hex.replace("#", "");
  if (raw.length !== 6) return "#111827";
  const r = Number.parseInt(raw.slice(0, 2), 16);
  const g = Number.parseInt(raw.slice(2, 4), 16);
  const b = Number.parseInt(raw.slice(4, 6), 16);
  const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luma > 0.62 ? "#111827" : "#f8fafc";
}
