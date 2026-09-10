import { MapPin, Clock, Calendar as CalendarIcon, Info, Users, Map } from "lucide-react";

export default function WeddingDetails({ wedding }: { wedding: any }) {
  // If not a wedding, we might skip, but let's just check if we have data
  const hasDetails = wedding.startTime || wedding.endTime || wedding.dressCode || wedding.usefulInfo || wedding.professionalsJson || (wedding.locations && wedding.locations.length > 0);

  if (!hasDetails) return null;

  const getLocation = (type: string) => wedding.locations?.find((l: any) => l.type === type);
  const ceremony = getLocation("CEREMONY");
  const reception = getLocation("RECEPTION");
  const bridePrep = getLocation("BRIDE_PREP");
  const groomPrep = getLocation("GROOM_PREP");

  const renderLocationInfo = (title: string, loc: any) => {
    if (!loc) return null;
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-serif text-stone-800">{title}</h3>
        </div>
        <div className="pl-13 text-stone-600">
          {loc.name && <p className="font-medium text-stone-800">{loc.name}</p>}
          {loc.address && <p>{loc.address}</p>}
          {loc.city && <p>{loc.city}</p>}
          {loc.notes && <p className="text-sm mt-2 text-stone-500 italic">{loc.notes}</p>}
        </div>
        
        {loc.coordinates && (
          <div className="w-full h-48 mt-4 rounded-xl overflow-hidden border border-stone-200">
            {/* Simple OSM embed if coordinates are present (Format: lat, lng) */}
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

          {wedding.dressCode && (
            <div className="flex items-start gap-4">
              <Users className="w-6 h-6 text-stone-400 shrink-0" />
              <div>
                <p className="font-medium">Dress Code</p>
                <p className="text-stone-300">{wedding.dressCode}</p>
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
