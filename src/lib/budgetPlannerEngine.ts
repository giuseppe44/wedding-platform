import type { ProFilterGroup } from "@/lib/proCategories";

export type BudgetEventType =
  | "WEDDING"
  | "BAPTISM_COMMUNION"
  | "GRADUATION_PARTY"
  | "ANNIVERSARY";

export type VenueFormula =
  | "RESTAURANT"
  | "AGRITURISMO"
  | "VILLA_CATERING"
  | "DYNAMIC_PARTY";

export type SeasonChoice = "PEAK_WEEKEND" | "SMART_WEEKDAY";

export type HoneymoonMode = "GIFT_FUNDED" | "INCLUDED";

export type BudgetPriorityKey =
  | "FOOD_WINE"
  | "PHOTO_CINEMA"
  | "PARTY_MUSIC"
  | "FLOWERS_DESIGN"
  | "ATTIRE_BEAUTY"
  | "GUEST_EXPERIENCE";

export interface BudgetPlannerInput {
  eventType: BudgetEventType;
  totalBudget: number;
  guestsCount: number;
  venueFormula: VenueFormula;
  season: SeasonChoice;
  honeymoonMode: HoneymoonMode;
  priorities: BudgetPriorityKey[];
  provinceCode?: string;
}

export interface BudgetLineItem {
  id: string;
  title: string;
  shortTitle: string;
  colorHex: string;
  badgeClass: string;
  costType: "PER_PERSON" | "FIXED_SERVICE" | "HYBRID";
  allocatedAmount: number;
  minSuggested: number;
  maxSuggested: number;
  percentage: number;
  perGuestNote?: string;
  recommendedTierLabel: string;
  proComparisonNote: string;
  honestAdvice: string;
  questionsToAsk: string[];
  bookingTiming: string;
  gentilunaTip: string;
  matchingCategoryCodes: string[];
  fornitoriFilterGroup?: ProFilterGroup;
  isPriorityBoosted?: boolean;
}

export interface RoadmapPhase {
  period: string;
  title: string;
  actions: string[];
}

export interface BudgetPlanResult {
  input: BudgetPlannerInput;
  sustainabilityStatus: "OPTIMAL" | "BALANCED" | "STRETCHED";
  sustainabilityHeadline: string;
  sustainabilityMessage: string;
  smartSuggestionTip?: string;
  perGuestOverall: number;
  estimatedReceptionPerGuest: number;
  estimatedVenueRentalFee: number;
  items: BudgetLineItem[];
  roadmap: RoadmapPhase[];
}

export interface BudgetIdeaScenario {
  id: string;
  badge: string;
  title: string;
  budgetRangeLabel: string;
  guestsLabel: string;
  accentGradient: string;
  borderClass: string;
  summary: string;
  whatYouCanDo: string[];
  smartTradeoffs: string[];
  presetInput: BudgetPlannerInput;
}

export const EVENT_TYPE_META: Record<
  BudgetEventType,
  {
    label: string;
    shortLabel: string;
    minBudget: number;
    maxBudget: number;
    stepBudget: number;
    defaultBudget: number;
    defaultGuests: number;
    minGuests: number;
    maxGuests: number;
  }
> = {
  WEDDING: {
    label: "Matrimonio",
    shortLabel: "Matrimonio",
    minBudget: 5000,
    maxBudget: 90000,
    stepBudget: 500,
    defaultBudget: 24000,
    defaultGuests: 100,
    minGuests: 20,
    maxGuests: 260,
  },
  BAPTISM_COMMUNION: {
    label: "Battesimo / Comunione",
    shortLabel: "Battesimo / Comunione",
    minBudget: 1200,
    maxBudget: 12000,
    stepBudget: 200,
    defaultBudget: 3500,
    defaultGuests: 50,
    minGuests: 15,
    maxGuests: 140,
  },
  GRADUATION_PARTY: {
    label: "Laurea / 18° / Festa",
    shortLabel: "Laurea & 18°",
    minBudget: 1000,
    maxBudget: 10000,
    stepBudget: 200,
    defaultBudget: 2800,
    defaultGuests: 60,
    minGuests: 15,
    maxGuests: 160,
  },
  ANNIVERSARY: {
    label: "Anniversario / Nozze d'Oro",
    shortLabel: "Anniversario",
    minBudget: 1500,
    maxBudget: 18000,
    stepBudget: 250,
    defaultBudget: 5500,
    defaultGuests: 65,
    minGuests: 15,
    maxGuests: 160,
  },
};

export const VENUE_FORMULA_META: Record<
  VenueFormula,
  {
    label: string;
    shortLabel: string;
    costStructureBadge: string;
    summary: string;
    pros: string;
    watchOut: string;
  }
> = {
  RESTAURANT: {
    label: "Ristorante / Sala Ricevimenti (Cucina Interna)",
    shortLabel: "Ristorante / Sala",
    costStructureBadge: "Tutto incluso a persona • 0€ affitto sala",
    summary:
      "Paghi il menù a ospite e hai già inclusi sala, cucina interna espressa, brigata di servizio, tovagliato e mise en place.",
    pros: "Massima resa del budget: eviti i 3.000€–8.000€ di affitto location nuda e riduci gli imprevisti logistici.",
    watchOut:
      "Chiedi sempre in anticipo se ci sono limiti d'orario serali, costi extra per open bar dopo il taglio torta e diritto di tappo/pasticceria esterna.",
  },
  AGRITURISMO: {
    label: "Agriturismo di Charme / Masseria / Relais",
    shortLabel: "Agriturismo / Relais",
    costStructureBadge: "Cucina del territorio • Atmosfera autentica",
    summary:
      "Immerso nel verde, unisce convivialità, materie prime locali e spesso camere interne per gli sposi o i parenti più vicini.",
    pros: "Ottimo equilibrio qualità/prezzo, spazi esterni naturali per aperitivo e foto al tramonto senza trasferimenti lunghi.",
    watchOut:
      "Verifica la capienza reale della sala interna in caso di pioggia o vento (Piano B reale senza tensostrutture a pagamento).",
  },
  VILLA_CATERING: {
    label: "Villa Storica / Castello + Catering Esterno",
    shortLabel: "Villa + Catering",
    costStructureBadge: "Affitto Esclusivo + Banqueting a persona",
    summary:
      "Affitti una dimora in esclusiva assoluta e scegli liberamente una società di Catering & Banqueting per cucinare in loco.",
    pros: "Scenografia da sogno, esclusività totale degli spazi e personalizzazione sartoriale di tavoli, sedute e illuminazione.",
    watchOut:
      "Prevede un doppio costo (affitto location fisso + catering + IVA 10%) ed eventuali extra per generatori, tensostrutture pioggia o service luci.",
  },
  DYNAMIC_PARTY: {
    label: "Cocktail Party / Buffet Gourmet / Beach Club",
    shortLabel: "Party Dinamico",
    costStructureBadge: "Formula snella • Focus festa & musica",
    summary:
      "Isole gastronomiche dal vivo, finger food d'autore e sedute lounge dinamiche al posto del classico banchetto seduto di 5 ore.",
    pros: "Perfetto per contenere il costo a persona o investire di più su musica live, open bar mixology e atmosfera contemporanea.",
    watchOut:
      "Assicurati sempre di prevedere tavoli d'appoggio e sedute comode riservate almeno per il 40-50% degli ospiti (nonni, genitori, donne incinte).",
  },
};

export const PRIORITY_META: Record<
  BudgetPriorityKey,
  { label: string; shortDesc: string }
> = {
  FOOD_WINE: {
    label: "Alta Cucina, Vini & Open Bar",
    shortDesc: "Più peso a menù, calici e mixology",
  },
  PHOTO_CINEMA: {
    label: "Foto d'Autore & Wedding Film",
    shortDesc: "Ricordi indelebili in alta risoluzione",
  },
  PARTY_MUSIC: {
    label: "Musica Live, DJ & Luci Festa",
    shortDesc: "Intrattenimento, band e party serale",
  },
  FLOWERS_DESIGN: {
    label: "Scenografia, Fiori & Regia",
    shortDesc: "Allestimenti floreali e coordinamento",
  },
  ATTIRE_BEAUTY: {
    label: "Abiti Sposi & Bridal Beauty",
    shortDesc: "Atelier, sartoria, trucco e acconciatura",
  },
  GUEST_EXPERIENCE: {
    label: "Coccola Ospiti, Auto & Navetta NCC",
    shortDesc: "Trasporti sicuri, dettagli e bomboniere",
  },
};

export const BUDGET_DISCLAIMER_TEXT =
  "Nota di Trasparenza: Tutte le cifre, le ripartizioni percentuali e gli scenari mostrati rappresentano un'ipotesi orientativa e non vincolante, elaborata sulle fasce medie del settore eventi in Italia. Non costituiscono preventivo né offerta contrattuale. I costi effettivi variano in base alla provincia, alla stagionalità, al numero reale di invitati confermati, alle scelte di menù o allestimento e alle tariffe dei singoli professionisti, e andranno sempre rettificati e confermati direttamente con location, ristoranti e fornitori.";

function roundTo50(val: number): number {
  if (val < 400) return Math.max(50, Math.round(val / 10) * 10);
  return Math.round(val / 50) * 50;
}

export function formatEuro(amount: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function calculateSmartBudgetPlan(
  rawInput: BudgetPlannerInput
): BudgetPlanResult {
  const meta = EVENT_TYPE_META[rawInput.eventType] || EVENT_TYPE_META.WEDDING;
  const totalBudget = Math.max(
    meta.minBudget,
    Math.min(meta.maxBudget * 1.5, Math.round(rawInput.totalBudget || meta.defaultBudget))
  );
  const guestsCount = Math.max(
    meta.minGuests,
    Math.min(meta.maxGuests, Math.round(rawInput.guestsCount || meta.defaultGuests))
  );

  const input: BudgetPlannerInput = {
    ...rawInput,
    totalBudget,
    guestsCount,
    priorities: (rawInput.priorities || []).slice(0, 3),
  };

  if (input.eventType !== "WEDDING") {
    return calculateMilestoneEventPlan(input);
  }

  const seasonFactor = input.season === "SMART_WEEKDAY" ? 0.88 : 1.0;
  const perGuestOverall = Math.round(totalBudget / guestsCount);

  // 1. Stima realistica costo base ricevimento (a persona + eventuale affitto villa)
  let baseMenuPerGuest = 110;
  let baseVenueRental = 0;

  if (input.venueFormula === "RESTAURANT") {
    baseMenuPerGuest =
      perGuestOverall < 140 ? 85 : perGuestOverall < 230 ? 115 : perGuestOverall < 340 ? 138 : 165;
  } else if (input.venueFormula === "AGRITURISMO") {
    baseMenuPerGuest =
      perGuestOverall < 140 ? 78 : perGuestOverall < 230 ? 102 : perGuestOverall < 340 ? 125 : 145;
  } else if (input.venueFormula === "DYNAMIC_PARTY") {
    baseMenuPerGuest =
      perGuestOverall < 130 ? 60 : perGuestOverall < 220 ? 82 : 105;
  } else if (input.venueFormula === "VILLA_CATERING") {
    baseMenuPerGuest =
      perGuestOverall < 240 ? 112 : perGuestOverall < 380 ? 130 : 162;
    baseVenueRental =
      totalBudget < 25000 ? 2500 : totalBudget < 48000 ? 4500 : totalBudget < 65000 ? 6500 : 9000;
  }

  baseMenuPerGuest = Math.round(baseMenuPerGuest * seasonFactor);
  baseVenueRental = Math.round(baseVenueRental * seasonFactor);

  const hasPriority = (k: BudgetPriorityKey) => input.priorities.includes(k);

  // Pesi dinamici coerenti: il ricevimento scala col numero di invitati, ma non supera mai un tetto sano
  const rawFoodEstimate =
    guestsCount * baseMenuPerGuest * (hasPriority("FOOD_WINE") ? 1.12 : 1) +
    baseVenueRental;

  // Valutazione sostenibilità onesta
  let sustainabilityStatus: BudgetPlanResult["sustainabilityStatus"] = "OPTIMAL";
  let sustainabilityHeadline = "Equilibrio Ottimale tra Budget, Ospiti e Scelte";
  let sustainabilityMessage =
    "Il rapporto tra il budget indicato, il numero di invitati e la formula di ricevimento scelta permette di lavorare con serenità su tutte le voci principali, mantenendo anche un sano margine imprevisti.";
  let smartSuggestionTip: string | undefined;

  if (input.venueFormula === "VILLA_CATERING" && rawFoodEstimate > totalBudget * 0.64) {
    sustainabilityStatus = "STRETCHED";
    sustainabilityHeadline = "Attenzione: Affitto Villa + Catering assorbe troppo budget";
    sustainabilityMessage = `Con ${guestsCount} invitati e ${formatEuro(totalBudget)}, sommare l'affitto di una villa nuda (${formatEuro(baseVenueRental)} circa) al catering esterno lascerebbe troppo poco margine per foto, abiti, fiori e musica.`;
    smartSuggestionTip =
      "Consiglio onesto: valuta un Ristorante con parco/giardino o una Tenuta con cucina interna (risparmi subito l'affitto location), oppure scegli un Venerdì/Domenica per ridurre i minimi garantiti del 12-15%.";
  } else if (perGuestOverall < 115 && input.venueFormula !== "DYNAMIC_PARTY") {
    sustainabilityStatus = "STRETCHED";
    sustainabilityHeadline = "Budget sfidante rispetto al numero di invitati";
    sustainabilityMessage = `Il budget medio complessivo è di circa ${formatEuro(perGuestOverall)} per ospite (tutto incluso, non solo il pranzo). Per non sforare dovrai fare scelte molto mirate sui costi fissi.`;
    smartSuggestionTip =
      "Consiglio onesto: valuta un Agriturismo di charme o una formula Cocktail/Buffet dinamico, concentra i fiori sui punti focali riutilizzabili e sfrutta gli inviti digitali con QR Code.";
  } else if (rawFoodEstimate > totalBudget * 0.56) {
    sustainabilityStatus = "BALANCED";
    sustainabilityHeadline = "Piano fattibile con gestione attenta dei fornitori";
    sustainabilityMessage =
      "La ristorazione rappresenta la fetta principale dell'investimento (normale con molti ospiti). Confrontando 2-3 preventivi chiari per categoria resterai perfettamente nei binari.";
    if (input.season === "PEAK_WEEKEND") {
      smartSuggestionTip =
        "Idea furba: se la data non è ancora bloccata, sposarsi di venerdì o in maggio/ fine settembre può liberare 1.500€–3.000€ da reinvestire nei servizi che ami di più.";
    }
  }

  // Riserva fissa onesta per Imprevisti, Bolli & SIAE (~6%) + eventuale Luna di Miele se inclusa
  const contingencyShare = 0.06;
  const honeymoonShare = input.honeymoonMode === "INCLUDED" ? 0.14 : 0;
  const distributableShare = 1 - contingencyShare - honeymoonShare;

  // Quota ricevimento clampata tra 36% e 56% del distribuibile in base al peso reale ospiti
  const targetReceptionRatio = Math.min(
    0.56,
    Math.max(0.36, rawFoodEstimate / (totalBudget * distributableShare))
  );

  const remainingRatio = 1 - targetReceptionRatio;

  // Pesi relativi per le altre 7 voci core del matrimonio
  const rawWeights = {
    photoVideo: 22 * (hasPriority("PHOTO_CINEMA") ? 1.28 : 1),
    attireBeauty: 19 * (hasPriority("ATTIRE_BEAUTY") ? 1.26 : 1),
    flowersPlanner: 17 * (hasPriority("FLOWERS_DESIGN") ? 1.28 : 1),
    musicParty: 14 * (hasPriority("PARTY_MUSIC") ? 1.3 : 1),
    cakeOpenBar: 10 * (hasPriority("FOOD_WINE") ? 1.2 : 1),
    nccHospitality: 9 * (hasPriority("GUEST_EXPERIENCE") ? 1.3 : 1),
    stationeryDigital: 9 * (hasPriority("GUEST_EXPERIENCE") ? 1.15 : 1),
  };

  const weightSum = Object.values(rawWeights).reduce((a, b) => a + b, 0);

  const calcShare = (w: number) =>
    distributableShare * remainingRatio * (w / weightSum);

  const receptionAlloc = roundTo50(totalBudget * distributableShare * targetReceptionRatio);
  const photoAlloc = roundTo50(totalBudget * calcShare(rawWeights.photoVideo));
  const attireAlloc = roundTo50(totalBudget * calcShare(rawWeights.attireBeauty));
  const flowersAlloc = roundTo50(totalBudget * calcShare(rawWeights.flowersPlanner));
  const musicAlloc = roundTo50(totalBudget * calcShare(rawWeights.musicParty));
  const cakeBarAlloc = roundTo50(totalBudget * calcShare(rawWeights.cakeOpenBar));
  const nccAlloc = roundTo50(totalBudget * calcShare(rawWeights.nccHospitality));
  const stationeryAlloc = roundTo50(totalBudget * calcShare(rawWeights.stationeryDigital));
  const honeymoonAlloc =
    input.honeymoonMode === "INCLUDED" ? roundTo50(totalBudget * honeymoonShare) : 0;

  const allocatedSoFar =
    receptionAlloc +
    photoAlloc +
    attireAlloc +
    flowersAlloc +
    musicAlloc +
    cakeBarAlloc +
    nccAlloc +
    stationeryAlloc +
    honeymoonAlloc;

  const contingencyAlloc = Math.max(300, totalBudget - allocatedSoFar);

  const estimatedVenueRentalFee =
    input.venueFormula === "VILLA_CATERING"
      ? Math.min(roundTo50(receptionAlloc * 0.26), 10000)
      : 0;
  const netFoodBudget = Math.max(0, receptionAlloc - estimatedVenueRentalFee);
  const estimatedReceptionPerGuest = Math.round(netFoodBudget / guestsCount);

  const items: BudgetLineItem[] = [
    {
      id: "reception",
      title:
        input.venueFormula === "VILLA_CATERING"
          ? "Affitto Villa in Esclusiva + Catering & Banqueting"
          : input.venueFormula === "AGRITURISMO"
          ? "Agriturismo / Relais & Banchetto Conviviale"
          : input.venueFormula === "DYNAMIC_PARTY"
          ? "Location & Cocktail Party / Buffet Gourmet"
          : "Ristorante / Sala Ricevimenti & Menù Nozze",
      shortTitle: "Ristorazione & Location",
      colorHex: "#059669",
      badgeClass: "bg-emerald-50 text-emerald-900 border-emerald-200",
      costType: input.venueFormula === "VILLA_CATERING" ? "HYBRID" : "PER_PERSON",
      allocatedAmount: receptionAlloc,
      minSuggested: roundTo50(receptionAlloc * 0.88),
      maxSuggested: roundTo50(receptionAlloc * 1.12),
      percentage: Math.round((receptionAlloc / totalBudget) * 100),
      perGuestNote:
        input.venueFormula === "VILLA_CATERING"
          ? `~${formatEuro(estimatedReceptionPerGuest)}/ospite catering + ~${formatEuro(estimatedVenueRentalFee)} affitto villa`
          : `~${formatEuro(estimatedReceptionPerGuest)} a persona per ${guestsCount} ospiti`,
      recommendedTierLabel:
        estimatedReceptionPerGuest < 85
          ? "Formula Smart / Apericena rinforzato o Agriturismo conviviale"
          : estimatedReceptionPerGuest < 125
          ? "Menù completo di terra o mare con aperitivo a isole e vini selezionati"
          : "Alta Ristorazione / Banqueting d'eccellenza con crudi, isole live e cantina premium",
      proComparisonNote:
        "Differenza chiave: un Ristorante o Sala Ricevimenti include cucina, sala, personale e tovagliato nel prezzo a persona; una Villa storica o Castello richiede invece l'affitto degli spazi nudi più l'ingaggio di un Catering esterno.",
      honestAdvice:
        "Chiedi sempre se l'IVA (10%) è già inclusa nel prezzo a persona, quanti camerieri sono previsti ogni tavolo (ottimale 1 ogni 10-12 ospiti) e come funziona il conteggio di bambini e fornitori (menù staff a prezzo ridotto).",
      questionsToAsk: [
        "Il prezzo a persona è IVA inclusa e comprende aperitivo di benvenuto, vini, stampa menù e messa a disposizione della sala?",
        "Qual è il Piano B interno già allestito se dovesse piovere o esserci molto vento?",
        "Fino a che ora possiamo restare in sala senza supplementi orari notturni?",
      ],
      bookingTiming: "Da bloccare per primo (12 – 10 mesi prima)",
      gentilunaTip:
        "Con il Portale Ristorante Live di GentiLuna invierai a sala e cucina il riepilogo automatico di tavoli, celiaci, intolleranze e menù bimbi senza fogli Excel dell'ultimo minuto.",
      matchingCategoryCodes: ["RESTAURANT", "LOCATION", "CATERING"],
      fornitoriFilterGroup: "RISTORANTI_LOCATION",
      isPriorityBoosted: hasPriority("FOOD_WINE"),
    },
    {
      id: "photo-video",
      title: "Fotografo, Videomaker & Raccolta Ricordi",
      shortTitle: "Foto & Video",
      colorHex: "#e11d48",
      badgeClass: "bg-rose-50 text-rose-900 border-rose-200",
      costType: "FIXED_SERVICE",
      allocatedAmount: photoAlloc,
      minSuggested: roundTo50(photoAlloc * 0.85),
      maxSuggested: roundTo50(photoAlloc * 1.18),
      percentage: Math.round((photoAlloc / totalBudget) * 100),
      recommendedTierLabel:
        photoAlloc < 1500
          ? "Servizio Fotografico Reportage Smart (1 professionista, consegna digitale HD)"
          : photoAlloc < 2700
          ? "Servizio Fotografico Completo (2 operatori o album artigianale) + eventuale mini-trailer"
          : "Team Completo Studio Foto + Videomaker Wedding Film + Drone + Album Fine-Art",
      proComparisonNote:
        "Un singolo fotografo in sola consegna digitale costa meno perché non include 2° operatore, montaggio cinematografico audio/video o album rilegato a mano. Diffida da chi promette tutto a cifre fuori mercato senza contratto o P.IVA.",
      honestAdvice:
        "Le fotografie e il film sono l'unica voce del budget che acquista valore con il passare degli anni. Guarda sempre un matrimonio intero (dalla preparazione al ballo serale), non solo i 10 scatti migliori su Instagram.",
      questionsToAsk: [
        "Sarete voi personalmente presenti il giorno dell'evento e quanti operatori prevede l'équipe?",
        "Quante foto post-prodotte in alta risoluzione consegnate e entro quali tempi contrattuali?",
        "Come gestite il backup immediato su doppia scheda e la consegna digitale agli sposi e invitati?",
      ],
      bookingTiming: "Da bloccare subito dopo la location (11 – 9 mesi prima)",
      gentilunaTip:
        "Il fotografo ufficiale firma i ritratti e i momenti solenni; il QR Code GentiLuna sui tavoli raccoglie in tempo reale centinaia di foto e video spontanei degli amici senza app!",
      matchingCategoryCodes: ["PHOTOGRAPHER", "VIDEOMAKER"],
      fornitoriFilterGroup: "FOTO_VIDEO",
      isPriorityBoosted: hasPriority("PHOTO_CINEMA"),
    },
    {
      id: "attire-beauty",
      title: "Abiti Sposi, Fedi Nuziali, Make-up & Hair Bridal",
      shortTitle: "Abiti, Fedi & Beauty",
      colorHex: "#d97706",
      badgeClass: "bg-amber-50 text-amber-900 border-amber-200",
      costType: "FIXED_SERVICE",
      allocatedAmount: attireAlloc,
      minSuggested: roundTo50(attireAlloc * 0.8),
      maxSuggested: roundTo50(attireAlloc * 1.25),
      percentage: Math.round((attireAlloc / totalBudget) * 100),
      recommendedTierLabel:
        attireAlloc < 2200
          ? "Collezioni Smart / Atelier Outlet selezionati + Fedi classiche + Make-up & Hair sposa"
          : attireAlloc < 4200
          ? "Abiti Sposa e Sposo in Atelier con modifiche sartoriali + Fedi oro + Pacchetto Bridal Beauty con prove"
          : "Alta Sartoria / Collezioni Esclusive Atelier + Cambio abito festa + Beauty stylist dedicata tutto il giorno",
      proComparisonNote:
        "Negli Atelier considera sempre se il prezzo dell'abito include già le modifiche di sartoria, il velo e gli accessori. Per trucco e parrucco, scegli professionisti specializzati in tenuta fotografica e lacrime/caldo.",
      honestAdvice:
        "Non dimenticare nel conto le fedi nuziali (l'oro ha un peso importante: ordinarle 4 mesi prima evita rincari o urgenze) e almeno una prova trucco + acconciatura coordinata allo scollo dell'abito.",
      questionsToAsk: [
        "Le modifiche sartoriali su misura e la stiratura finale prima del ritiro sono incluse nel preventivo?",
        "Nel pacchetto trucco/acconciatura sposa sono compresi la prova preliminare, la trasferta a domicilio e il trucco mamma?",
        "Quali sono i tempi di consegna e incisione per le fedi scelte?",
      ],
      bookingTiming: "Abiti 9 – 7 mesi prima • Fedi e Beauty 5 – 4 mesi prima",
      gentilunaTip:
        "Puoi indicare un elegante suggerimento di Dress Code o palette colori per gli ospiti direttamente nella pagina benvenuto del tuo Sito Evento GentiLuna.",
      matchingCategoryCodes: ["ATELIER_JEWELRY", "MAKEUP_ARTIST", "HAIR_STYLIST"],
      fornitoriFilterGroup: "PLANNER_MUSICA_STILE",
      isPriorityBoosted: hasPriority("ATTIRE_BEAUTY"),
    },
    {
      id: "flowers-planner",
      title: "Fiori, Allestimenti Scenografici & Regia / Wedding Planner",
      shortTitle: "Fiori & Regia",
      colorHex: "#7c3aed",
      badgeClass: "bg-violet-50 text-violet-900 border-violet-200",
      costType: "HYBRID",
      allocatedAmount: flowersAlloc,
      minSuggested: roundTo50(flowersAlloc * 0.82),
      maxSuggested: roundTo50(flowersAlloc * 1.22),
      percentage: Math.round((flowersAlloc / totalBudget) * 100),
      recommendedTierLabel:
        flowersAlloc < 1400
          ? "Allestimento Floreale Essenziale con fiori di stagione (bouquet, rito e centrotavola) + Regia digitale fai-da-te"
          : flowersAlloc < 3200
          ? "Floral Design Coordinato (chiesa/rito + location + tableau) + eventuale Wedding Day Coordinator"
          : "Scenografia Floreale & Light Design su misura + Servizio Wedding Planner / Regia dedicata",
      proComparisonNote:
        "Differenza importante: il Wedding Planner completo ti segue per 12 mesi su fornitori e design; il 'Wedding Coordinator' costa molto meno e coordina solo tempi e fornitori nel giorno delle nozze per toglierti ogni pensiero.",
      honestAdvice:
        "Scegliere fiori di stagione (evitando varietà d'importazione fuori mese) riduce il preventivo del 25-30% a parità di impatto visivo. Chiedi al fiorista di progettare composizioni trasportabili dalla cerimonia al ricevimento!",
      questionsToAsk: [
        "Quali fiori sono naturalmente di stagione nel mese del nostro evento per ottenere più volume senza sovrapprezzi?",
        "È previsto lo spostamento e riutilizzo delle composizioni dal luogo del rito alla zona aperitivo/taglio torta?",
        "Il disallestimento notturno o del giorno successivo in location è già compreso?",
      ],
      bookingTiming: "Planner 12 – 9 mesi prima • Fiorista 7 – 5 mesi prima",
      gentilunaTip:
        "Anche senza Wedding Planner, la dashboard GentiLuna ordina scaletta oraria, indirizzi GPS, mappa tavoli e fornitori assegnati in un'unica cabina di regia.",
      matchingCategoryCodes: ["FLORIST", "WEDDING_PLANNER"],
      fornitoriFilterGroup: "PLANNER_MUSICA_STILE",
      isPriorityBoosted: hasPriority("FLOWERS_DESIGN"),
    },
    {
      id: "music-party",
      title: "Musica Cerimonia, Band Live, DJ & Service Audio/Luci",
      shortTitle: "Musica & Intrattenimento",
      colorHex: "#0284c7",
      badgeClass: "bg-sky-50 text-sky-900 border-sky-200",
      costType: "FIXED_SERVICE",
      allocatedAmount: musicAlloc,
      minSuggested: roundTo50(musicAlloc * 0.85),
      maxSuggested: roundTo50(musicAlloc * 1.2),
      percentage: Math.round((musicAlloc / totalBudget) * 100),
      recommendedTierLabel:
        musicAlloc < 950
          ? "DJ Set completo con impianto audio/luci per ricevimento e festa"
          : musicAlloc < 1900
          ? "Musica Cerimonia / Aperitivo acustico + DJ Set e Luci per il party serale"
          : "Full Live Band + Musica Cerimonia + DJ Set, Sax/Violinista e Luci Architetturali",
      proComparisonNote:
        "In molte location il ricevimento si svolge in 3 zone diverse (aperitivo in giardino, cena in sala, taglio torta e ballo a bordo piscina): servono più postazioni casse/microfoni wireless per non avere tempi morti.",
      honestAdvice:
        "La musica decide il ritmo emotivo e quanto si divertiranno gli ospiti. Ricorda che il permesso SIAE è quasi sempre a carico degli sposi (salvo accordi diversi) ed è già accantonato nella nostra voce Tasse & Imprevisti qui sotto!",
      questionsToAsk: [
        "Quante postazioni audio separate (es. giardino aperitivo + sala interna + zona torta/ballo) sono incluse nel prezzo?",
        "Avete attrezzatura di riserva e gestite voi la pratica online del borderò SIAE?",
        "Sono presenti limitazioni di decibel in location dopo una certa ora (es. cuffie silent party o sala interna)?",
      ],
      bookingTiming: "Da prenotare 8 – 6 mesi prima",
      gentilunaTip:
        "Durante il DJ set o i balli, collega un proiettore o TV di sala a GentiLuna LIVE per mostrare in diretta gli scatti divertenti caricati dagli invitati!",
      matchingCategoryCodes: ["MUSICIAN", "DJ", "PHOTO_BOOTH"],
      fornitoriFilterGroup: "PLANNER_MUSICA_STILE",
      isPriorityBoosted: hasPriority("PARTY_MUSIC"),
    },
    {
      id: "cake-openbar",
      title: "Wedding Cake, Confettata & Open Bar / Corner Degustazione",
      shortTitle: "Torta & Open Bar",
      colorHex: "#db2777",
      badgeClass: "bg-pink-50 text-pink-900 border-pink-200",
      costType: "PER_PERSON",
      allocatedAmount: cakeBarAlloc,
      minSuggested: roundTo50(cakeBarAlloc * 0.8),
      maxSuggested: roundTo50(cakeBarAlloc * 1.25),
      percentage: Math.round((cakeBarAlloc / totalBudget) * 100),
      perGuestNote: `~${formatEuro(Math.round(cakeBarAlloc / guestsCount))}/ospite tra dolce/confettata ed extra bar`,
      recommendedTierLabel:
        cakeBarAlloc < 900
          ? "Torta Nuziale artigianale (o upgrade pasticceria) + Confettata curata"
          : cakeBarAlloc < 1900
          ? "Wedding Cake su misura + Sweet Table/Confettata + Open Bar serale base"
          : "Cake Design scenografico + Buffet Dolci + Cocktail Bar Mixology & Angolo Rum/Sigari",
      proComparisonNote:
        "Molti ristoranti includono già una torta base nel menù: se invece desideri una creazione di Cake Design particolare o un Cocktail Catering dedicato, verifica che la struttura accetti fornitori esterni con certificazione HACCP.",
      honestAdvice:
        "Per l'Open Bar serale evita formule 'a consumo illimitato al bicchiere' che possono far lievitare il conto finale a sorpresa: concorda sempre un forfait fisso o un pacchetto di ore/drink prestabilito!",
      questionsToAsk: [
        "La torta nuziale è già compresa nel menù della location o conviene affidarla a una pasticceria esterna certificata?",
        "Per l'Open Bar è previsto un forfait bloccato per 2-3 ore con bartender dedicati e ghiaccio illimitato?",
        "Sono previste opzioni senza glutine e senza lattosio anche per la torta nuziale?",
      ],
      bookingTiming: "Pasticceria e Bartender 5 – 3 mesi prima",
      gentilunaTip:
        "Il taglio della torta è il momento più fotografato da tutti gli invitati: valorizza chi ha creato la wedding cake inserendolo nel Team Ufficiale del tuo evento.",
      matchingCategoryCodes: ["PASTRY_CAKE", "BAR_EXPERIENCE"],
      fornitoriFilterGroup: "VIAGGI_AUTO_TORTE",
      isPriorityBoosted: hasPriority("FOOD_WINE"),
    },
    {
      id: "ncc-hospitality",
      title: "Auto Sposi, Navetta NCC Invitati & Ospitalità Fuori Sede",
      shortTitle: "Auto NCC & Ospitalità",
      colorHex: "#ca8a04",
      badgeClass: "bg-yellow-50 text-yellow-900 border-yellow-200",
      costType: "FIXED_SERVICE",
      allocatedAmount: nccAlloc,
      minSuggested: roundTo50(nccAlloc * 0.75),
      maxSuggested: roundTo50(nccAlloc * 1.3),
      percentage: Math.round((nccAlloc / totalBudget) * 100),
      recommendedTierLabel:
        nccAlloc < 650
          ? "Auto di prestigio/epoca per gli sposi (o transfer mirato parenti)"
          : nccAlloc < 1400
          ? "Auto Sposi con conducente + Van NCC rientro sicuro o camere cortesia"
          : "Auto d'epoca/Luxury Sposi + Servizio Navetta Bus/NCC per gli invitati + Convenzione Hotel",
      proComparisonNote:
        "Un servizio NCC professionale ti garantisce autista in divisa, permessi ZTL per centri storici/chiese, puntualità e — per la sera — una navetta che permette agli amici di brindare senza pensieri per la patente.",
      honestAdvice:
        "Se hai molti ospiti che arrivano da fuori regione, non serve pagare tutti gli alloggi: basta stipulare una tariffa agevolata con 1-2 Hotel o B&B vicini e pubblicare le indicazioni sul sito del matrimonio!",
      questionsToAsk: [
        "Il preventivo auto include autista, carburante, pedaggi, accesso ZTL e attesa fino all'arrivo in location?",
        "Possiamo attivare un servizio navetta NCC a orari fissi (es. 00:30 e 02:00) dalla location verso gli hotel in centro?",
      ],
      bookingTiming: "Auto/NCC e blocchi camere Hotel 6 – 4 mesi prima",
      gentilunaTip:
        "Sul tuo sito GentiLuna puoi inserire la mappa interattiva di cerimonia, location e hotel consigliati per guidare tutti gli ospiti fuori sede con un clic.",
      matchingCategoryCodes: ["NCC_CARS", "HOTEL_HOSPITALITY"],
      fornitoriFilterGroup: "VIAGGI_AUTO_TORTE",
      isPriorityBoosted: hasPriority("GUEST_EXPERIENCE"),
    },
    {
      id: "stationery-favors",
      title: "Partecipazioni, Coordinato Grafico, Bomboniere & Sito Evento",
      shortTitle: "Inviti, QR & Bomboniere",
      colorHex: "#4f46e5",
      badgeClass: "bg-indigo-50 text-indigo-900 border-indigo-200",
      costType: "HYBRID",
      allocatedAmount: stationeryAlloc,
      minSuggested: roundTo50(stationeryAlloc * 0.8),
      maxSuggested: roundTo50(stationeryAlloc * 1.2),
      percentage: Math.round((stationeryAlloc / totalBudget) * 100),
      recommendedTierLabel:
        stationeryAlloc < 800
          ? "Inviti digitali interattivi + poche partecipazioni cartacee per i parenti + Bomboniere essenziali/solidali"
          : stationeryAlloc < 1600
          ? "Partecipazioni tipografiche con QR Code + Bomboniere gastronomiche o artigianali per ogni famiglia"
          : "Coordinato cartaceo su carta d'Amalfi/cotone + Segnaposto, Menù, Cartoncini QR e Bomboniere d'autore",
      proComparisonNote:
        "Ricorda che partecipazioni e bomboniere NON si contano per singolo invitato ma per nucleo familiare/coppia (in media circa il 55-60% del numero totale di ospiti, più un 10% di scorta).",
      honestAdvice:
        "Stampare il QR Code del sito matrimonio su un cartoncino elegante evita di stampare 3 foglietti separati (mappa stradale, lista nozze e conferma RSVP) e ti fa risparmiare subito su carta e spedizioni.",
      questionsToAsk: [
        "Quanti nuclei familiari reali abbiamo in lista (così da non ordinare il doppio di partecipazioni e bomboniere)?",
        "La tipografia può integrare il nostro QR Code GentiLuna direttamente su inviti e cartoncini tavolo?",
      ],
      bookingTiming: "Sito e Inviti 5 – 4 mesi prima • Bomboniere 3 mesi prima",
      gentilunaTip:
        "Dalla tua Area Sposi GentiLuna generi gratis i cartoncini tavolo pronti per la stampa con QR Code integrato e gestisci conferme RSVP via WhatsApp.",
      matchingCategoryCodes: ["STATIONERY_FAVORS"],
      fornitoriFilterGroup: "PLANNER_MUSICA_STILE",
      isPriorityBoosted: hasPriority("GUEST_EXPERIENCE"),
    },
  ];

  if (input.honeymoonMode === "INCLUDED") {
    items.push({
      id: "honeymoon",
      title: "Viaggio di Nozze (Quota inclusa nel Budget)",
      shortTitle: "Luna di Miele",
      colorHex: "#0ea5e9",
      badgeClass: "bg-cyan-50 text-cyan-900 border-cyan-200",
      costType: "FIXED_SERVICE",
      allocatedAmount: honeymoonAlloc,
      minSuggested: roundTo50(honeymoonAlloc * 0.85),
      maxSuggested: roundTo50(honeymoonAlloc * 1.25),
      percentage: Math.round((honeymoonAlloc / totalBudget) * 100),
      recommendedTierLabel:
        honeymoonAlloc < 3000
          ? "Capitale europea / Mediterraneo di charme, crociera o tour su misura di 7-10 giorni"
          : honeymoonAlloc < 5500
          ? "Viaggio intercontinentale (es. USA, Giappone, Safari o Oceano Indiano) prenotato con anticipo"
          : "Luna di Miele Luxury a tappe multi-destinazione con resort esclusivi ed esperienze private",
      proComparisonNote:
        "Prenotare tramite un'Agenzia di Viaggi specializzata in Honeymoon ti tutela su coincidenze voli, assicurazioni mediche/annullamento, visti e assistenza H24 in caso di cambi operativi aerei.",
      honestAdvice:
        "Anche se hai scelto di includerlo nel budget, puoi attivare la Lista Viaggio a tappe per recuperare buona parte della spesa grazie ai regali degli invitati!",
      questionsToAsk: [
        "Qual è il periodo climatico migliore per la meta che sogniamo (evitando stagione piogge o tifoni)?",
        "Nel preventivo sono già incluse tasse aeroportuali, assicurazione medico-bagaglio ad alto massimale e annullamento?",
      ],
      bookingTiming: "Da bloccare 9 – 6 mesi prima per le tariffe voli migliori",
      gentilunaTip:
        "Con GentiLuna crei la Lista Viaggio a Tappe a 0% trattenute e custodisci biglietti e voucher nell'area Documenti riservata.",
      matchingCategoryCodes: ["TRAVEL_AGENCY"],
      fornitoriFilterGroup: "VIAGGI_AUTO_TORTE",
    });
  }

  items.push({
    id: "contingency-taxes",
    title: "Fondo Salvagente: SIAE, Pratiche Rito & Imprevisti (6%)",
    shortTitle: "Tasse, SIAE & Imprevisti",
    colorHex: "#57534e",
    badgeClass: "bg-stone-100 text-stone-800 border-stone-300",
    costType: "FIXED_SERVICE",
    allocatedAmount: contingencyAlloc,
    minSuggested: roundTo50(contingencyAlloc * 0.8),
    maxSuggested: roundTo50(contingencyAlloc * 1.2),
    percentage: Math.max(4, Math.round((contingencyAlloc / totalBudget) * 100)),
    recommendedTierLabel:
      "Copertura prudenziale per diritti SIAE (~250€–550€), bolli/offerta chiesa o diritti sala comunale, e piccoli extra dell'ultima settimana",
    proComparisonNote:
      "Un buon pianificatore non assegna mai il 100% del budget ai fornitori: tenere il 6% libero vi evita qualsiasi ansia negli ultimi 15 giorni prima del Sì.",
    honestAdvice:
      "Verifica in Comune l'eventuale tariffa per sale storiche o per i non residenti, e in Parrocchia l'offerta consueta oltre ai documenti matrimoniali.",
    questionsToAsk: [
      "Quali diritti comunali o offerte parrocchiali sono previsti per il rito scelto?",
      "Qual è la tariffa SIAE esatta in base alla capienza location e alla presenza di musica dal vivo o registrata?",
    ],
    bookingTiming: "Pratiche burocratiche 6 – 3 mesi prima • SIAE entro il mese dell'evento",
    gentilunaTip:
      "Tieni tutte le scadenze sotto controllo con semplicità: se non userai questo fondo imprevisti, sarà un regalo extra per la vostra Luna di Miele!",
    matchingCategoryCodes: [],
  });

  const roadmap: RoadmapPhase[] = [
    {
      period: "12 – 9 Mesi Prima",
      title: "Le Fondamenta che bloccano data e stile",
      actions: [
        "Fissa budget massimo, fascia numero invitati e scegli tra Ristorante con cucina interna o Villa + Catering.",
        "Visita 3 strutture al massimo, verifica il Piano B pioggia e blocca la data con caparra chiara.",
        "Scegli Fotografo e Videomaker (i più richiesti lavorano su un solo evento al giorno!).",
        "Se desideri supporto completo o un viaggio intercontinentale, contatta ora Wedding Planner e Agenzia Viaggi.",
      ],
    },
    {
      period: "8 – 5 Mesi Prima",
      title: "Abiti, Musica, Fiori e Spazio Digitale",
      actions: [
        "Scegli gli abiti in Atelier per avere tutto il tempo delle prove sartoriali senza urgenze.",
        "Blocca Musica cerimonia, Band o DJ verificando postazioni audio e luci in location.",
        "Definisci il progetto floreale stagionale col Fiorista e prenota eventuale Auto Sposi / Navetta NCC.",
        "Attiva il tuo Sito Evento su GentiLuna per raccogliere conferme RSVP e intolleranze in ordine.",
      ],
    },
    {
      period: "4 – 2 Mesi Prima",
      title: "Inviti, Fedi, Torta e Beauty",
      actions: [
        "Ordina le Fedi nuziali, fai le prove Make-up & Hair e definisci Wedding Cake / Pasticceria.",
        "Invia le partecipazioni (cartacee con QR Code + inviti digitali WhatsApp) chiedendo conferma entro 30-40 giorni dalle nozze.",
        "Scegli le bomboniere calcolandole per nucleo familiare (+10% margine).",
      ],
    },
    {
      period: "Ultimo Mese",
      title: "Regia Finale Zero Stress",
      actions: [
        "Chiudi le conferme RSVP, assegna i posti nella Mappa Tavoli GentiLuna e invia il Link Ristorante Live allo chef.",
        "Stampa i cartoncini tavolo con QR Code per raccogliere le foto spontanee degli ospiti.",
        "Salda la pratica SIAE, condividi la scaletta oraria con tutti i professionisti e goditi la festa!",
      ],
    },
  ];

  return {
    input,
    sustainabilityStatus,
    sustainabilityHeadline,
    sustainabilityMessage,
    smartSuggestionTip,
    perGuestOverall,
    estimatedReceptionPerGuest,
    estimatedVenueRentalFee,
    items,
    roadmap,
  };
}

function calculateMilestoneEventPlan(
  input: BudgetPlannerInput
): BudgetPlanResult {
  const { totalBudget, guestsCount, eventType } = input;
  const perGuestOverall = Math.round(totalBudget / guestsCount);
  const eventLabel = EVENT_TYPE_META[eventType].label;

  const foodAlloc = roundTo50(totalBudget * 0.52);
  const photoAlloc = roundTo50(totalBudget * 0.16);
  const cakeAlloc = roundTo50(totalBudget * 0.11);
  const musicDecorAlloc = roundTo50(totalBudget * 0.11);
  const favorsInvitesAlloc = roundTo50(totalBudget * 0.06);
  const contingencyAlloc = Math.max(
    50,
    totalBudget - (foodAlloc + photoAlloc + cakeAlloc + musicDecorAlloc + favorsInvitesAlloc)
  );

  const estMenuPerGuest = Math.round(foodAlloc / guestsCount);

  const sustainabilityStatus: BudgetPlanResult["sustainabilityStatus"] =
    estMenuPerGuest < 32 ? "STRETCHED" : estMenuPerGuest < 55 ? "BALANCED" : "OPTIMAL";

  const items: BudgetLineItem[] = [
    {
      id: "milestone-food",
      title: `Ristorante, Location o Buffet per ${eventLabel}`,
      shortTitle: "Ristorante / Location",
      colorHex: "#059669",
      badgeClass: "bg-emerald-50 text-emerald-900 border-emerald-200",
      costType: "PER_PERSON",
      allocatedAmount: foodAlloc,
      minSuggested: roundTo50(foodAlloc * 0.88),
      maxSuggested: roundTo50(foodAlloc * 1.12),
      percentage: Math.round((foodAlloc / totalBudget) * 100),
      perGuestNote: `~${formatEuro(estMenuPerGuest)} a persona per ${guestsCount} ospiti`,
      recommendedTierLabel:
        estMenuPerGuest < 45
          ? "Apericena gourmet / Buffet conviviale o Agriturismo"
          : "Pranzo o Cena servita in Ristorante / Sala ricevimenti con menù dedicato",
      proComparisonNote:
        "Per battesimi, lauree e anniversari i ristoranti con giardino e cucina interna evitano costi fissi d'affitto e gestiscono con facilità menù bimbi e intolleranze.",
      honestAdvice:
        "Concorda un menù chiaro bevande incluse e verifica uno spazio dedicato per taglio torta e foto di gruppo.",
      questionsToAsk: [
        "Il prezzo include bevande, caffè, amari e servizio taglio torta?",
        "C'è uno spazio riservato o una sala dedicata solo al nostro gruppo?",
      ],
      bookingTiming: "3 – 2 mesi prima dell'evento",
      gentilunaTip:
        "Con GentiLuna raccogli conferme e intolleranze su WhatsApp e invii la lista tavoli pulita al ristorante.",
      matchingCategoryCodes: ["RESTAURANT", "LOCATION", "CATERING", "BAR_EXPERIENCE"],
      fornitoriFilterGroup: "RISTORANTI_LOCATION",
    },
    {
      id: "milestone-photo",
      title: "Servizio Fotografico & Galleria QR Invitati",
      shortTitle: "Fotografo & Ricordi",
      colorHex: "#e11d48",
      badgeClass: "bg-rose-50 text-rose-900 border-rose-200",
      costType: "FIXED_SERVICE",
      allocatedAmount: photoAlloc,
      minSuggested: roundTo50(photoAlloc * 0.85),
      maxSuggested: roundTo50(photoAlloc * 1.2),
      percentage: Math.round((photoAlloc / totalBudget) * 100),
      recommendedTierLabel:
        photoAlloc < 400
          ? "Servizio fotografico smart per rito/festa + QR Code foto invitati"
          : "Fotografo professionista dedicato per l'intero evento con consegna galleria HD e mini-album",
      proComparisonNote:
        "Avere un fotografo dedicato permette a genitori e festeggiati di godersi gli abbracci senza dover tenere il telefono in mano tutto il tempo.",
      honestAdvice:
        "Abbina agli scatti d'autore del professionista i cartoncini QR sui tavoli per raccogliere anche tutti i video divertenti degli amici!",
      questionsToAsk: [
        "Quante ore di copertura e quanti scatti post-prodotti in HD sono compresi?",
      ],
      bookingTiming: "2 mesi prima",
      gentilunaTip:
        "Ogni evento diventa un nuovo Capitolo custodito per sempre nella vostra Timeline di Famiglia su GentiLuna!",
      matchingCategoryCodes: ["PHOTOGRAPHER", "VIDEOMAKER"],
      fornitoriFilterGroup: "FOTO_VIDEO",
    },
    {
      id: "milestone-cake",
      title: "Torta Celebrativa, Cake Design & Confettata",
      shortTitle: "Torta & Pasticceria",
      colorHex: "#db2777",
      badgeClass: "bg-pink-50 text-pink-900 border-pink-200",
      costType: "PER_PERSON",
      allocatedAmount: cakeAlloc,
      minSuggested: roundTo50(cakeAlloc * 0.85),
      maxSuggested: roundTo50(cakeAlloc * 1.2),
      percentage: Math.round((cakeAlloc / totalBudget) * 100),
      recommendedTierLabel: "Torta artigianale personalizzata a tema + selezione confetti",
      proComparisonNote:
        "Una pasticceria specializzata può creare una torta scenografica coordinata ai colori dell'evento con certificazione per il trasporto in sala.",
      honestAdvice:
        "Verifica con il ristorante che sia disponibile la cella frigo adeguata all'altezza della torta scelta.",
      questionsToAsk: [
        "La consegna refrigerata direttamente al ristorante è inclusa?",
      ],
      bookingTiming: "1 mese prima",
      gentilunaTip:
        "Mostra la pasticceria tra i Partner dell'evento: tutti gli ospiti chiedono sempre chi ha fatto la torta!",
      matchingCategoryCodes: ["PASTRY_CAKE"],
      fornitoriFilterGroup: "VIAGGI_AUTO_TORTE",
    },
    {
      id: "milestone-music-decor",
      title: "Allestimento, Fiori, Musica / DJ o Animazione Bimbi",
      shortTitle: "Allestimento & Musica",
      colorHex: "#7c3aed",
      badgeClass: "bg-violet-50 text-violet-900 border-violet-200",
      costType: "FIXED_SERVICE",
      allocatedAmount: musicDecorAlloc,
      minSuggested: roundTo50(musicDecorAlloc * 0.8),
      maxSuggested: roundTo50(musicDecorAlloc * 1.25),
      percentage: Math.round((musicDecorAlloc / totalBudget) * 100),
      recommendedTierLabel:
        eventType === "GRADUATION_PARTY"
          ? "DJ Set / Impianto audio-luci + Corner fotografico / Backdrop laurea"
          : "Allestimento floreale e tavolo torta + intrattenimento musicale o animazione bambini",
      proComparisonNote:
        "Nei battesimi e comunioni un animatore per i bambini regala 3 ore di relax vero a tutti i genitori invitati!",
      honestAdvice:
        "Concentra l'allestimento sul backdrop dietro il tavolo della torta: sarà lo sfondo di tutte le foto ricordo.",
      questionsToAsk: [
        "Il montaggio e smontaggio degli allestimenti in sala è concordato con gli orari del ristorante?",
      ],
      bookingTiming: "1 – 2 mesi prima",
      gentilunaTip:
        "Puoi proiettare su una TV in sala lo slideshow live delle foto della festa o dei ricordi d'infanzia!",
      matchingCategoryCodes: ["FLORIST", "DJ", "MUSICIAN", "PHOTO_BOOTH"],
      fornitoriFilterGroup: "PLANNER_MUSICA_STILE",
    },
    {
      id: "milestone-favors",
      title: "Inviti Digitali, Segnaposto QR & Bomboniere",
      shortTitle: "Inviti & Bomboniere",
      colorHex: "#4f46e5",
      badgeClass: "bg-indigo-50 text-indigo-900 border-indigo-200",
      costType: "HYBRID",
      allocatedAmount: favorsInvitesAlloc,
      minSuggested: roundTo50(favorsInvitesAlloc * 0.8),
      maxSuggested: roundTo50(favorsInvitesAlloc * 1.2),
      percentage: Math.round((favorsInvitesAlloc / totalBudget) * 100),
      recommendedTierLabel: "Inviti digitali interattivi WhatsApp + bomboniere per ogni famiglia",
      proComparisonNote:
        "Calcola sempre 1 bomboniera per nucleo familiare e usa gli inviti digitali per azzerare i costi di spedizione.",
      honestAdvice:
        "Le bomboniere enogastronomiche (olio pregiato, miele, liquori artigianali) o solidali sono tra le più apprezzate.",
      questionsToAsk: [
        "Quanti nuclei familiari parteciperanno effettivamente?",
      ],
      bookingTiming: "4 – 3 settimane prima",
      gentilunaTip:
        "Invia l'invito con apertura a busta digitale direttamente su WhatsApp dal tuo spazio GentiLuna.",
      matchingCategoryCodes: ["STATIONERY_FAVORS"],
      fornitoriFilterGroup: "PLANNER_MUSICA_STILE",
    },
    {
      id: "milestone-buffer",
      title: "Margine Extra & Piccole Spese",
      shortTitle: "Margine Imprevisti",
      colorHex: "#57534e",
      badgeClass: "bg-stone-100 text-stone-800 border-stone-300",
      costType: "FIXED_SERVICE",
      allocatedAmount: contingencyAlloc,
      minSuggested: contingencyAlloc,
      maxSuggested: roundTo50(contingencyAlloc * 1.3),
      percentage: Math.max(3, Math.round((contingencyAlloc / totalBudget) * 100)),
      recommendedTierLabel: "Piccolo fondo cassa per abbigliamento, SIAE o aggiunte dell'ultimo minuto",
      proComparisonNote: "Tenere un piccolo cuscinetto evita sforamenti imprevisti.",
      honestAdvice: "Utile per eventuali stampe o brindisi extra.",
      questionsToAsk: ["Abbiamo verificato se serve SIAE per eventuale DJ set?"],
      bookingTiming: "Ultima settimana",
      gentilunaTip: "Gestisci dediche e ringraziamenti sul Guestbook digitale dopo la festa!",
      matchingCategoryCodes: [],
    },
  ];

  return {
    input,
    sustainabilityStatus,
    sustainabilityHeadline:
      sustainabilityStatus === "STRETCHED"
        ? "Budget contenuto rispetto al numero di ospiti: punta su formula buffet/apericena"
        : `Piano equilibrato e concreto per il tuo evento (${eventLabel})`,
    sustainabilityMessage: `Con ${formatEuro(totalBudget)} e ${guestsCount} invitati hai circa ${formatEuro(estMenuPerGuest)}/ospite dedicati alla ristorazione, più budget per foto, torta, allestimento e bomboniere.`,
    perGuestOverall,
    estimatedReceptionPerGuest: estMenuPerGuest,
    estimatedVenueRentalFee: 0,
    items,
    roadmap: [
      {
        period: "2 – 3 Mesi Prima",
        title: "Scelta Ristorante & Fotografo",
        actions: [
          "Prenota il Ristorante o la Location definendo menù adulti, menù bimbi e spazi.",
          "Blocca il Fotografo per avere ricordi nitidi ed emozionanti senza pensieri.",
        ],
      },
      {
        period: "1 Mese Prima",
        title: "Inviti Digitali, Torta & Allestimento",
        actions: [
          "Invia il link d'invito GentiLuna su WhatsApp per raccogliere le conferme e le intolleranze.",
          "Ordina torta personalizzata, confetti e bomboniere per famiglia.",
        ],
      },
      {
        period: "Ultima Settimana",
        title: "Tavoli & QR Code Foto in Sala",
        actions: [
          "Invia i numeri definitivi al ristorante e posiziona il QR Code sui tavoli per raccogliere tutte le foto della giornata!",
        ],
      },
    ],
  };
}

export const BUDGET_IDEA_SCENARIOS: BudgetIdeaScenario[] = [
  {
    id: "intimo-chic",
    badge: "Fascia Smart • 35–50 Ospiti",
    title: "Matrimonio Intimo & Autentico",
    budgetRangeLabel: "8.000 € – 12.000 €",
    guestsLabel: "Circa 45 invitati",
    accentGradient: "from-rose-50 via-white to-amber-50/40",
    borderClass: "border-rose-200/80 hover:border-rose-400",
    summary:
      "Pochi invitati davvero vicini al cuore, zero sprechi scenografici inutili e tanta qualità umana ed enogastronomica.",
    whatYouCanDo: [
      "Pranzo o cena curata in Agriturismo di charme o Ristorante selezionato (zero costo affitto villa nuda).",
      "Servizio fotografico d'autore in stile reportage (6-8 ore, consegna digitale HD) affiancato dal QR Code foto invitati.",
      "Bouquet sposa, bottoniere e centrotavola stagionali raffinati + Wedding Cake artigianale.",
      "Abiti scelti con intelligenza (collezioni civili, sartoria essenziale o outlet atelier) e musica acustica/selezione regia.",
    ],
    smartTradeoffs: [
      "Evita ville in affitto separato e doppi spostamenti lunghi: fare rito e ricevimento vicini abbatte costi di auto e doppi fiori.",
      "Usa partecipazioni digitali interattive + solo 15-20 inviti stampati per nonni e parenti stretti.",
    ],
    presetInput: {
      eventType: "WEDDING",
      totalBudget: 10500,
      guestsCount: 45,
      venueFormula: "AGRITURISMO",
      season: "SMART_WEEKDAY",
      honeymoonMode: "GIFT_FUNDED",
      priorities: ["FOOD_WINE", "PHOTO_CINEMA"],
    },
  },
  {
    id: "conviviale-curato",
    badge: "Molto Richiesto • 70–90 Ospiti",
    title: "Festa Conviviale in Ristorante con Giardino",
    budgetRangeLabel: "15.000 € – 20.000 €",
    guestsLabel: "Circa 80 invitati",
    accentGradient: "from-emerald-50/70 via-white to-teal-50/30",
    borderClass: "border-emerald-200/80 hover:border-emerald-400",
    summary:
      "Il segreto di questa fascia è puntare su una splendida Sala Ricevimenti o Ristorante con parco/terrazza e cucina interna: l'impatto è da grande evento senza pagare affitti extra.",
    whatYouCanDo: [
      "Aperitivo in giardino + banchetto completo in Ristorante rinomato con vini inclusi.",
      "Fotografo professionista per l'intera giornata + DJ Set con impianto luci per far ballare tutti la sera.",
      "Allestimento floreale coordinato tra cerimonia e location + torta pasticceria e confettata.",
      "Abiti sposa e sposo in atelier, fedi in oro e pacchetto bridal make-up & hair.",
    ],
    smartTradeoffs: [
      "Valutare un venerdì pomeriggio/sera in estate regala tramonti magici e spesso sconti importanti sul menù.",
      "Finanzia la Luna di Miele tramite la Lista Viaggio a tappe a 0% commissioni anziché intaccare questo budget.",
    ],
    presetInput: {
      eventType: "WEDDING",
      totalBudget: 18000,
      guestsCount: 80,
      venueFormula: "RESTAURANT",
      season: "PEAK_WEEKEND",
      honeymoonMode: "GIFT_FUNDED",
      priorities: ["FOOD_WINE", "PARTY_MUSIC"],
    },
  },
  {
    id: "classico-italiano",
    badge: "Equilibrio Completo • 100–120 Ospiti",
    title: "Il Grande Matrimonio Classico Italiano",
    budgetRangeLabel: "25.000 € – 32.000 €",
    guestsLabel: "Circa 110 invitati",
    accentGradient: "from-amber-50/80 via-white to-rose-50/40",
    borderClass: "border-amber-300/80 hover:border-amber-500",
    summary:
      "La fascia regina in Italia per un matrimonio completo di ogni dettaglio tradizionale e moderno, con professionisti dedicati in ogni ruolo chiave.",
    whatYouCanDo: [
      "Tenuta o Sala Ricevimenti d'eccellenza con isole gastronomiche live, menù ricco e open bar serale.",
      "Studio completo Fotografo + Videomaker (Wedding Film emozionale e riprese drone) + Live Wall in sala.",
      "Musica dal vivo durante rito/aperitivo + DJ Set party serale.",
      "Floral design completo, Auto sposi con conducente (NCC), coordinato tipografico con QR Code e bomboniere artigianali.",
    ],
    smartTradeoffs: [
      "Richiedi sempre un forfait fisso per le ore di open bar dopo il taglio torta per avere certezza assoluta del totale.",
    ],
    presetInput: {
      eventType: "WEDDING",
      totalBudget: 28000,
      guestsCount: 110,
      venueFormula: "RESTAURANT",
      season: "PEAK_WEEKEND",
      honeymoonMode: "GIFT_FUNDED",
      priorities: ["PHOTO_CINEMA", "FOOD_WINE", "PARTY_MUSIC"],
    },
  },
  {
    id: "villa-esperienziale",
    badge: "Esclusivo • 120–150 Ospiti",
    title: "Dimora Storica / Villa in Esclusiva & Regia",
    budgetRangeLabel: "38.000 € – 50.000 €",
    guestsLabel: "Circa 130 invitati",
    accentGradient: "from-violet-50/70 via-white to-amber-50/40",
    borderClass: "border-violet-200/80 hover:border-violet-400",
    summary:
      "Ideale per chi sogna una Villa storica, un Castello o una Masseria riservata in esclusiva con banqueting sartoriale, regia coordinata ed esperienze memorabili per gli ospiti.",
    whatYouCanDo: [
      "Affitto Villa/Dimora in esclusiva + Catering d'alta cucina con mise en place personalizzata.",
      "Supporto Wedding Planner / Coordinator + Floral & Light Design architetturale (cieli stellati, tavoli imperiali).",
      "Équipe completa 2 Fotografi + Cinema + Drone + Album Fine-Art stampato a mano.",
      "Band Live + DJ/Sax + Cocktail Bar Mixology, angolo sigari & rum e navetta NCC notturna per il rientro degli invitati.",
    ],
    smartTradeoffs: [
      "Verifica fin dal primo sopralluogo che la villa disponga di saloni interni capienti quanto il giardino per evitare il noleggio di tensostrutture extra.",
    ],
    presetInput: {
      eventType: "WEDDING",
      totalBudget: 44000,
      guestsCount: 130,
      venueFormula: "VILLA_CATERING",
      season: "PEAK_WEEKEND",
      honeymoonMode: "GIFT_FUNDED",
      priorities: ["FLOWERS_DESIGN", "PHOTO_CINEMA", "FOOD_WINE"],
    },
  },
  {
    id: "luxury-weekend",
    badge: "Gran Galà & Destination • 2-3 Giorni",
    title: "Luxury & Weekend Wedding Experience",
    budgetRangeLabel: "60.000 € – 90.000+ €",
    guestsLabel: "120–160 invitati",
    accentGradient: "from-stone-900 via-stone-900 to-stone-800 text-white",
    borderClass: "border-amber-400/60 hover:border-amber-300",
    summary:
      "Non un singolo giorno ma un intero weekend d'autore sul mare, tra le colline o in un resort storico: Welcome Dinner del venerdì, Gran Galà del sabato e Brunch domenicale.",
    whatYouCanDo: [
      "Location iconica o Resort riservato con gestione ospitalità e transfer NCC dedicati per gli ospiti fuori sede.",
      "Wedding Planner full-service dall'ideazione creativa alla regia di tutti i fornitori.",
      "Alta sartoria sposi con cambio abito serale, spettacolo musicale live internazionale, light design e fuochi/fontane fredde.",
      "Possibilità di includere direttamente anche una Luna di Miele intercontinentale di lusso.",
    ],
    smartTradeoffs: [
      "Centralizza tutte le informazioni logistiche dei 3 giorni (orari navette, dress code serate, hotel, mappa tavoli) sul portale privato dell'evento.",
    ],
    presetInput: {
      eventType: "WEDDING",
      totalBudget: 72000,
      guestsCount: 140,
      venueFormula: "VILLA_CATERING",
      season: "PEAK_WEEKEND",
      honeymoonMode: "INCLUDED",
      priorities: ["FLOWERS_DESIGN", "GUEST_EXPERIENCE", "PARTY_MUSIC"],
    },
  },
  {
    id: "altri-eventi-vita",
    badge: "Capitoli di Vita • Battesimo, Laurea, Nozze d'Oro",
    title: "Feste & Traguardi di Famiglia Perfetti",
    budgetRangeLabel: "1.800 € – 6.000 €",
    guestsLabel: "40–80 invitati",
    accentGradient: "from-sky-50/80 via-white to-indigo-50/40",
    borderClass: "border-sky-200/80 hover:border-sky-400",
    summary:
      "GentiLuna accompagna ogni capitolo della vita: ecco come organizzare un Battesimo, una Comunione, una Festa di Laurea, un 18° o un 25°/50° Anniversario senza stress.",
    whatYouCanDo: [
      "Pranzo in Ristorante/Agriturismo o Cocktail Party dinamico serale con DJ set.",
      "Servizio fotografico dedicato + QR Code sui tavoli per raccogliere le foto di parenti e amici.",
      "Torta Cake Design personalizzata, confettata, backdrop fotografico e inviti digitali WhatsApp.",
    ],
    smartTradeoffs: [
      "Riaprendo o creando il tuo spazio su GentiLuna conservi tutti i traguardi della famiglia in un unico archivio nel tempo.",
    ],
    presetInput: {
      eventType: "BAPTISM_COMMUNION",
      totalBudget: 3500,
      guestsCount: 55,
      venueFormula: "RESTAURANT",
      season: "PEAK_WEEKEND",
      honeymoonMode: "GIFT_FUNDED",
      priorities: ["FOOD_WINE", "PHOTO_CINEMA"],
    },
  },
];
