export type CanniCollectionId =
  | "cc1"
  | "cc2"
  | "cc3"
  | "cc4"
  | "cc5"
  | "cc6"
  | "cc7"
  | "cc8";

export type ProductColor = {
  name: string;
  value: string;
};

export const CANNI_COLLECTIONS: Array<{
  id: CanniCollectionId;
  label: string;
  image: string;
}> = Array.from({ length: 8 }, (_, index) => {
  const number = index + 1;
  return {
    id: `cc${number}` as CanniCollectionId,
    label: `CC${number}`,
    image: `${import.meta.env.BASE_URL}images/canni/cc${number}.webp`,
  };
});

const FRENCH_COLORS: Record<string, string> = {
  argent: "#c0c0c0",
  beige: "#e8d5c4",
  blanc: "#ffffff",
  bleu: "#3b82f6",
  bordeaux: "#7f1d3f",
  brun: "#7c4a2d",
  corail: "#ff7f6a",
  dore: "#d4a72c",
  gris: "#9ca3af",
  jaune: "#facc15",
  lilas: "#c4b5fd",
  marron: "#8b5e3c",
  noir: "#111111",
  nude: "#d9a38f",
  orange: "#f97316",
  rose: "#ec4899",
  rouge: "#ef4444",
  turquoise: "#14b8a6",
  vert: "#22c55e",
  violet: "#8b5cf6",
};

export function resolveProductColor(value: string) {
  const normalized = value.trim().toLowerCase();
  if (/^#[0-9a-f]{3,8}$/i.test(normalized)) return normalized;
  return FRENCH_COLORS[normalized] ?? "#ec4899";
}
