/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react/no-unescaped-entities */
import { MapPin, Clock, Info, Users, Map } from "lucide-react";
import { parseDressCode } from "@/lib/dressCode";
import { getLocationPresentation } from "@/lib/locationMeta";

export default function WeddingDetails({ wedding }: { wedding: any }) {
  const hasDetails = wedding.startTime || wedding.endTime || wedding.dressCode || wedding.usefulInfo || wedding.professionalsJson || (wedding.locations && wedding.locations.length > 0);

  if (!hasDetails) return null;

  const parsedDress = parseDressCode(wedding.dressCode);

  const getLocation = (type: string) => wedding.locations?.find((l: any) => l.type === type);
  const ceremony = getLocation("CEREMONY");
  const reception = getLocation("RECEPTION");
  const bridePrep = getLocation("BRIDE_PREP");
  const groomPrep = getLocation("GROOM_PREP");

  const renderLocationInfo = (title: string, loc: any) => {
    if (!loc) return null;
    const meta = getLocationPresentation(loc);
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">{title}</span>
            <h3 className="text-xl font-serif text-stone-800">{meta.displayName}</h3>
          </div>
        </div>
        <div className="text-stone-600 space-y-1">
          <p className="text-xs text-stone-500">{meta.roleHelper}</p>
          {meta.cleanAddress && <p className="font-medium text-stone-800 text-sm">{meta.cleanAddress}</p>}
          {loc.notes && <p className="text-sm mt-2 text-stone-500 italic">{loc.notes}</p>}
        </div>
        
        {loc.coordinates && (
          <div className="w-full h-48 mt-2 rounded-xl overflow-hidden border border-stone-200">
            <iframe 
              width="100%" 
              height="100%" 
              style={{ border: 0 }}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(loc.coordinates.split(',')[1]) - 0.01},${parseFloat(loc.coordinates.split(',')[0]) - 0.01},${parseFloat(loc.coordinates.split(',')[1]) + 0.01},${parseFloat(loc.coordinates.split(',')[0]) + 0.01}&layer=mapnik&marker=${loc.coordinates}`}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h2 className="text-3xl font-serif text-center text-stone-800 mb-12">I Dettagli</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Info Rapide */}
        <div className="bg-stone-800 text-stone-50 p-8 rounded-2xl flex flex-col gap-6">
          <h3 className="text-2xl font-serif mb-2">Informazioni</h3>
          
          {(wedding.date || wedding.startTime) && (
            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 text-stone-400 shrink-0" />
              <div>
                <p className="font-medium">Orari</p>
                <p className="text-stone-300">
                  {wedding.date && new Date(wedding.date).toLocaleDateString('it-IT')} 
                  {wedding.startTime && ` dalle ${wedding.startTime}`}
                  {wedding.endTime && ` fino alle ${wedding.endTime}`}
                </p>
              </div>
            </div>
          )}

          {wedding.ceremonyType && (
            <div className="flex items-start gap-4">
              <Map className="w-6 h-6 text-stone-400 shrink-0" />
              <div>
                <p className="font-medium">Cerimonia</p>
                <p className="text-stone-300">{wedding.ceremonyType === "RELIGIOUS" ? "Religiosa" : "Civile / Simbolica"}</p>
              </div>
            </div>
          )}

          {(parsedDress.text || parsedDress.colors.length > 0) && (
            <div className="flex items-start gap-4">
              <Users className="w-6 h-6 text-stone-400 shrink-0" />
              <div>
                <p className="font-medium">Dress Code</p>
                {parsedDress.text && <p className="text-stone-300">{parsedDress.text}</p>}
                {parsedDress.colors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {parsedDress.colors.map((c) => (
                      <span key={c.id} className="inline-flex items-center gap-1.5 text-xs text-stone-200 bg-white/10 px-2 py-0.5 rounded-full">
                        <span className="w-3 h-3 rounded-full border border-white/40" style={{ backgroundColor: c.hex }} />
                        {c.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {wedding.usefulInfo && (
            <div className="flex items-start gap-4">
              <Info className="w-6 h-6 text-stone-400 shrink-0" />
              <div>
                <p className="font-medium">Info Utili</p>
                <p className="text-stone-300 whitespace-pre-wrap">{wedding.usefulInfo}</p>
              </div>
            </div>
          )}
        </div>

        {/* Luoghi Principali */}
        <div className="flex flex-col gap-8">
          {renderLocationInfo("Cerimonia", ceremony)}
          {renderLocationInfo("Ricevimento", reception)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {renderLocationInfo("Preparazione Sposa", bridePrep)}
        {renderLocationInfo("Preparazione Sposo", groomPrep)}
      </div>

      {wedding.professionalsJson && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 text-center">
          <h3 className="text-xl font-serif text-stone-800 mb-4">Professionisti</h3>
          <p className="text-stone-600 whitespace-pre-wrap">{wedding.professionalsJson}</p>
        </div>
      )}

    </div>
  );
}
