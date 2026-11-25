export type ProvinceQuotaTier = "LARGE" | "MEDIUM" | "BOUTIQUE";

export interface ItalianProvinceMeta {
  code: string;
  name: string;
  region: string;
  tier: ProvinceQuotaTier;
  maxPerCategory: number;
}

const TIER_CAPS: Record<ProvinceQuotaTier, number> = {
  LARGE: 30,
  MEDIUM: 20,
  BOUTIQUE: 15,
};

const RAW_PROVINCES: Array<[string, string, string, ProvinceQuotaTier]> = [
  // Sardegna (in evidenza in cima per comodità o ordine alfabetico per regione/provincia)
  ["CA", "Cagliari", "Sardegna", "MEDIUM"],
  ["SS", "Sassari (incl. Alghero & Olbia)", "Sardegna", "MEDIUM"],
  ["OR", "Oristano", "Sardegna", "BOUTIQUE"],
  ["NU", "Nuoro", "Sardegna", "BOUTIQUE"],
  ["SU", "Sud Sardegna", "Sardegna", "BOUTIQUE"],
  // Abruzzo
  ["AQ", "L'Aquila", "Abruzzo", "BOUTIQUE"],
  ["CH", "Chieti", "Abruzzo", "BOUTIQUE"],
  ["PE", "Pescara", "Abruzzo", "BOUTIQUE"],
  ["TE", "Teramo", "Abruzzo", "BOUTIQUE"],
  // Basilicata
  ["MT", "Matera", "Basilicata", "BOUTIQUE"],
  ["PZ", "Potenza", "Basilicata", "BOUTIQUE"],
  // Calabria
  ["CS", "Cosenza", "Calabria", "MEDIUM"],
  ["CZ", "Catanzaro", "Calabria", "BOUTIQUE"],
  ["KR", "Crotone", "Calabria", "BOUTIQUE"],
  ["RC", "Reggio Calabria", "Calabria", "BOUTIQUE"],
  ["VV", "Vibo Valentia", "Calabria", "BOUTIQUE"],
  // Campania
  ["NA", "Napoli", "Campania", "LARGE"],
  ["SA", "Salerno", "Campania", "MEDIUM"],
  ["CE", "Caserta", "Campania", "MEDIUM"],
  ["AV", "Avellino", "Campania", "BOUTIQUE"],
  ["BN", "Benevento", "Campania", "BOUTIQUE"],
  // Emilia-Romagna
  ["BO", "Bologna", "Emilia-Romagna", "MEDIUM"],
  ["MO", "Modena", "Emilia-Romagna", "MEDIUM"],
  ["PR", "Parma", "Emilia-Romagna", "BOUTIQUE"],
  ["RE", "Reggio Emilia", "Emilia-Romagna", "BOUTIQUE"],
  ["RN", "Rimini", "Emilia-Romagna", "BOUTIQUE"],
  ["RA", "Ravenna", "Emilia-Romagna", "BOUTIQUE"],
  ["FC", "Forlì-Cesena", "Emilia-Romagna", "BOUTIQUE"],
  ["FE", "Ferrara", "Emilia-Romagna", "BOUTIQUE"],
  ["PC", "Piacenza", "Emilia-Romagna", "BOUTIQUE"],
  // Friuli-Venezia Giulia
  ["UD", "Udine", "Friuli-Venezia Giulia", "MEDIUM"],
  ["TS", "Trieste", "Friuli-Venezia Giulia", "BOUTIQUE"],
  ["PN", "Pordenone", "Friuli-Venezia Giulia", "BOUTIQUE"],
  ["GO", "Gorizia", "Friuli-Venezia Giulia", "BOUTIQUE"],
  // Lazio
  ["RM", "Roma", "Lazio", "LARGE"],
  ["LT", "Latina", "Lazio", "BOUTIQUE"],
  ["FR", "Frosinone", "Lazio", "BOUTIQUE"],
  ["VT", "Viterbo", "Lazio", "BOUTIQUE"],
  ["RI", "Rieti", "Lazio", "BOUTIQUE"],
  // Liguria
  ["GE", "Genova", "Liguria", "MEDIUM"],
  ["SP", "La Spezia", "Liguria", "BOUTIQUE"],
  ["SV", "Savona", "Liguria", "BOUTIQUE"],
  ["IM", "Imperia", "Liguria", "BOUTIQUE"],
  // Lombardia
  ["MI", "Milano", "Lombardia", "LARGE"],
  ["BS", "Brescia", "Lombardia", "MEDIUM"],
  ["BG", "Bergamo", "Lombardia", "MEDIUM"],
  ["MB", "Monza e Brianza", "Lombardia", "MEDIUM"],
  ["VA", "Varese", "Lombardia", "MEDIUM"],
  ["CO", "Como", "Lombardia", "BOUTIQUE"],
  ["PV", "Pavia", "Lombardia", "BOUTIQUE"],
  ["MN", "Mantova", "Lombardia", "BOUTIQUE"],
  ["CR", "Cremona", "Lombardia", "BOUTIQUE"],
  ["LC", "Lecco", "Lombardia", "BOUTIQUE"],
  ["LO", "Lodi", "Lombardia", "BOUTIQUE"],
  ["SO", "Sondrio", "Lombardia", "BOUTIQUE"],
  // Marche
  ["AN", "Ancona", "Marche", "BOUTIQUE"],
  ["PU", "Pesaro e Urbino", "Marche", "BOUTIQUE"],
  ["MC", "Macerata", "Marche", "BOUTIQUE"],
  ["AP", "Ascoli Piceno", "Marche", "BOUTIQUE"],
  ["FM", "Fermo", "Marche", "BOUTIQUE"],
  // Molise
  ["CB", "Campobasso", "Molise", "BOUTIQUE"],
  ["IS", "Isernia", "Molise", "BOUTIQUE"],
  // Piemonte
  ["TO", "Torino", "Piemonte", "LARGE"],
  ["CN", "Cuneo", "Piemonte", "BOUTIQUE"],
  ["AL", "Alessandria", "Piemonte", "BOUTIQUE"],
  ["NO", "Novara", "Piemonte", "BOUTIQUE"],
  ["AT", "Asti", "Piemonte", "BOUTIQUE"],
  ["BI", "Biella", "Piemonte", "BOUTIQUE"],
  ["VC", "Vercelli", "Piemonte", "BOUTIQUE"],
  ["VB", "Verbano-Cusio-Ossola", "Piemonte", "BOUTIQUE"],
  // Puglia
  ["BA", "Bari", "Puglia", "MEDIUM"],
  ["LE", "Lecce", "Puglia", "MEDIUM"],
  ["TA", "Taranto", "Puglia", "BOUTIQUE"],
  ["FG", "Foggia", "Puglia", "BOUTIQUE"],
  ["BR", "Brindisi", "Puglia", "BOUTIQUE"],
  ["BT", "Barletta-Andria-Trani", "Puglia", "BOUTIQUE"],
  // Sicilia
  ["PA", "Palermo", "Sicilia", "MEDIUM"],
  ["CT", "Catania", "Sicilia", "MEDIUM"],
  ["ME", "Messina", "Sicilia", "BOUTIQUE"],
  ["SR", "Siracusa", "Sicilia", "BOUTIQUE"],
  ["TP", "Trapani", "Sicilia", "BOUTIQUE"],
  ["RG", "Ragusa", "Sicilia", "BOUTIQUE"],
  ["AG", "Agrigento", "Sicilia", "BOUTIQUE"],
  ["CL", "Caltanissetta", "Sicilia", "BOUTIQUE"],
  ["EN", "Enna", "Sicilia", "BOUTIQUE"],
  // Toscana
  ["FI", "Firenze", "Toscana", "MEDIUM"],
  ["PI", "Pisa", "Toscana", "BOUTIQUE"],
  ["LU", "Lucca", "Toscana", "BOUTIQUE"],
  ["SI", "Siena", "Toscana", "BOUTIQUE"],
  ["AR", "Arezzo", "Toscana", "BOUTIQUE"],
  ["LI", "Livorno", "Toscana", "BOUTIQUE"],
  ["PT", "Pistoia", "Toscana", "BOUTIQUE"],
  ["PO", "Prato", "Toscana", "BOUTIQUE"],
  ["GR", "Grosseto", "Toscana", "BOUTIQUE"],
  ["MS", "Massa-Carrara", "Toscana", "BOUTIQUE"],
  // Trentino-Alto Adige
  ["TN", "Trento", "Trentino-Alto Adige", "BOUTIQUE"],
  ["BZ", "Bolzano", "Trentino-Alto Adige", "BOUTIQUE"],
  // Umbria
  ["PG", "Perugia", "Umbria", "MEDIUM"],
  ["TR", "Terni", "Umbria", "BOUTIQUE"],
  // Valle d'Aosta
  ["AO", "Aosta", "Valle d'Aosta", "BOUTIQUE"],
  // Veneto
  ["VR", "Verona", "Veneto", "MEDIUM"],
  ["PD", "Padova", "Veneto", "MEDIUM"],
  ["TV", "Treviso", "Veneto", "MEDIUM"],
  ["VE", "Venezia", "Veneto", "MEDIUM"],
  ["VI", "Vicenza", "Veneto", "MEDIUM"],
  ["BL", "Belluno", "Veneto", "BOUTIQUE"],
  ["RO", "Rovigo", "Veneto", "BOUTIQUE"],
];

export const ITALIAN_PROVINCES: ItalianProvinceMeta[] = RAW_PROVINCES.map(
  ([code, name, region, tier]) => ({
    code,
    name,
    region,
    tier,
    maxPerCategory: TIER_CAPS[tier],
  })
).sort((a, b) => a.name.localeCompare(b.name, "it"));

export const PROVINCE_MAP: Record<string, ItalianProvinceMeta> = Object.fromEntries(
  ITALIAN_PROVINCES.map((p) => [p.code, p])
);

export function getProvinceMeta(codeOrName?: string | null): ItalianProvinceMeta | null {
  if (!codeOrName) return null;
  const clean = codeOrName.trim();
  if (!clean) return null;
  const upper = clean.toUpperCase();
  if (PROVINCE_MAP[upper]) return PROVINCE_MAP[upper];

  const lower = clean.toLowerCase();
  const byName = ITALIAN_PROVINCES.find(
    (p) =>
      p.name.toLowerCase() === lower ||
      lower.includes(p.name.split(" ")[0].toLowerCase())
  );
  if (byName) return byName;

  if (lower.includes("alghero") || lower.includes("olbia") || lower.includes("gallura")) {
    return PROVINCE_MAP.SS;
  }
  return null;
}

export function cleanVatNumber(raw?: string | null): string | null {
  if (!raw) return null;
  const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!cleaned) return null;
  return cleaned;
}

export function isValidItalianOrEuVat(raw?: string | null): boolean {
  const cleaned = cleanVatNumber(raw);
  if (!cleaned) return true; // Opzionale se vuoto
  if (/^\d{11}$/.test(cleaned)) return true;
  if (/^IT\d{11}$/.test(cleaned)) return true;
  if (/^[A-Z]{2}[A-Z0-9]{8,12}$/.test(cleaned)) return true;
  return false;
}
