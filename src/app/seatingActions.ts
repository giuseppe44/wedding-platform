"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Gestione Ospiti
export async function createGuest(timelineItemId: string, data: any, slug: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  const wedding = await prisma.timelineItem.findUnique({ where: { id: timelineItemId } });
  if (!wedding || (wedding.ownerId !== session.userId && wedding.coupleId !== session.userId && session.role !== "ADMIN")) throw new Error("Non autorizzato");

  await prisma.guest.create({
    data: {
      timelineItemId,
      name: data.name,
      surname: data.surname,
      email: data.email,
      phone: data.phone,
      category: data.category || "OTHER",
      dietaryNotes: data.dietaryNotes,
      isAttending: data.isAttending,
      hasAccess: data.hasAccess ?? true,
      tableId: data.tableId || null,
    }
  });

  revalidatePath(`/couple/${slug}/chapter/[chapterSlug]`, "page");
}

export async function updateGuest(guestId: string, data: any, slug: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  const guest = await prisma.guest.findUnique({ where: { id: guestId }, include: { timelineItem: true } });
  if (!guest || (guest.timelineItem.ownerId !== session.userId && guest.timelineItem.coupleId !== session.userId && session.role !== "ADMIN")) throw new Error("Non autorizzato");

  await prisma.guest.update({
    where: { id: guestId },
    data: {
      name: data.name,
      surname: data.surname,
      email: data.email,
      phone: data.phone,
      category: data.category,
      dietaryNotes: data.dietaryNotes,
      isAttending: data.isAttending,
      hasAccess: data.hasAccess,
      tableId: data.tableId || null,
    }
  });

  revalidatePath(`/couple/${slug}/chapter/[chapterSlug]`, "page");
}

export async function deleteGuest(guestId: string, slug: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  const guest = await prisma.guest.findUnique({ where: { id: guestId }, include: { timelineItem: true } });
  if (!guest || (guest.timelineItem.ownerId !== session.userId && guest.timelineItem.coupleId !== session.userId && session.role !== "ADMIN")) throw new Error("Non autorizzato");

  await prisma.guest.delete({ where: { id: guestId } });
  revalidatePath(`/couple/${slug}/chapter/[chapterSlug]`, "page");
}

// Gestione Tavoli
export async function createTable(timelineItemId: string, data: any, slug: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  const wedding = await prisma.timelineItem.findUnique({ where: { id: timelineItemId } });
  if (!wedding || (wedding.ownerId !== session.userId && wedding.coupleId !== session.userId && session.role !== "ADMIN")) throw new Error("Non autorizzato");

  await prisma.table.create({
    data: {
      timelineItemId,
      name: data.name,
      type: data.type || "ROUND",
      capacity: parseInt(data.capacity) || 10,
    }
  });

  revalidatePath(`/couple/${slug}/chapter/[chapterSlug]`, "page");
}

export async function updateTable(tableId: string, data: any, slug: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  const table = await prisma.table.findUnique({ where: { id: tableId }, include: { timelineItem: true } });
  if (!table || (table.timelineItem.ownerId !== session.userId && table.timelineItem.coupleId !== session.userId && session.role !== "ADMIN")) throw new Error("Non autorizzato");

  await prisma.table.update({
    where: { id: tableId },
    data: {
      name: data.name,
      type: data.type,
      capacity: parseInt(data.capacity) || 10,
    }
  });

  revalidatePath(`/couple/${slug}/chapter/[chapterSlug]`, "page");
}

export async function deleteTable(tableId: string, slug: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  const table = await prisma.table.findUnique({ where: { id: tableId }, include: { timelineItem: true } });
  if (!table || (table.timelineItem.ownerId !== session.userId && table.timelineItem.coupleId !== session.userId && session.role !== "ADMIN")) throw new Error("Non autorizzato");

  await prisma.table.delete({ where: { id: tableId } });
  revalidatePath(`/couple/${slug}/chapter/[chapterSlug]`, "page");
}

export async function assignGuestToTable(guestId: string, tableId: string | null, slug: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  const guest = await prisma.guest.findUnique({ where: { id: guestId }, include: { timelineItem: true } });
  if (!guest || (guest.timelineItem.ownerId !== session.userId && guest.timelineItem.coupleId !== session.userId && session.role !== "ADMIN")) throw new Error("Non autorizzato");

  if (tableId) {
    // verify table belongs to the same wedding
    const table = await prisma.table.findUnique({ where: { id: tableId } });
    if (!table || table.timelineItemId !== guest.timelineItemId) throw new Error("Tavolo non valido");
    
    // check capacity
    const count = await prisma.guest.count({ where: { tableId } });
    if (count >= table.capacity) throw new Error("Tavolo pieno");
  }

  await prisma.guest.update({
    where: { id: guestId },
    data: { tableId }
  });

  revalidatePath(`/couple/${slug}/chapter/[chapterSlug]`, "page");
}

export async function searchGuestSeating(timelineItemId: string, name: string, surname: string) {
  if (!name.trim() || !surname.trim()) return null;
  
  // Fetch all guests for this wedding and filter in memory to avoid Prisma SQLite vs Postgres case-sensitivity issues
  const allGuests = await prisma.guest.findMany({
    where: { timelineItemId },
    include: {
      table: {
        include: {
          guests: { select: { name: true, surname: true } }
        }
      }
    }
  });
  
  const guest = allGuests.find(g => 
    g.name?.toLowerCase().trim() === name.toLowerCase().trim() && 
    g.surname?.toLowerCase().trim() === surname.toLowerCase().trim()
  );

  if (!guest || !guest.table) return null;

  return {
    table: guest.table.name,
    tableType: guest.table.type,
    tablemates: guest.table.guests.map(g => `${g.name} ${g.surname}`)
  };
}
