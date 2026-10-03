/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Plane, Wallet, ExternalLink, CreditCard, MapPin, Calendar, Compass } from "lucide-react";
import { revealIban } from "@/app/giftActions";

export default function GiftSection({ slug, options }: { slug: string, options: any[] }) {
  const activeOptions = options.filter(o => o.isActive).sort((a, b) => a.order - b.order);
  
  if (activeOptions.length === 0) return null;

  const travelStages = activeOptions.filter(o => o.isTravelStage);
  const otherGifts = activeOptions.filter(o => !o.isTravelStage);

  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-serif text-stone-800 mb-4">Lista Nozze & Regali</h2>
        <p className="text-stone-600 max-w-2xl mx-auto">
          La vostra presenza è il regalo più bello. Se desiderate comunque farci un pensiero, ecco come.
        </p>
      </div>

      {travelStages.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Compass className="w-8 h-8 text-amber-600" />
            <h3 className="text-2xl font-serif text-stone-800">Il Nostro Viaggio a Tappe</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {travelStages.map((opt, i) => (
              <div key={opt.id} className="relative">
                {/* Connecting Line */}
                {i !== travelStages.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 border-t-2 border-dashed border-amber-200 z-0"></div>
                )}
                <Card className="relative z-10 border-amber-100 bg-amber-50/30 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="absolute top-0 left-0 w-full h-1 bg-amber-400"></div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                        <Plane className="w-3 h-3"/> Tappa {i + 1}
                      </span>
                      {opt.targetAmount && <span className="text-amber-700 font-bold font-serif">{opt.targetAmount}€</span>}
                    </div>
                    <h4 className="text-xl font-bold text-stone-800 mb-2">{opt.title || "Tappa Viaggio"}</h4>
                    
                    <div className="space-y-2 mb-4 text-sm text-stone-600">
                      {opt.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-500" /> {opt.location}</div>}
                      {opt.stageDate && <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-amber-500" /> {new Date(opt.stageDate).toLocaleDateString()}</div>}
                    </div>

                    {opt.description && <p className="text-sm text-stone-600 mb-4 line-clamp-3">{opt.description}</p>}
                    
                    <GiftInteractions option={opt} slug={slug} btnClass="w-full bg-amber-600 hover:bg-amber-700 text-white" />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      {otherGifts.length > 0 && (
        <div>
          {travelStages.length > 0 && <h3 className="text-2xl font-serif text-center text-stone-800 mb-8 mt-12">Partecipa al regalo di nozze</h3>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center max-w-3xl mx-auto">
            {otherGifts.map(opt => (
              <Card key={opt.id} className="border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-stone-100 p-3 rounded-full">
                      {opt.type === 'HONEYMOON' ? <Plane className="w-6 h-6 text-stone-600" /> : 
                      opt.type === 'GIFT_REGISTRY' ? <Gift className="w-6 h-6 text-stone-600" /> : 
                      <Wallet className="w-6 h-6 text-stone-600" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-stone-800 leading-tight">{opt.title || "Regalo"}</h4>
                      <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
                        {opt.type === 'HONEYMOON' ? 'Viaggio' : opt.type === 'GIFT_REGISTRY' ? 'Lista Nozze' : 'Contributo Libero'}
                      </span>
                    </div>
                  </div>
                  {opt.description && <p className="text-stone-600 text-sm mb-6">{opt.description}</p>}
                  
                  <GiftInteractions option={opt} slug={slug} btnClass="w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GiftInteractions({ option, slug, btnClass = "w-full" }: { option: any, slug: string, btnClass?: string }) {
  const [ibanData, setIbanData] = useState<{ iban: string | null, accountHolder: string | null }>({ iban: null, accountHolder: null });
  const [loadingIban, setLoadingIban] = useState(false);
  const [error, setError] = useState("");

  const handleRevealIban = async () => {
    setLoadingIban(true);
    setError("");
    try {
      const result = await revealIban(option.id, slug);
      if (result && result.iban) {
        setIbanData({ iban: result.iban, accountHolder: result.accountHolder });
      } else {
        setError("Impossibile recuperare l'IBAN");
      }
    } catch (err) {
      setError("Errore di connessione");
    } finally {
      setLoadingIban(false);
    }
  };

  return (
    <div className="space-y-3">
      {option.iban && !ibanData.iban && (
        <Button onClick={handleRevealIban} variant="outline" className={btnClass} disabled={loadingIban}>
          {loadingIban ? "Verifica in corso..." : <><CreditCard className="w-4 h-4 mr-2" /> Mostra IBAN per Bonifico</>}
        </Button>
      )}

      {ibanData.iban && (
        <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 text-center animate-in fade-in">
          {ibanData.accountHolder && <p className="text-xs text-stone-500 mb-1 font-semibold uppercase">Intestatario: {ibanData.accountHolder}</p>}
          <p className="font-mono text-sm md:text-base font-bold text-stone-800 break-all">{ibanData.iban}</p>
        </div>
      )}

      {error && <p className="text-red-500 text-xs text-center">{error}</p>}

      {option.paypalLink && (
        <a href={option.paypalLink} target="_blank" rel="noopener noreferrer" className="block">
          <Button variant="default" className="w-full bg-[#0070ba] hover:bg-[#003087] text-white">
            Paga con PayPal
          </Button>
        </a>
      )}

      {option.externalLink && (
        <a href={option.externalLink} target="_blank" rel="noopener noreferrer" className="block">
          <Button variant="outline" className="w-full border-stone-300">
            <ExternalLink className="w-4 h-4 mr-2" /> Vai alla Lista Esterna
          </Button>
        </a>
      )}
    </div>
  );
}
