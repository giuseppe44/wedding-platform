export interface LocalSeoVertical {
  slugPrefix: string;
  titlePlural: string;
  singularLabel: string;
  primaryCategoryCode: string;
  acceptedCategories: string[];
  adviceIntro: string;
  partnerPitch: string;
}

export interface LocalSeoArea {
  areaSlug: string;
  name: string;
  prepositionName: string; // es. "a Roma e nel Lazio", "in Sardegna", "in Puglia e Salento"
  matchTerms: string[];
}

export const LOCAL_SEO_VERTICALS: LocalSeoVertical[] = [
  {
    slugPrefix: "ristoranti-matrimoni",
    titlePlural: "Ristoranti, Ville e Sale Ricevimenti per Matrimoni",
    singularLabel: "Ristorante o Villa per Matrimoni",
    primaryCategoryCode: "RESTAURANT",
    acceptedCategories: ["RESTAURANT", "LOCATION", "CATERING", "BAR_EXPERIENCE"],
    adviceIntro:
      "Scegliere il ristorante o la villa giusta significa unire cucina d'eccellenza, spazi accoglienti e una gestione impeccabile di tavoli, intolleranze alimentari, celiaci e menù bambini grazie al Portale Ristorante Live di GentiLuna.",
    partnerPitch:
      "Gestisci un ristorante, una villa o una sala ricevimenti? Crea gratis la tua Vetrina e usa il Portale Sala & Allergie Live per matrimoni, battesimi, comunioni e lauree.",
  },
  {
    slugPrefix: "fotografi-matrimonio",
    titlePlural: "Fotografi e Videomaker per Matrimonio",
    singularLabel: "Fotografo o Videomaker Matrimonio",
    primaryCategoryCode: "PHOTOGRAPHER",
    acceptedCategories: ["PHOTOGRAPHER", "VIDEOMAKER"],
    adviceIntro:
      "Un reportage spontaneo unito alla consegna digitale in Alta Risoluzione su GentiLuna e alla raccolta foto live degli invitati con QR Code sui tavoli rende eterno ogni istante della giornata.",
    partnerPitch:
      "Hai uno studio fotografico o video? Pubblica gratis fino a 15 scatti nel portfolio, consegna album HD ai tuoi sposi e acquisisci clienti a 0% commissioni.",
  },
  {
    slugPrefix: "agenzie-viaggi-nozze",
    titlePlural: "Agenzie di Viaggi e Liste Luna di Miele",
    singularLabel: "Agenzia di Viaggi per Luna di Miele",
    primaryCategoryCode: "TRAVEL_AGENCY",
    acceptedCategories: ["TRAVEL_AGENCY", "HOTEL_HOSPITALITY"],
    adviceIntro:
      "Organizza un viaggio di nozze su misura raccontando ogni tappa dell'itinerario nella Lista Viaggio interattiva di GentiLuna e custodendo voucher e documenti in un'unica area privata.",
    partnerPitch:
      "Gestisci un'agenzia di viaggi o una struttura ricettiva? Offri alle tue coppie la Lista Luna di Miele a tappe già pronta e mostra il tuo brand a tutti gli invitati.",
  },
  {
    slugPrefix: "pasticcerie-torte-nuziali",
    titlePlural: "Pasticcerie, Negozi di Torte e Cake Design",
    singularLabel: "Pasticceria e Cake Designer",
    primaryCategoryCode: "PASTRY_CAKE",
    acceptedCategories: ["PASTRY_CAKE"],
    adviceIntro:
      "Dalla wedding cake monumentale alla millefoglie espressa, fino a confettate, sweet table e monoporzioni senza glutine o lattosio per coccolare ogni ospite al momento del taglio torta.",
    partnerPitch:
      "Hai una pasticceria o laboratorio di cake design? Crea gratis la tua Vetrina e ricevi ordini diretti per matrimoni, battesimi, comunioni, lauree e compleanni.",
  },
  {
    slugPrefix: "ncc-auto-matrimoni",
    titlePlural: "NCC (Noleggio con Conducente) e Auto per Matrimoni",
    singularLabel: "Servizio NCC o Auto per Matrimonio",
    primaryCategoryCode: "NCC_CARS",
    acceptedCategories: ["NCC_CARS"],
    adviceIntro:
      "Auto d'epoca, cabriolet o berline di lusso per l'arrivo degli sposi, affiancate da van e navette NCC con conducente per far viaggiare e rientrare tutti gli invitati in totale sicurezza.",
    partnerPitch:
      "Operi nel noleggio con conducente (NCC) o auto da cerimonia? Registra gratis la tua flotta e ricevi richieste sia dagli sposi sia dagli invitati fuori sede.",
  },
  {
    slugPrefix: "wedding-planner",
    titlePlural: "Wedding Planner e Organizzatori di Eventi",
    singularLabel: "Wedding & Event Planner",
    primaryCategoryCode: "WEDDING_PLANNER",
    acceptedCategories: ["WEDDING_PLANNER"],
    adviceIntro:
      "Affidarsi a un Wedding Planner significa godersi i preparativi senza stress, coordinando budget, fornitori, scaletta oraria e disposizione tavoli in un'unica cabina di regia.",
    partnerPitch:
      "Sei un Wedding o Event Planner? Attiva gratis la tua Vetrina e coordina timeline, ospiti e fornitori dei tuoi clienti su GentiLuna.",
  },
  {
    slugPrefix: "musica-dj-matrimonio",
    titlePlural: "Musica Live, Band e DJ per Matrimoni",
    singularLabel: "Musicista, Band o DJ Matrimonio",
    primaryCategoryCode: "MUSICIAN",
    acceptedCategories: ["MUSICIAN", "DJ", "PHOTO_BOOTH"],
    adviceIntro:
      "Dall'accompagnamento emozionante per il rito all'aperitivo acustico fino al DJ set scatenato abbinato al Live Photo Wall proiettato in sala durante la festa.",
    partnerPitch:
      "Sei un musicista, band, DJ o fornitore photo booth? Crea gratis la tua scheda e fatti contattare dagli invitati che ti ascoltano dal vivo.",
  },
  {
    slugPrefix: "fioristi-partecipazioni-bomboniere",
    titlePlural: "Fioristi, Partecipazioni con QR Code e Bomboniere",
    singularLabel: "Fiorista, Tipografia o Atelier Sposi",
    primaryCategoryCode: "FLORIST",
    acceptedCategories: [
      "FLORIST",
      "STATIONERY_FAVORS",
      "ATELIER_JEWELRY",
      "MAKEUP_ARTIST",
      "HAIR_STYLIST",
    ],
    adviceIntro:
      "Allestimenti floreali scenografici, partecipazioni artigianali e segnaposto con QR Code integrato, bomboniere ed eleganza sartoriale per dare un'identità unica al vostro evento.",
    partnerPitch:
      "Hai una fioreria, tipografia partecipazioni, negozio bomboniere o atelier? Iscriviti gratis e intercetta le nuove coppie della tua zona.",
  },
];

export const LOCAL_SEO_AREAS: LocalSeoArea[] = [
  {
    areaSlug: "roma-lazio",
    name: "Roma e Lazio",
    prepositionName: "a Roma e nel Lazio",
    matchTerms: ["roma", "lazio", "viterbo", "latina", "frosinone", "rieti", "castelli"],
  },
  {
    areaSlug: "milano-lombardia",
    name: "Milano e Lombardia",
    prepositionName: "a Milano e in Lombardia",
    matchTerms: ["milano", "lombardia", "bergamo", "brescia", "monza", "varese", "pavia"],
  },
  {
    areaSlug: "lago-di-como",
    name: "Lago di Como e Brianza",
    prepositionName: "sul Lago di Como e in Brianza",
    matchTerms: ["como", "lecco", "brianza", "lombardia", "laghi"],
  },
  {
    areaSlug: "toscana-firenze",
    name: "Toscana e Firenze",
    prepositionName: "a Firenze e in Toscana",
    matchTerms: ["toscana", "firenze", "siena", "lucca", "pisa", "arezzo", "chianti"],
  },
  {
    areaSlug: "puglia-salento",
    name: "Puglia e Salento",
    prepositionName: "in Puglia e nel Salento",
    matchTerms: ["puglia", "bari", "lecce", "salento", "brindisi", "taranto", "foggia", "valle d'itria"],
  },
  {
    areaSlug: "sardegna",
    name: "Sardegna",
    prepositionName: "in Sardegna",
    matchTerms: ["sardegna", "cagliari", "sassari", "olbia", "alghero", "nuoro", "oristano", "costa smeralda"],
  },
  {
    areaSlug: "sicilia",
    name: "Sicilia",
    prepositionName: "in Sicilia",
    matchTerms: ["sicilia", "palermo", "catania", "taormina", "siracusa", "ragusa", "agrigento", "trapani"],
  },
  {
    areaSlug: "napoli-costiera",
    name: "Napoli e Costiera Amalfitana",
    prepositionName: "a Napoli, Salerno e in Costiera Amalfitana",
    matchTerms: ["napoli", "campania", "salerno", "amalfi", "sorrento", "caserta", "costiera"],
  },
  {
    areaSlug: "veneto-venezia",
    name: "Veneto, Venezia e Verona",
    prepositionName: "in Veneto, Venezia e Verona",
    matchTerms: ["veneto", "venezia", "verona", "padova", "treviso", "vicenza", "garda"],
  },
  {
    areaSlug: "torino-piemonte",
    name: "Torino, Langhe e Piemonte",
    prepositionName: "a Torino, nelle Langhe e in Piemonte",
    matchTerms: ["torino", "piemonte", "langhe", "asti", "cuneo", "novara", "lago maggiore"],
  },
  {
    areaSlug: "bologna-emilia-romagna",
    name: "Bologna ed Emilia-Romagna",
    prepositionName: "a Bologna e in Emilia-Romagna",
    matchTerms: ["bologna", "emilia", "romagna", "modena", "parma", "rimini", "reggio"],
  },
  {
    areaSlug: "liguria",
    name: "Genova, Portofino e Liguria",
    prepositionName: "in Liguria e Riviera",
    matchTerms: ["liguria", "genova", "portofino", "sanremo", "cinque terre", "savona", "la spezia"],
  },
];

export function parseLocalSeoSlug(seoSlug: string): {
  vertical: LocalSeoVertical;
  area: LocalSeoArea;
} | null {
  const clean = (seoSlug || "").trim().toLowerCase();
  for (const vertical of LOCAL_SEO_VERTICALS) {
    const prefix = `${vertical.slugPrefix}-`;
    if (clean.startsWith(prefix)) {
      const rest = clean.slice(prefix.length);
      const area = LOCAL_SEO_AREAS.find((a) => a.areaSlug === rest);
      if (area) {
        return { vertical, area };
      }
    }
  }
  return null;
}

export function getFeaturedLocalSeoSlugs(): {
  slug: string;
  label: string;
}[] {
  const featured: { slug: string; label: string }[] = [];
  const topVerticals = LOCAL_SEO_VERTICALS.slice(0, 5);
  const topAreas = LOCAL_SEO_AREAS.slice(0, 8);

  for (const v of topVerticals) {
    for (const a of topAreas) {
      featured.push({
        slug: `${v.slugPrefix}-${a.areaSlug}`,
        label: `${v.titlePlural.split(",")[0]} ${a.name}`,
      });
    }
  }
  return featured;
}

export function getAllLocalSeoSlugs(): string[] {
  const slugs: string[] = [];
  for (const v of LOCAL_SEO_VERTICALS) {
    for (const a of LOCAL_SEO_AREAS) {
      slugs.push(`${v.slugPrefix}-${a.areaSlug}`);
    }
  }
  return slugs;
}
