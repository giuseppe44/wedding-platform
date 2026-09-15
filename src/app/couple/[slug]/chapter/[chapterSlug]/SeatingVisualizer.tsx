"use client";
import { User, Printer, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SeatingVisualizer({ tables, guests, title }: { tables: any[], guests: any[], title: string }) {

  const printVisualMap = () => {
    window.print();
  };

  return (
    <div className="space-y-8 relative">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-map, #printable-map * {
            visibility: visible;
          }
          #printable-map {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print-break-inside-avoid {
            break-inside: avoid;
          }
        }
      `}</style>

      <div className="flex justify-between items-center print:hidden bg-stone-50 p-4 rounded-xl border border-stone-200">
        <div>
          <h3 className="text-xl font-serif text-stone-800">Piantina Sala / Grafico Tavoli</h3>
          <p className="text-sm text-stone-500">Visualizza la disposizione degli ospiti. Le persone in giallo hanno esigenze alimentari.</p>
        </div>
        <Button onClick={printVisualMap} className="gap-2 bg-stone-800 hover:bg-stone-700 text-white shadow-lg">
          <Printer className="w-4 h-4"/> Esporta PDF / Stampa
        </Button>
      </div>

      <div className="print:block" id="printable-map">
        <div className="hidden print:block text-center mb-12 border-b border-stone-300 pb-6">
           <h1 className="text-4xl font-serif text-stone-800">Mappa dei Tavoli</h1>
           <h2 className="text-xl font-medium text-stone-500 mt-2">{title}</h2>
        </div>
        
        <div className="flex flex-wrap gap-x-16 gap-y-24 justify-center items-start pt-8 pb-16 min-h-[500px]">
          {tables.map(table => {
            const tableGuests = guests.filter(g => g.tableId === table.id);
            const isRound = table.type === "ROUND";
            const isSquare = table.type === "SQUARE";
            
            const baseSize = 220;
            const width = isRound ? baseSize : (isSquare ? baseSize : baseSize * 1.6);
            const height = isRound ? baseSize : (isSquare ? baseSize : baseSize * 0.7);

            return (
              <div key={table.id} className="relative flex items-center justify-center print-break-inside-avoid m-6" style={{ width: width + 120, height: height + 120 }}>
                <div 
                  className={`absolute bg-stone-100 border-4 border-stone-300 shadow-md flex flex-col items-center justify-center z-0 transition-all hover:border-stone-400
                    ${isRound ? 'rounded-full' : 'rounded-2xl'}
                  `}
                  style={{ width, height }}
                >
                  <span className="font-serif text-2xl text-stone-800 text-center px-4 font-bold leading-tight">{table.name}</span>
                  <div className="flex items-center gap-2 mt-2 text-stone-500 bg-white/60 px-3 py-1 rounded-full text-sm font-medium border border-stone-200">
                    <UsersIcon /> {tableGuests.length} / {table.capacity}
                  </div>
                </div>

                {tableGuests.map((guest, idx) => {
                  const total = tableGuests.length;
                  let top = 0;
                  let left = 0;

                  if (isRound) {
                    const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;
                    const radius = width / 2 + 40;
                    left = (width + 120)/2 + Math.cos(angle) * radius;
                    top = (height + 120)/2 + Math.sin(angle) * radius;
                  } else {
                    const pad = 40;
                    const w2 = width + pad * 2;
                    const h2 = height + pad * 2;
                    const perimeter = w2 * 2 + h2 * 2;
                    let distance = (idx / total) * perimeter;
                    
                    if (distance <= w2) {
                      left = distance;
                      top = 0;
                    } else if (distance <= w2 + h2) {
                      left = w2;
                      top = distance - w2;
                    } else if (distance <= w2 * 2 + h2) {
                      left = w2 - (distance - w2 - h2);
                      top = h2;
                    } else {
                      left = 0;
                      top = h2 - (distance - w2 * 2 - h2);
                    }
                    left += (120 - pad*2)/2;
                    top += (120 - pad*2)/2;
                  }

                  const hasDiet = !!guest.dietaryNotes;

                  return (
                    <div 
                      key={guest.id} 
                      className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 z-10 hover:z-20 group"
                      style={{ top: `${top}px`, left: `${left}px`, width: '100px' }}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md border-2 transition-transform group-hover:scale-125
                        ${hasDiet ? 'bg-amber-100 border-amber-300 text-amber-700' : 'bg-white border-stone-200 text-stone-500'}
                      `}>
                        {hasDiet ? <Utensils className="w-5 h-5" /> : <User className="w-5 h-5" />}
                      </div>
                      <div className="bg-white/90 print:bg-white px-2 py-1 rounded shadow-sm border border-stone-100 mt-1">
                        <span className="block text-[11px] font-bold text-stone-800 text-center leading-tight truncate w-[90px]">
                          {guest.name} {guest.surname}
                        </span>
                        {hasDiet && <span className="block text-[9px] text-amber-600 font-semibold text-center truncate">{guest.dietaryNotes}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        
        {tables.length === 0 && (
          <div className="text-center py-20 text-stone-400">
            Nessun tavolo configurato. Aggiungi i tavoli per visualizzare la piantina.
          </div>
        )}
      </div>
    </div>
  );
}

function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  );
}
