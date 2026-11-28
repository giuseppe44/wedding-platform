export type ProFilterGroup =
  | "FOTO_VIDEO"
  | "RISTORANTI_LOCATION"
  | "VIAGGI_AUTO_TORTE"
  | "PLANNER_MUSICA_STILE";

export interface ProCategoryMeta {
  code: string;
  label: string;
  shortLabel: string;
  groupName: string;
  filterGroup: ProFilterGroup;
  businessPlaceholder: string;
  publicFallbackDescription: (businessName: string) => string;
  proValuePitch: string;
}

export const PRO_CATEGORIES: ProCategoryMeta[] = [
  // 1. Ospitalità, Ristoranti & Banchetto
  {
    code: "RESTAURANT",
    label: "Ristorante & Sala Ricevimenti",
    shortLabel: "Ristorante",
    groupName: "Ristoranti, Ville & Banchetto",
    filterGroup: "RISTORANTI_LOCATION",
    businessPlaceholder: "Es. Ristorante Villa Belvedere",
    publicFallbackDescription: (name) =>
      `Scopri le sale ricevimenti, i menù per matrimoni e cerimonie e richiedi disponibilità diretta a ${name} su GentiLuna.`,
    proValuePitch:
      "Ricevi tavoli, allergie e intolleranze in tempo reale dagli sposi, offri il Live Photo Wall in sala e intercetta matrimoni, battesimi, comunioni e lauree tutto l'anno.",
  },
  {
    code: "LOCATION",
    label: "Villa, Location & Agriturismo",
    shortLabel: "Location & Villa",
    groupName: "Ristoranti, Ville & Banchetto",
    filterGroup: "RISTORANTI_LOCATION",
    businessPlaceholder: "Es. Tenuta & Dimora Storica San Lorenzo",
    publicFallbackDescription: (name) =>
      `Esplora gli spazi interni ed esterni, la capienza e i servizi esclusivi per eventi di ${name}.`,
    proValuePitch:
      "Posiziona la tua location nella vetrina ufficiale, coordina la disposizione tavoli digitale con gli sposi e trasforma ogni ospite in un futuro cliente.",
  },
  {
    code: "CATERING",
    label: "Catering & Banqueting",
    shortLabel: "Catering",
    groupName: "Ristoranti, Ville & Banchetto",
    filterGroup: "RISTORANTI_LOCATION",
    businessPlaceholder: "Es. Eccellenza Banqueting & Catering",
    publicFallbackDescription: (name) =>
      `Scopri le proposte gastronomiche, gli allestimenti tavola e i servizi banqueting su misura di ${name}.`,
    proValuePitch:
      "Riepilogo automatico di celiaci, intolleranze e menù bimbi diviso tavolo per tavolo, più vetrina diretta davanti a tutti gli invitati.",
  },
  {
    code: "PASTRY_CAKE",
    label: "Pasticceria, Negozi di Torte & Cake Design",
    shortLabel: "Pasticceria & Torte",
    groupName: "Ristoranti, Ville & Banchetto",
    filterGroup: "VIAGGI_AUTO_TORTE",
    businessPlaceholder: "Es. Pasticceria & Cake Design Dolce Arte",
    publicFallbackDescription: (name) =>
      `Ammira le wedding cake artigianali, torte da cerimonia, confettate e sweet table firmate da ${name}.`,
    proValuePitch:
      "Mostra torte nuziali, sweet table e creazioni per battesimi, lauree e compleanni a centinaia di invitati proprio nel momento del taglio torta.",
  },
  {
    code: "BAR_EXPERIENCE",
    label: "Open Bar, Cocktail Catering, Sigari & Sommelier",
    shortLabel: "Open Bar & Experience",
    groupName: "Ristoranti, Ville & Banchetto",
    filterGroup: "RISTORANTI_LOCATION",
    businessPlaceholder: "Es. Luxury Bartender & Cigar Corner",
    publicFallbackDescription: (name) =>
      `Scopri i servizi di mixology open bar, degustazione vini/distillati e angolo sigari & rum per eventi di ${name}.`,
    proValuePitch:
      "Porta i tuoi cocktail bar mobili e angoli degustazione davanti a tutti gli ospiti del party serale e ricevi preventivi diretti a 0% commissioni.",
  },

  // 2. Viaggi, Liste Nozze, Auto NCC & Ospitalità
  {
    code: "GIFT_REGISTRY_STORE",
    label: "Negozio Liste Nozze, Regali & Casa",
    shortLabel: "Liste Nozze & Regali",
    groupName: "Viaggi, Liste Nozze, Auto (NCC) & Ospitalità",
    filterGroup: "VIAGGI_AUTO_TORTE",
    businessPlaceholder: "Es. Boutique Lista Nozze, Regali & Casa",
    publicFallbackDescription: (name) =>
      `Scopri la Lista Nozze, le idee regalo, gli articoli per la casa, tavola, design e arredo proposti da ${name} su GentiLuna.`,
    proValuePitch:
      "Collega le tue Liste Nozze e proposte regalo direttamente allo spazio digitale degli sposi e fatti conoscere da tutti gli invitati di matrimoni, battesimi, lauree e anniversari.",
  },
  {
    code: "TRAVEL_AGENCY",
    label: "Agenzia di Viaggi & Luna di Miele",
    shortLabel: "Agenzia Viaggi",
    groupName: "Viaggi, Liste Nozze, Auto (NCC) & Ospitalità",
    filterGroup: "VIAGGI_AUTO_TORTE",
    businessPlaceholder: "Es. Orizzonti Viaggi & Honeymoon",
    publicFallbackDescription: (name) =>
      `Progetta la tua Luna di Miele da sogno e gestisci la lista viaggio a tappe insieme ai consulenti di ${name}.`,
    proValuePitch:
      "Offri agli sposi la Lista Viaggio di Nozze interattiva a tappe già pronta su GentiLuna e ricevi richieste da tutte le nuove coppie tra gli invitati.",
  },
  {
    code: "NCC_CARS",
    label: "NCC (Noleggio con Conducente) & Auto Matrimoni",
    shortLabel: "NCC & Auto Sposi",
    groupName: "Viaggi, Liste Nozze, Auto (NCC) & Ospitalità",
    filterGroup: "VIAGGI_AUTO_TORTE",
    businessPlaceholder: "Es. Prestige NCC & Auto Sposi d'Epoca",
    publicFallbackDescription: (name) =>
      `Scopri la flotta di auto da cerimonia, auto d'epoca, vetture di lusso e servizi NCC transfer per sposi e invitati di ${name}.`,
    proValuePitch:
      "Promuovi sia l'auto da sogno per gli sposi sia i servizi navetta/NCC per il rientro in sicurezza degli invitati direttamente dentro il portale dell'evento.",
  },
  {
    code: "HOTEL_HOSPITALITY",
    label: "Hotel, B&B, Resort & Alloggi per Invitati",
    shortLabel: "Hotel & Ospitalità",
    groupName: "Viaggi, Liste Nozze, Auto (NCC) & Ospitalità",
    filterGroup: "VIAGGI_AUTO_TORTE",
    businessPlaceholder: "Es. Relais & Boutique Hotel Bellavista",
    publicFallbackDescription: (name) =>
      `Scopri le camere, suite per la prima notte di nozze e convenzioni di soggiorno per gli invitati fuori sede presso ${name}.`,
    proValuePitch:
      "Intercetta decine di invitati fuori sede che cercano dove dormire vicino alla cerimonia e al ristorante direttamente dalla pagina ufficiale dell'evento.",
  },

  // 3. Foto, Video & Intrattenimento
  {
    code: "PHOTOGRAPHER",
    label: "Fotografo",
    shortLabel: "Fotografo",
    groupName: "Foto, Video & Intrattenimento",
    filterGroup: "FOTO_VIDEO",
    businessPlaceholder: "Es. Studio Fotografico Rossi",
    publicFallbackDescription: (name) =>
      `Scopri il portfolio fotografico, lo stile di reportage e i pacchetti dedicati agli sposi di ${name}.`,
    proValuePitch:
      "Consegna gallerie HD divise in capitoli, mostra il tuo QR Code sui tavoli e acquisisci nuovi sposi a 0% commissioni.",
  },
  {
    code: "VIDEOMAKER",
    label: "Videomaker & Drone",
    shortLabel: "Videomaker",
    groupName: "Foto, Video & Intrattenimento",
    filterGroup: "FOTO_VIDEO",
    businessPlaceholder: "Es. Cinema Wedding Film Studio",
    publicFallbackDescription: (name) =>
      `Guarda i wedding film, i trailer emozionali e le riprese aeree con drone realizzate da ${name}.`,
    proValuePitch:
      "Metti in mostra i tuoi wedding film nella vetrina ufficiale e fatti contattare dagli invitati conquistati dal tuo lavoro.",
  },
  {
    code: "MUSICIAN",
    label: "Musicista / Band Live",
    shortLabel: "Musica & Band",
    groupName: "Foto, Video & Intrattenimento",
    filterGroup: "PLANNER_MUSICA_STILE",
    businessPlaceholder: "Es. Ensemble Live Wedding Music",
    publicFallbackDescription: (name) =>
      `Ascolta il repertorio dal vivo per cerimonia, aperitivo e ricevimento proposto da ${name}.`,
    proValuePitch:
      "Chi ti ascolta dal vivo al matrimonio trova subito il tuo contatto ufficiale aprendo il QR Code sul proprio tavolo.",
  },
  {
    code: "DJ",
    label: "DJ & Service Audio/Luci",
    shortLabel: "DJ & Audio/Luci",
    groupName: "Foto, Video & Intrattenimento",
    filterGroup: "PLANNER_MUSICA_STILE",
    businessPlaceholder: "Es. Sound & Light Wedding DJ",
    publicFallbackDescription: (name) =>
      `Scopri i DJ set, gli allestimenti audio-luci architetturali e l'intrattenimento party di ${name}.`,
    proValuePitch:
      "Abbina al tuo DJ set il Live Photo Wall su proiettore GentiLuna e rendi indimenticabile ogni festa e ricevimento.",
  },
  {
    code: "PHOTO_BOOTH",
    label: "Photo Booth & Animazione",
    shortLabel: "Photo Booth & Animazione",
    groupName: "Foto, Video & Intrattenimento",
    filterGroup: "PLANNER_MUSICA_STILE",
    businessPlaceholder: "Es. Smile Mirror Photo Booth & Eventi",
    publicFallbackDescription: (name) =>
      `Scopri i servizi di photo booth, mirror booth, animazione adulti/bambini ed effetti speciali di ${name}.`,
    proValuePitch:
      "Integra l'intrattenimento in sala con la raccolta foto digitale degli ospiti e moltiplica i preventivi per feste, lauree e matrimoni.",
  },

  // 4. Regia, Fiori, Stampa, Abiti & Beauty
  {
    code: "WEDDING_PLANNER",
    label: "Wedding & Event Planner",
    shortLabel: "Wedding Planner",
    groupName: "Regia, Fiori, Partecipazioni & Stile",
    filterGroup: "PLANNER_MUSICA_STILE",
    businessPlaceholder: "Es. Atelier Eventi & Wedding Planner",
    publicFallbackDescription: (name) =>
      `Affida la regia, il design e il coordinamento completo del tuo evento all'esperienza di ${name}.`,
    proValuePitch:
      "Gestisci timeline, mappa tavoli, portale ristorante e team fornitori in un'unica cabina di regia elegante per i tuoi sposi.",
  },
  {
    code: "FLORIST",
    label: "Fiorista & Floral Designer",
    shortLabel: "Fiorista",
    groupName: "Regia, Fiori, Partecipazioni & Stile",
    filterGroup: "PLANNER_MUSICA_STILE",
    businessPlaceholder: "Es. Giardino Segreto Floral Design",
    publicFallbackDescription: (name) =>
      `Lasciati ispirare dalle scenografie floreali, bouquet e centrotavola realizzati su misura da ${name}.`,
    proValuePitch:
      "Quando gli ospiti ammirano i tuoi centrotavola e inquadrano il QR Code lì accanto, scoprono subito chi ha firmato l'allestimento.",
  },
  {
    code: "STATIONERY_FAVORS",
    label: "Tipografia, Partecipazioni & Bomboniere",
    shortLabel: "Partecipazioni & Bomboniere",
    groupName: "Regia, Fiori, Partecipazioni & Stile",
    filterGroup: "PLANNER_MUSICA_STILE",
    businessPlaceholder: "Es. Carta d'Autore Partecipazioni & Bomboniere",
    publicFallbackDescription: (name) =>
      `Scopri i coordinati grafici, le partecipazioni personalizzate, i tableau e le bomboniere di ${name}.`,
    proValuePitch:
      "Offri coordinati cartacei con QR Code GentiLuna integrato (inviti, menù, segnaposto) aumentando il valore medio di ogni ordine.",
  },
  {
    code: "ATELIER_JEWELRY",
    label: "Atelier Sposi, Abiti & Gioielleria Fedi",
    shortLabel: "Atelier & Fedi",
    groupName: "Regia, Fiori, Partecipazioni & Stile",
    filterGroup: "PLANNER_MUSICA_STILE",
    businessPlaceholder: "Es. Maison Sposa & Gioielli",
    publicFallbackDescription: (name) =>
      `Scopri le collezioni abiti sposa, sposo, cerimonia e le fedi nuziali proposte da ${name}.`,
    proValuePitch:
      "Raggiungi le coppie appena fidanzate nella tua provincia e mostra in vetrina le tue collezioni e creazioni sartoriali o orafe.",
  },
  {
    code: "MAKEUP_ARTIST",
    label: "Make-up Artist Bridal",
    shortLabel: "Make-up Artist",
    groupName: "Regia, Fiori, Partecipazioni & Stile",
    filterGroup: "PLANNER_MUSICA_STILE",
    businessPlaceholder: "Es. Giulia Bridal Make-up",
    publicFallbackDescription: (name) =>
      `Scopri i servizi di trucco sposa e cerimonia a lunga tenuta firmati da ${name}.`,
    proValuePitch:
      "Fatti trovare dalle spose della tua zona e ricevi richieste per prove trucco e pacchetti bridal.",
  },
  {
    code: "HAIR_STYLIST",
    label: "Hair Stylist Bridal",
    shortLabel: "Hair Stylist",
    groupName: "Regia, Fiori, Partecipazioni & Stile",
    filterGroup: "PLANNER_MUSICA_STILE",
    businessPlaceholder: "Es. Atelier Capelli Sposa",
    publicFallbackDescription: (name) =>
      `Scopri le acconciature sposa e i servizi hair styling per cerimonie di ${name}.`,
    proValuePitch:
      "Mostra il tuo portfolio acconciature sposa e ricevi contatti diretti senza pagare commissioni.",
  },
  {
    code: "OTHER",
    label: "Professionista Eventi",
    shortLabel: "Partner Eventi",
    groupName: "Regia, Fiori, Partecipazioni & Stile",
    filterGroup: "PLANNER_MUSICA_STILE",
    businessPlaceholder: "Es. Nome della tua Attività",
    publicFallbackDescription: (name) =>
      `Scopri i servizi esclusivi dedicati a matrimoni ed eventi offerti da ${name} su GentiLuna.`,
    proValuePitch:
      "Entra nella rete ufficiale GentiLuna con la tua vetrina verificata, QR Code personale e contatti diretti a 0% commissioni.",
  },
];

export const PRO_CATEGORY_MAP: Record<string, ProCategoryMeta> = Object.fromEntries(
  PRO_CATEGORIES.map((c) => [c.code, c])
);

export const PRO_CATEGORY_GROUPS: { groupName: string; items: ProCategoryMeta[] }[] = [
  "Ristoranti, Ville & Banchetto",
  "Viaggi, Liste Nozze, Auto (NCC) & Ospitalità",
  "Foto, Video & Intrattenimento",
  "Regia, Fiori, Partecipazioni & Stile",
].map((groupName) => ({
  groupName,
  items: PRO_CATEGORIES.filter((c) => c.groupName === groupName),
}));

export function getProCategoryMeta(code?: string | null): ProCategoryMeta {
  if (!code) return PRO_CATEGORY_MAP.OTHER;
  return PRO_CATEGORY_MAP[code.toUpperCase()] || PRO_CATEGORY_MAP.OTHER;
}

export function getProCategoryLabel(code?: string | null): string {
  return getProCategoryMeta(code).label;
}

export function getProFilterGroup(code?: string | null): ProFilterGroup {
  return getProCategoryMeta(code).filterGroup;
}
