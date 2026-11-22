"use server";

import { prisma } from "@/lib/prisma";
import { createSystemNotification } from "@/lib/notifications";

export async function submitPublicEventConnection(data: {
  timelineItemId: string;
  weddingSlug: string;
  coupleNames: string;
  type: "GUEST" | "PRO" | "RESTAURANT";
  name: string;
  email: string;
  phone?: string;
  companyOrRole?: string;
  notes?: string;
  marketingConsent?: boolean;
}) {
  try {
    const name = (data.name || "").trim();
    const email = (data.email || "").trim().toLowerCase();
    const phone = (data.phone || "").trim();
    const companyOrRole = (data.companyOrRole || "").trim();
    const notes = (data.notes || "").trim();

    if (!data.timelineItemId || !name || !email) {
      return { success: false, error: "Compila nome ed email per inviare i tuoi dati." };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: "Inserisci un indirizzo email valido." };
    }

    const wedding = await prisma.timelineItem.findUnique({
      where: { id: data.timelineItemId },
      select: { id: true, ownerId: true, coupleId: true, slug: true },
    });

    const intentMap = {
      GUEST: "GUEST_EVENT_NOTIFY",
      PRO: "EVENT_PRO_CONNECT",
      RESTAURANT: "RESTAURANT_EVENT_CONNECT",
    } as const;

    const details = [
      `Evento: ${data.coupleNames} (/w/${data.weddingSlug})`,
      `Nome: ${name}`,
      phone ? `Telefono: ${phone}` : null,
      companyOrRole ? `Attività/Ruolo: ${companyOrRole}` : null,
      notes ? `Note: ${notes}` : null,
      `Marketing consent: ${data.marketingConsent ? "Si" : "No"}`,
    ]
      .filter(Boolean)
      .join("\n");

    await prisma.lead.create({
      data: {
        email,
        intent: intentMap[data.type],
        details,
      },
    });

    if (wedding?.ownerId && (data.type === "PRO" || data.type === "RESTAURANT")) {
      const label = data.type === "RESTAURANT" ? "Ristorante / Location" : "Professionista";
      try {
        await createSystemNotification(
          wedding.ownerId,
          `Nuovo contatto ${label} per ${data.coupleNames}`,
          `${name}${companyOrRole ? ` (${companyOrRole})` : ""} si è collegato dalla pagina del vostro evento (${email}).`,
          "LEAD",
          `/couple/${wedding.slug}`
        );
      } catch {
        // non-blocking notification failure
      }
    }

    return { success: true };
  } catch (err) {
    console.error("submitPublicEventConnection error:", err);
    return { success: false, error: "Si è verificato un errore temporaneo. Riprova tra poco." };
  }
}
