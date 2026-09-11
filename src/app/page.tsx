import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Camera, ArrowRight, UserCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen font-sans flex flex-col md:flex-row bg-[#1c1917]">
      
      {/* LATO SPOSI */}
      <div className="flex-1 relative flex flex-col justify-center items-center p-12 overflow-hidden bg-stone-900 group border-b md:border-b-0 md:border-r border-stone-800">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop" 
            alt="Matrimonio" 
            className="w-full h-full object-cover opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-1000" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center max-w-lg mx-auto flex flex-col items-center">
          <div className="w-20 h-20 bg-rose-500/20 backdrop-blur-md rounded-full flex items-center justify-center mb-8 border border-rose-500/30">
            <Heart className="w-10 h-10 text-rose-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Siete i futuri Sposi?</h2>
          <p className="text-stone-300 text-lg mb-10 font-light">
            Create il vostro spazio digitale privato. Raccogliete le foto degli invitati, condividete il programma e raccontate la vostra storia capitolo dopo capitolo.
          </p>
          <Link href="/sposi">
            <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-white text-stone-900 hover:bg-stone-200 shadow-2xl transition-all hover:scale-105 border-none font-bold">
              Scopri l'area Sposi <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <div className="mt-8">
            <Link href="/login?role=COUPLE" className="text-stone-400 hover:text-white transition-colors flex items-center gap-2 text-sm">
              <UserCircle className="w-4 h-4" /> Hai già uno spazio? Accedi
            </Link>
          </div>
        </div>
      </div>

      {/* LATO PROFESSIONISTI */}
      <div className="flex-1 relative flex flex-col justify-center items-center p-12 overflow-hidden bg-stone-950 group">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1554048612-b6a37e5cb23e?q=80&w=2070&auto=format&fit=crop" 
            alt="Fotografo Professionista" 
            className="w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-1000 grayscale group-hover:grayscale-0" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center max-w-lg mx-auto flex flex-col items-center">
          <div className="w-20 h-20 bg-amber-500/10 backdrop-blur-md rounded-full flex items-center justify-center mb-8 border border-amber-500/20">
            <Camera className="w-10 h-10 text-amber-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Sei un Professionista?</h2>
          <p className="text-stone-400 text-lg mb-10 font-light">
            Trasforma ogni evento in un generatore di nuovi contatti. Raccogli le email degli invitati, vendi le tue stampe e crea una vetrina portfolio esclusiva.
          </p>
          <Link href="/professionisti">
            <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-2xl transition-all hover:scale-105 border-none font-bold">
              Scopri l'area Professionisti <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <div className="mt-8">
            <Link href="/login?role=PHOTOGRAPHER" className="text-stone-500 hover:text-amber-400 transition-colors flex items-center gap-2 text-sm">
              <UserCircle className="w-4 h-4" /> Hai già una vetrina? Accedi
            </Link>
          </div>
        </div>
      </div>
      
    </div>
  );
}
