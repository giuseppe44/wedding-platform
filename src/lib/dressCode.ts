export interface DressCodePaletteColor {
  id: string;
  label: string;
  hex: string;
}

export const DRESS_CODE_PALETTE: DressCodePaletteColor[] = [
  { id: "ivory", label: "Avorio", hex: "#fcf9f2" },
  { id: "champagne", label: "Champagne", hex: "#f4ebd0" },
  { id: "rose", label: "Rosa Antico", hex: "#dca8a9" },
  { id: "sage", label: "Verde Salvia", hex: "#c2ceba" },
  { id: "blue", label: "Blu Polvere", hex: "#b5c2d1" },
  { id: "burgundy", label: "Borgogna", hex: "#7f1d1d" },
  { id: "emerald", label: "Verde Smeraldo", hex: "#065f46" },
  { id: "black", label: "Nero / Cravatta Nera", hex: "#1c1917" },
  { id: "gold", label: "Oro", hex: "#d4af37" },
];

const PALETTE_MARKER = "||palette:";

export interface ParsedDressCode {
  text: string;
  colors: DressCodePaletteColor[];
}

/**
 * Parses a saved TimelineItem.dressCode string into free-text description
 * and ONLY the color swatches explicitly selected by the couple.
 * Backward compatible: plain legacy text returns colors = [].
 */
export function parseDressCode(raw: string | null | undefined): ParsedDressCode {
  const safe = (raw || "").trim();
  if (!safe) {
    return { text: "", colors: [] };
  }

  const markerIdx = safe.indexOf(PALETTE_MARKER);
  if (markerIdx === -1) {
    return { text: safe, colors: [] };
  }

  const text = safe.slice(0, markerIdx).trim();
  const rawIds = safe
    .slice(markerIdx + PALETTE_MARKER.length)
    .split(",")
    .map((id) => id.trim().toLowerCase())
    .filter(Boolean);

  const colorMap = new Map(DRESS_CODE_PALETTE.map((c) => [c.id, c]));
  const colors = rawIds
    .map((id) => colorMap.get(id))
    .filter((c): c is DressCodePaletteColor => Boolean(c));

  return { text, colors };
}

/**
 * Serializes dress code description + optional selected color IDs back into
 * TimelineItem.dressCode cleanly without requiring schema changes.
 */
export function stringifyDressCode(text: string, colorIds: string[]): string {
  const cleanText = (text || "").trim();
  const validIds = Array.from(
    new Set(
      colorIds
        .map((id) => id.trim().toLowerCase())
        .filter((id) => DRESS_CODE_PALETTE.some((p) => p.id === id))
    )
  );

  if (validIds.length === 0) {
    return cleanText;
  }

  return `${cleanText} ${PALETTE_MARKER}${validIds.join(",")}`.trim();
}
