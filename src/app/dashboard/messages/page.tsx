import { getSession } from "@/lib/auth";
import { getConversations, getOrCreateConversationForPro } from "@/app/messagingActions";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageSquare, ArrowLeft, ShieldCheck, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ proId?: string }>;
}) {
  const session = await getSession();
  if (!session || !["PHOTOGRAPHER", "COUPLE", "ADMIN"].includes(session.role)) {
    redirect("/login?role=COUPLE");
  }

  const resolvedParams = await searchParams;
  const proId = typeof resolvedParams?.proId === "string" ? resolvedParams.proId : undefined;

  if (proId && session.role === "COUPLE") {
    const convId = await getOrCreateConversationForPro(proId);
    if (convId) {
      redirect(`/dashboard/messages/${convId}`);
    }
  }

  const conversations = await getConversations();
  const isPro = session.role === "PHOTOGRAPHER";
  const isAdmin = session.role === "ADMIN";
  const backHref = isAdmin ? "/admin" : isPro ? "/dashboard" : "/";

  return (
    <div className="min-h-screen bg-[#faf9f8] p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Torna indietro
            </Link>
            <h1 className="text-3xl font-serif text-stone-800 flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-rose-500" /> Live Chat &amp; Messaggi Protetti
            </h1>
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4" /> Chat Interna Tracciata GentiLuna
          </span>
        </div>

        {conversations.length === 0 ? (
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 text-center space-y-4 shadow-sm">
            <MessageSquare className="w-10 h-10 text-stone-300 mx-auto" />
            <h2 className="font-serif text-xl text-stone-800">Nessuna conversazione attiva al momento</h2>
            <p className="text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
              {isPro
                ? "Quando gli sposi ti invieranno un messaggio diretto o saranno collegati al tuo profilo, troverai qui tutte le chat tracciate."
                : "Sfoglia la directory fornitori per inviare un preventivo gratuito o aprire una chat diretta con un professionista verificato."}
            </p>
            <div className="pt-2">
              <Link href="/fornitori">
                <Button className="rounded-full bg-stone-900 hover:bg-stone-800 text-white gap-2 px-6">
                  <Search className="w-4 h-4" /> Esplora Fornitori
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conv) => (
              <Link
                key={conv.id}
                href={`/dashboard/messages/${conv.id}`}
                className="block bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 hover:border-rose-300 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-center gap-4">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-lg text-stone-800 truncate">
                      {isAdmin
                        ? `${conv.timelineItem?.brideName || ""} & ${conv.timelineItem?.groomName || ""} ↔ ${conv.professionalProfile?.businessName || ""}`
                        : isPro
                        ? `Evento: ${conv.timelineItem?.title || `${conv.timelineItem?.brideName || ""} & ${conv.timelineItem?.groomName || ""}`}`
                        : `Professionista: ${conv.professionalProfile?.businessName || ""}`}
                    </h3>
                    <p className="text-sm text-stone-500 mt-1 truncate">
                      {conv.messages?.[0]?.text || "Nessun messaggio ancora — scrivi il primo saluto!"}
                    </p>
                  </div>
                  <div className="text-xs text-stone-400 shrink-0">
                    {conv.updatedAt ? new Date(conv.updatedAt).toLocaleDateString("it-IT") : ""}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
