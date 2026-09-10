import { requireAuth } from "@/lib/auth";
import { getConversations } from "@/app/messagingActions";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

export default async function MessagesPage() {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  const conversations = await getConversations();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-serif text-stone-800 mb-8 flex items-center gap-3">
        <MessageSquare className="w-8 h-8" /> Messaggi
      </h1>
      
      {conversations.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-stone-200 text-center text-stone-500">
          Nessuna conversazione attiva.
        </div>
      ) : (
        <div className="space-y-4">
          {conversations.map(conv => (
            <Link key={conv.id} href={`/dashboard/messages/${conv.id}`} className="block bg-white p-6 rounded-xl border border-stone-200 hover:border-stone-400 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg text-stone-800">
                    {session.role === "PHOTOGRAPHER" 
                      ? `Matrimonio: ${conv.timelineItem.title || conv.timelineItem.brideName + ' & ' + conv.timelineItem.groomName}`
                      : `Professionista: ${conv.professionalProfile.businessName}`}
                  </h3>
                  <p className="text-sm text-stone-500 mt-1">
                    {conv.messages[0]?.text || "Nessun messaggio"}
                  </p>
                </div>
                <div className="text-xs text-stone-400">
                  {conv.updatedAt.toLocaleDateString("it-IT")}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
