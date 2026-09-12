"use server";

import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitLead(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const intent = formData.get("intent") as string;
    const details = formData.get("details") as string;

    if (!email || !intent) {
      return { success: false, error: "Dati mancanti" };
    }

    // 1. Salva nel Database (Tabella Lead)
    try {
      await prisma.lead.create({
        data: {
          email,
          intent,
          details: details || "",
        },
      });
    } catch (dbError) {
      console.error("Errore salvataggio DB. Assicurati di aver fatto prisma db push", dbError);
    }

    const isSegnalazione = intent === "SEGNALAZIONE_PRO";
    const title = isSegnalazione ? "🌟 Nuova Segnalazione Pro!" : "🔥 Nuovo Sposo (Lead)!";
    const message = isSegnalazione 
      ? `Email: ${email}\nDettagli: ${details}` 
      : `Richiesta Preventivo da: ${email}\nDettagli: ${details}`;

    // 2. Invia Notifica via Email tramite Resend
    try {
      // Usa onboarding@resend.dev finché non verifichi il dominio su Resend
      const { data, error } = await resend.emails.send({
        from: 'ecos.com Leads <onboarding@resend.dev>',
        to: [process.env.ADMIN_EMAIL || "web@topwebsite.it"],
        subject: title,
        html: `
          <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #1c1917; padding: 24px; text-align: center;">
              <h2 style="color: #fff; margin: 0;">${title}</h2>
            </div>
            <div style="padding: 24px; background-color: #faf9f8;">
              <p style="font-size: 16px; color: #333;">Hai ricevuto un nuovo contatto dalla barra di ricerca (Lead Trap):</p>
              <ul style="list-style-type: none; padding: 0;">
                <li style="margin-bottom: 12px;"><strong>Email Cliente:</strong> ${email}</li>
                <li style="margin-bottom: 12px;"><strong>Dettagli:</strong><br/> ${details.replace(/\n/g, '<br/>')}</li>
              </ul>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
              <p style="font-size: 14px; color: #666; text-align: center;">Accedi al database di ecos.com per ulteriori informazioni.</p>
            </div>
          </div>
        `,
      });

      if (error) {
        console.error("Errore Resend:", error);
      } else {
        console.log("Email inviata con successo tramite Resend!", data);
      }
    } catch (emailError) {
      console.error("Eccezione invio email con Resend:", emailError);
    }

    // 3. Invia Notifica Push al Telefono di Michele tramite Ntfy.sh (Mantenuta come backup gratuito)
    const topic = "weddingspace_leads_michele";
    await fetch(`https://ntfy.sh/${topic}`, {
      method: "POST",
      body: message,
      headers: {
        "Title": title,
        "Tags": isSegnalazione ? "camera" : "ring",
        "Priority": "high"
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Errore salvataggio lead:", error);
    return { success: false, error: error.message };
  }
}
