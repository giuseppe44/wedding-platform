export type BlogAudience = "SPOSI" | "PROFESSIONISTI" | "TUTTI";

export interface BlogSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  category: string;
  audience: BlogAudience;
  readTime: string;
  publishedAt: string;
  image: string;
  imageAlt: string;
  excerpt: string;
  sections: BlogSection[];
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "portale-ristorante-matrimonio-gestione-tavoli-allergie-intolleranze-live",
    title: "Portale Ristorante Matrimonio: come inviare tavoli, celiaci e intolleranze alla cucina in tempo reale",
    seoTitle: "Portale Ristorante Matrimonio: Tavoli e Allergie Live | GentiLuna",
    metaDescription:
      "Basta fogli Excel e telefonate dell'ultimo minuto prima del ricevimento: scopri il Portale Ristorante Live di GentiLuna per condividere tavoli, allergie, celiaci e menù bimbi tra sposi, sala e cucina.",
    keywords: [
      "portale ristorante matrimonio",
      "gestione allergie matrimonio ristorante",
      "lista tavoli matrimonio cucina",
      "software sale ricevimenti matrimoni",
      "intolleranze invitati matrimonio",
    ],
    category: "Ristoranti & Location",
    audience: "TUTTI",
    readTime: "5 min",
    publishedAt: "2026-11-23",
    image: "/blog/16-portale-ristorante-tavoli-allergie.jpg",
    imageAlt: "Terrazza di ristorante italiano per matrimoni al tramonto con tavoli rotondi apparecchiati e maitre con tablet regia sala",
    excerpt:
      "Negli ultimi dieci giorni prima del banchetto ogni cambio posto rischia di mandare in tilt sala e cucina: ecco come il link protetto per il ristorante azzera gli errori e valorizza la location.",
    sections: [
      {
        heading: "Il vero problema degli ultimi giorni prima di un ricevimento",
        paragraphs: [
          "Chi dirige una sala ricevimenti, una villa o un ristorante per cerimonie conosce bene la scena: fogli stampati corretti a penna, messaggi vocali sugli ospiti celiaci o intolleranti al lattosio e cambi di tavolo comunicati la sera prima dell'evento.",
          "Anche per gli sposi dover ricopiare a mano tre volte le stesse informazioni tra RSVP, tableau e lista per lo chef diventa fonte di stress inutile proprio alla vigilia della festa.",
        ],
      },
      {
        heading: "Un unico link protetto e sincronizzato per Direttore di Sala e Chef",
        paragraphs: [
          "Su GentiLuna gli sposi generano dalla propria dashboard un Link Ristorante dedicato e firmato crittograficamente, da inviare su WhatsApp o via email al responsabile del banchetto senza obbligarlo a creare account complicati.",
        ],
        bullets: [
          "Riepilogo automatico in alto di celiaci, intolleranze al lattosio, vegetariani, vegani, allergie gravi, menù bambini e seggioloni.",
          "Dettaglio tavolo per tavolo sempre aggiornato in tempo reale a ogni modifica degli sposi.",
          "Modalità stampa pulita in un clic per consegnare il foglio ufficiale direttamente alla brigata di cucina.",
          "Vetrina ufficiale del Ristorante collegata all'evento e visibile a tutti i 150 invitati presenti in sala.",
        ],
      },
      {
        heading: "Perché conviene a Ristoranti, Ville e Sale per tutte le cerimonie dell'anno",
        paragraphs: [
          "Oltre ai matrimoni estivi, la stessa regia funziona per battesimi, comunioni, feste di laurea, diciottesimi e anniversari: il ristorante lavora meglio, può offrire il Live Photo Wall sugli schermi di sala e riceve nuovi contatti diretti a 0% commissioni partendo anche dalla Vetrina Base Gratuita.",
        ],
      },
    ],
    ctaLabel: "Scopri il Programma Ristoranti & Location",
    ctaHref: "/partner#ristoranti",
    secondaryCtaLabel: "Crea Vetrina Ristorante Gratis",
    secondaryCtaHref: "/login?role=PHOTOGRAPHER&mode=REGISTER&category=RESTAURANT",
  },
  {
    slug: "agenzia-viaggi-lista-nozze-luna-di-miele-online-a-tappe",
    title: "Lista Viaggio di Nozze a tappe e Agenzie di Viaggi: come unire regali degli invitati e documenti in un solo spazio",
    seoTitle: "Lista Viaggio di Nozze Online per Sposi e Agenzie Viaggi | GentiLuna",
    metaDescription:
      "Come creare una Lista Luna di Miele suddivisa in tappe emozionanti su GentiLuna e perché le Agenzie di Viaggi trovano nuovi clienti sposi senza commissioni.",
    keywords: [
      "lista viaggio di nozze online",
      "agenzia viaggi matrimonio lista nozze",
      "luna di miele a tappe",
      "regalo viaggio di nozze invitati",
    ],
    category: "Viaggi di Nozze",
    audience: "TUTTI",
    readTime: "4 min",
    publishedAt: "2026-11-23",
    image: "/blog/17-agenzia-viaggi-luna-di-miele.jpg",
    imageAlt: "Scrivania di agenzia viaggi boutique italiana con passaporti in lino, mappamondo in ottone e cartoline tropicali",
    excerpt:
      "Dalle tappe dell'itinerario ai voucher di viaggio custoditi in un'area riservata: il modo più elegante per raccontare la Luna di Miele agli ospiti e valorizzare l'Agenzia di Viaggi.",
    sections: [
      {
        heading: "Perché una lista viaggio a tappe coinvolge molto più di un semplice IBAN freddo",
        paragraphs: [
          "Gli invitati amano sapere che il loro pensiero si trasformerà in una cena sull'oceano, in un safari all'alba o in un volo verso il Giappone. Su GentiLuna la sezione Lista Nozze permette di raccontare ogni tappa dell'itinerario con titolo, data, luogo, obiettivo e messaggio di ringraziamento.",
          "Il contributo arriva direttamente agli sposi o secondo le modalità concordate con la propria agenzia di fiducia, senza trattenute percentuali da parte della piattaforma.",
        ],
      },
      {
        heading: "Un vantaggio enorme per le Agenzie di Viaggi Partner",
        paragraphs: [
          "Molte agenzie viaggi perdono ore per realizzare mini-siti artigianali per ogni coppia di sposi. Entrando nella rete GentiLuna (a partire dalla Vetrina Gratuita), l'agenzia offre un portale di livello luxury già pronto e ottiene visibilità diretta davanti a tutti gli invitati del matrimonio.",
        ],
        bullets: [
          "Sezione Documenti di Viaggio dedicata per raccogliere biglietti, voucher e itinerari della coppia.",
          "Capitolo 'Luna di Miele' che gli sposi possono riaprire al rientro per condividere i ricordi del viaggio.",
          "Presenza del marchio dell'Agenzia Viaggi tra i Partner Ufficiali dell'evento davanti a decine di nuove coppie.",
        ],
      },
    ],
    ctaLabel: "Programma per Agenzie di Viaggi",
    ctaHref: "/partner#categorie-partner",
    secondaryCtaLabel: "Esplora la Directory Fornitori",
    secondaryCtaHref: "/fornitori",
  },
  {
    slug: "torta-nuziale-pasticceria-cake-design-sweet-table-matrimonio",
    title: "Torta Nuziale, Pasticcerie e Cake Design: come brillare al taglio torta e ricevere ordini tutto l'anno",
    seoTitle: "Pasticcerie Torte Matrimonio, Cake Design e Sweet Table | GentiLuna",
    metaDescription:
      "Guida per sposi e pasticcerie artigianali: scelta della wedding cake, gestione intolleranze alimentari per il dessert e visibilità digitale per negozi di torte e cake designer.",
    keywords: [
      "pasticceria torte matrimonio",
      "cake design torta nuziale",
      "negozio torte cerimonie",
      "sweet table confettata matrimonio",
      "torta matrimonio senza glutine lattosio",
    ],
    category: "Pasticcerie & Cake Design",
    audience: "TUTTI",
    readTime: "4 min",
    publishedAt: "2026-11-22",
    image: "/blog/18-pasticceria-torta-nuziale-cake-design.jpg",
    imageAlt: "Torta nuziale italiana a tre piani con foglia oro, rose cipria e sweet table con confetti in giardino storico",
    excerpt:
      "Il taglio della torta è l'istante più fotografato dell'intero ricevimento: ecco come pasticcerie e negozi di torte trasformano quell'emozione in nuovi clienti per nozze, battesimi e lauree.",
    sections: [
      {
        heading: "Il momento clou della serata (e l'importanza delle intolleranze)",
        paragraphs: [
          "Che si tratti di una millefoglie espressa montata davanti agli ospiti o di una wedding cake monumentale a più piani abbinata a confettata e sweet table, il dessert chiude il banchetto lasciando il ricordo più dolce.",
          "Grazie alla raccolta RSVP con note alimentari di GentiLuna, sposi e pasticceri sanno in anticipo quante monoporzioni senza glutine, senza lattosio o vegane preparare, facendo sentire coccolato ogni singolo invitato.",
        ],
      },
      {
        heading: "Come una Pasticceria o Cake Designer moltiplica le richieste con GentiLuna",
        paragraphs: [
          "Durante il taglio torta tutti gli ospiti hanno lo smartphone in mano per caricare le foto tramite il QR Code dell'evento. Essere collegati come Pasticceria Partner significa far scoprire immediatamente il proprio laboratorio a 150 persone della stessa zona.",
        ],
        bullets: [
          "Vetrina Base Gratuita con galleria fotografica delle tue migliori creazioni, listino indicativo e richiesta preventivo.",
          "Clienti ricorrenti 12 mesi l'anno: chi scopre la tua torta a un matrimonio ti ricontatta per battesimi, comunioni, lauree e compleanni.",
          "Zero commissioni sugli ordini ricevuti tramite la piattaforma.",
        ],
      },
    ],
    ctaLabel: "Iscrivi Gratis la tua Pasticceria",
    ctaHref: "/login?role=PHOTOGRAPHER&mode=REGISTER&category=PASTRY_CAKE",
    secondaryCtaLabel: "Scopri il Programma Partner",
    secondaryCtaHref: "/partner",
  },
  {
    slug: "noleggio-auto-matrimonio-ncc-conducente-navetta-invitati",
    title: "Auto per il Matrimonio e NCC (Noleggio con Conducente): eleganza per gli sposi e rientro sicuro per gli ospiti",
    seoTitle: "NCC e Auto per Matrimoni: Auto d'Epoca e Navette Ospiti | GentiLuna",
    metaDescription:
      "Come organizzare l'auto degli sposi e il servizio navetta NCC per gli invitati: consigli pratici sulle tempistiche e vantaggi della vetrina GentiLuna per autonoleggi con conducente.",
    keywords: [
      "ncc matrimonio noleggio con conducente",
      "noleggio auto matrimonio epoca",
      "navetta invitati matrimonio",
      "transfer ospiti matrimonio sicuro",
    ],
    category: "NCC & Auto Sposi",
    audience: "TUTTI",
    readTime: "5 min",
    publishedAt: "2026-11-22",
    image: "/blog/19-ncc-auto-sposi-navetta-invitati.jpg",
    imageAlt: "Auto d'epoca decappottabile color crema e berlina NCC di lusso con autista lungo un viale di cipressi in Toscana",
    excerpt:
      "Dall'arrivo scenografico della sposa al servizio transfer notturno per far brindare gli amici senza pensieri: perché l'NCC è oggi uno dei servizi più apprezzati nei matrimoni moderni.",
    sections: [
      {
        heading: "Due esigenze preziose in un solo grande giorno",
        paragraphs: [
          "Quando si parla di auto per matrimoni si pensa subito alla vettura d'epoca, sportiva o d'alta rappresentanza che accompagna gli sposi dalla casa alla cerimonia e poi allo shooting fotografico.",
          "Oggi però sempre più coppie affiancano all'auto nuziale un servizio van o navetta NCC dedicato agli invitati: comodissimo per chi arriva in aeroporto o treno e fondamentale a fine open bar per rientrare in hotel in totale sicurezza.",
        ],
      },
      {
        heading: "Come comunicare orari navette sul sito evento (e far crescere la tua flotta NCC)",
        paragraphs: [
          "All'interno del portale evento GentiLuna gli sposi possono indicare orari e punti di ritrovo delle navette nelle informazioni utili, collegando direttamente la vetrina dell'operatore NCC ufficiale.",
        ],
        bullets: [
          "Per gli operatori NCC e Autonoleggi Cerimonia: Vetrina Gratuita nella directory provinciale con foto della flotta e servizi offerti.",
          "Richieste dirette anche dagli invitati fuori sede che necessitano di transfer privati da aeroporti, stazioni e hotel.",
          "Zero intermediari e possibilità di upgrade al piano VIP Partner a soli 49€/1° anno.",
        ],
      },
    ],
    ctaLabel: "Iscrivi Gratis la tua Flotta NCC / Auto",
    ctaHref: "/login?role=PHOTOGRAPHER&mode=REGISTER&category=NCC_CARS",
    secondaryCtaLabel: "Cerca Auto & NCC in Directory",
    secondaryCtaHref: "/fornitori",
  },
  {
    slug: "partecipazioni-matrimonio-con-qr-code-tipografie-bomboniere",
    title: "Partecipazioni, Menù e Segnaposto con QR Code: quando la tipografia artigianale incontra il digitale",
    seoTitle: "Partecipazioni Matrimonio con QR Code e Tipografie | GentiLuna",
    metaDescription:
      "Carta pregiata e tecnologia: come integrare il QR Code di GentiLuna su partecipazioni, tableau e cavalierini da tavolo e nuove opportunità per tipografie e negozi di bomboniere.",
    keywords: [
      "partecipazioni matrimonio con qr code",
      "cartoncino qr code foto matrimonio",
      "tipografia partecipazioni matrimonio",
      "bomboniere e coordinato grafico nozze",
    ],
    category: "Partecipazioni & Stile",
    audience: "TUTTI",
    readTime: "4 min",
    publishedAt: "2026-11-21",
    image: "/blog/20-partecipazioni-qr-code-tipografia.jpg",
    imageAlt: "Partecipazioni di matrimonio in carta cotone italiana con ceralacca oro, nastri di seta, bomboniere e cartoncino QR Code",
    excerpt:
      "Il digitale non sostituisce la magia della carta d'autore: la esalta! Scopri come un piccolo QR Code trasforma inviti, menù e bomboniere in un ricordo vivo.",
    sections: [
      {
        heading: "L'eleganza della carta cotone + la praticità dell'aggiornamento istantaneo",
        paragraphs: [
          "Consegnare a mano una partecipazione su carta pregiata con sigillo in ceralacca resta un rito insostituibile. Aggiungere un discreto talloncino con il QR Code dello spazio GentiLuna permette però agli invitati di confermare l'RSVP in 10 secondi, aprire le mappe GPS e scoprire eventuali aggiornamenti d'orario senza appesantire la grafica dell'invito.",
        ],
      },
      {
        heading: "Un'opportunità d'oro per Tipografie, Grafici e Negozi di Bomboniere",
        paragraphs: [
          "Le tipografie e gli studi grafici sono spesso il primo fornitore scelto dalla coppia. Proporre il coordinato cartaceo completo per il giorno dell'evento aumenta lo scontrino medio e offre un servizio memorabile.",
        ],
        bullets: [
          "Cartoncini da tavolo e menù con il QR Code per la raccolta foto live degli invitati.",
          "Tag per confetti e bomboniere che rimandano alla galleria ringraziamenti dopo le nozze.",
          "Vetrina Gratuita per Tipografie e Bomboniere su GentiLuna per farsi trovare dalle nuove coppie della propria città.",
        ],
      },
    ],
    ctaLabel: "Scopri i Vantaggi per Tipografie & Partner",
    ctaHref: "/partner",
    secondaryCtaLabel: "Funzioni per Sposi & Invitati",
    secondaryCtaHref: "/funzioni-sposi",
  },
  {
    slug: "portale-digitale-battesimo-comunione-laurea-diciottesimo-anniversario",
    title: "Oltre il Matrimonio: come usare GentiLuna per Battesimi, Comunioni, Lauree, Diciottesimi e Nozze d'Oro",
    seoTitle: "Sito e Foto QR Code per Battesimo, Laurea, Comunione e Anniversari | GentiLuna",
    metaDescription:
      "Un unico spazio digitale per tutti i capitoli della famiglia: inviti, gestione tavoli ristorante, allergie e raccolta foto con QR Code per battesimi, comunioni, lauree e anniversari.",
    keywords: [
      "raccolta foto battesimo qr code",
      "organizzare festa di laurea tavoli foto",
      "invito digitale comunione e battesimo",
      "festa anniversario nozze d oro foto invitati",
    ],
    category: "Capitoli della Vita",
    audience: "SPOSI",
    readTime: "4 min",
    publishedAt: "2026-11-20",
    image: "/blog/21-eventi-battesimo-laurea-anniversari.jpg",
    imageAlt: "Tavolata italiana di festa in uliveto per battesimo, laurea e anniversario con brindisi tra generazioni",
    excerpt:
      "La storia di una famiglia continua: dal primo sorriso di un figlio alla corona d'alloro fino alle Nozze d'Argento e d'Oro, custoditi capitolo dopo capitolo.",
    sections: [
      {
        heading: "Ogni traguardo merita di non disperdersi nelle chat",
        paragraphs: [
          "Chi ha provato la comodità del QR Code sui tavoli e della mappa posti durante il matrimonio ci chiede subito la stessa esperienza per il battesimo del primo figlio, per una festa di laurea, un diciottesimo o i 25 e 50 anni di matrimonio dei genitori.",
          "Su GentiLuna non devi ricominciare da zero: puoi aggiungere nuovi Capitoli alla tua storia familiare scegliendo chi invitare a ciascun evento.",
        ],
      },
      {
        heading: "Ideale anche per Ristoranti, Pasticcerie e Fotografi in tutte le stagioni",
        paragraphs: [
          "Mentre i matrimoni si concentrano nei mesi caldi, lauree, battesimi, comunioni e compleanni animano ristoranti, pasticcerie e studi fotografici per tutti i 12 mesi dell'anno.",
        ],
        bullets: [
          "Invito digitale condivisibile su WhatsApp con orari, mappa location e conferma presenze.",
          "Gestione tavoli e intolleranze pronta per il ristorante anche nei pranzi di battesimo e comunione.",
          "Galleria privata dove nonni, zii e amici caricano e rivedono foto e dediche in alta qualità.",
        ],
      },
    ],
    ctaLabel: "Crea lo Spazio per il tuo Evento",
    ctaHref: "/sposi",
    secondaryCtaLabel: "Vedi i Piani Sposi & Famiglia",
    secondaryCtaHref: "/prezzi",
  },
  {
    slug: "vetrina-gratuita-fornitori-matrimonio-zero-commissioni-abbonamenti-pro",
    title: "Vetrina Gratuita vs Piani PRO per Ristoranti e Fornitori Eventi: come acquisire clienti a 0% commissioni",
    seoTitle: "Vetrina Gratuita Fornitori Matrimonio e Ristoranti 0% Commissioni | GentiLuna",
    metaDescription:
      "Come funziona l'iscrizione per Ristoranti, Fotografi, Agenzie Viaggi, Pasticcerie e NCC su GentiLuna: Vetrina Base Gratuita subito attiva e upgrade facoltativi ai livelli PRO.",
    keywords: [
      "vetrina gratuita fornitori matrimonio",
      "portale matrimonio senza commissioni",
      "iscrivere ristorante portale matrimoni gratis",
      "pubblicita fornitori eventi italia",
    ],
    category: "Guida Partner B2B",
    audience: "PROFESSIONISTI",
    readTime: "5 min",
    publishedAt: "2026-11-19",
    image: "/blog/22-vetrina-gratuita-partner-eventi.jpg",
    imageAlt: "Chef, floral designer e wedding planner italiani al lavoro intorno a un tavolo luminoso con moodboard e portatile",
    excerpt:
      "Nessun vincolo d'ingresso e nessuna percentuale sui tuoi lavori: parti gratis con la Vetrina Verificata nella directory nazionale e scegli tu se e quando passare ai piani PRO.",
    sections: [
      {
        heading: "Perché abbiamo scelto un ingresso gratuito trasparente",
        paragraphs: [
          "I portali tradizionali chiedono abbonamenti annuali di migliaia di euro prima ancora di aver ricevuto una sola richiesta reale. Su GentiLuna ribaltiamo il paradigma: ogni professionista serio — dal ristorante alla pasticceria, dall'agenzia viaggi all'NCC fino al fotografo — può registrarsi gratuitamente e compilare subito la propria Vetrina Base.",
        ],
      },
      {
        heading: "Cosa include la Vetrina Free e cosa sbloccano i Piani PRO",
        paragraphs: [
          "La crescita avviene per gradi chiari e sostenibili, sempre con la regola aurea dello 0% di commissioni sui preventivi firmati.",
        ],
        bullets: [
          "Vetrina Base Free (0€): presenza nella directory ufficiale /fornitori, pagina pubblica /pro/tuo-nome, foto copertina/portfolio, fino a 3 servizi e modulo richiesta preventivo.",
          "Founders Club PRO (49,00 € per 12 mesi per i primi 50 iscritti, poi piani Entry 120€ e PRO 299€): badge VIP Partner, servizi illimitati, spazi evento illimitati, Live Chat e acquisizione lead via QR Code in sala.",
          "Diamond White-Label (449,00 €/anno): pensato per Ristoranti, Location, Agenzie Viaggi e Wedding Planner che desiderano pacchetti sposi inclusi da offrire ai propri clienti col proprio logo.",
          "Pagamenti rapidi con Carta, Apple Pay e Google Pay su Stripe, oppure tramite Bonifico Aziendale con Fattura Elettronica P.IVA.",
        ],
      },
    ],
    ctaLabel: "Crea Ora la tua Vetrina Gratuita",
    ctaHref: "/partner#attiva-ora",
    secondaryCtaLabel: "Confronta tutti i Livelli PRO",
    secondaryCtaHref: "/professionisti#pricing",
  },
  {
    slug: "come-raccogliere-foto-invitati-matrimonio-qr-code-senza-app",
    title: "Come raccogliere tutte le foto degli invitati al matrimonio con un QR Code (senza app)",
    seoTitle: "Foto Invitati Matrimonio con QR Code Senza App | GentiLuna",
    metaDescription:
      "Scopri come raccogliere foto e video spontanei di amici e parenti il giorno delle nozze usando un semplice QR Code sui tavoli, senza app da scaricare e con galleria moderata.",
    keywords: [
      "foto matrimonio qr code",
      "raccogliere foto invitati matrimonio",
      "condivisione foto matrimonio senza app",
      "qr code tavoli matrimonio",
    ],
    category: "Sposi & Invitati",
    audience: "SPOSI",
    readTime: "4 min",
    publishedAt: "2026-11-18",
    image: "/press/GentiLuna_Immagine_6.jpg",
    imageAlt: "QR Code GentiLuna sui tavoli che invia foto live sullo smartphone e sul Live Wall",
    excerpt:
      "Dimentica le chat di WhatsApp intasate e le immagini compresse: con il QR Code di GentiLuna ogni ospite inquadra e invia i propri scatti in qualità originale dal browser dello smartphone.",
    sections: [
      {
        heading: "Perché le solite chat rovinano i ricordi spontanei delle nozze",
        paragraphs: [
          "Durante il ricevimento gli amici scattano centinaia di foto spontanee, video divertenti dei brindisi e retroscena che neppure il miglior reportage riesce sempre a intercettare. Troppo spesso però quei file si perdono nei telefoni degli invitati oppure arrivano giorni dopo su WhatsApp compressi e disordinati.",
          "Chiedere a cento invitati di scaricare un'app dedicata crea subito attrito: tra password dimenticate e memoria piena sul telefono, moltissimi rinunciano prima ancora di cominciare.",
        ],
      },
      {
        heading: "La soluzione GentiLuna: QR Code da tavolo e zero app da installare",
        paragraphs: [
          "All'interno del tuo spazio matrimonio su GentiLuna trovi già pronto un QR Code univoco da scaricare in alta risoluzione e stampare sui segnatavolo, sui menu o su piccoli cartoncini segnaposto.",
          "Quando un invitato inquadra il codice con la fotocamera del cellulare, si apre direttamente una pagina web leggera e veloce dove può selezionare foto e video dalla galleria e inviarli subito al tuo spazio evento.",
        ],
        bullets: [
          "Nessuna applicazione da scaricare dagli store e nessuna registrazione complessa per gli ospiti.",
          "Moderazione attiva di default: ogni contenuto resta in attesa fino alla tua approvazione.",
          "Download completo dell'intero album in formato ZIP per conservare tutti gli scatti al sicuro.",
        ],
      },
      {
        heading: "Dove posizionare il QR Code durante la festa per ottenere più scatti",
        paragraphs: [
          "Il momento migliore è l'aperitivo e la cena: inserire il QR Code vicino ai centrotavola, al tableau o sul banco della confettata incoraggia gli ospiti mentre aspettano le portate. Puoi anche inviare il link diretto del capitolo tramite i pulsanti WhatsApp integrati nella tua area gestione.",
        ],
      },
    ],
    ctaLabel: "Scopri le Funzioni per Sposi",
    ctaHref: "/funzioni-sposi",
    secondaryCtaLabel: "Crea gratis il tuo Spazio",
    secondaryCtaHref: "/login?role=COUPLE&mode=REGISTER",
  },
  {
    slug: "sito-matrimonio-personalizzato-cosa-inserire-per-gli-ospiti",
    title: "Sito matrimonio personalizzato: cosa inserire per guidare davvero gli ospiti",
    seoTitle: "Sito Matrimonio Personalizzato: Cosa Inserire | Guida GentiLuna",
    metaDescription:
      "Guida pratica ai contenuti essenziali per il sito web delle nozze: indirizzo personalizzato, busta animata d'invito, mappe cerimonia e ricevimento, orari e dress code.",
    keywords: [
      "sito matrimonio personalizzato",
      "sito web nozze cosa scrivere",
      "invito matrimonio digitale busta animata",
      "informazioni matrimonio invitati",
    ],
    category: "Organizzazione Nozze",
    audience: "SPOSI",
    readTime: "5 min",
    publishedAt: "2026-11-17",
    image: "/press/GentiLuna_Immagine_9.jpg",
    imageAlt: "Sito matrimonio GentiLuna su smartphone con Tableau, Galleria HD, QR Code Live e Timeline Evento",
    excerpt:
      "Un sito matrimonio ben strutturato azzera le telefonate dell'ultimo minuto e accoglie i tuoi invitati con un'apertura scenografica a busta sigillata.",
    sections: [
      {
        heading: "Prima impressione: link leggibile e apertura a busta sigillata",
        paragraphs: [
          "Su GentiLuna ogni coppia riceve automaticamente un indirizzo pulito basato sui propri nomi (ad esempio /w/nome-e-nome-nozze), facile da condividere in un messaggio WhatsApp o da scrivere sulla partecipazione cartacea.",
          "Quando i tuoi invitati aprono la pagina principale vengono accolti da una busta elegante con il vostro monogramma in sigillo e, subito dopo, dal grattino interattivo sulla data e dal vostro messaggio di benvenuto.",
        ],
      },
      {
        heading: "Le informazioni pratiche che non devono mai mancare",
        paragraphs: [
          "Oltre all'emozione estetica, il sito risponde in anticipo a tutte le domande logistiche dei parenti che arrivano da fuori città.",
        ],
        bullets: [
          "Luoghi esatti di preparazione, cerimonia e ricevimento con città, indirizzo e note parcheggio.",
          "Programma della giornata con gli orari delle fasi principali (rito, aperitivo, cena, taglio torta).",
          "Indicazioni su eventuale dress code e informazioni utili su navette o alloggi nei dintorni.",
        ],
      },
      {
        heading: "Controllo completo e aggiornamenti istantanei",
        paragraphs: [
          "Se cambia l'orario della messa o aggiungi un'indicazione sul parcheggio della villa, ti basta modificare il dato dalla tua Area di Gestione: l'aggiornamento è immediato per chiunque apra il sito, senza dover ristampare nulla.",
        ],
      },
    ],
    ctaLabel: "Vedi le Funzioni Sposi & Eventi",
    ctaHref: "/funzioni-sposi",
    secondaryCtaLabel: "Confronta i Piani",
    secondaryCtaHref: "/prezzi",
  },
  {
    slug: "gestione-rsvp-matrimonio-allergie-intolleranze-invitati",
    title: "Gestione RSVP matrimonio: come raccogliere conferme, allergie e scelte menù senza errori",
    seoTitle: "Gestione RSVP Matrimonio, Allergie e Menu Invitati | GentiLuna",
    metaDescription:
      "Organizza al meglio la lista invitati del matrimonio: link RSVP personali, conferma presenze, menu bambini o vegetariani e segnalazione allergie e intolleranze per il catering.",
    keywords: [
      "gestione rsvp matrimonio",
      "conferma presenza matrimonio online",
      "allergie intolleranze invitati matrimonio",
      "lista invitati digitale nozze",
    ],
    category: "Organizzazione Nozze",
    audience: "SPOSI",
    readTime: "4 min",
    publishedAt: "2026-11-16",
    image: "/press/GentiLuna_Immagine_8.jpg",
    imageAlt: "Gestione RSVP Ospiti, Intolleranze Alimentari, Lista Ospiti e Tableau Tavoli su GentiLuna",
    excerpt:
      "Tenere traccia di chi partecipa, chi porta un accompagnatore e quali ospiti hanno celiachia o intolleranze diventa semplice grazie ai link RSVP personali e all'export ordinato.",
    sections: [
      {
        heading: "Basta fogli Excel disallineati a poche settimane dal sì",
        paragraphs: [
          "Raccogliere le risposte a voce, tra messaggi privati, telefonate ai genitori e chat sparse espone al rischio di dimenticare conferme importanti o segnalazioni alimentari delicate.",
          "In GentiLuna l'elenco invitati convive nello stesso pannello dei tavoli: per ogni ospite o nucleo puoi generare un link RSVP individuale da inviare su WhatsApp.",
        ],
      },
      {
        heading: "Allergie, intolleranze e menù speciali sempre visibili",
        paragraphs: [
          "Attraverso la pagina RSVP dedicata, l'invitato conferma o declina in pochi secondi e può indicare esigenze alimentari specifiche (senza glutine, lattosio, menù vegetariano, vegano o menù bambini).",
        ],
        bullets: [
          "Stato presenze aggiornato in tempo reale nella tua area privata.",
          "Riepilogo chiaro delle note alimentari da condividere con catering e sala.",
          "Possibilità di esportare i dati degli invitati per consegnarli al ristorante senza trascrizioni manuali.",
        ],
      },
      {
        heading: "Un consiglio pratico per il giorno del ricevimento",
        paragraphs: [
          "Ricorda sempre agli invitati con allergie severe di confermare comunque al personale di sala i propri piatti: la raccolta digitale aiuta te e la location a pianificare con largo anticipo ogni alternativa di cucina.",
        ],
      },
    ],
    ctaLabel: "Scopri come funziona GentiLuna",
    ctaHref: "/funzioni-sposi",
    secondaryCtaLabel: "Inizia il tuo Spazio Evento",
    secondaryCtaHref: "/login?role=COUPLE&mode=REGISTER",
  },
  {
    slug: "tableau-de-mariage-digitale-organizzare-tavoli-nozze",
    title: "Tableau de Mariage digitale: come progettare i tavoli ed evitare code all'ingresso della sala",
    seoTitle: "Tableau de Mariage Digitale e Mappa Tavoli Matrimonio | GentiLuna",
    metaDescription:
      "Scopri come creare i tavoli rotondi o rettangolari, assegnare gli invitati con un clic, esportare il riepilogo per la location e permettere agli ospiti di trovare il proprio posto online.",
    keywords: [
      "tableau de mariage digitale",
      "mappa tavoli matrimonio online",
      "disposizione tavoli nozze software",
      "cerca tavolo matrimonio invitati",
    ],
    category: "Sposi & Invitati",
    audience: "SPOSI",
    readTime: "4 min",
    publishedAt: "2026-11-15",
    image: "/press/GentiLuna_Immagine_4.jpg",
    imageAlt: "Editor Tableau Tavoli Interattivo, Conferme Ospiti e Galleria QR Live su GentiLuna",
    excerpt:
      "Gestisci tavoli rotondi o imperiali in dashboard e attiva, quando vuoi tu, la ricerca istantanea del tavolo dal sito pubblico degli ospiti.",
    sections: [
      {
        heading: "Costruire la disposizione della sala senza impazzire coi post-it",
        paragraphs: [
          "Ogni cambiamento dell'ultima settimana obbliga spesso a spostare decine di segnaposto. Con l'editor di Invitati & Tavoli presente nei capitoli GentiLuna crei i tavoli con nome personalizzato, capienza e forma, collegando ogni ospite confermato.",
          "Se qualcuno cambia compagno di tavolo o arriva un ospite in più, sposti l'assegnazione in un attimo mantenendo sempre sotto controllo il numero di posti occupati rispetto alla capienza.",
        ],
      },
      {
        heading: "Ricerca posto dal telefono per gli invitati e controllo privacy",
        paragraphs: [
          "Una delle funzioni più apprezzate dagli ospiti è la pagina di ricerca tavolo integrata nel tuo sito pubblico: ogni invitato può digitare il proprio nome e vedere subito a quale tavolo è assegnato, evitando affollamenti davanti al tableau fisico.",
        ],
        bullets: [
          "Sei tu a decidere dalle impostazioni se e quando rendere visibile il tableau sul sito pubblico.",
          "Esportazione ordinata della lista tavoli per il maître di sala e il fiorista.",
        ],
      },
    ],
    ctaLabel: "Esplora gli Strumenti Sposi",
    ctaHref: "/funzioni-sposi",
    secondaryCtaLabel: "Guarda i Piani disponibili",
    secondaryCtaHref: "/prezzi",
  },
  {
    slug: "proiezione-foto-matrimonio-live-in-sala-gentiluna",
    title: "Proiezione foto dal vivo durante il ricevimento: come stupire gli ospiti con GentiLuna LIVE",
    seoTitle: "Proiezione Foto Matrimonio Live in Sala con QR Code | GentiLuna",
    metaDescription:
      "Trasforma uno schermo o un proiettore in sala in un muro fotografico dinamico: le foto e le dediche approvate degli ospiti appaiono in diretta durante la festa.",
    keywords: [
      "proiezione foto matrimonio live",
      "live photo wall ricevimento matrimonio",
      "schermo foto invitati matrimonio",
      "gentiluna live proiettore",
    ],
    category: "Esperienza Live",
    audience: "SPOSI",
    readTime: "4 min",
    publishedAt: "2026-11-14",
    image: "/press/GentiLuna_Immagine_3.jpg",
    imageAlt: "Proiezione foto dal vivo GentiLuna Live Wall su maxischermo in sala durante il ricevimento",
    excerpt:
      "Collega un semplice browser a schermo intero su un proiettore o monitor della location: man mano che gli amici scattano dal QR Code, le foto approvate animano la sala in diretta.",
    sections: [
      {
        heading: "Un momento di festa collettivo dal taglio torta al party serale",
        paragraphs: [
          "Vedere sul grande schermo i sorrisi della preparazione mattutina insieme agli scatti rubati dieci minuti prima ai tavoli crea un coinvolgimento straordinario tra amici e familiari.",
          "La modalità GentiLuna LIVE è una vista fullscreen già pensata per TV, schermi led o videoproiettori della location: non servono software complessi da installare sul computer del DJ.",
        ],
      },
      {
        heading: "Sicurezza grazie alla moderazione preventiva",
        paragraphs: [
          "Poiché puoi moderare le foto dalla tua Area di Gestione prima di approvarle (oppure affidare la moderazione al tuo fotografo o wedding planner assegnato), sul proiettore finiscono soltanto gli scatti che approvi davvero.",
        ],
        bullets: [
          "Visualizzazione elegante a schermo intero con dedica e nome dell'autore.",
          "QR Code visibile direttamente a bordo schermo per invitare anche gli ultimi arrivati a partecipare.",
        ],
      },
    ],
    ctaLabel: "Scopri il Piano Diamond e LIVE",
    ctaHref: "/prezzi",
    secondaryCtaLabel: "Funzioni per Sposi & Eventi",
    secondaryCtaHref: "/funzioni-sposi",
  },
  {
    slug: "lista-nozzi-viaggio-di-nozze-a-tappe-iban-digitale",
    title: "Lista nozze e viaggio di nozze a tappe: come presentarla online con eleganza e trasparenza",
    seoTitle: "Lista Nozze Digitale e Viaggio di Nozze a Tappe | GentiLuna",
    metaDescription:
      "Scopri come inserire sul sito del tuo matrimonio il contributo libero con IBAN o le singole tappe del viaggio di nozze in modo chiaro, elegante e diretto.",
    keywords: [
      "lista nozze digitale",
      "viaggio di nozze a tappe lista matrimonio",
      "come scrivere iban matrimonio sito",
      "regali matrimonio online",
    ],
    category: "Organizzazione Nozze",
    audience: "SPOSI",
    readTime: "4 min",
    publishedAt: "2026-11-13",
    image: "/press/GentiLuna_Showcase_Regali_Guestbook.jpg",
    imageAlt: "Lista Regali e IBAN, Tappe Viaggio Nozze, Guestbook Dediche e Documenti Viaggio su GentiLuna",
    excerpt:
      "Racconta il vostro sogno attraverso tappe concrete del viaggio di nozze o condividi l'IBAN intestato e i link esterni direttamente sul sito dell'evento, senza commissioni sui regali.",
    sections: [
      {
        heading: "Dare valore emotivo al regalo senza passare per freddi numeri",
        paragraphs: [
          "Molte coppie oggi preferiscono ricevere un contributo per la casa o per il viaggio di nozze al posto della classica lista di oggetti. Su GentiLuna puoi presentare i desideri di regalo con estrema cura stilistica.",
          "Puoi creare sia un'opzione di contributo libero con IBAN e intestatario chiari, sia vere e proprie Tappe di Viaggio con località, descrizione dell'esperienza e quota indicativa.",
        ],
      },
      {
        heading: "Documenti di viaggio e organizzazione in un unico posto",
        paragraphs: [
          "Oltre alla sezione pubblica per gli invitati, nella vostra area gestione trovate la scheda Documenti dove archiviare carte d'imbarco, prenotazioni hotel o voucher dell'agenzia viaggi così da avere tutto ordinato prima della partenza.",
        ],
        bullets: [
          "Zero intermediazioni: GentiLuna non trattiene percentuali sui bonifici inviati dai vostri cari.",
          "Puoi nascondere o mostrare la sezione Regali dalle impostazioni in qualsiasi momento.",
        ],
      },
    ],
    ctaLabel: "Scopri tutte le Funzioni Sposi",
    ctaHref: "/funzioni-sposi",
    secondaryCtaLabel: "Inizia ora gratuitamente",
    secondaryCtaHref: "/login?role=COUPLE&mode=REGISTER",
  },
  {
    slug: "guestbook-digitale-matrimonio-dediche-e-ricordi-sicuri",
    title: "Guestbook digitale di matrimonio: raccogliere dediche autentiche e approvarle con cura",
    seoTitle: "Guestbook Digitale Matrimonio: Dediche Online degli Invitati | GentiLuna",
    metaDescription:
      "Affianca o sostituisci il classico libro delle firme con un guestbook digitale elegante: ogni ospite lascia un pensiero dal telefono e tu approvi cosa pubblicare.",
    keywords: [
      "guestbook digitale matrimonio",
      "libro firme matrimonio online",
      "dediche invitati nozze sito",
      "auguri sposi online",
    ],
    category: "Sposi & Invitati",
    audience: "SPOSI",
    readTime: "3 min",
    publishedAt: "2026-11-12",
    image: "/blog/07-guestbook-digitale-dediche.jpg",
    imageAlt: "Ospiti che scrivono dediche su carte pregiate e tablet digitale al ricevimento",
    excerpt:
      "Anche chi è timido o non riesce a raggiungere il tavolo del libro firme può lasciarvi una dedica sentita direttamente dallo smartphone, conservata per sempre nel capitolo.",
    sections: [
      {
        heading: "Perché tanti amici non firmano il guestbook cartaceo",
        paragraphs: [
          "Durante un matrimonio il tempo vola tra musica, balli e foto di gruppo. Il libro cartaceo resta spesso in un angolo oppure raccoglie solo poche firme frettolose verso mezzanotte.",
          "Con il guestbook digitale integrato nella pagina pubblica del capitolo su GentiLuna, gli ospiti possono scrivere un pensiero con calma persino il giorno dopo mentre riguardano le prime foto.",
        ],
      },
      {
        heading: "Moderazione completa prima della pubblicazione",
        paragraphs: [
          "Ogni dedica inviata compare prima nella scheda Dediche della tua Area di Gestione: con un clic scegli se pubblicarla sul sito pubblico oppure tenerla archiviata privatamente.",
        ],
      },
    ],
    ctaLabel: "Vedi come funziona il Portale",
    ctaHref: "/funzioni-sposi",
    secondaryCtaLabel: "Scopri i Piani",
    secondaryCtaHref: "/prezzi",
  },
  {
    slug: "dopo-il-matrimonio-capitoli-viaggi-anniversari-nascita-famiglia",
    title: "Oltre il giorno del sì: trasformare il sito delle nozze in un archivio vivo per viaggi, nascite e traguardi",
    seoTitle: "Album Digitale Capitoli di Famiglia: Viaggi, Nascite e Anniversari | GentiLuna",
    metaDescription:
      "A differenza dei siti temporanei che scadono dopo le nozze, su GentiLuna puoi aprire nuovi capitoli per Viaggio di Nozze, Anniversari, Nascita, Battesimo e feste di famiglia.",
    keywords: [
      "album digitale famiglia privato",
      "sito battesimo compleanno anniversario",
      "raccolta foto nascita figlio privato",
      "timeline eventi vita coppia",
    ],
    category: "Eventi & Famiglia",
    audience: "SPOSI",
    readTime: "4 min",
    publishedAt: "2026-11-11",
    image: "/press/GentiLuna_Showcase_Capitoli.jpg",
    imageAlt: "Timeline Capitoli della Vita GentiLuna: Matrimonio, Viaggio di Nozze, Nascita e Famiglia",
    excerpt:
      "Il matrimonio è soltanto il Capitolo 1: aggiungi nel tempo Viaggio di Nozze, Primo Anniversario, Nascita o Compleanni con impostazioni di visibilità scelte capitolo per capitolo.",
    sections: [
      {
        heading: "Perché buttare via mesi di preparazione e ricordi dopo una sola giornata?",
        paragraphs: [
          "La maggior parte dei servizi nuziali serve solo per l'invito e poi viene dimenticata. GentiLuna nasce con l'idea opposta: creare la linea del tempo della vostra famiglia, partendo dal matrimonio per custodire ogni tappa successiva.",
        ],
      },
      {
        heading: "Privacy su misura per ogni singolo capitolo",
        paragraphs: [
          "Dalla bacheca 'La Vostra Storia' puoi creare nuovi capitoli scegliendo la tipologia esatta e decidendo chi può vederli.",
        ],
        bullets: [
          "Tipologie pronte: Viaggio, Anniversario, Nascita, Battesimo, Compleanno, Famiglia, Ricordo o Evento personalizzato.",
          "Livelli di accesso indipendenti: Pubblico, Condiviso con la Famiglia oppure Solo per noi (privato).",
          "Condivisione rapida per singolo capitolo via WhatsApp o Email quando vuoi mostrare solo quell'evento.",
        ],
      },
    ],
    ctaLabel: "Scopri la Timeline GentiLuna",
    ctaHref: "/funzioni-sposi",
    secondaryCtaLabel: "Inizia il Capitolo 1",
    secondaryCtaHref: "/login?role=COUPLE&mode=REGISTER",
  },
  {
    slug: "come-trovare-clienti-fotografo-matrimoni-visibilita-ricevimento",
    title: "Come trovare nuovi clienti come fotografo o fornitore di matrimoni direttamente durante l'evento",
    seoTitle: "Come Trovare Clienti Fotografo Matrimoni e Fornitori | GentiLuna PRO",
    metaDescription:
      "Ogni matrimonio riunisce oltre 100 invitati: scopri come farti notare in sala grazie agli spazi digitali e ai QR Code GentiLuna invece di perdere il passaparola.",
    keywords: [
      "come trovare clienti fotografo matrimoni",
      "marketing fotografi wedding italia",
      "farsi conoscere agli invitati matrimonio",
      "trovare sposi matrimonio",
    ],
    category: "Strategia Professionisti",
    audience: "PROFESSIONISTI",
    readTime: "5 min",
    publishedAt: "2026-11-10",
    image: "/blog/09-trovare-clienti-fotografo.jpg",
    imageAlt: "Fotografo di matrimoni al tramonto in Toscana circondato da ospiti sorridenti",
    excerpt:
      "In ogni ricevimento lavoriamo davanti a potenziali future coppie, festeggiati e genitori: portare il tuo brand sul loro smartphone trasforma un singolo ingaggio nel prossimo passaparola.",
    sections: [
      {
        heading: "Il paradosso dei ricevimenti: 150 persone vedono come lavori ma nessuno ricorda il tuo nome",
        paragraphs: [
          "Un fotografo, un videomaker o una wedding planner passa dodici ore in mezzo a decine di amici degli sposi che presto organizzeranno il proprio matrimonio, battesimo o evento aziendale.",
          "Eppure, settimane dopo, nessuno ha il tuo contatto salvato e quando si parla del servizio ricevuto nessuno sa risalire al tuo studio.",
        ],
      },
      {
        heading: "Come GentiLuna collega il tuo studio allo spazio dell'evento",
        paragraphs: [
          "Quando crei lo spazio per una coppia (o vieni collegato al Team Fornitori dell'evento), il tuo profilo pubblico verificato appare direttamente all'interno del sito del matrimonio e del processo di condivisione foto.",
        ],
        bullets: [
          "Gli invitati che guardano o caricano le foto vedono subito chi ha curato il reportage o l'evento.",
          "Dalla scheda fornitore possono cliccare su 'Richiedi Preventivo Gratuito' aprendo una conversazione tracciata direttamente con te.",
          "Zero commissioni sui lavori conclusi tramite la piattaforma.",
        ],
      },
    ],
    ctaLabel: "Scopri le Funzioni Professionisti",
    ctaHref: "/funzioni-professionisti",
    secondaryCtaLabel: "Entra nel Founders Club (€ 49)",
    secondaryCtaHref: "/professionisti#founders",
  },
  {
    slug: "consegna-foto-nozze-hd-ai-clienti-alternativa-whatsapp-drive",
    title: "Consegna foto matrimonio in Alta Risoluzione ai clienti: alternativa elegante a cartelle spoglie",
    seoTitle: "Consegna Foto Matrimonio Alta Risoluzione ai Clienti | GentiLuna PRO",
    metaDescription:
      "Consegna i tuoi servizi fotografici di matrimonio in un portale su misura per gli sposi, diviso in capitoli, scaricabile in ZIP e protetto da accesso riservato.",
    keywords: [
      "consegna foto matrimonio online clienti",
      "galleria fotografica online fotografi matrimonio",
      "portale consegna foto matrimoni",
      "alternativa google drive fotografi",
    ],
    category: "Workflow Fotografi",
    audience: "PROFESSIONISTI",
    readTime: "4 min",
    publishedAt: "2026-11-09",
    image: "/press/GentiLuna_Showcase_Pro.jpg",
    imageAlt: "GentiLuna Studio per Fotografi: Consegna Album HD, Vetrina Pro, Preventivi Protetti e 0% Commissioni",
    excerpt:
      "Sostituisci i link anonimi con una vera esperienza emozionale per le tue coppie: gallerie in alta risoluzione, suddivisione in capitoli, download ZIP e custodia a lungo termine.",
    sections: [
      {
        heading: "La consegna finale fa parte del valore percepito del tuo studio",
        paragraphs: [
          "Dopo aver dedicato settimane alla post-produzione, inviare un semplice collegamento a una cartella compressa sminuisce la cura messa in ogni scatto.",
          "Con la Dashboard Professionisti di GentiLuna generi in dieci secondi uno spazio matrimonio dedicato agli sposi e carichi la galleria ufficiale in alta qualità (supporto immagini professionali JPG, PNG, WebP, HEIC e TIFF fino a 25 MB).",
        ],
      },
      {
        heading: "Ordine, privacy e continua relazione col cliente",
        paragraphs: [
          "Gli sposi ritrovano la galleria ufficiale insieme alle dediche degli invitati e ai momenti successivi della loro famiglia nello stesso portale.",
        ],
        bullets: [
          "Caricamento organizzato in album e capitoli (Pre-wedding, Cerimonia, Festa, ecc.).",
          "Pulsante 'Scarica Tutto (ZIP)' pratico per archiviare gli originali.",
          "Impostazione visibilità privata o protetta per tutelare la riservatezza della coppia.",
        ],
      },
    ],
    ctaLabel: "Scopri la Dashboard Partner",
    ctaHref: "/funzioni-professionisti",
    secondaryCtaLabel: "Attiva Prova / Promo Lancio",
    secondaryCtaHref: "/professionisti#founders",
  },
  {
    slug: "portale-fornitori-matrimoni-0-commissioni-preventivi-protetti",
    title: "Portale fornitori matrimoni con 0% commissioni: come proteggiamo i tuoi preventivi da spam e bot",
    seoTitle: "Portale Fornitori Matrimoni 0% Commissioni e Chat Protetta | GentiLuna",
    metaDescription:
      "Niente aste al ribasso né percentuali trattenute sui contratti: su GentiLuna ricevi richieste preventivo reali e tracciate dentro la Live Chat interna protetta.",
    keywords: [
      "portale fornitori matrimoni 0 commissioni",
      "richieste preventivo fotografi matrimonio",
      "directory fornitori wedding italia",
      "vetrina matrimonio senza commissioni",
    ],
    category: "Directory & Lead",
    audience: "PROFESSIONISTI",
    readTime: "4 min",
    publishedAt: "2026-11-08",
    image: "/blog/11-portale-fornitori-zero-commissioni.jpg",
    imageAlt: "Coppia di sposi e fotografo che consultano stampe d'autore in un cortile italiano luminoso",
    excerpt:
      "I tuoi recapiti privati non restano esposti in pasto a bot pubblicitari: ogni richiesta passa dal sistema interno con notifica immediata, zero commissioni e pieno controllo in dashboard.",
    sections: [
      {
        heading: "Stop allo scraping di email e numeri di telefono pubblici",
        paragraphs: [
          "Pubblicare in chiaro email personale, cellulare o WhatsApp su portali pubblici espone ogni studio a chiamate promozionali indesiderate e spam automatico, rendendo impossibile misurare quante richieste arrivino davvero dalla vetrina.",
          "GentiLuna protegge la tua scheda nella directory /fornitori mantenendo i contatti diretti privati e offrendo agli sposi due canali immediati e sicuri: il modulo 'Richiedi Preventivo Gratuito' e la 'Live Chat Protetta'.",
        ],
      },
      {
        heading: "Vantaggi concreti per te e per le coppie",
        paragraphs: [
          "Ogni richiesta ricevuta ti viene notificata via email e salvata nella sezione Messaggi della tua dashboard con data evento, nome della coppia e note iniziali.",
        ],
        bullets: [
          "0% commissioni sui contratti che chiudi con le tue coppie.",
          "Storico centralizzato di ogni preventivo ricevuto per non perdere mai un contatto.",
          "Ambiente anti-spam verificato che tutela tanto i fornitori quanto le coppie.",
        ],
      },
    ],
    ctaLabel: "Scopri il Modello Partner",
    ctaHref: "/funzioni-professionisti",
    secondaryCtaLabel: "Sfoglia la Directory Fornitori",
    secondaryCtaHref: "/fornitori",
  },
  {
    slug: "wedding-planner-location-organizzare-tavoli-rsvp-e-documenti",
    title: "Wedding Planner e Location: collaborare con gli sposi su RSVP, tavoli e documenti da un unico spazio",
    seoTitle: "Software Matrimoni per Wedding Planner e Location | GentiLuna PRO",
    metaDescription:
      "Affianca le tue coppie nella logistica nuziale: accedi allo spazio evento come professionista assegnato per monitorare presenze, diete, disposizione sala e voucher.",
    keywords: [
      "software wedding planner italia",
      "gestione location matrimoni rsvp tavoli",
      "coordinamento evento sposi digitale",
      "wedding planner tableau digitale",
    ],
    category: "Wedding Planner & Location",
    audience: "PROFESSIONISTI",
    readTime: "4 min",
    publishedAt: "2026-11-07",
    image: "/press/GentiLuna_Showcase_Planner.jpg",
    imageAlt: "Dashboard Wedding Planner e Location: Gestione Tavoli, Conferme RSVP, Allergie e Team Fornitori",
    excerpt:
      "Invece di scambiare decine di versioni di file via mail con ogni coppia, lavori sullo stesso spazio evento condiviso tenendo sotto controllo orari, ospiti, tavoli e documenti.",
    sections: [
      {
        heading: "Un unico tavolo digitale condiviso con la coppia",
        paragraphs: [
          "Per Wedding Planner, Direttori di Sala, Location e Catering la precisione sui numeri e sulle esigenze alimentari cambia l'esito dell'intero servizio.",
          "Attraverso il collegamento diretto tra il profilo del professionista e lo spazio digitale della coppia, tutte le informazioni operative restano sempre aggiornate nello stesso ambiente.",
        ],
      },
      {
        heading: "Cosa puoi coordinare concretamente su GentiLuna",
        paragraphs: [
          "Oltre ai profili fotografici, GentiLuna supporta figure organizzative complete con pacchetti scalabili fino alle soluzioni White-Label del piano Diamond.",
        ],
        bullets: [
          "Caricamento di documenti operativi e voucher viaggio/fornitori nell'area Documenti.",
          "Supporto agli sposi nella definizione del programma orario e dei luoghi.",
          "Esportazione ordinata di liste ospiti, esigenze dietetiche e assegnazione tavoli.",
        ],
      },
    ],
    ctaLabel: "Vedi le Funzioni Professionisti",
    ctaHref: "/funzioni-professionisti",
    secondaryCtaLabel: "Scopri i Piani Entry, PRO e Diamond",
    secondaryCtaHref: "/professionisti#pricing",
  },
  {
    slug: "vetrina-online-fotografo-fornitore-eventi-cosa-cercano-gli-sposi",
    title: "Come costruire una vetrina fornitori su GentiLuna che convince gli sposi al primo sguardo",
    seoTitle: "Vetrina Online Fornitori Matrimonio: Checklist Completa | GentiLuna",
    metaDescription:
      "Consigli pratici per completare al 100% la tua vetrina in directory: bio chiara, zona operativa, portfolio HD, video vetrina e pacchetti indicativi trasparenti.",
    keywords: [
      "vetrina fotografo matrimonio online",
      "profilo fornitore matrimoni efficace",
      "portfolio matrimonio online",
      "categorie fornitori wedding",
    ],
    category: "Workflow Fotografi",
    audience: "PROFESSIONISTI",
    readTime: "4 min",
    publishedAt: "2026-11-06",
    image: "/blog/13-vetrina-online-fornitori-wedding.jpg",
    imageAlt: "Fiorista e videomaker all'opera in una luminosa limonaia italiana",
    excerpt:
      "Una scheda ben compilata nella directory /fornitori fa subito capire il tuo stile a chi sta cercando esattamente nella tua regione e categoria.",
    sections: [
      {
        heading: "Cosa guardano le coppie nei primi dieci secondi",
        paragraphs: [
          "Quando una coppia esplora la directory GentiLuna filtra subito per categoria (Fotografo, Videomaker, Wedding Planner, Location, Fiorista, DJ, Musicista, Make-up, Hair Stylist, Catering) e per parola chiave o città.",
          "Le schede senza foto copertina, senza descrizione autentica o senza fascia di servizio ricevono pochissime richieste rispetto ai profili curati fin nei dettagli.",
        ],
      },
      {
        heading: "La checklist rapida direttamente dalla tua Dashboard",
        paragraphs: [
          "Nella sezione Il Mio Profilo trovi subito tutto ciò che serve per andare online al massimo della forza espressiva.",
        ],
        bullets: [
          "Carica Logo o ritratto riconoscibile e un'immagine di copertina luminosa.",
          "Indica con precisione la tua Zona Operativa (città, provincia o disponibilità in tutta Italia).",
          "Carica fino a 15 immagini del portfolio in alta risoluzione (fino a 25 MB per file) e fino a 2 link video.",
          "Inserisci i tuoi pacchetti o servizi principali con una descrizione chiara del metodo di lavoro.",
        ],
      },
    ],
    ctaLabel: "Crea la tua Vetrina Verificata",
    ctaHref: "/login?role=PHOTOGRAPHER&mode=REGISTER",
    secondaryCtaLabel: "Esplora i Fornitori attivi",
    secondaryCtaHref: "/fornitori",
  },
  {
    slug: "founders-club-gentiluna-come-funziona-promo-lancio-professionisti",
    title: "Founders Club GentiLuna: perché i primi 50 professionisti accedono al piano PRO a 49 € per 12 mesi",
    seoTitle: "Founders Club GentiLuna PRO a € 49: Come Funziona | Offerta Lancio",
    metaDescription:
      "Tutti i dettagli dell'offerta lancio GentiLuna Founders Club riservata ai primi 50 fotografi e professionisti wedding: funzioni PRO incluse per un anno intero a € 49.",
    keywords: [
      "founders club gentiluna",
      "promo fotografi matrimoni 49 euro",
      "piattaforma fotografi sposi italia",
      "abbonamento portale matrimonio professionisti",
    ],
    category: "Novità Piattaforma",
    audience: "PROFESSIONISTI",
    readTime: "4 min",
    publishedAt: "2026-11-05",
    image: "/blog/14-founders-club-gentiluna.jpg",
    imageAlt: "Brindisi creativo in studio fotografico italiano con album nuziali e fotocamere",
    excerpt:
      "Un'iniziativa concreta dedicata ai primi 50 professionisti italiani che vogliono testare sul campo spazi sposi illimitati, consegna album HD e visibilità VIP Partner.",
    sections: [
      {
        heading: "Cresciamo insieme ai veri protagonisti del settore wedding",
        paragraphs: [
          "GentiLuna nasce dall'esperienza reale sul campo di fotografi e sviluppatori italiani stanchi delle commissioni alte e dei portali che mettono in competizione i professionisti sul solo prezzo.",
          "Per premiare i primi 50 studi che sposano la visione sin dal lancio, il Founders Club sblocca il valore del piano PRO annuale (normalmente € 299/anno) a € 49,00 per 12 mesi.",
        ],
      },
      {
        heading: "Cosa include e qual è l'unico impegno richiesto",
        paragraphs: [
          "Non ci sono vincoli nascosti di rinnovo automatico: l'obiettivo è portare GentiLuna dentro matrimoni reali per dimostrare sul campo quanto vale il passaparola digitale.",
        ],
        bullets: [
          "Spazi e consegne matrimonio illimitati per 12 mesi.",
          "Profilo VIP Partner nella directory nazionale Fornitori.",
          "Richieste preventivo tracciate via piattaforma con 0% di commissioni.",
          "L'unica condizione: utilizzare GentiLuna e i QR Code raccolta foto in almeno 3 matrimoni reali nell'anno.",
        ],
      },
    ],
    ctaLabel: "Vai all'Offerta Founders Club",
    ctaHref: "/professionisti#founders",
    secondaryCtaLabel: "Scopri le Funzioni Pro",
    secondaryCtaHref: "/funzioni-professionisti",
  },
  {
    slug: "privacy-foto-matrimonio-moderazione-scatti-invitati-gdpr",
    title: "Privacy delle foto e dei dati degli invitati: controllo visibilità, moderazione e tutele su GentiLuna",
    seoTitle: "Privacy Foto Matrimonio e Tutela Invitati GDPR | GentiLuna",
    metaDescription:
      "Come proteggere foto, dediche e nomi degli invitati del tuo matrimonio online: visibilità privata per capitolo, moderazione scatti, trasparenza AI e rispetto GDPR.",
    keywords: [
      "privacy foto matrimonio online",
      "sito matrimonio privato con password",
      "moderazione foto invitati",
      "tutela dati ospiti matrimonio gdpr",
    ],
    category: "Privacy & Sicurezza",
    audience: "TUTTI",
    readTime: "4 min",
    publishedAt: "2026-11-04",
    image: "/blog/15-privacy-moderazione-scatti.jpg",
    imageAlt: "Stampe fotografiche nuziali custodite in una scatola di lino e carta velina alla luce del mattino",
    excerpt:
      "Condividere i ricordi con i propri cari non significa esporre tutto su internet: scopri gli strumenti di moderazione preventiva e privacy selettiva integrati.",
    sections: [
      {
        heading: "Il pieno controllo resta sempre nelle vostre mani",
        paragraphs: [
          "Molte coppie amano l'idea di raccogliere foto dagli ospiti ma giustamente non vogliono che immagini imprecise finiscano subito online o che sconosciuti vedano momenti intimi di famiglia.",
          "Per questo su GentiLuna la sicurezza non è un'aggiunta opzionale: sia le foto caricate dagli ospiti sia le dediche nel guestbook possono essere moderate dalla vostra dashboard prima di apparire nella galleria visibile.",
        ],
      },
      {
        heading: "Tre livelli di visibilità e trasparenza normativa",
        paragraphs: [
          "Sia per gli Sposi sia per i Professionisti, la piattaforma applica criteri chiari di tutela dati e trasparenza europea.",
        ],
        bullets: [
          "Controllo visibilità per capitolo: Pubblico, Famiglia o Solo per noi (privato).",
          "Possibilità di attivare o disattivare singole sezioni sul sito pubblico (es. Guestbook, Mappa Tavoli, Regali).",
          "Pagamenti piani gestiti direttamente tramite Stripe crittografato SSL senza salvare carte sui server GentiLuna.",
          "Assistente virtuale Luna AI conforme agli obblighi di trasparenza UE (Art. 50 AI Act), con team umano sempre contattabile su /assistenza.",
        ],
      },
    ],
    ctaLabel: "Scopri tutte le Funzioni Sposi",
    ctaHref: "/funzioni-sposi",
    secondaryCtaLabel: "Leggi l'Informativa Privacy",
    secondaryCtaHref: "/privacy",
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
