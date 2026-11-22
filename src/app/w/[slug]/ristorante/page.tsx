import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { verifyRestaurantPortalToken } from "@/lib/restaurantAccess";
import { parseDietary } from "@/lib/dietary";
import { getLocationPresentation } from "@/lib/locationMeta";
import { GentiLunaLogo } from "@/components/GentiLunaLogo";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import RestaurantPortalClient, { type RestaurantGuestRow } from "./RestaurantPortalClient";
import {
  Utensils,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  Lock,
  Sparkles,
  ArrowRight,
  Calendar,
} from "lucide-react";

export default async function RestaurantPortalPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ key?: string }>;
}) {
  const { slug } = await params;
  const { key } = await searchParams;

  const wedding = await prisma.timelineItem.findUnique({
    where: { slug },
    include: {
      locations: true,
      tables: { orderBy: { createdAt: "asc" } },
      guests: { orderBy: [{ tableId: "asc" }, { name: "asc" }] },
      schedule: { orderBy: { order: "asc" } },
    },
  });

  if (!wedding) notFound();

  const isAuthorized = verifyRestaurantPortalToken(wedding.id, key);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#faf9f8] flex flex-col">
        <nav className="w-full bg-stone-950 text-white px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-serif text-xl">
            <GentiLunaLogo variant="pro" className="w-6 h-6 shrink-0" />
            <span>GentiLuna</span>
          </Link>
        </nav>

        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-stone-200 shadow-lg text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Accesso Riservato al Ristorante / Location
            </h1>
            <p className="text-sm text-stone-600 leading-relaxed">
              Questa scheda contiene i tavoli e le intolleranze alimentari degli invitati di{" "}
              <strong>
                {wedding.brideName} &amp; {wedding.groomName}
              </strong>
              . Chiedi agli sposi di inviarti il link diretto dal loro Pannello Sposi GentiLuna.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link href="/professionisti#founders">
                <Button className="rounded-full bg-stone-900 hover:bg-stone-800 text-white px-6">
                  Sei un Ristorante? Scopri GentiLuna
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const coupleNames = `${wedding.brideName} & ${wedding.groomName}`;
  const receptionLoc = wedding.locations.find((l) => l.type === "RECEPTION");
  const receptionInfo = receptionLoc ? getLocationPresentation(receptionLoc) : null;

  const tableMap = new Map(wedding.tables.map((t) => [t.id, t.name]));

  const guestRows: RestaurantGuestRow[] = wedding.guests.map((g) => {
    const parsed = parseDietary(g.dietaryNotes);
    return {
      id: g.id,
      name: g.name || "",
      surname: g.surname || "",
      tableId: g.tableId || "",
      tableName: g.tableId ? tableMap.get(g.tableId) || "Tavolo assegnato" : "Da assegnare",
      isAttending: g.isAttending,
      allergies: parsed.allergies,
      dietNotes: parsed.notes,
    };
  });

  const confirmedCount = wedding.guests.filter((g) => g.isAttending === true).length;
  const pendingCount = wedding.guests.filter((g) => g.isAttending === null).length;
  const declinedCount = wedding.guests.filter((g) => g.isAttending === false).length;
  const dietaryGuests = guestRows.filter((g) => g.allergies.length > 0 || g.dietNotes.trim().length > 0);

  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans text-stone-900 flex flex-col overflow-x-hidden">
      {/* TOP NAVBAR */}
      <nav className="sticky top-0 z-40 w-full bg-stone-950 text-white px-4 sm:px-6 py-3.5 border-b border-stone-800 print:hidden">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 font-serif text-xl">
            <GentiLunaLogo variant="pro" className="w-6 h-6 shrink-0" />
            <span>GentiLuna</span>
            <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-emerald-400">
              HOSPITALITY
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href={`/w/${wedding.slug}`}
              className="text-xs text-stone-300 hover:text-white underline underline-offset-4"
            >
              Vedi pagina sposi
            </Link>
            <Link href="/professionisti#founders">
              <Button className="rounded-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs h-9 px-4">
                Attiva GentiLuna per il tuo Ristorante
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO RISTORANTE */}
      <header className="bg-stone-900 text-white py-10 sm:py-14 px-4 border-b border-stone-800">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-500/15 border border-emerald-400/30 px-3 py-1 rounded-full">
                <Utensils className="w-3.5 h-3.5" /> Scheda Ricevimento, Tavoli &amp; Cucina in Diretta
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white">
                Matrimonio di {coupleNames}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-stone-300">
                {wedding.date && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    {new Date(wedding.date).toLocaleDateString("it-IT", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                )}
                {receptionInfo && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-400" />
                    {receptionInfo.displayName}
                    {receptionInfo.cleanAddress ? ` — ${receptionInfo.cleanAddress}` : ""}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <RestaurantPortalClient coupleNames={coupleNames} guests={guestRows} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full px-4 py-10 space-y-10 flex-1">
        {/* KPI SUMMARY */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
            <div className="text-3xl font-bold text-emerald-800">{confirmedCount}</div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mt-1">
              Ospiti Confermati
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-5 text-center">
            <Users className="w-6 h-6 text-stone-700 mx-auto mb-1.5" />
            <div className="text-3xl font-bold text-stone-900">{wedding.guests.length}</div>
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mt-1">
              Totale in Lista ({declinedCount} no)
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
            <Clock className="w-6 h-6 text-amber-600 mx-auto mb-1.5" />
            <div className="text-3xl font-bold text-amber-900">{pendingCount}</div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800 mt-1">
              In Attesa Conferma
            </div>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-center">
            <AlertTriangle className="w-6 h-6 text-rose-600 mx-auto mb-1.5" />
            <div className="text-3xl font-bold text-rose-800">{dietaryGuests.length}</div>
            <div className="text-xs font-bold uppercase tracking-wider text-rose-700 mt-1">
              Allergie / Menù Speciali
            </div>
          </div>
        </section>

        {/* SCHEDA CUCINA: ALLERGIE E INTOLLERANZE */}
        <section className="bg-white rounded-3xl border border-rose-200/80 shadow-sm overflow-hidden">
          <div className="bg-rose-50/80 px-6 py-4 border-b border-rose-200/70 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" /> Scheda Cucina: Allergie &amp; Intolleranze
              </h2>
              <p className="text-xs text-stone-600 mt-0.5">
                Elenco completo degli invitati che hanno segnalato intolleranze alimentari o richieste menù.
              </p>
            </div>
            <span className="text-xs font-bold bg-rose-600 text-white px-3 py-1 rounded-full">
              {dietaryGuests.length} segnalazioni
            </span>
          </div>

          <div className="p-6">
            {dietaryGuests.length === 0 ? (
              <p className="text-sm text-stone-500 italic">
                Nessuna allergia o intolleranza segnalata al momento dagli invitati.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 text-xs uppercase tracking-wider text-stone-500">
                      <th className="py-2.5 pr-4">Invitato</th>
                      <th className="py-2.5 px-4">Tavolo</th>
                      <th className="py-2.5 px-4">Stato RSVP</th>
                      <th className="py-2.5 pl-4">Allergie &amp; Note Cucina</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {dietaryGuests.map((g) => (
                      <tr key={g.id}>
                        <td className="py-3 pr-4 font-bold text-stone-900">
                          {g.name} {g.surname}
                        </td>
                        <td className="py-3 px-4 text-stone-700 font-medium">{g.tableName}</td>
                        <td className="py-3 px-4">
                          {g.isAttending === true ? (
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              Confermato
                            </span>
                          ) : g.isAttending === false ? (
                            <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                              Assente
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                              In Attesa
                            </span>
                          )}
                        </td>
                        <td className="py-3 pl-4">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {g.allergies.map((a) => (
                              <span
                                key={a}
                                className="bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-md text-xs font-bold"
                              >
                                {a}
                              </span>
                            ))}
                            {g.dietNotes && <span className="text-stone-700 text-xs">{g.dietNotes}</span>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* DISPOSIZIONE TAVOLI SALA */}
        <section className="space-y-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Disposizione Tavoli per la Sala
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              Elenco dei tavoli configurati dagli sposi con posti occupati ed esigenze alimentari per singolo commensale.
            </p>
          </div>

          {wedding.tables.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-6 text-sm text-stone-500 italic">
              Gli sposi stanno ancora ultimando la creazione dei tavoli. L&apos;elenco si aggiornerà automaticamente su questo stesso link!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {wedding.tables.map((table) => {
                const tableGuests = guestRows.filter((g) => g.tableId === table.id);
                return (
                  <div
                    key={table.id}
                    className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-stone-100">
                      <h3 className="font-serif font-bold text-lg text-stone-900">{table.name}</h3>
                      <span className="text-xs font-bold bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full">
                        {tableGuests.length} / {table.capacity} posti
                      </span>
                    </div>

                    {tableGuests.length === 0 ? (
                      <p className="text-xs text-stone-400 italic">Nessun ospite assegnato al tavolo.</p>
                    ) : (
                      <ul className="space-y-2">
                        {tableGuests.map((g) => (
                          <li
                            key={g.id}
                            className="bg-stone-50 rounded-xl px-3 py-2 border border-stone-100 text-xs sm:text-sm"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-stone-800">
                                {g.name} {g.surname}
                              </span>
                              <span
                                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                                  g.isAttending === true
                                    ? "bg-emerald-500"
                                    : g.isAttending === false
                                    ? "bg-rose-500"
                                    : "bg-amber-400"
                                }`}
                                title={
                                  g.isAttending === true
                                    ? "Confermato"
                                    : g.isAttending === false
                                    ? "Assente"
                                    : "In attesa"
                                }
                              />
                            </div>
                            {(g.allergies.length > 0 || g.dietNotes) && (
                              <div className="mt-1 flex flex-wrap gap-1 text-[11px] text-rose-700 font-semibold">
                                {g.allergies.join(", ")}
                                {g.allergies.length > 0 && g.dietNotes ? " — " : ""}
                                {g.dietNotes}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* B2B INVITE CARD PER RISTORANTE, LOCATION, FOTOGRAFI & WEDDING PLANNER */}
        <section className="bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 text-white rounded-3xl p-7 sm:p-10 border border-amber-500/30 shadow-xl print:hidden">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-300 bg-amber-500/15 border border-amber-400/25 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" /> Scopri GentiLuna per Ristoranti, Location &amp; Professionisti
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold">
              Ti piace ricevere tavoli, RSVP e allergie in ordine e senza rincorrere fogli Excel?
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed font-light">
              Crea la vetrina ufficiale del tuo Ristorante, Villa o Servizio su GentiLuna, consiglia la piattaforma ai tuoi prossimi sposi o collabora direttamente con Fotografi e Wedding Planner nella tua zona a <strong className="text-white">0% commissioni</strong>.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/professionisti#founders">
                <Button className="rounded-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-6 h-11 gap-2">
                  Registra il tuo Ristorante / Location <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/fornitori">
                <Button
                  variant="outline"
                  className="rounded-full bg-transparent border-stone-600 text-white hover:bg-white/10 px-6 h-11"
                >
                  Esplora la Directory Professionisti
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
