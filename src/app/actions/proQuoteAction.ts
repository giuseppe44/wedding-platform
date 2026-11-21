"use server";

import { prisma } from "@/lib/prisma";
import { createSystemNotification } from "@/lib/notifications";
import { inspectAndSanitizeMessage } from "@/lib/contactGuard";
import { Resend } from "resend";

export async function requestProQuote(data: {
  proId: string;
  coupleName: string;
  weddingDate?: string;
  coupleEmail: string;
  message: string;
}) {
  try {
    const coupleName = (data.coupleName || "").trim();
    const coupleEmail = (data.coupleEmail || "").trim().toLowerCase();
    const weddingDate = (data.weddingDate || "").trim();
    const message = (data.message || "").trim();

    if (!data.proId || !coupleName || !coupleEmail || !message) {
      return { success: false, error: "Compila tutti i campi obbligatori per inviare la richiesta." };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(coupleEmail)) {
      return { success: false, error: "Inserisci un indirizzo email valido per ricevere le risposte di GentiLuna." };
    }

    // Controllo anti-disintermediazione nel corpo del messaggio
    const guard = inspectAndSanitizeMessage(message);
    if (guard.hasPrivateContact) {
      return {
        success: false,
        error: `Per tutelare la tua privacy e mantenere tracciata la richiesta su GentiLuna, non inserire contatti esterni nel messaggio (${guard.reasons.join(", ")}). Il professionista ti risponderà direttamente tramite GentiLuna.`,
      };
    }

    const pro = await prisma.professionalProfile.findUnique({
      where: { id: data.proId },
      select: {
        id: true,
        businessName: true,
        slug: true,
        userId: true,
        contactEmail: true,
        user: { select: { email: true } },
      },
    });

    if (!pro) {
      return { success: false, error: "Professionista non trovato." };
    }

    const detailsSummary = [
      `Professionista: ${pro.businessName} (/pro/${pro.slug})`,
      `Richiedente: ${coupleName}`,
      `Data Evento: ${weddingDate || "Da definire"}`,
      `Messaggio: ${message}`,
    ].join("\n");

    // 1. Salva il Lead tracciato nel DB
    await prisma.lead.create({
      data: {
        email: coupleEmail,
        intent: "PRO_QUOTE_REQUEST",
        details: detailsSummary,
      },
    });

    // 2. Crea notifica interna nella dashboard del Professionista
    await createSystemNotification(
      pro.userId,
      `Nuova Richiesta Preventivo da ${coupleName}`,
      `Data evento: ${weddingDate || "Da definire"} — "${message.slice(0, 140)}${message.length > 140 ? "..." : ""}"`,
      "LEAD",
      "/dashboard/notifications"
    );

    // 3. Notifica email riservata al professionista e all'Admin (se Resend configurato)
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const recipients = Array.from(
          new Set(
            [pro.contactEmail, pro.user?.email, process.env.ADMIN_EMAIL || "web@topwebsite.it"].filter(
              Boolean
            ) as string[]
          )
        );
        const escapeHtml = (str: string) =>
          String(str || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");

        await resend.emails.send({
          from: "GentiLuna <onboarding@resend.dev>",
          to: recipients,
          subject: `Nuova Richiesta Preventivo su GentiLuna per ${pro.businessName}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e7e5e4; border-radius: 12px; overflow: hidden;">
              <div style="background-color: #1c1917; padding: 24px; text-align: center;">
                <h2 style="color: #fff; margin: 0;">Nuova Richiesta su GentiLuna</h2>
              </div>
              <div style="padding: 24px; background-color: #faf9f8;">
                <p style="font-size: 15px; color: #292524;">Ciao <strong>${escapeHtml(pro.businessName)}</strong>, hai ricevuto una nuova richiesta di preventivo tracciata tramite la tua vetrina GentiLuna:</p>
                <ul style="list-style: none; padding: 0; margin: 16px 0;">
                  <li style="margin-bottom: 8px;"><strong>Sposi / Cliente:</strong> ${escapeHtml(coupleName)}</li>
                  <li style="margin-bottom: 8px;"><strong>Data Evento:</strong> ${escapeHtml(weddingDate || "Da definire")}</li>
                  <li style="margin-bottom: 8px;"><strong>Messaggio:</strong><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</li>
                </ul>
                <div style="text-align: center; margin-top: 24px;">
                  <a href="https://www.gentiluna.com/dashboard/notifications" style="display: inline-block; background-color: #e11d48; color: #fff; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: bold;">Apri Dashboard GentiLuna</a>
                </div>
                <p style="font-size: 12px; color: #78716c; text-align: center; margin-top: 20px;">
                  Tutte le richieste e comunicazioni sono gestite e tracciate in sicurezza nell'ecosistema GentiLuna.
                </p>
              </div>
            </div>
          `,
        });
      } catch (mailErr) {
        console.error("Errore invio email notifica preventivo:", mailErr);
      }
    }

    return { success: true };
  } catch (err: unknown) {
    console.error("Errore requestProQuote:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Errore durante l'invio della richiesta.",
    };
  }
}
