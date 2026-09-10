import { requireAuth } from "@/lib/auth";
import { getMessages } from "@/app/messagingActions";
import ChatClient from "./ChatClient";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  
  try {
    const messages = await getMessages(id);
    
    // We need the conversation details for the header
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        timelineItem: true,
        professionalProfile: true
      }
    });

    if (!conversation) redirect("/dashboard/messages");

    return (
      <div className="p-4 md:p-8">
        <ChatClient 
          conversation={conversation} 
          initialMessages={messages} 
          currentUserId={session.userId} 
          isPro={session.role === "PHOTOGRAPHER"} 
        />
      </div>
    );
  } catch (err: any) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-xl m-8 border border-red-200">
        <p className="font-semibold">{err.message || "Accesso negato"}</p>
        <p className="text-sm mt-2">L'assegnazione potrebbe essere stata revocata.</p>
      </div>
    );
  }
}
