export interface CatalogPlan {
  code: string;
  name: string;
  subtitle: string;
  role: "COUPLE" | "PHOTOGRAPHER";
  tier: "BASE" | "PREMIUM" | "DIAMOND";
  priceCents: number;
  priceDisplay: string;
  periodLabel: string;
  renewalNote: string;
  durationMonths: number;
  isTriennial?: boolean;
  badge?: string;
  features: string[];
}

export const PLANS_CATALOG: Record<string, CatalogPlan> = {
  // ================= PIANI SPOSI / EVENTI =================
  BASE_ANNUAL: {
    code: "BASE_ANNUAL",
    name: "Piano Base (Annuale)",
    subtitle: "L'essenziale per il tuo evento",
    role: "COUPLE",
    tier: "BASE",
    priceCents: 14900,
    priceDisplay: "149,00 €",
    periodLabel: "1° anno",
    renewalNote: "Rinnovo dal 2° anno: 50,00 €/anno",
    durationMonths: 12,
    isTriennial: false,
    features: [
      "Spazio cloud privato: 3 GB",
      "Raccolta fino a 20 foto",
      "1 Capitolo evento",
      "Sito web pubblico personalizzato",
      "Info luoghi, mappe e orari evento",
      "Lista nozze / regali e IBAN"
    ]
  },
  BASE_TRIENNIAL: {
    code: "BASE_TRIENNIAL",
    name: "Piano Base (Triennale - 3 Anni)",
    subtitle: "Blocchi il prezzo per un intero triennio",
    role: "COUPLE",
    tier: "BASE",
    priceCents: 24900,
    priceDisplay: "249,00 €",
    periodLabel: "per 3 anni",
    renewalNote: "Pagamento unico per 36 mesi (nessun rinnovo per 3 anni)",
    durationMonths: 36,
    isTriennial: true,
    badge: "PROMO 3 ANNI",
    features: [
      "3 Anni di attivazione inclusi",
      "Spazio cloud privato: 3 GB",
      "Raccolta fino a 20 foto",
      "1 Capitolo evento",
      "Sito web pubblico personalizzato",
      "Info luoghi, mappe e lista regali"
    ]
  },
  PREMIUM_ANNUAL: {
    code: "PREMIUM_ANNUAL",
    name: "Piano Premium (Annuale)",
    subtitle: "Ideale per ricordare, condividere e organizzare",
    role: "COUPLE",
    tier: "PREMIUM",
    priceCents: 39900,
    priceDisplay: "399,00 €",
    periodLabel: "1° anno",
    renewalNote: "Rinnovo dal 2° anno: 60,00 €/anno",
    durationMonths: 12,
    isTriennial: false,
    badge: "IL PIÙ SCELTO",
    features: [
      "Tutto il piano Base incluso",
      "Spazio cloud privato: 5 GB (fino a 500 foto)",
      "Fino a 15 Capitoli (Viaggi, Nascite, Anniversari)",
      "Gestione Tavoli interattiva e RSVP illimitati",
      "Upload foto diretto da parte vostra e degli invitati",
      "Guestbook digitale per dediche"
    ]
  },
  PREMIUM_TRIENNIAL: {
    code: "PREMIUM_TRIENNIAL",
    name: "Piano Premium (Triennale - 3 Anni)",
    subtitle: "Organizzazione completa per 3 anni",
    role: "COUPLE",
    tier: "PREMIUM",
    priceCents: 49900,
    priceDisplay: "499,00 €",
    periodLabel: "per 3 anni",
    renewalNote: "Pagamento unico per 36 mesi (risparmi sul rinnovo)",
    durationMonths: 36,
    isTriennial: true,
    badge: "PROMO 3 ANNI",
    features: [
      "3 Anni di attivazione Premium inclusi",
      "Spazio cloud privato: 5 GB (fino a 500 foto)",
      "Fino a 15 Capitoli della vostra storia",
      "Gestione Tavoli interattiva e RSVP illimitati",
      "Upload foto diretto e QR Code da tavolo",
      "Guestbook digitale per dediche"
    ]
  },
  DIAMOND_ANNUAL: {
    code: "DIAMOND_ANNUAL",
    name: "Piano Diamond (Annuale)",
    subtitle: "L'esperienza di lusso definitiva",
    role: "COUPLE",
    tier: "DIAMOND",
    priceCents: 44900,
    priceDisplay: "449,00 €",
    periodLabel: "1° anno",
    renewalNote: "Rinnovo dal 2° anno: 70,00 €/anno",
    durationMonths: 12,
    isTriennial: false,
    features: [
      "Tutto il piano Premium incluso",
      "Spazio cloud enorme: 50 GB in Alta Risoluzione",
      "Fino a 30 Capitoli della vostra vita",
      "GentiLuna LIVE (Proiezione foto in tempo reale in sala)",
      "Esportazione PDF dei Tavoli e Tableau personalizzabile"
    ]
  },
  DIAMOND_TRIENNIAL: {
    code: "DIAMOND_TRIENNIAL",
    name: "Piano Diamond (Triennale - 3 Anni)",
    subtitle: "Esperienza Diamond bloccata per 3 anni",
    role: "COUPLE",
    tier: "DIAMOND",
    priceCents: 67350,
    priceDisplay: "673,50 €",
    periodLabel: "per 3 anni",
    renewalNote: "Pagamento unico per 36 mesi",
    durationMonths: 36,
    isTriennial: true,
    badge: "PROMO 3 ANNI",
    features: [
      "3 Anni di attivazione Diamond inclusi",
      "Spazio cloud enorme: 50 GB in Alta Risoluzione",
      "Fino a 30 Capitoli della vostra vita",
      "GentiLuna LIVE (Proiezione foto in tempo reale in sala)",
      "Esportazione PDF dei Tavoli e Tableau personalizzabile"
    ]
  },

  // ================= PIANI PROFESSIONISTI =================
  PRO_FOUNDERS_49: {
    code: "PRO_FOUNDERS_49",
    name: "Founders Club PRO (Promo Primi 50)",
    subtitle: "Pacchetto PRO completo al prezzo lancio per 12 mesi",
    role: "PHOTOGRAPHER",
    tier: "PREMIUM",
    priceCents: 4900,
    priceDisplay: "49,00 €",
    periodLabel: "per 12 mesi",
    renewalNote: "Offerta lancio riservata ai primi 50 iscritti (valore 299,00 €)",
    durationMonths: 12,
    badge: "OFFERTA LANCIO - PRIMI 50",
    features: [
      "Eventi e Spazi Sposi Illimitati",
      "Profilo 'VIP Partner' in evidenza nella directory",
      "Acquisizione Lead automatica dagli invitati via QR Code",
      "Modulo Upsell e Richiesta Stampe (0% commissioni)",
      "Consegna Album in Alta Risoluzione"
    ]
  },
  PRO_ENTRY_120: {
    code: "PRO_ENTRY_120",
    name: "Professionisti Entry (Annuale)",
    subtitle: "Ideale per iniziare sulla piattaforma",
    role: "PHOTOGRAPHER",
    tier: "BASE",
    priceCents: 12000,
    priceDisplay: "120,00 €",
    periodLabel: "all'anno",
    renewalNote: "Fatturazione annuale",
    durationMonths: 12,
    features: [
      "Gestione fino a 3 Eventi all'anno",
      "Profilo base nella directory Fornitori",
      "Lead generation standard (Email)",
      "Galleria privata per gli sposi"
    ]
  },
  PRO_299: {
    code: "PRO_299",
    name: "Professionisti PRO (Annuale)",
    subtitle: "Per scalare il tuo studio e acquisire clienti",
    role: "PHOTOGRAPHER",
    tier: "PREMIUM",
    priceCents: 29900,
    priceDisplay: "299,00 €",
    periodLabel: "all'anno",
    renewalNote: "Fatturazione annuale",
    durationMonths: 12,
    badge: "PIÙ SCELTO DAI PRO",
    features: [
      "Eventi Illimitati",
      "Vetrina Premium ad alta visibilità con contatti diretti",
      "Modulo Upsell e Richiesta Stampe",
      "Download album in Alta Risoluzione",
      "Personalizzazione colori e logo galleria"
    ]
  },
  PRO_DIAMOND_449: {
    code: "PRO_DIAMOND_449",
    name: "Professionisti Diamond White-Label (Annuale)",
    subtitle: "Ideale per Studi Strutturati, Wedding Planner e Location",
    role: "PHOTOGRAPHER",
    tier: "DIAMOND",
    priceCents: 44900,
    priceDisplay: "449,00 €",
    periodLabel: "all'anno",
    renewalNote: "Fatturazione annuale",
    durationMonths: 12,
    features: [
      "Tutto il piano PRO incluso",
      "Pacchetti Sposi in stock da offrire/rivendere ai clienti",
      "Piattaforma White-Label con il tuo Logo",
      "Account Manager GentiLuna dedicato"
    ]
  }
};

export function getCatalogPlan(code?: string | null): CatalogPlan | undefined {
  if (!code) return undefined;
  const upper = code.toUpperCase();
  if (PLANS_CATALOG[upper]) return PLANS_CATALOG[upper];
  // Legacy aliases
  if (upper === "BASE") return PLANS_CATALOG.BASE_ANNUAL;
  if (upper === "PREMIUM") return PLANS_CATALOG.PREMIUM_ANNUAL;
  if (upper === "DIAMOND") return PLANS_CATALOG.DIAMOND_ANNUAL;
  return undefined;
}
