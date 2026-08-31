import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Camera, Image as ImageIcon, Video, Heart, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      {/* Header */}
      <header className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
        <div className="font-serif text-2xl font-bold tracking-tighter text-white drop-shadow-md">
          Wedding<span className="font-light">Space</span>
        </div>
        <Link href="/login">
          <Button variant="outline" className="bg-white/90 backdrop-blur-sm text-stone-900 hover:bg-white rounded-full">
            Accedi
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop" 
            alt="Wedding background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-stone-900/40 mix-blend-multiply" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-16">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium tracking-wide">
            LA PIATTAFORMA N.1 PER PROFESSIONISTI DEL MATRIMONIO
          </div>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 drop-shadow-xl leading-tight">
            Il matrimonio visto<br />attraverso gli occhi di tutti.
          </h1>
          <p className="text-xl md:text-2xl text-stone-200 mb-10 font-light drop-shadow-md max-w-3xl mx-auto">
            Offri ai tuoi sposi una Digital Wedding Experience indimenticabile. Raccogli foto, video e dediche dagli invitati in uno spazio elegante, privato e sicuro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/w/demo-chiara-e-matteo">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-white text-stone-900 hover:bg-stone-200 transition-all shadow-xl font-semibold">
                Esplora Lato Invitati
              </Button>
            </Link>
            <form action="/login" method="POST" className="inline-block">
              {/* Form fittizio per reindirizzare direttamente alla dashboard sposi in demo */}
              <input type="hidden" name="role" value="COUPLE" />
              <Button formAction={async () => {
                "use server";
                const { loginAction } = await import("@/app/actions");
                await loginAction("COUPLE");
                const { redirect } = await import("next/navigation");
                redirect("/couple/demo-chiara-e-matteo");
              }} size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full bg-black/30 text-white border-white/50 hover:bg-black/50 backdrop-blur-sm transition-all">
                Esplora Lato Sposi
              </Button>
            </form>
          </div>
          <p className="text-stone-300 text-sm mt-6 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Nessuna registrazione richiesta per la demo
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-serif font-semibold text-stone-800 mb-4">Molto più di una galleria.</h2>
          <p className="text-lg text-stone-500 max-w-2xl mx-auto">
            Un'esperienza digitale progettata per esaltare il lavoro dei fotografi professionisti e regalare agli sposi un ricordo vivo, interattivo e corale.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <FeatureCard 
            icon={<Camera className="w-8 h-8 text-stone-700" />}
            title="Upload Istantaneo via QR"
            description="Nessuna app da scaricare. Gli invitati inquadrano il QR code sui tavoli e caricano foto e video direttamente dal loro smartphone."
          />
          <FeatureCard 
            icon={<Heart className="w-8 h-8 text-stone-700" />}
            title="Guestbook Digitale"
            description="Non solo foto. Un vero e proprio diario in cui ogni invitato può lasciare un augurio o una dedica che resterà per sempre."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8 text-stone-700" />}
            title="Moderazione e Privacy"
            description="Gli sposi hanno il controllo totale. Ogni foto caricata passa per una dashboard privata prima di essere pubblicata nella galleria visibile a tutti."
          />
        </div>
      </section>

      {/* For Professionals Section */}
      <section className="py-24 bg-stone-900 text-white px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-serif mb-6">Il servizio premium per i tuoi clienti.</h2>
            <p className="text-stone-300 text-lg mb-8 leading-relaxed">
              Come fotografo o videomaker, distinguiti offrendo una piattaforma digitale completa. Consegna i tuoi scatti professionali in uno spazio elegante che integra i ricordi catturati dagli ospiti.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3"><Zap className="text-stone-400" /> Creazione evento in 1 minuto</li>
              <li className="flex items-center gap-3"><Zap className="text-stone-400" /> Generazione automatica di QR Code stampabili</li>
              <li className="flex items-center gap-3"><Zap className="text-stone-400" /> Link privati e isolamento totale per ogni cliente</li>
              <li className="flex items-center gap-3"><Zap className="text-stone-400" /> Dashboard sposi chiavi in mano</li>
            </ul>
            <Link href="/login">
              <Button size="lg" className="bg-white text-stone-900 hover:bg-stone-200 rounded-full h-12 px-8">
                Inizia come Fotografo
              </Button>
            </Link>
          </div>
          <div className="relative">
            <div className="aspect-square bg-stone-800 rounded-2xl overflow-hidden shadow-2xl p-8 border border-stone-700">
               {/* Decorative mockup representation */}
               <div className="w-full h-8 bg-stone-700 rounded-md mb-4 flex items-center px-4 gap-2">
                 <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                 <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                 <div className="w-3 h-3 bg-green-400 rounded-full"></div>
               </div>
               <div className="flex gap-4 mb-4">
                 <div className="w-1/3 h-24 bg-stone-700 rounded-md"></div>
                 <div className="w-2/3 h-24 bg-stone-700 rounded-md"></div>
               </div>
               <div className="w-full h-48 bg-stone-600 rounded-md flex items-center justify-center">
                 <ImageIcon className="w-16 h-16 text-stone-500" />
               </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-stone-100 py-12 text-center text-stone-500">
        <p>© {new Date().getFullYear()} WeddingSpace. Digital Wedding Experience.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100 text-center hover:shadow-lg transition-shadow duration-300">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-stone-800 mb-3">{title}</h3>
      <p className="text-stone-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
