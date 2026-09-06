import type { CSSProperties } from "react";
import { SHADOW_PRESETS } from "./constants";
import type { CardDesign, Category, Product } from "./types";

export const DEFAULT_CARD: CardDesign = {
  imageHeight: 220,
  titleFontSize: 18,
  background: "#ffffff",
  shadow: SHADOW_PRESETS.md,
  radius: 12,
};

const CODE_PREFIX = "LFCARD1.";

export function resolveCardDesign(product?: Product | null, category?: Category | null): CardDesign {
  return product?.card_design ?? category?.card_design ?? DEFAULT_CARD;
}

export function encodeDesignCode(design: CardDesign) {
  const json = JSON.stringify(design);
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
    if (
      typeof parsed.imageHeight !== "number" ||
      typeof parsed.titleFontSize !== "number" ||
      typeof parsed.background !== "string" ||
      typeof parsed.shadow !== "string" ||
      typeof parsed.radius !== "number"
    ) {
      return null;
    }
    return {
      imageHeight: parsed.imageHeight,
      titleFontSize: parsed.titleFontSize,
      background: parsed.background,
      shadow: parsed.shadow,
      radius: parsed.radius,
    };
  } catch {
    return null;
  }
}

export function isDefaultDesign(design: CardDesign | null | undefined) {
  if (!design) return true;
  return JSON.stringify(design) === JSON.stringify(DEFAULT_CARD);
}

export function cardStyle(design: CardDesign): CSSProperties {
  return {
    background: design.background,
    boxShadow: design.shadow,
    borderRadius: design.radius,
  };
}
