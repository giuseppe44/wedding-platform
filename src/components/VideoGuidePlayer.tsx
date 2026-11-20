"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Camera,
  QrCode,
  Users,
  Crown,
  CheckCircle2,
  XCircle,
  HardDrive,
  FileText,
  Tv,
  Heart,
  ShieldCheck,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface GuideSlide {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  narration: string;
  bullets: string[];
  visualType:
    | "WELCOME_PRO"
    | "UPLOAD_PRO"
    | "DELIVERY_PRO"
    | "QRCODE_PRO"
    | "PLANNER_PRO"
    | "PLANS_PRO"
    | "WELCOME_COUPLE"
    | "SETUP_COUPLE"
    | "RSVP_COUPLE"
    | "TABLEAU_COUPLE"
    | "QRCODE_COUPLE"
    | "PLANS_COUPLE";
}

const PRO_SLIDES: GuideSlide[] = [
  {
    id: 1,
    tag: "Capitolo 1 • Benvenuto & Filosofia",
    title: "Benvenuto nell'Area Professionisti GentiLuna",
    subtitle: "Il tuo sistema operativo per consegne HD e acquisizione clienti dal vivo (0% commissioni)",
    narration:
      "Benvenuto nell'Area Riservata Professionisti di GentiLuna. Questa piattaforma è stata progettata da professionisti del wedding per offrirti due vantaggi concreti: primo, uno spazio cloud elegante per consegnare foto e video in alta definizione ai tuoi sposi; secondo, un sistema di marketing diretto che ti fa conoscere da tutti i centocinquanta invitati presenti a ogni matrimonio, con zero commissioni sui tuoi lavori e contatto diretto al cento per cento.",
    bullets: [
      "0% Commissioni sui lavori acquisiti: il contatto con gli sposi è diretto (WhatsApp, Telefono, Sito Web)",
      "Nessuna asta al ribasso: visibilità territoriale ordinata e meritocratica",
      "Doppio strumento: Gestione & Consegna Gallerie HD + Marketing automatico sugli invitati",
    ],
    visualType: "WELCOME_PRO",
  },
  {
    id: 2,
    tag: "Capitolo 2 • Vetrina & Portfolio Foto",
    title: "Come Completare il Profilo e Caricare le Foto",
    subtitle: "Supporto immagini ad alta risoluzione fino a 25 MB (JPG, PNG, WebP, HEIC, TIFF)",
    narration:
      "Il primo passo fondamentale è completare la tua Vetrina Pubblica. Clicca sul pulsante Il Mio Profilo o Completa la Vetrina. Inserisci il nome del tuo studio, la categoria, la città, una descrizione del tuo stile e i tuoi recapiti diretti. Nella sezione Portfolio puoi caricare le tue migliori fotografie fino a venticinque Megabyte ciascuna, inclusi i formati professionali JPEG, PNG, WebP, HEIC e TIFF. Una vetrina ricca e curata converte immediatamente gli ospiti che visitano la piattaforma.",
    bullets: [
      "Clicca su 'Il Mio Profilo' -> Inserisci Bio, Città, Telefono WhatsApp e Link al tuo Sito",
      "Carica Foto Copertina, Logo/Avatar e gli scatti migliori del tuo Portfolio (fino a 25 MB per file)",
      "Formati supportati: JPG, PNG, WebP, HEIC (iPhone) e TIFF senza perdita di qualità",
    ],
    visualType: "UPLOAD_PRO",
  },
  {
    id: 3,
    tag: "Capitolo 3 • Creazione Matrimoni & Gallerie HD",
    title: "Come Creare lo Spazio Sposi e Consegnare in HD",
    subtitle: "Gallerie private protette da PIN, divise in capitoli e senza compressione",
    narration:
      "Dalla tua Dashboard principale puoi creare in dieci secondi lo spazio digitale per una nuova coppia. Compila il riquadro Nuovo Matrimonio con il nome della sposa, il nome dello sposo e la data delle nozze, oppure usa il tasto Invita gli Sposi su WhatsApp. All'interno dell'evento potrai caricare le fotografie ufficiali in alta definizione, suddividerle in capitoli come Pre-wedding, Cerimonia, Ricevimento o Viaggio di Nozze, e proteggere l'accesso con un codice PIN riservato.",
    bullets: [
      "Box 'Nuovo Matrimonio': inserisci Nome Sposa, Nome Sposo e Data per generare subito il sito dell'evento",
      "Caricamento multiplo di foto in Alta Risoluzione senza la compressione distruttiva di WhatsApp",
      "Protezione tramite PIN privato e moderazione degli scatti caricati",
    ],
    visualType: "DELIVERY_PRO",
  },
  {
    id: 4,
    tag: "Capitolo 4 • Il Motore di Marketing: QR Code Live",
    title: "Come Sfruttare il QR Code ai Tavoli per Nuovi Clienti",
    subtitle: "Trasforma ogni banchetto nuziale in 150 contatti qualificati che vedono il tuo brand",
    narration:
      "Ecco come sfruttare GentiLuna per acquisire nuovi clienti a costo zero. Per ogni matrimonio viene generato un QR Code Live da posizionare sui tavoli del ricevimento. Durante la cena, tutti gli invitati inquadrano il QR Code per caricare e riguardare le foto spontanee della festa. In ogni schermata, gli ospiti vedono il tuo nome, il tuo logo di Fotografo o Wedding Planner ufficiale e il pulsante per contattarti direttamente. Chi ti vede lavorare dal vivo sarà il tuo prossimo cliente.",
    bullets: [
      "Scarica il QR Code dalla pagina del matrimonio e posizionalo sui segnatavolo in sala",
      "Gli invitati non devono scaricare nessuna app dagli store: si apre istantaneamente via web",
      "Il tuo Brand e il link al tuo profilo compaiono davanti a tutti gli ospiti durante e dopo le nozze",
    ],
    visualType: "QRCODE_PRO",
  },
  {
    id: 5,
    tag: "Capitolo 5 • Funzioni per Wedding Planner & Location",
    title: "Tableau Interattivo, RSVP e Gestione Intolleranze",
    subtitle: "Strumenti organizzativi completi per collaborare con Sposi, Catering e Sale Ricevimenti",
    narration:
      "Se sei una Wedding Planner, un gestore di Location o un fotografo che offre un servizio completo, puoi affiancare gli sposi anche nell'organizzazione logistica. La piattaforma include il modulo RSVP per le conferme di presenza, il censimento automatico di allergie e intolleranze alimentari, e il Tableau de Mariage interattivo per disporre gli ospiti sui tavoli rotondi o imperiali ed esportare il documento PDF pronto per la cucina e la sala.",
    bullets: [
      "Collaborazione diretta sullo spazio della coppia come Professionista Assegnato all'evento",
      "Monitoraggio conferme invitati, menu bambini, allergie, celiachia e intolleranze",
      "Mappa tavoli visuale ed esportazione PDF immediata per il maître di sala",
    ],
    visualType: "PLANNER_PRO",
  },
  {
    id: 6,
    tag: "Capitolo 6 • Guida ai Piani di Abbonamento PRO",
    title: "Cosa Puoi Fare con il Piano FREE vs Piani PRO",
    subtitle: "Confronto completo tra Vetrina Base Gratuita, Founders Club 49€, Entry, PRO e Diamond",
    narration:
      "Vediamo ora nel dettaglio cosa puoi fare con ciascun piano di abbonamento. Con il Piano FREE gratuito puoi accedere alla piattaforma e creare un profilo base, ma con gestione limitata e senza recapiti diretti né posizionamento in evidenza. Con il piano speciale Founders Club PRO a soli quarantanove euro per dodici mesi, riservato ai primi cinquanta professionisti, sblocchi tutto: Eventi e Spazi Sposi Illimitati, profilo VIP Partner in evidenza con contatti diretti, acquisizione lead dagli invitati via QR Code, consegna Album in Alta Risoluzione e modulo richiesta stampe a zero commissioni. Sono inoltre disponibili i piani annuali Entry a centoventi euro per gestire fino a tre eventi, PRO a duecentonovantanove euro per eventi illimitati e personalizzazione logo, e Diamond White-Label a quattrocentoquarantanove euro con pacchetti sposi inclusi e piattaforma con il tuo marchio.",
    bullets: [
      "PIANO FREE (0 €): Accesso base esplorativo, gestione limitata, profilo base senza recapiti diretti in vetrina",
      "FOUNDERS CLUB PRO (49 € / 12 mesi - Promo Primi 50): Eventi Illimitati, Vetrina VIP con contatti diretti, Lead da QR Code, Consegna HD e Modulo Stampe (0% commissioni)",
      "PRO ENTRY (120 €/anno): Fino a 3 Eventi all'anno, profilo directory fornitori e galleria privata sposi",
      "PRO ANNUALE (299 €/anno) & DIAMOND WHITE-LABEL (449 €/anno): Eventi illimitati, White-Label col tuo Logo e pacchetti sposi in stock",
    ],
    visualType: "PLANS_PRO",
  },
];

const COUPLE_SLIDES: GuideSlide[] = [
  {
    id: 1,
    tag: "Capitolo 1 • Benvenuti Sposi",
    title: "Benvenuti nella Vostra Area Riservata 'La Vostra Storia'",
    subtitle: "Un unico spazio magico per organizzare le nozze e custodire per sempre ogni ricordo",
    narration:
      "Benvenuti nella vostra Area Riservata Sposi su GentiLuna. Da questa dashboard potete gestire ogni fase del vostro matrimonio e dei capitoli più belli della vostra vita insieme: dalla pagina web dell'evento con mappe e lista nozze, alla disposizione dei tavoli e delle intolleranze alimentari, fino alla raccolta in alta definizione di tutte le fotografie scattate dai vostri invitati e dal vostro fotografo.",
    bullets: [
      "Un'unica Web-App elegante per voi e per i vostri invitati (senza dover installare app pesanti)",
      "Addio alle foto perse o sgranate sulle chat di WhatsApp dopo il matrimonio",
      "Suddivisione in Capitoli della vostra storia: Matrimonio, Viaggio di Nozze, Anniversari, Nascite",
    ],
    visualType: "WELCOME_COUPLE",
  },
  {
    id: 2,
    tag: "Capitolo 2 • Personalizzazione Evento & Capitoli",
    title: "Come Personalizzare il Matrimonio, Luoghi e Lista Regali",
    subtitle: "Foto di copertina, orari, mappe interattive e coordinate Lista Nozze / IBAN",
    narration:
      "Per iniziare, cliccate sul capitolo del vostro Matrimonio nella sezione I Vostri Capitoli. Qui potete caricare la vostra foto di copertina, scrivere un messaggio di benvenuto, inserire gli indirizzi e gli orari precisi della Cerimonia e del Ricevimento con mappa geolocalizzata, e aggiungere le indicazioni per la vostra Lista Nozze o codice IBAN. Potete anche creare nuovi capitoli cliccando su Aggiungi Capitolo per raccontare il vostro viaggio di nozze o altri eventi.",
    bullets: [
      "Personalizza foto di copertina, titolo, data e programma orario della giornata",
      "Mappe integrate per guidare gli invitati verso Chiesa, Comune e Location del ricevimento",
      "Sezione Lista Nozze / IBAN elegante e discreta consultabile dagli ospiti",
    ],
    visualType: "SETUP_COUPLE",
  },
  {
    id: 3,
    tag: "Capitolo 3 • Invitati, Conferme RSVP & Intolleranze",
    title: "Come Ricevere le Conferme RSVP e le Allergie degli Ospiti",
    subtitle: "Raccolta automatica di presenze, menu bambini, celiachia e intolleranze alimentari",
    narration:
      "Dimenticate i fogli di carta e le decine di telefonate per sapere chi parteciperà. Condividendo il link del vostro spazio GentiLuna su WhatsApp, i vostri invitati possono confermare la loro presenza con un semplice clic, indicando il numero di accompagnatori, la richiesta di menu bambini ed eventuali allergie o intolleranze alimentari come celiachia, intolleranza al lattosio, menu vegetariano o vegano.",
    bullets: [
      "Link d'invito condivisibile su WhatsApp con tutti i vostri amici e parenti",
      "Modulo RSVP intuitivo: ogni ospite conferma presenza, accompagnatori ed esigenze alimentari",
      "Elenco sempre aggiornato in tempo reale nella vostra area riservata",
    ],
    visualType: "RSVP_COUPLE",
  },
  {
    id: 4,
    tag: "Capitolo 4 • Tableau de Mariage & Mappa Tavoli",
    title: "Come Creare i Tavoli ed Esportare il PDF per il Catering",
    subtitle: "Disponi gli ospiti su tavoli rotondi o imperiali e stampa il riepilogo ufficiale",
    narration:
      "All'interno della sezione Gestione Tavoli potete progettare il vostro Tableau de Mariage in modo semplice e visivo. Create i tavoli scegliendo tra formato rotondo o tavolata imperiale, date un nome a ciascun tavolo e assegnate i posti agli invitati confermati. Il sistema evidenzia automaticamente le intolleranze presenti a ogni tavolo e vi permette di esportare il documento PDF completo da inviare direttamente al catering e alla location.",
    bullets: [
      "Crea tavoli rotondi o imperiali e assegna gli invitati con un clic",
      "Controllo automatico dei posti occupati e delle note alimentari per singolo tavolo",
      "Esportazione PDF del Tableau de Mariage pronta per la stampa e per il responsabile di sala",
    ],
    visualType: "TABLEAU_COUPLE",
  },
  {
    id: 5,
    tag: "Capitolo 5 • Caricamento Foto, QR Code & Live Wall",
    title: "Come Raccogliere le Foto degli Invitati e Proiettarle in Sala",
    subtitle: "QR Code sui tavoli, approvazione scatti, Guestbook dediche e proiezione GentiLuna LIVE",
    narration:
      "Ecco come funziona la raccolta delle fotografie durante la festa. Dalla pagina del vostro evento potete scaricare il QR Code ufficiale da stampare sui segnatavolo. Durante il ricevimento, gli invitati inquadrano il QR Code con il proprio telefono e caricano all'istante le loro foto più belle e le dediche nel Guestbook digitale. Nella vostra dashboard comparirà il riquadro Foto in attesa di approvazione: vi basta premere la spunta verde per pubblicarle nell'album o proiettarle in diretta sul maxischermo della sala con GentiLuna LIVE!",
    bullets: [
      "QR Code da tavolo: gli ospiti caricano foto in alta qualità senza installare alcuna applicazione",
      "Pannello Moderazione: approvate o rifiutate le foto caricate dagli ospiti con un tocco",
      "GentiLuna LIVE: proiezione spettacolare in tempo reale delle foto sul maxischermo durante la festa",
    ],
    visualType: "QRCODE_COUPLE",
  },
  {
    id: 6,
    tag: "Capitolo 6 • Guida ai Piani di Abbonamento Sposi",
    title: "Cosa Potete Fare con i Piani FREE, BASE, PREMIUM e DIAMOND",
    subtitle: "Tutte le differenze di spazio cloud, numero foto, funzioni e durata (Annuale o 3 Anni)",
    narration:
      "Vediamo infine cosa offre ciascun piano di abbonamento per gli sposi. Con l'accesso iniziale di prova potete esplorare la dashboard e caricare fino a venti foto di test. Il Piano BASE, a centoquarantanove euro per un anno o duecentoquarantanove euro per tre anni, include tre Gigabyte di spazio cloud, fino a venti foto, un capitolo evento e il sito pubblico con mappe, orari e lista nozze. Il Piano PREMIUM, il più scelto dalle coppie a trecentonovantanove euro l'anno o quattrocentonovantanove euro per tre anni, sblocca cinque Gigabyte di cloud fino a cinquecento foto, quindici capitoli della vostra storia, la Gestione Tavoli interattiva con RSVP illimitati, l'upload foto diretto dagli invitati tramite QR Code da tavolo e il Guestbook digitale. Infine il Piano DIAMOND, a quattrocentoquarantanove euro l'anno o seicentosettantatré euro e cinquanta per tre anni, vi offre cinquanta Gigabyte in alta risoluzione, trenta capitoli, la proiezione in sala in tempo reale GentiLuna LIVE e l'esportazione PDF personalizzabile del Tableau.",
    bullets: [
      "PIANO BASE (149 € Annuale / 249 € per 3 Anni): 3 GB Cloud, fino a 20 foto, 1 Capitolo, Sito evento con mappe, orari e Lista Nozze/IBAN",
      "PIANO PREMIUM (399 € Annuale / 499 € per 3 Anni - Più Scelto): 5 GB Cloud (fino a 500 foto), 15 Capitoli, Gestione Tavoli & RSVP illimitati, Upload Foto Invitati con QR Code e Guestbook",
      "PIANO DIAMOND (449 € Annuale / 673,50 € per 3 Anni - Lusso): 50 GB Cloud HD, 30 Capitoli, Proiezione in sala GentiLuna LIVE ed Esportazione PDF Tavoli e Tableau personalizzabile",
    ],
    visualType: "PLANS_COUPLE",
  },
];

export function VideoGuidePlayer({ role }: { role: "PHOTOGRAPHER" | "COUPLE" }) {
  const slides = role === "PHOTOGRAPHER" ? PRO_SLIDES : COUPLE_SLIDES;
  const isPro = role === "PHOTOGRAPHER";

  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const playerContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentSlide = slides[currentIndex];

  const stopSpeech = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const speakSlide = useCallback(
    (index: number, muted: boolean) => {
      stopSpeech();
      setProgress(0);
      const slide = slides[index];
      if (!slide) return;

      const estimatedDurationMs = Math.max(12000, slide.narration.length * 62);
      const startTime = Date.now();

      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min(99, Math.round((elapsed / estimatedDurationMs) * 100));
        setProgress(pct);
      }, 200);

      if (typeof window !== "undefined" && "speechSynthesis" in window && !muted) {
        const utterance = new SpeechSynthesisUtterance(slide.narration);
        utterance.lang = "it-IT";
        utterance.rate = 1.02;
        utterance.pitch = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const itVoice =
          voices.find((v) => v.lang.toLowerCase().includes("it") && v.name.toLowerCase().includes("natural")) ||
          voices.find((v) => v.lang.toLowerCase().includes("it") && v.name.toLowerCase().includes("elsa")) ||
          voices.find((v) => v.lang.toLowerCase().includes("it"));
        if (itVoice) utterance.voice = itVoice;

        utterance.onend = () => {
          if (timerRef.current) clearInterval(timerRef.current);
          setProgress(100);
          if (index < slides.length - 1) {
            setTimeout(() => {
              setCurrentIndex(index + 1);
            }, 900);
          } else {
            setIsPlaying(false);
          }
        };

        utterance.onerror = () => {
          if (timerRef.current) clearInterval(timerRef.current);
        };

        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback auto-advance if muted or speechSynthesis unavailable
        setTimeout(() => {
          if (timerRef.current) clearInterval(timerRef.current);
          setProgress(100);
          if (index < slides.length - 1) {
            setCurrentIndex(index + 1);
          } else {
            setIsPlaying(false);
          }
        }, estimatedDurationMs);
      }
    },
    [slides, stopSpeech]
  );

  useEffect(() => {
    if (isOpen && isPlaying) {
      speakSlide(currentIndex, isMuted);
    } else {
      stopSpeech();
    }
    return () => stopSpeech();
  }, [isOpen, isPlaying, currentIndex, isMuted, speakSlide, stopSpeech]);

  const handleOpenAndPlay = (startIdx = 0) => {
    setCurrentIndex(startIdx);
    setIsOpen(true);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleToggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="mb-8">
      {/* BANNER DI LANCIO NELL'AREA RISERVATA */}
      {!isOpen && (
        <div
          className={`rounded-3xl p-6 md:p-8 border shadow-md transition-all relative overflow-hidden ${
            isPro
              ? "bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 text-white border-amber-500/30"
              : "bg-gradient-to-r from-rose-950 via-stone-900 to-amber-950 text-white border-rose-400/30"
          }`}
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-amber-300 border border-white/15">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                Video-Guida Interattiva con Voce Italiana • 6 Capitoli
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold">
                {isPro
                  ? "Come Sfruttare GentiLuna al 100% & Guida ai Piani Professionisti"
                  : "Guida Completa al Vostro Matrimonio Digitale & Confronto Piani Sposi"}
              </h2>
              <p className="text-stone-300 text-sm md:text-base leading-relaxed">
                {isPro
                  ? "Ascolta e guarda il tutorial vocale passo-passo: come caricare il portfolio fino a 25 MB, creare le gallerie HD protette da PIN, acquisire clienti con il QR Code ai tavoli e scoprire tutte le differenze tra Piano FREE e Piani PRO."
                  : "Ascolta e guarda il tutorial vocale passo-passo: come personalizzare il matrimonio, ricevere le conferme RSVP e le intolleranze, creare il Tableau dei tavoli, stampare il QR Code per le foto degli invitati e confrontare i piani FREE, BASE, PREMIUM e DIAMOND."}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => handleOpenAndPlay(idx)}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 transition-colors border border-white/10 flex items-center gap-1.5"
                  >
                    <Play className="w-3 h-3 text-amber-400 fill-amber-400" />
                    {idx + 1}. {s.tag.split("•")[1]?.trim() || s.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="shrink-0 w-full lg:w-auto">
              <Button
                onClick={() => handleOpenAndPlay(0)}
                className={`w-full lg:w-auto rounded-full px-8 py-6 text-base font-bold shadow-xl flex items-center justify-center gap-3 ${
                  isPro
                    ? "bg-amber-500 hover:bg-amber-400 text-stone-950"
                    : "bg-rose-500 hover:bg-rose-400 text-white"
                }`}
              >
                <Play className="w-5 h-5 fill-current" />
                Avvia Video-Guida con Voce
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* PLAYER VIDEO CINEMATOGRAFICO CON VOCE */}
      {isOpen && (
        <div
          ref={playerContainerRef}
          className="rounded-3xl bg-stone-950 text-white border border-stone-800 shadow-2xl overflow-hidden flex flex-col"
        >
          {/* TOP BAR PLAYER */}
          <div className="bg-stone-900/90 border-b border-stone-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isPlaying ? "bg-emerald-400" : "bg-amber-400"
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${
                    isPlaying ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                ></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                {isPro ? "VIDEO-GUIDA UFFICIALE PROFESSIONISTI" : "VIDEO-GUIDA UFFICIALE SPOSI"} • CAPITOLO{" "}
                {currentIndex + 1} DI {slides.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleFullscreen}
                className="text-stone-300 hover:text-white hover:bg-stone-800 rounded-full text-xs gap-1.5"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                {isFullscreen ? "Riduci" : "Schermo Intero"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsPlaying(false);
                  setIsOpen(false);
                }}
                className="text-stone-400 hover:text-white hover:bg-stone-800 rounded-full text-xs"
              >
                Chiudi Player ✕
              </Button>
            </div>
          </div>

          {/* SELETTORE CAPITOLI RAPIDO */}
          <div className="bg-stone-900/50 border-b border-stone-800/80 px-6 py-2.5 flex items-center gap-2 overflow-x-auto">
            {slides.map((s, idx) => {
              const active = idx === currentIndex;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsPlaying(true);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? isPro
                        ? "bg-amber-500 text-stone-950 shadow-md"
                        : "bg-rose-500 text-white shadow-md"
                      : "bg-stone-800/70 text-stone-400 hover:bg-stone-800 hover:text-stone-200"
                  }`}
                >
                  {idx + 1}. {s.tag.split("•")[1]?.trim()}
                </button>
              );
            })}
          </div>

          {/* SCHERMO CENTRALE ANIMATO */}
          <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[420px] bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950">
            {/* COLONNA TESTO & PUNTI CHIAVE */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                {currentSlide.tag}
              </div>

              <h3 className="text-2xl md:text-4xl font-serif font-bold leading-tight text-white">
                {currentSlide.title}
              </h3>

              <p className="text-amber-200/90 text-sm md:text-base font-medium">
                {currentSlide.subtitle}
              </p>

              <div className="space-y-3 pt-2">
                {currentSlide.bullets.map((b, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-3.5"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-stone-200 leading-snug">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* COLONNA SCHERMATA DIMOSTRATIVA INTERATTIVA */}
            <div className="lg:col-span-6">
              {currentSlide.visualType === "PLANS_PRO" ? (
                <div className="bg-stone-900/90 border border-amber-500/30 rounded-2xl p-5 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                    <span className="font-serif font-bold text-amber-400 flex items-center gap-2">
                      <Crown className="w-5 h-5" /> Tabella Piani Professionisti
                    </span>
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                      0% Commissioni
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-1.5">
                      <div className="font-bold text-stone-300 flex justify-between">
                        <span>PIANO FREE</span>
                        <span className="text-stone-400">0 €</span>
                      </div>
                      <p className="text-stone-400">• Accesso base alla dashboard</p>
                      <p className="text-stone-400">• Gestione limitata</p>
                      <p className="text-rose-400 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> No contatti diretti in vetrina
                      </p>
                      <p className="text-rose-400 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> No Lead da QR Code invitati
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-900/20 border-2 border-amber-400 space-y-1.5">
                      <div className="font-bold text-amber-300 flex justify-between">
                        <span>FOUNDERS PRO</span>
                        <span className="bg-amber-400 text-stone-950 px-2 rounded font-extrabold">49 € / anno</span>
                      </div>
                      <p className="text-emerald-300">✓ Eventi & Spazi Sposi Illimitati</p>
                      <p className="text-emerald-300">✓ Vetrina VIP con contatti diretti</p>
                      <p className="text-emerald-300">✓ Lead automatici da QR Code</p>
                      <p className="text-emerald-300">✓ Consegna Album HD & Stampe</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
                      <div className="font-bold text-stone-200 flex justify-between">
                        <span>PRO ENTRY</span>
                        <span className="text-amber-400">120 € / anno</span>
                      </div>
                      <p className="text-stone-300">✓ Fino a 3 Eventi all&apos;anno</p>
                      <p className="text-stone-300">✓ Galleria privata sposi & Directory</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
                      <div className="font-bold text-stone-200 flex justify-between">
                        <span>PRO 299€ / DIAMOND 449€</span>
                      </div>
                      <p className="text-stone-300">✓ Eventi Illimitati & Logo Galleria</p>
                      <p className="text-stone-300">✓ White-Label & Pacchetti Sposi</p>
                    </div>
                  </div>
                </div>
              ) : currentSlide.visualType === "PLANS_COUPLE" ? (
                <div className="bg-stone-900/90 border border-rose-500/30 rounded-2xl p-5 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                    <span className="font-serif font-bold text-rose-300 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-rose-400" /> Confronto Piani Sposi (Annuale o 3 Anni)
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
                      <div className="font-bold text-stone-300 flex justify-between">
                        <span>FREE (Prova)</span>
                        <span>0 €</span>
                      </div>
                      <p className="text-stone-400">✓ Test fino a 20 foto (3 GB)</p>
                      <p className="text-rose-400">✕ No Gestione Tavoli / No Live Wall</p>
                    </div>

                    <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
                      <div className="font-bold text-stone-200 flex justify-between">
                        <span>PIANO BASE</span>
                        <span className="text-rose-300">149€ (1a) / 249€ (3a)</span>
                      </div>
                      <p className="text-stone-300">✓ 3 GB Cloud • Fino a 20 foto</p>
                      <p className="text-stone-300">✓ 1 Capitolo • Sito, Mappe & IBAN</p>
                    </div>

                    <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-500/10 border-2 border-rose-400 space-y-1">
                      <div className="font-bold text-rose-200 flex justify-between">
                        <span>PREMIUM (Più Scelto)</span>
                        <span className="text-amber-300">399€ (1a) / 499€ (3a)</span>
                      </div>
                      <p className="text-emerald-300">✓ 5 GB Cloud (fino a 500 foto)</p>
                      <p className="text-emerald-300">✓ 15 Capitoli • Tavoli & RSVP illimitati</p>
                      <p className="text-emerald-300">✓ Upload Foto Invitati via QR Code</p>
                    </div>

                    <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-stone-900 border border-amber-400/60 space-y-1">
                      <div className="font-bold text-amber-300 flex justify-between">
                        <span>DIAMOND (Lusso)</span>
                        <span>449€ (1a) / 673,50€ (3a)</span>
                      </div>
                      <p className="text-emerald-300">✓ 50 GB Cloud Alta Risoluzione</p>
                      <p className="text-emerald-300">✓ 30 Capitoli • GentiLuna LIVE in sala</p>
                      <p className="text-emerald-300">✓ Export PDF Tableau personalizzabile</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-stone-900/80 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-xs text-stone-400 ml-2 font-mono">www.gentiluna.com</span>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/10 text-amber-300">
                      Simulazione Guidata
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-stone-950/90 border border-stone-800 flex flex-col items-center text-center gap-2">
                      {isPro ? (
                        <Camera className="w-8 h-8 text-amber-400" />
                      ) : (
                        <QrCode className="w-8 h-8 text-rose-400" />
                      )}
                      <div className="text-sm font-bold">
                        {isPro ? "Upload HD fino a 25 MB" : "QR Code Live sui Tavoli"}
                      </div>
                      <p className="text-xs text-stone-400">
                        {isPro
                          ? "JPG, PNG, WebP, HEIC e TIFF senza errori né blocchi"
                          : "Gli ospiti inquadrano e caricano foto senza scaricare app"}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-950/90 border border-stone-800 flex flex-col items-center text-center gap-2">
                      {isPro ? (
                        <QrCode className="w-8 h-8 text-emerald-400" />
                      ) : (
                        <Users className="w-8 h-8 text-amber-400" />
                      )}
                      <div className="text-sm font-bold">
                        {isPro ? "Il Tuo Brand su 150 Ospiti" : "Tableau & Intolleranze"}
                      </div>
                      <p className="text-xs text-stone-400">
                        {isPro
                          ? "Ogni invitato vede i tuoi contatti mentre guarda le foto"
                          : "Mappa tavoli rotondi/imperiali ed export PDF per il catering"}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-950/90 border border-stone-800 flex flex-col items-center text-center gap-2">
                      <ShieldCheck className="w-8 h-8 text-blue-400" />
                      <div className="text-sm font-bold">Cloud Privato & PIN</div>
                      <p className="text-xs text-stone-400">
                        {isPro
                          ? "100% proprietà delle immagini tua e degli sposi (GDPR)"
                          : "Moderazione foto ospiti con un clic prima della pubblicazione"}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-950/90 border border-stone-800 flex flex-col items-center text-center gap-2">
                      {isPro ? (
                        <Crown className="w-8 h-8 text-amber-400" />
                      ) : (
                        <Tv className="w-8 h-8 text-emerald-400" />
                      )}
                      <div className="text-sm font-bold">
                        {isPro ? "0% Commissioni" : "GentiLuna LIVE Wall"}
                      </div>
                      <p className="text-xs text-stone-400">
                        {isPro
                          ? "Contatto diretto WhatsApp/Telefono senza intermediari"
                          : "Proiezione in tempo reale su maxischermo durante la festa"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SOTTOTITOLI VOCE SINCRONIZZATI */}
          <div className="bg-stone-900/95 border-t border-stone-800 px-6 py-4">
            <div className="flex items-start gap-3 max-w-5xl mx-auto">
              <Volume2
                className={`w-5 h-5 shrink-0 mt-0.5 ${
                  isPlaying && !isMuted ? "text-amber-400 animate-bounce" : "text-stone-500"
                }`}
              />
              <p className="text-xs md:text-sm text-stone-300 italic leading-relaxed">
                &ldquo;{currentSlide.narration}&rdquo;
              </p>
            </div>
          </div>

          {/* BARRA DI AVANZAMENTO & CONTROLLI AUDIO/VIDEO */}
          <div className="bg-stone-950 px-6 py-4 border-t border-stone-800 flex flex-col gap-3">
            <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-200 ${
                  isPro ? "bg-amber-500" : "bg-rose-500"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleTogglePlay}
                  className={`rounded-full px-5 font-bold gap-2 ${
                    isPro
                      ? "bg-amber-500 hover:bg-amber-400 text-stone-950"
                      : "bg-rose-500 hover:bg-rose-400 text-white"
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  {isPlaying ? "Pausa Voce" : "Riproduci Voce"}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => speakSlide(currentIndex, isMuted)}
                  title="Riascolta capitolo"
                  className="rounded-full border-stone-700 bg-stone-900 text-stone-200 hover:bg-stone-800"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleToggleMute}
                  title={isMuted ? "Attiva audio voce" : "Disattiva audio voce"}
                  className="rounded-full border-stone-700 bg-stone-900 text-stone-200 hover:bg-stone-800"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentIndex === 0}
                  onClick={() => {
                    setCurrentIndex((i) => Math.max(0, i - 1));
                    setIsPlaying(true);
                  }}
                  className="rounded-full border-stone-700 bg-stone-900 text-stone-200 hover:bg-stone-800 gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Precedente
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentIndex === slides.length - 1}
                  onClick={() => {
                    setCurrentIndex((i) => Math.min(slides.length - 1, i + 1));
                    setIsPlaying(true);
                  }}
                  className="rounded-full border-stone-700 bg-stone-900 text-stone-200 hover:bg-stone-800 gap-1"
                >
                  Successivo <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
