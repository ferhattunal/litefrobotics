/** Public canvas: equal-channel dirty white (no yellow). */
export const DIRTY_WHITE = "#f0f0f0";

const WARM_OFFWHITES = [
  "#f3f0e8",
  "#f4f4f1",
  "#faf8f1",
  "#f7f3ea",
  "#f5f0e6",
  "#faf6ee",
  "#f6f1e7",
  "#ebe6d9",
  "#e8e4d8",
  "#fff8e7",
  "#f5f5f4",
  "#fafaf9",
  "#f7f4ee",
  "#efebe3",
];

const WARM_SET = new Set(WARM_OFFWHITES);

export function coolOffWhite(color: string) {
  const value = color.trim().toLowerCase();
  return WARM_SET.has(value) ? DIRTY_WHITE : color;
}

export function rewriteWarmCss(css: string) {
  let next = css;
  for (const hex of WARM_OFFWHITES) {
    next = next.replaceAll(new RegExp(hex, "gi"), DIRTY_WHITE);
  }
  return next.replaceAll(/\b(beige|antiquewhite|linen|cornsilk|oldlace|papayawhip|wheat|ivory|seashell|floralwhite)\b/gi, DIRTY_WHITE);
}
