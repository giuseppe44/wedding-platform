import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const session = await getSession();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const wedding = await prisma.timelineItem.findUnique({
      where: { slug },
      include: {
        guests: {
          include: { table: true },
          orderBy: [{ table: { name: "asc" } }, { surname: "asc" }, { name: "asc" }]
        }
      }
    });

    if (!wedding) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const isOwner = wedding.ownerId === session.userId || wedding.coupleId === session.userId;
    const isAdmin = session.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const headers = ["Nome", "Cognome", "Email", "Telefono", "Categoria", "Note Alimentari", "Partecipa", "Tavolo"];
    
    let csvContent = headers.join(",") + "\n";

    for (const guest of wedding.guests) {
      const row = [
        `"${(guest.name || "").replace(/"/g, '""')}"`,
        `"${(guest.surname || "").replace(/"/g, '""')}"`,
        `"${(guest.email || "").replace(/"/g, '""')}"`,
        `"${(guest.phone || "").replace(/"/g, '""')}"`,
        `"${(guest.category || "").replace(/"/g, '""')}"`,
        `"${(guest.dietaryNotes || "").replace(/"/g, '""')}"`,
        `"${guest.isAttending === true ? "Sì" : guest.isAttending === false ? "No" : "Da confermare"}"`,
        `"${(guest.table?.name || "Non assegnato").replace(/"/g, '""')}"`
      ];
      csvContent += row.join(",") + "\n";
    }

    const response = new NextResponse(csvContent);
    response.headers.set("Content-Type", "text/csv; charset=utf-8");
    response.headers.set("Content-Disposition", `attachment; filename="ospiti-${slug}.csv"`);

    return response;
  } catch (error) {
    console.error("Export error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
