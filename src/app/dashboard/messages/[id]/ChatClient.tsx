"use client";

import { useState, useEffect, useRef } from "react";
import { Send, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { sendMessage } from "@/app/messagingActions";
import { useRouter } from "next/navigation";

export default function ChatClient({ conversation, initialMessages, currentUserId, isPro }: any) {
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simple polling (every 10 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 10000);
    return () => clearInterval(interval);
  }, [router]);

  // The server component fetches fresh messages when router.refresh() happens
  // We sync them when initialMessages changes
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const text = inputText.trim();
    setInputText("");
    setIsSending(true);

    try {
      await sendMessage(conversation.timelineItemId, conversation.professionalProfileId, text);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Errore durante l'invio");
    } finally {
      setIsSending(false);
    }
  };

  const otherPartyName = isPro 
    ? `${conversation.timelineItem.brideName} & ${conversation.timelineItem.groomName}`
    : conversation.professionalProfile.businessName;

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-120px)] bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-stone-50 border-b border-stone-200 p-4 flex items-center gap-4">
        <Link href="/dashboard/messages" className="text-stone-500 hover:text-stone-800">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="font-semibold text-lg text-stone-800">{otherPartyName}</h2>
          <p className="text-xs text-stone-500">{isPro ? "Sposi" : "Professionista"}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
        {messages.length === 0 ? (
          <div className="text-center text-stone-400 mt-10">Nessun messaggio. Inizia la conversazione!</div>
        ) : (
          messages.map((msg: any) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMe ? "bg-stone-800 text-white rounded-br-none" : "bg-white border border-stone-200 text-stone-800 rounded-bl-none"}`}>
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                  <p className={`text-[10px] mt-1 text-right ${isMe ? "text-stone-300" : "text-stone-400"}`}>
                    {new Date(msg.createdAt).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-stone-200">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            className="flex-1 rounded-full border border-stone-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-800"
            placeholder="Scrivi un messaggio..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="bg-stone-800 hover:bg-stone-700 disabled:opacity-50 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
