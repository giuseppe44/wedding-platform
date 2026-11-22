export interface LocationLike {
  id?: string;
  name?: string | null;
  address?: string | null;
  city?: string | null;
  notes?: string | null;
  coordinates?: string | null;
  type?: string | null;
}

export type LocationIconKind =
  | "bride_home"
  | "groom_home"
  | "church"
  | "civic"
  | "hotel"
  | "restaurant";

export interface LocationPresentation {
  roleBadge: string;
  roleHelper: string;
  displayName: string;
  cleanAddress: string;
  badgeClass: string;
  iconKind: LocationIconKind;
}

/**
 * Normalizes stray backslashes or repeated spacing in saved street addresses
 * (e.g. "via G.Rossa 4\a" -> "via G.Rossa 4/a").
 */
export function normalizeLocationText(raw: string | null | undefined): string {
  if (!raw) return "";
  return raw
    .replace(/\\+/g, "/")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Derives clear Italian role badges, colorful icon category, and guest-facing
 * descriptions for each wedding location card.
 */
export function getLocationPresentation(loc: LocationLike): LocationPresentation {
  const rawName = normalizeLocationText(loc.name);
  const rawAddress = normalizeLocationText(loc.address);
  const rawCity = normalizeLocationText(loc.city);
  const combinedAddress = [rawAddress, rawCity]
    .filter(Boolean)
    .filter((part, idx, arr) => idx === 0 || !arr[0].toLowerCase().includes(part.toLowerCase()))
    .join(" — ");

  const upperType = (loc.type || "").toUpperCase();
  const lowerName = rawName.toLowerCase();

  if (upperType === "BRIDE_PREP") {
    return {
      roleBadge: "Casa della Sposa",
      roleHelper: "Preparazione della Sposa prima della cerimonia.",
      displayName: lowerName === "casa" ? "Casa della Sposa" : rawName || "Casa della Sposa",
      cleanAddress: combinedAddress,
      badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
      iconKind: "bride_home",
    };
  }

  if (upperType === "GROOM_PREP") {
    return {
      roleBadge: "Casa dello Sposo",
      roleHelper: "Preparazione dello Sposo prima della cerimonia.",
      displayName: lowerName === "casa" ? "Casa dello Sposo" : rawName || "Casa dello Sposo",
      cleanAddress: combinedAddress,
      badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
      iconKind: "groom_home",
    };
  }

  if (upperType === "RECEPTION") {
    const isHotelOrVilla =
      lowerName.includes("hotel") ||
      lowerName.includes("resort") ||
      lowerName.includes("villa") ||
      lowerName.includes("tenuta") ||
      lowerName.includes("residen") ||
      lowerName.includes("borgo") ||
      lowerName.includes("castello");
    return {
      roleBadge: "Ricevimento & Festa",
      roleHelper: "Qui si festeggerà insieme tra brindisi, banchetto e musica.",
      displayName: rawName || "Location del Ricevimento",
      cleanAddress: combinedAddress,
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      iconKind: isHotelOrVilla ? "hotel" : "restaurant",
    };
  }

  // Fallback smart inference if older DB rows defaulted to CEREMONY
  if (lowerName === "casa" || lowerName.includes("casa sposa") || lowerName.includes("casa dello sposo")) {
    const isBride = lowerName.includes("sposa");
    const isGroom = lowerName.includes("sposo");
    return {
      roleBadge: isBride ? "Casa della Sposa" : isGroom ? "Casa dello Sposo" : "Ritrovo / Abitazione",
      roleHelper: isBride
        ? "Preparazione della Sposa prima della cerimonia."
        : isGroom
        ? "Preparazione dello Sposo prima della cerimonia."
        : "Punto di ritrovo indicato dagli sposi prima del rito.",
      displayName: rawName || "Ritrovo Sposi",
      cleanAddress: combinedAddress,
      badgeClass: isBride
        ? "bg-rose-50 text-rose-700 border-rose-200"
        : isGroom
        ? "bg-sky-50 text-sky-700 border-sky-200"
        : "bg-stone-100 text-stone-700 border-stone-200",
      iconKind: isGroom ? "groom_home" : "bride_home",
    };
  }

  if (
    lowerName.includes("villa") ||
    lowerName.includes("ristorante") ||
    lowerName.includes("tenuta") ||
    lowerName.includes("hotel") ||
    lowerName.includes("resort") ||
    lowerName.includes("borgo") ||
    lowerName.includes("agriturismo")
  ) {
    const isHotelOrVilla =
      lowerName.includes("hotel") ||
      lowerName.includes("resort") ||
      lowerName.includes("villa") ||
      lowerName.includes("tenuta") ||
      lowerName.includes("borgo");
    return {
      roleBadge: "Ricevimento & Festa",
      roleHelper: "Qui si terranno il ricevimento, il pranzo/cena e i festeggiamenti.",
      displayName: rawName || "Location Ricevimento",
      cleanAddress: combinedAddress,
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      iconKind: isHotelOrVilla ? "hotel" : "restaurant",
    };
  }

  const isCivic =
    lowerName.includes("comune") ||
    lowerName.includes("municipio") ||
    lowerName.includes("sala ") ||
    lowerName.includes("palazzo ");

  return {
    roleBadge: "Cerimonia & Rito",
    roleHelper: "L'evento verrà celebrato in questo luogo: ti aspettiamo per il Sì.",
    displayName: rawName || "Luogo della Cerimonia",
    cleanAddress: combinedAddress,
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    iconKind: isCivic ? "civic" : "church",
  };
}
