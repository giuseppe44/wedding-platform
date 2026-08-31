"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addGuestMessage } from "@/app/guestActions";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function GuestbookForm({ weddingId, buttonColor }: { weddingId: string, buttonColor?: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await addGuestMessage(weddingId, formData);
      if (res.success) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 p-6 rounded-2xl text-center border border-green-100">
        <CheckCircle2 className="mx-auto h-8 w-8 text-green-500 mb-2" />
        <p className="text-green-800 font-medium">Dedica inviata! Gli sposi la vedranno a breve.</p>
        <Button variant="outline" className="mt-4" onClick={() => setSuccess(false)}>Invia un'altra</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 space-y-4">
      <div>
        <Input name="guestName" placeholder="Il tuo nome (opzionale)" className="bg-stone-50" />
      </div>
      <div>
        <textarea 
          name="text" 
          required 
          placeholder="Scrivi qui il tuo augurio o un ricordo speciale..." 
          className="w-full h-32 p-3 border border-stone-200 rounded-md bg-stone-50 resize-none focus:outline-none focus:ring-2 focus:ring-stone-400"
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full rounded-full" style={{ backgroundColor: buttonColor || '#000' }}>
        {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : "Invia Dedica"}
      </Button>
    </form>
  );
}
