import type { CSSProperties } from "react";
import { SHADOW_PRESETS } from "./constants";
import type { CardDesign, Category, ImageRatio, Product } from "./types";

export const DEFAULT_CARD: CardDesign = {
  imageHeight: 220,
  titleFontSize: 18,
  background: "#ffffff",
  shadow: SHADOW_PRESETS.md,
  hoverShadow: SHADOW_PRESETS.lg,
  radius: 12,
  borderWidth: 0,
  borderColor: "#e7e5e4",
  accentColor: "#c2410c",
  padding: 16,
  imageRatio: "4/3",
  hoverPan: true,
};

const CODE_PREFIX = "LFCARD1.";

const RATIOS: ImageRatio[] = ["1/1", "4/3", "16/9", "3/4", "auto"];

function asRatio(value: unknown): ImageRatio {
  return RATIOS.includes(value as ImageRatio) ? (value as ImageRatio) : DEFAULT_CARD.imageRatio;
}

export function normalizeCardDesign(partial?: Partial<CardDesign> | null): CardDesign {
  if (!partial) return DEFAULT_CARD;
  return {
    imageHeight: typeof partial.imageHeight === "number" ? partial.imageHeight : DEFAULT_CARD.imageHeight,
    titleFontSize: typeof partial.titleFontSize === "number" ? partial.titleFontSize : DEFAULT_CARD.titleFontSize,
    background: typeof partial.background === "string" ? partial.background : DEFAULT_CARD.background,
    shadow: typeof partial.shadow === "string" ? partial.shadow : DEFAULT_CARD.shadow,
    hoverShadow: typeof partial.hoverShadow === "string" ? partial.hoverShadow : DEFAULT_CARD.hoverShadow,
    radius: typeof partial.radius === "number" ? partial.radius : DEFAULT_CARD.radius,
    borderWidth: typeof partial.borderWidth === "number" ? partial.borderWidth : DEFAULT_CARD.borderWidth,
    borderColor: typeof partial.borderColor === "string" ? partial.borderColor : DEFAULT_CARD.borderColor,
    accentColor: typeof partial.accentColor === "string" ? partial.accentColor : DEFAULT_CARD.accentColor,
    padding: typeof partial.padding === "number" ? partial.padding : DEFAULT_CARD.padding,
    imageRatio: asRatio(partial.imageRatio),
    hoverPan: typeof partial.hoverPan === "boolean" ? partial.hoverPan : DEFAULT_CARD.hoverPan,
  };
}

export function resolveCardDesign(product?: Product | null, category?: Category | null): CardDesign {
  return normalizeCardDesign(product?.card_design ?? category?.card_design ?? DEFAULT_CARD);
}

export function encodeDesignCode(design: CardDesign) {
  const json = JSON.stringify(normalizeCardDesign(design));
  const encoded =
    typeof window === "undefined"
      ? Buffer.from(json, "utf8").toString("base64")
      : btoa(unescape(encodeURIComponent(json)));
  return `${CODE_PREFIX}${encoded}`;
}

export function decodeDesignCode(code: string): CardDesign | null {
  const raw = code.trim();
  if (!raw.startsWith(CODE_PREFIX)) return null;
  try {
    const payload = raw.slice(CODE_PREFIX.length);
    const json =
      typeof window === "undefined"
        ? Buffer.from(payload, "base64").toString("utf8")
        : decodeURIComponent(escape(atob(payload)));
    const parsed = JSON.parse(json) as Partial<CardDesign>;
    if (typeof parsed.titleFontSize !== "number" || typeof parsed.background !== "string") {
      return null;
    }
    return normalizeCardDesign(parsed);
  } catch {
    return null;
  }
}

export function isDefaultDesign(design: CardDesign | null | undefined) {
  if (!design) return true;
  return JSON.stringify(normalizeCardDesign(design)) === JSON.stringify(DEFAULT_CARD);
}

export function imageRatioStyle(design: CardDesign): CSSProperties {
  if (design.imageRatio === "auto") {
    return { height: design.imageHeight };
  }
  return { aspectRatio: design.imageRatio.replace("/", " / ") };
}

export function cardStyle(design: CardDesign): CSSProperties {
  return {
    background: design.background,
    boxShadow: design.shadow,
    borderRadius: design.radius,
    border: design.borderWidth ? `${design.borderWidth}px solid ${design.borderColor}` : "none",
    ["--card-hover-shadow" as string]: design.hoverShadow,
    ["--card-accent" as string]: design.accentColor,
  };
}
