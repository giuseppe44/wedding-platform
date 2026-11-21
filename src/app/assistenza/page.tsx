import Link from "next/link";
import { ArrowLeft, Phone, MessageCircle, UserPlus, LifeBuoy, KeyRound, Camera, Clock } from "lucide-react";
import Footer from "@/components/Footer";
import InstallApp from "@/components/InstallApp";
import { GentiLunaLogo } from "@/components/GentiLunaLogo";

export const metadata = {
  title: "Assistenza Clienti | GentiLuna",
  description:
    "Hai bisogno di aiuto per registrarti o usare GentiLuna? Contatta Michele, referente assistenza clienti, via telefono o WhatsApp.",
};

const PHONE_DISPLAY = "+39 388 124 0248";
const PHONE_TEL = "+393881240248";
const WA_LINK = "https://wa.me/393881240248?text=" + encodeURIComponent("Ciao Michele, ho bisogno di assistenza su GentiLuna.");

const topics = [
  { icon: UserPlus, title: "Registrazione", text: "Come creare l'account come sposo o professionista e scegliere il piano." },
  { icon: KeyRound, title: "Accesso e password", text: "Problemi di login, credenziali dimenticate o account da verificare." },
  { icon: Camera, title: "Uso della piattaforma", text: "Caricare foto, creare capitoli, gestire invitati, RSVP e consegna album." },
  { icon: LifeBuoy, title: "Problemi e segnalazioni", text: "Qualcosa non funziona? Raccontacelo e lo risolviamo insieme." },
];

export default function AssistenzaPage() {
  return (
    <div className="min-h-screen bg-[#faf9f8] flex flex-col font-sans text-stone-800">
      <nav className="bg-stone-950 text-white px-6 py-5 border-b border-stone-800">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-2xl font-serif text-white">
            <GentiLunaLogo className="w-7 h-7 shrink-0" /> GentiLuna
          </Link>
          <Link href="/" className="text-sm text-stone-300 hover:text-white flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Torna alla Home
          </Link>
        </div>
      </nav>

      <section className="bg-stone-950 text-white pb-16 pt-12 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-widest mb-6">
            <LifeBuoy className="w-4 h-4" /> Assistenza Clienti
          </div>
          <h1 className="text-4xl md:text-6xl font-serif mb-5">Siamo qui per aiutarti</h1>
          <p className="text-stone-300 text-lg font-light">
            Assistenza dedicata a sposi, professionisti e clienti per registrazioni, utilizzo della piattaforma e
            qualsiasi problema tecnico.
          </p>
        </div>
      </section>

      <main className="flex-grow px-4 pb-16 -mt-8">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-lg p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-2">Il tuo referente</p>
                <h2 className="text-3xl font-serif text-stone-900 mb-2">Michele</h2>
                <p className="text-stone-500 mb-4">
                  Socio fondatore di GentiLuna: ti risponde personalmente, che tu sia un professionista o un cliente.
                </p>
                <p className="text-2xl font-semibold text-stone-900">{PHONE_DISPLAY}</p>
                <p className="flex items-center gap-2 text-sm text-stone-500 mt-2">
                  <Clock className="w-4 h-4" /> Telefono e WhatsApp
                </p>
              </div>
              <div className="flex flex-col gap-3 md:w-64">
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors"
                >
                  <MessageCircle className="w-5 h-5" /> Scrivi su WhatsApp
                </a>
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="inline-flex items-center justify-center gap-2 h-12 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-semibold transition-colors"
                >
                  <Phone className="w-5 h-5" /> Chiama ora
                </a>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-serif text-stone-900 mb-5 text-center">Per cosa possiamo aiutarti</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {topics.map((t) => (
                <div key={t.title} className="bg-white rounded-2xl border border-stone-200 p-6 flex gap-4">
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center">
                    <t.icon className="w-5 h-5 text-rose-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900 mb-1">{t.title}</h3>
                    <p className="text-sm text-stone-500">{t.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <InstallApp />

          <p className="text-center text-xs text-stone-400">
            Questa pagina è dedicata all&apos;assistenza tecnica e alle registrazioni. Per questioni legali o privacy scrivi a{" "}
            <a href="mailto:info@gentiluna.com" className="underline">info@gentiluna.com</a>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
