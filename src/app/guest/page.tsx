import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MailOpen, Users, Camera, Key } from "lucide-react";

export default function GuestEntrancePage() {
  return (
    <div className="min-h-screen bg-[#faf9f8] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full mx-auto mb-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Torna alla Home
        </Link>
      </div>

      <div className="max-w-xl w-full mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-stone-200 text-center">
        <div className="mx-auto bg-stone-100 p-4 rounded-full inline-flex mb-6">
          <MailOpen className="h-8 w-8 text-stone-800" />
        </div>
        
        <h1 className="text-4xl font-serif text-stone-800 mb-4">Sei un invitato?</h1>
        
        <p className="text-lg text-stone-600 mb-8 leading-relaxed">
          Per accedere allo spazio digitale del matrimonio <strong>devi attendere l&apos;invito o il link di accesso</strong> inviato direttamente dagli Sposi.
        </p>

        <div className="bg-stone-50 rounded-xl p-6 mb-8 text-left space-y-4 border border-stone-100">
          <div className="flex items-start gap-4">
            <Key className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
            <p className="text-sm text-stone-600">Gli Sposi gestiscono gli inviti e scelgono chi ha accesso ai contenuti e al programma privato.</p>
          </div>
          <div className="flex items-start gap-4">
            <Users className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
            <p className="text-sm text-stone-600">Al tuo primo accesso potrai trovare il tuo tavolo, confermare la presenza e indicare eventuali intolleranze.</p>
          </div>
          <div className="flex items-start gap-4">
            <Camera className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
            <p className="text-sm text-stone-600">I contenuti che potrai vedere (e caricare) dipendono dai permessi che gli sposi ti hanno assegnato.</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-2">Vuoi provare l&apos;esperienza?</h3>
          <Link href="/w/demo-chiara-e-matteo">
            <Button className="w-full h-14 text-lg rounded-xl bg-stone-900 hover:bg-stone-800 text-white shadow-md transition-all">
              Esplora il Matrimonio Demo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
