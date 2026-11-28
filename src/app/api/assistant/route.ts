import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PLANS_CATALOG } from "@/lib/plans";

type AssistantContext = "PUBLIC" | "LOGIN" | "COUPLE" | "PRO";

interface KnowledgeEntry {
  id: string;
  contexts: AssistantContext[];
  keywords: string[];
  answer: string;
  links?: { label: string; href: string }[];
}

function normalize(str: string): string {
  return (str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function buildKnowledgeBase(activeProsCount: number): KnowledgeEntry[] {
  const baseAnnual = PLANS_CATALOG.BASE_ANNUAL.priceDisplay;
  const premiumAnnual = PLANS_CATALOG.PREMIUM_ANNUAL.priceDisplay;
  const diamondAnnual = PLANS_CATALOG.DIAMOND_ANNUAL.priceDisplay;
  const proFounders = PLANS_CATALOG.PRO_FOUNDERS_49.priceDisplay;
  const proEntry = PLANS_CATALOG.PRO_ENTRY_120.priceDisplay;
  const proStandard = PLANS_CATALOG.PRO_299.priceDisplay;
  const proDiamond = PLANS_CATALOG.PRO_DIAMOND_449.priceDisplay;

  return [
    {
      id: "budget-planner",
      contexts: ["PUBLIC", "LOGIN", "COUPLE", "PRO"],
      keywords: [
        "budget",
        "spesa",
        "spendere",
        "calcolo",
        "calcolatore",
        "simulatore",
        "quanto costa sposarsi",
        "organizzare budget",
        "idee di budget",
        "10000",
        "15000",
        "20000",
        "25000",
        "30000",
        "differenza ristorante villa",
      ],
      answer:
        "Su GentiLuna trovi il nuovo strumento gratuito **'Parti dal Budget & Organizza'** ✨:\n• **Simulatore su misura:** inserisci il tuo budget ipotetico, il numero di invitati e la formula preferita (Ristorante con cucina interna, Agriturismo o Villa + Catering esterno) per vedere come distribuire le voci con onestà, chi contattare e cosa chiedere prima di firmare.\n• **6 Idee di Budget pronte:** scopri cosa puoi realizzare concretamente da 8.000€ fino a oltre 60.000€ (più una sezione dedicata a Battesimi, Lauree e Anniversari).\n*(Nota: i calcoli sono simulazioni orientative e ipotetiche da confermare poi con location e professionisti.)*",
      links: [
        { label: "Apri Simulatore Budget", href: "/budget-matrimonio" },
        { label: "Vedi 6 Idee di Budget", href: "/budget-matrimonio?tab=idee" },
      ],
    },
    {
      id: "what-is-gentiluna",
      contexts: ["PUBLIC", "LOGIN", "COUPLE", "PRO"],
      keywords: ["cos'e", "cosa e", "gentiluna", "funziona", "piattaforma", "serve", "presentazione", "spiegami"],
      answer:
        "GentiLuna è la piattaforma digitale italiana pensata per Sposi e Professionisti del matrimonio. Permette alle coppie di creare il proprio sito evento elegante, raccogliere foto e video dagli invitati tramite QR Code (senza app da scaricare!), gestire RSVP, tavoli, capitoli della vita e trovare fornitori verificati. Per i fotografi e fornitori offre una vetrina dedicata con preventivi tracciati e consegna gallerie in alta risoluzione.",
      links: [
        { label: "Area Sposi", href: "/sposi" },
        { label: "Area Professionisti", href: "/professionisti" },
        { label: "Vedi Piani e Prezzi", href: "/prezzi" },
      ],
    },
    {
      id: "pricing",
      contexts: ["PUBLIC", "LOGIN", "COUPLE", "PRO"],
      keywords: ["prezzi", "prezzo", "costa", "costo", "piani", "abbonamento", "gratis", "free", "pagare", "founders", "diamond", "premium", "tariffa"],
      answer: `Ecco i piani attuali di GentiLuna:\n\n• **Sposi & Eventi:** puoi iniziare gratuitamente e poi scegliere tra Base (${baseAnnual}/anno), Premium (${premiumAnnual}/anno) o Diamond (${diamondAnnual}/anno, con Live Wall e funzionalità complete), disponibili anche in versione Triennale scontata.\n• **Professionisti:** promo lancio **Founders Club PRO a ${proFounders}/anno** (per i primi 50 partner), Entry (${proEntry}/anno), PRO (${proStandard}/anno) e Diamond White-Label (${proDiamond}/anno).`,
      links: [
        { label: "Confronta tutti i Piani", href: "/prezzi" },
        { label: "Gestisci Abbonamento", href: "/dashboard/billing" },
      ],
    },
    {
      id: "couple-setup",
      contexts: ["COUPLE", "PUBLIC"],
      keywords: ["compilare", "iniziare", "configurare", "copertina", "location", "programma", "orari", "dettagli", "casa", "chiesa", "ristorante", "mappa"],
      answer:
        "Per completare al 100% il vostro spazio Matrimonio ti consiglio questi 5 passaggi rapidi:\n1. **Apri il Capitolo Matrimonio** dalla vostra bacheca e carica una bella **Foto Copertina** + un messaggio di benvenuto.\n2. Nella scheda **Dettagli & Location**, aggiungi le tappe (es. 'Casa Sposa', 'Chiesa / Rito', 'Ricevimento') con l'indirizzo preciso.\n3. Compila il **Programma della giornata** con gli orari principali.\n4. Inserisci gli **Invitati** (per RSVP e allergie) e imposta i **Tavoli**.\n5. Usa i pulsanti **WhatsApp / Email / Copia Link** sotto il capitolo per inviare il sito ai vostri ospiti!",
      links: [{ label: "Assistenza Sposi", href: "/assistenza" }],
    },
    {
      id: "couple-chapters-share",
      contexts: ["COUPLE", "PUBLIC"],
      keywords: ["capitolo", "capitoli", "condividere", "condividi", "whatsapp", "link", "viaggio", "anniversario", "invitare", "inviare"],
      answer:
        "Su GentiLuna la vostra storia cresce nel tempo! Dalla bacheca potete cliccare su **'Aggiungi un capitolo'** per creare nuove tappe (Viaggio di Nozze, Anniversario, Nascita, Ricordi). Sotto ogni card capitolo — sia nella vostra dashboard privata sia sul sito pubblico — trovate i pulsanti rapidi **WhatsApp, Email e Copia Link** per condividere quel capitolo specifico con gli invitati in un clic!",
    },
    {
      id: "couple-guests-rsvp-tables",
      contexts: ["COUPLE", "PUBLIC"],
      keywords: ["invitati", "rsvp", "tavoli", "tableau", "allergie", "intolleranze", "conferma", "ospiti", "posti"],
      answer:
        "All'interno del capitolo Matrimonio trovi le schede dedicate a **Invitati (RSVP)** e **Tavoli (Tableau Mariage)**:\n• Puoi aggiungere gli invitati e inviare loro il link personale per confermare la presenza e segnalare eventuali allergie o intolleranze.\n• Nella sezione Tavoli crei i tavoli rotondi o rettangolari e assegni ogni ospite al proprio posto.\n• Puoi anche decidere se rendere visibile il tableau sul sito pubblico degli invitati!",
    },
    {
      id: "qr-photos",
      contexts: ["COUPLE", "PRO", "PUBLIC"],
      keywords: ["qr", "qrcode", "foto", "video", "caricare", "galleria", "approvare", "live", "wall", "schermo", "ricordi"],
      answer:
        "Il sistema **QR Code di GentiLuna** è semplicissimo: gli invitati inquadrano il QR Code stampato sui tavoli (o aprono il link del matrimonio) e caricano subito foto e video dal loro smartphone, **senza dover installare nessuna app**. Come sposi o fotografo potete attivare la moderazione per approvare le foto prima che diventino visibili in galleria o proiettate sul **Live Wall** durante la festa!",
    },
    {
      id: "pro-profile-setup",
      contexts: ["PRO", "PUBLIC"],
      keywords: ["vetrina", "profilo", "portfolio", "servizi", "listino", "bio", "biografia", "completare", "fotografo", "fornitore", "wedding planner"],
      answer:
        "Per rendere irresistibile la tua vetrina su GentiLuna e comparire al top nella directory:\n1. Vai su **Profilo & Vetrina** nella tua dashboard.\n2. Carica il **Logo/Avatar** e una **Foto Copertina** luminosa ad alta qualità.\n3. Scrivi una **Biografia** autentica e indica la tua **Zona Operativa**.\n4. Aggiungi almeno **5-8 foto nel Portfolio** (e un video se lo hai) e inserisci i tuoi **Servizi / Pacchetti** con prezzo indicativo.\nUn profilo completo al 100% riceve fino a 4 volte più richieste di preventivo!",
      links: [{ label: "Vai al tuo Profilo Vetrina", href: "/dashboard/profile" }],
    },
    {
      id: "pro-protected-contacts",
      contexts: ["PRO", "PUBLIC", "COUPLE"],
      keywords: ["contatti", "telefono", "whatsapp", "email", "instagram", "sito", "nascosti", "protetti", "chat", "preventivo", "lead", "spam", "bloccato"],
      answer:
        "GentiLuna adotta un **Ecosistema Protetto al 100% interno**:\n• I recapiti diretti dei professionisti (email, telefono, WhatsApp, Instagram, sito web) restano **riservati ad uso interno** per proteggerli da spam/bot e verificare l'account.\n• Gli sposi richiedono informazioni tramite il pulsante **'Richiedi Preventivo Gratuito'** e la **Live Chat interna protetta**, dove un filtro automatico impedisce lo scambio di numeri o link esterni.\n• Così ogni professionista riceve notifiche istantanee e ha **tutti i lead tracciati e misurabili** nella propria dashboard!",
      links: [
        { label: "Apri Messaggi / Chat", href: "/dashboard/messages" },
        { label: "Leggi Termini & Regole", href: "/terms" },
      ],
    },
    {
      id: "directory-find-pros",
      contexts: ["PUBLIC", "COUPLE"],
      keywords: ["trova", "fornitori", "fotografi", "location", "fiorista", "dj", "catering", "cerca", "vetrine", "professionisti"],
      answer: `Nella directory di GentiLuna trovi attualmente **${activeProsCount} professionisti verificati** (fotografi, wedding planner e fornitori eventi) filtrabili per categoria e zona. Apri la scheda di chi ti ispira e clicca su **'Richiedi Preventivo Gratuito'** per contattarlo in sicurezza dentro la piattaforma!`,
      links: [{ label: "Esplora Catalogo Fornitori", href: "/fornitori" }],
    },
    {
      id: "login-register",
      contexts: ["LOGIN", "PUBLIC"],
      keywords: ["accedere", "login", "registrarmi", "registrazione", "password", "account", "entrare", "iscrivermi", "ruolo", "dimenticata"],
      answer:
        "Per entrare su GentiLuna:\n• **Se siete Sposi:** scegliete il ruolo **'Sposi / Coppia'** e create gratis il vostro spazio (verrà generato subito il vostro sito personalizzato con i vostri nomi!).\n• **Se sei un Professionista (Fotografo, Planner, Location, ecc.):** seleziona il ruolo **'Professionista / Partner'** per accedere alla dashboard dedicata e creare la tua vetrina.\nHai dimenticato la password o hai difficoltà ad accedere? Contatta il nostro supporto umano dalla pagina Assistenza.",
      links: [
        { label: "Vai al Login / Registrazione", href: "/login" },
        { label: "Contatta Assistenza", href: "/assistenza" },
      ],
    },
    {
      id: "ai-privacy-legal",
      contexts: ["PUBLIC", "LOGIN", "COUPLE", "PRO"],
      keywords: ["chi sei", "sei un robot", "intelligenza artificiale", "ai", "privacy", "gdpr", "legge", "umano", "operatore", "assistenza", "supporto", "aiuto"],
      answer:
        "Ciao! Sono **Luna ✨**, l'assistente virtuale basato su intelligenza artificiale di GentiLuna (informativa trasparente ai sensi dell'Art. 50 del Regolamento UE 2024/1689 — AI Act).\nNon sono un operatore umano e non salvo dati sensibili o password: sono qui 24/7 per guidarti nell'uso della piattaforma! Se invece desideri parlare direttamente con il team umano di GentiLuna, puoi scrivere dalla pagina Assistenza.",
      links: [
        { label: "Parla con il Team Umano", href: "/assistenza" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Termini e Condizioni", href: "/terms" },
      ],
    },
  ];
}

function findBestLocalAnswer(
  query: string,
  context: AssistantContext,
  kb: KnowledgeEntry[]
): { answer: string; links?: { label: string; href: string }[] } {
  const normQuery = normalize(query);
  const words = normQuery.split(/[^a-z0-9']+/).filter((w) => w.length >= 2);

  let bestScore = 0;
  let bestEntry: KnowledgeEntry | null = null;

  for (const entry of kb) {
    let score = 0;
    for (const kw of entry.keywords) {
      const nkw = normalize(kw);
      if (normQuery.includes(nkw)) {
        score += nkw.includes(" ") ? 5 : 3;
      } else if (words.some((w) => w === nkw || (w.length >= 4 && nkw.startsWith(w)))) {
        score += 2;
      }
    }
    if (score > 0 && entry.contexts.includes(context)) {
      score += 1.5;
    }
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  if (bestEntry && bestScore >= 2) {
    return { answer: bestEntry.answer, links: bestEntry.links };
  }

  // Fallback cortese e contestuale
  if (context === "COUPLE") {
    return {
      answer:
        "Ottima domanda! Posso aiutarti passo-passo a **caricare la copertina**, **aggiungere location e programma**, **gestire invitati RSVP e tavoli**, **creare nuovi capitoli** o **condividere il sito su WhatsApp**. Scrivimi su quale sezione stai lavorando, oppure contatta il nostro team umano se hai bisogno di supporto dedicato!",
      links: [{ label: "Supporto Umano GentiLuna", href: "/assistenza" }],
    };
  }
  if (context === "PRO") {
    return {
      answer:
        "Sono qui per aiutarti a far crescere il tuo studio su GentiLuna! Chiedimi pure come **completare la tua vetrina al 100%**, come funzionano i **preventivi tracciati e la Live Chat protetta**, come **creare uno spazio sposi con QR Code** o dettagli sui **piani PRO e Founders Club**.",
      links: [
        { label: "Gestisci Vetrina", href: "/dashboard/profile" },
        { label: "Supporto Umano", href: "/assistenza" },
      ],
    };
  }
  return {
    answer:
      "Ciao! Sono **Luna**, la guida virtuale di GentiLuna ✨ Posso spiegarti come funziona la piattaforma per **Sposi** o **Professionisti**, illustrarti i **Piani e Prezzi**, il **QR Code per le foto live** o come inviare una richiesta di preventivo protetta. Cosa ti piacerebbe scoprire?",
    links: [
      { label: "Scopri Piani e Prezzi", href: "/prezzi" },
      { label: "Esplora Fornitori", href: "/fornitori" },
      { label: "Assistenza Umana", href: "/assistenza" },
    ],
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = String(body?.message || "").trim();
    const rawContext = String(body?.context || "PUBLIC").toUpperCase();
    const context: AssistantContext = ["PUBLIC", "LOGIN", "COUPLE", "PRO"].includes(rawContext)
      ? (rawContext as AssistantContext)
      : "PUBLIC";

    if (!message || message.length > 600) {
      return NextResponse.json(
        { error: "Inserisci una domanda breve (massimo 600 caratteri)." },
        { status: 400 }
      );
    }

    let activeProsCount = 0;
    try {
      activeProsCount = await prisma.professionalProfile.count({ where: { isActive: true } });
    } catch {
      activeProsCount = 0;
    }

    const kb = buildKnowledgeBase(activeProsCount);
    const localMatch = findBestLocalAnswer(message, context, kb);

    // Se è configurata una GEMINI_API_KEY su Vercel, migliora la risposta in modo conversazionale ancorandola alla Knowledge Base
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const kbSummary = kb.map((k) => `[${k.id}]: ${k.answer}`).join("\n\n");
        const systemInstruction = `Sei Luna, l'assistente virtuale AI simpatica, elegante e professionale di GentiLuna (www.gentiluna.com), piattaforma italiana per matrimoni, eventi e fotografi.
Contesto attuale utente: ${context}.
Regole inderogabili:
1. Rispondi SEMPRE in italiano, in modo cordiale, conciso (max 4-5 frasi o breve elenco puntato) e fedele ESCLUSIVAMENTE alle informazioni reali di GentiLuna qui sotto.
2. Non inventare prezzi o funzioni non presenti nella base di conoscenza.
3. Non chiedere mai password, dati bancari o dati personali sensibili.
4. Ricorda che i contatti diretti dei professionisti (email, telefono, WhatsApp, Instagram) sono protetti e non esposti pubblicamente: tutte le comunicazioni avvengono tramite Preventivo interno e Live Chat protetta su GentiLuna.

BASE DI CONOSCENZA GENTILUNA:
${kbSummary}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(geminiKey)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: systemInstruction }] },
              contents: [{ role: "user", parts: [{ text: message }] }],
              generationConfig: { temperature: 0.4, maxOutputTokens: 350 },
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (aiText) {
            return NextResponse.json({
              reply: aiText,
              links: localMatch.links || [],
              engine: "ai",
            });
          }
        }
      } catch (llmErr) {
        console.warn("Fallback a Knowledge Base locale per Luna Assistant:", llmErr);
      }
    }

    return NextResponse.json({
      reply: localMatch.answer,
      links: localMatch.links || [],
      engine: "kb",
    });
  } catch (err: unknown) {
    console.error("Errore API /api/assistant:", err);
    return NextResponse.json(
      { error: "Ops, ho avuto un piccolo intoppo tecnico. Riprova tra un attimo!" },
      { status: 500 }
    );
  }
}
