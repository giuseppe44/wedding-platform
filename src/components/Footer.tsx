import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-900">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="text-2xl font-serif text-white tracking-tight flex items-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-rose-500" />
            WeddingSpace
          </Link>
          <p className="text-sm max-w-sm leading-relaxed">
            La piattaforma digitale definitiva per sposi, invitati e professionisti. Raccogli ricordi, organizza il tuo evento e fai crescere il tuo business.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-4">Esplora</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/sposi" className="hover:text-white transition-colors">Per gli Sposi</Link></li>
            <li><Link href="/professionisti" className="hover:text-white transition-colors">Per i Professionisti</Link></li>
            <li><Link href="/prezzi" className="hover:text-white transition-colors">Tariffe Sposi</Link></li>
            <li><Link href="/login" className="hover:text-white transition-colors">Accedi / Registrati</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-4">Note Legali</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Termini e Condizioni</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-stone-800 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} WeddingSpace. Tutti i diritti riservati.</p>
        <p>Realizzato con cura per i tuoi momenti speciali.</p>
      </div>
    </footer>
  );
}
