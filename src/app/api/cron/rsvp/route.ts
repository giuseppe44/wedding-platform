import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET(req: Request) {
  // CRON_SECRET SECURITY CHECK
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  
  const dbConfig = await prisma.systemConfig.findUnique({ where: { id: "default" } });
  const smtpHost = dbConfig?.smtpHost || process.env.SMTP_HOST;
  const smtpUser = dbConfig?.smtpUser || process.env.SMTP_USER;
  const smtpPass = dbConfig?.smtpPass || process.env.SMTP_PASS;
  const smtpPort = dbConfig?.smtpPort || process.env.SMTP_PORT || "587";
  const senderEmail = dbConfig?.senderEmail || process.env.ADMIN_EMAIL || "info@tuosito.com";


  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn("Credenziali SMTP non configurate in .env. Salto invio email.");
    return NextResponse.json({ message: "No SMTP Configured" });
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort),
    auth: {
      user: smtpUser,
      pass: smtpPass,
    }
  });

  // Find target dates using the correct timezone (Europe/Rome)
  const today = new Date();
  
  // Calculate exactly 30 days and 10 days from today
  const target30 = new Date(today);
  target30.setDate(target30.getDate() + 30);
  
  const target10 = new Date(today);
  target10.setDate(target10.getDate() + 10);

  const startOfDay30 = new Date(target30.setHours(0,0,0,0));
  const endOfDay30 = new Date(target30.setHours(23,59,59,999));

  const startOfDay10 = new Date(target10.setHours(0,0,0,0));
  const endOfDay10 = new Date(target10.setHours(23,59,59,999));

  let sentCount = 0;
  let errors: string[] = [];

  // --- 30 DAYS REMINDER ---
  const weddings30 = await prisma.timelineItem.findMany({
    where: { 
      type: "WEDDING",
      date: { gte: startOfDay30, lte: endOfDay30 }
    },
    include: { guests: true }
  });

  for (const w of weddings30) {
    const targetGuests = w.guests.filter(g => g.email && g.isAttending === null && !g.rsvpReminder30Sent);
    
    for (const g of targetGuests) {
      try {
        let safeToken = g.token;
        if (!safeToken) {
          const crypto = require('crypto');
          safeToken = crypto.randomUUID();
          await prisma.guest.update({ where: { id: g.id }, data: { token: safeToken } });
        }
        const url = `${process.env.NEXT_PUBLIC_APP_URL || 'https://tuosito.com'}/w/${w.slug}/rsvp/${safeToken}`;
        
        await transporter.sendMail({
          from: `"Wedding Team" <${senderEmail}>`,
          to: g.email as string,
          subject: "Conferma la tua presenza al matrimonio! ❤️",
          html: `
            <p>Ci siamo quasi! ❤️</p>
            <p>Gli sposi stanno organizzando gli ultimi dettagli per rendere questo giorno davvero speciale e hanno bisogno di sapere se potrai essere presente.</p>
            <p><strong><a href="${url}">CLICCA QUI PER CONFERMARE LA TUA PARTECIPAZIONE</a></strong></p>
            <p>La tua risposta ci aiutera' a preparare tutto al meglio. Grazie di cuore!</p>
          `
        });

        await prisma.guest.update({
          where: { id: g.id },
          data: { rsvpReminder30Sent: true }
        });
        sentCount++;
      } catch (err) {
        errors.push(`Errore invio 30d a ${g.email}: ${err}`);
      }
    }
  }

  // --- 10 DAYS REMINDER ---
  const weddings10 = await prisma.timelineItem.findMany({
    where: { 
      type: "WEDDING",
      date: { gte: startOfDay10, lte: endOfDay10 }
    },
    include: { guests: true }
  });

  for (const w of weddings10) {
    const targetGuests = w.guests.filter(g => g.email && g.isAttending === null && !g.rsvpReminder10Sent);
    
    for (const g of targetGuests) {
      try {
        let safeToken = g.token;
        if (!safeToken) {
          const crypto = require('crypto');
          safeToken = crypto.randomUUID();
          await prisma.guest.update({ where: { id: g.id }, data: { token: safeToken } });
        }
        const url = `${process.env.NEXT_PUBLIC_APP_URL || 'https://tuosito.com'}/w/${w.slug}/rsvp/${safeToken}`;
        
        await transporter.sendMail({
          from: `"Wedding Team" <${senderEmail}>`,
          to: g.email as string,
          subject: "Il grande giorno si avvicina! 💍",
          html: `
            <p>Il grande giorno si avvicina! 💍</p>
            <p>Per permettere agli sposi di definire gli ultimi dettagli del ricevimento, ti chiediamo di confermare la tua presenza.</p>
            <p><strong><a href="${url}">CLICCA QUI PER RISPONDERE</a></strong></p>
            <p>Ti basta indicare SÌ oppure NO. Grazie per aiutarci a rendere tutto perfetto! ❤️</p>
          `
        });

        await prisma.guest.update({
          where: { id: g.id },
          data: { rsvpReminder10Sent: true }
        });
        sentCount++;
      } catch (err) {
        errors.push(`Errore invio 10d a ${g.email}: ${err}`);
      }
    }
  }

  return NextResponse.json({ 
    status: "ok", 
    sent: sentCount, 
    errors 
  });
}
