"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Sparkles, X, Send, Moon, ShieldCheck, ArrowUpRight, Bot, Minimize2 } from "lucide-react";

type AssistantContext = "PUBLIC" | "LOGIN" | "COUPLE" | "PRO";

interface ChatMsg {
  id: string;
  role: "assistant" | "user";
  text: string;
  links?: { label: string; href: string }[];
}

const CONTEXT_CONFIG: Record<
  AssistantContext,
  {
    subtitle: string;
    greeting: string;
    chips: string[];
  }
> = {
  PUBLIC: {
    subtitle: "Guida Virtuale AI • Sposi & Fornitori",
    greeting:
      "Ciao! Sono **Luna ✨**, l'assistente virtuale AI di GentiLuna. Posso aiutarti a scoprire come funziona il sito matrimonio, i piani, il QR Code per le foto live o come contattare un fornitore verificato!",
    chips: [
      "Aiutami col budget matrimonio",
      "Cos'è GentiLuna?",
      "Quanto costano i piani?",
      "Come funziona il QR Code foto?",
    ],
  },
  LOGIN: {
    subtitle: "Guida Virtuale AI • Accesso & Registrazione",
    greeting:
      "Benvenuto! Sono **Luna ✨**, l'assistente virtuale AI di GentiLuna. Hai dubbi su quale ruolo scegliere tra **Sposi** e **Professionista** o su come accedere al tuo spazio?",
    chips: [
      "Come mi registro come Sposi?",
      "Come mi registro come Fotografo?",
      "Ho dimenticato la password",
      "Quanto costa iniziare?",
    ],
  },
  COUPLE: {
    subtitle: "Guida Virtuale AI • Area Sposi",
    greeting:
      "Ciao sposi! 💍 Sono **Luna ✨**, la vostra assistente AI. Chiedetemi pure come completare il vostro sito matrimonio, aggiungere location, invitati, tavoli o condividere i capitoli su WhatsApp!",
    chips: [
      "Aiutami col budget matrimonio",
      "Come completo il nostro sito?",
      "Come condivido un capitolo su WhatsApp?",
      "Come gestisco invitati e tavoli?",
    ],
  },
  PRO: {
    subtitle: "Guida Virtuale AI • Area Professionisti",
    greeting:
      "Ciao Partner! 📸 Sono **Luna ✨**, l'assistente virtuale AI di GentiLuna. Ti aiuto a portare la tua vetrina al 100%, gestire preventivi tracciati, Live Chat protetta e spazi sposi!",
    chips: [
      "Come completo la vetrina al 100%?",
      "Perché i contatti sono protetti?",
      "Come funzionano i piani PRO?",
      "Come funziona il QR Code lead?",
    ],
  },
};

function renderFormattedText(text: string) {
  return text.split("\n").map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className={i > 0 ? "mt-1.5" : ""}>
        {parts.map((part, j) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={j} className="font-semibold">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return <span key={j}>{part}</span>;
        })}
      </p>
    );
  });
}

export default function LunaAssistant() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (window.localStorage.getItem("gentiluna_luna_minimized") === "1") {
        setMinimized(true);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const handleToggleMinimize = (nextState: boolean) => {
    setMinimized(nextState);
    if (nextState) setOpen(false);
    try {
      window.localStorage.setItem("gentiluna_luna_minimized", nextState ? "1" : "0");
    } catch {
      // ignore storage errors
    }
  };

  // Nascondi l'assistente sulle pagine pubbliche romantiche degli invitati e sul pannello Admin
  const shouldHide =
    pathname.startsWith("/w/") ||
    pathname.startsWith("/live/") ||
    pathname.startsWith("/admin");

  const context: AssistantContext = pathname.startsWith("/couple")
    ? "COUPLE"
    : pathname.startsWith("/dashboard")
    ? "PRO"
    : pathname.startsWith("/login")
    ? "LOGIN"
    : "PUBLIC";

  const cfg = CONTEXT_CONFIG[context];

  // Inizializza/aggiorna il saluto al cambio di contesto se la chat è vuota o al primo avvio
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 0) {
        return [{ id: "welcome", role: "assistant", text: cfg.greeting }];
      }
      if (prev.length === 1 && prev[0].id === "welcome") {
        return [{ id: "welcome", role: "assistant", text: cfg.greeting }];
      }
      return prev;
    });
  }, [cfg.greeting]);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, loading]);

  if (shouldHide) return null;

  const sendQuestion = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMsg = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, context }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: "assistant",
            text: data.error || "Ops! Non sono riuscita a rispondere. Riprova tra un attimo.",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: "assistant",
            text: data.reply,
            links: data.links,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          text: "Connessione momentaneamente non disponibile. Puoi contattare il nostro team dalla pagina Assistenza!",
          links: [{ label: "Vai ad Assistenza", href: "/assistenza" }],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed right-3 sm:right-5 z-40 flex flex-col items-end pointer-events-none ${
        pathname.startsWith("/login") ? "bottom-3 sm:bottom-6" : "bottom-4 sm:bottom-6"
      }`}
    >
      {/* FINESTRA CHAT */}
      {open && (
        <div className="pointer-events-auto mb-3 w-[calc(100vw-1.5rem)] sm:w-[380px] max-h-[70vh] bg-white rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-stone-900 text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center shadow-md shrink-0">
                <Moon className="w-5 h-5 text-white fill-white/20" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-base leading-none">Luna</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-white/15 text-amber-200 px-2 py-0.5 rounded-full">
                    <Bot className="w-3 h-3" /> Assistente AI
                  </span>
                </div>
                <p className="text-[11px] text-stone-300 mt-1">{cfg.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleToggleMinimize(true)}
                title="Riduci a icona"
                aria-label="Riduci assistente Luna a icona"
                className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Chiudi finestra chat Luna"
                className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Informativa Trasparenza EU AI Act Art. 50 & GDPR */}
          <div className="bg-amber-50/90 border-b border-amber-200/70 px-4 py-2 text-[11px] text-amber-950 flex items-start gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
            <span>
              Interagisci con un <strong>sistema AI</strong> (Art. 50 Reg. UE 2024/1689). Non inserire password o dati sensibili.{" "}
              <Link href="/privacy" className="underline font-medium hover:text-rose-600">
                Privacy
              </Link>{" "}
              ·{" "}
              <Link href="/assistenza" className="underline font-medium hover:text-rose-600">
                Team Umano
              </Link>
            </span>
          </div>

          {/* Messaggi */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#faf9f8] min-h-[240px] max-h-[380px]"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-stone-900 text-white rounded-br-sm"
                      : "bg-white text-stone-800 border border-stone-200 rounded-bl-sm"
                  }`}
                >
                  {renderFormattedText(msg.text)}

                  {msg.links && msg.links.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-stone-100">
                      {msg.links.map((lk, idx) => (
                        <Link
                          key={idx}
                          href={lk.href}
                          onClick={() => setOpen(false)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full transition-colors"
                        >
                          {lk.label}
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-start">
                <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-sm px-4 py-2.5 text-xs text-stone-500 flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-spin" />
                  Luna sta scrivendo...
                </div>
              </div>
            )}

            {/* Quick Chips contestuali */}
            {messages.length <= 2 && !loading && (
              <div className="pt-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Domande frequenti:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {cfg.chips.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => sendQuestion(chip)}
                      className="text-left text-xs bg-white hover:bg-rose-50 text-stone-700 hover:text-rose-700 border border-stone-200 hover:border-rose-200 px-3 py-1.5 rounded-full transition-colors shadow-xs cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendQuestion(input);
            }}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Fai una domanda a Luna..."
              maxLength={600}
              className="flex-1 bg-stone-100 hover:bg-stone-100/80 focus:bg-white border border-transparent focus:border-stone-300 rounded-full px-4 py-2 text-sm text-stone-800 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Invia domanda"
              className="w-10 h-10 rounded-full bg-stone-900 hover:bg-rose-600 text-white flex items-center justify-center shrink-0 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* PULSANTE FLOATING "CHIEDI A LUNA" / MINI STATO */}
      {(minimized || pathname.startsWith("/login")) && !open ? (
        <button
          type="button"
          onClick={() => {
            if (minimized) handleToggleMinimize(false);
            setOpen(true);
          }}
          title="Chiedi a Luna - Assistente AI"
          aria-label="Apri Assistente AI Luna"
          className="pointer-events-auto flex items-center gap-1.5 bg-stone-900/90 hover:bg-stone-900 text-white p-2 sm:px-3 sm:py-2 rounded-full shadow-lg border border-white/15 backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-rose-500 to-amber-400">
            <Moon className="w-3.5 h-3.5 text-white fill-white/25" />
          </span>
          <span className="hidden sm:inline text-[11px] font-semibold pr-0.5">Luna AI</span>
        </button>
      ) : (
        <div className="pointer-events-auto flex items-center gap-1.5 bg-stone-900/95 hover:bg-stone-900 text-white pl-2.5 pr-2 py-2 rounded-full shadow-xl border border-white/15 backdrop-blur-md transition-all">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Apri Assistente AI Luna"
            className="flex items-center gap-2 pr-1 cursor-pointer"
          >
            <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 shadow-inner shrink-0">
              {open ? (
                <X className="w-3.5 h-3.5 text-white" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-white fill-white/25" />
              )}
              {!open && (
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 border border-stone-900"></span>
                </span>
              )}
            </span>
            <div className="text-left">
              <div className="text-[11px] sm:text-xs font-bold leading-tight flex items-center gap-1">
                Chiedi a Luna <Sparkles className="w-3 h-3 text-amber-300" />
              </div>
              <div className="text-[9px] sm:text-[10px] text-stone-300 leading-tight">Assistente AI</div>
            </div>
          </button>
          {!open && (
            <button
              type="button"
              onClick={() => handleToggleMinimize(true)}
              title="Minimizza Luna"
              aria-label="Minimizza assistente Luna"
              className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
