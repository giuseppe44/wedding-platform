"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Plane, Wallet, ExternalLink, CreditCard } from "lucide-react";
import { revealIban } from "@/app/giftActions";

export default function GiftSection({ slug, options }: { slug: string, options: any[] }) {
  const activeOptions = options.filter(o => o.isActive).sort((a, b) => a.order - b.order);
  
  if (activeOptions.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-serif text-stone-800 mb-4">Lista Nozze</h2>
        <p className="text-stone-600 max-w-2xl mx-auto">
          La vostra presenza è il regalo più bello. Se desiderate comunque farci un pensiero, ecco come.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center">
        {activeOptions.map(opt => (
          <GiftCard key={opt.id} option={opt} slug={slug} />
        ))}
      </div>
    </div>
  );
}

function GiftCard({ option, slug }: { option: any, slug: string }) {
  const [iban, setIban] = useState<string | null>(null);
  const [loadingIban, setLoadingIban] = useState(false);
  const [error, setError] = useState("");

  const handleRevealIban = async () => {
    setLoadingIban(true);
    setError("");
    try {
      const revealed = await revealIban(option.id, slug);
      setIban(revealed);
    } catch (err) {
      setError("Impossibile recuperare l'IBAN.");
    } finally {
      setLoadingIban(false);
    }
  };

  const getIcon = () => {
    if (option.type === "HONEYMOON") return <Plane className="w-8 h-8 text-stone-400" />;
    if (option.type === "CASH_GIFT") return <Wallet className="w-8 h-8 text-stone-400" />;
    return <Gift className="w-8 h-8 text-stone-400" />;
  };

  const hasIban = option.hasIban; // Passed from server as a boolean

  return (
    <Card className="border border-stone-200 shadow-sm hover:shadow-md transition-shadow text-center">
      <CardContent className="p-8 flex flex-col items-center h-full">
        <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-6">
          {getIcon()}
        </div>
        
        <h3 className="text-xl font-serif text-stone-800 mb-3">{option.title || "Regalo"}</h3>
        
        {option.description && (
          <p className="text-stone-600 text-sm mb-8 whitespace-pre-wrap flex-grow">
            {option.description}
          </p>
        )}

        <div className="w-full space-y-3 mt-auto">
          {hasIban && !iban && (
            <Button variant="outline" onClick={handleRevealIban} disabled={loadingIban} className="w-full gap-2">
              <CreditCard className="w-4 h-4" /> {loadingIban ? "Recupero..." : "Mostra IBAN"}
            </Button>
          )}
          
          {error && <p className="text-red-500 text-xs">{error}</p>}
          
          {iban && (
            <div className="bg-stone-100 p-3 rounded-md text-stone-800 font-mono text-sm tracking-wider">
              {iban}
            </div>
          )}

          {option.paypalLink && (
            <a href={option.paypalLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-blue-200 bg-background hover:bg-blue-50 text-blue-700 h-10 px-4 py-2 w-full gap-2">
              PayPal.Me
            </a>
          )}

          {option.externalLink && (
            <a href={option.externalLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full gap-2">
              <ExternalLink className="w-4 h-4" /> Scopri di più
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
