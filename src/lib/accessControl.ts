import { getSession } from "./auth";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "./prisma";

const secretKey = process.env.JWT_SECRET || "super-secret-key-for-wedding-platform-mvp-local-only";
const key = new TextEncoder().encode(secretKey);

export async function setGuestSession(timelineItemId: string, category: string, guestId?: string, pwdVer?: string | null) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const payload = { timelineItemId, role: "GUEST", category, guestId, pwdVer, expires };
  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 day from now")
    .sign(key);
  
  const cookieStore = await cookies();
  cookieStore.set(`guest_session_${timelineItemId}`, session, { expires, httpOnly: true, path: "/" });
}

export async function getGuestSession(timelineItemId: string) {
  const cookieStore = await cookies();
  const session = cookieStore.get(`guest_session_${timelineItemId}`)?.value;
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, key, { algorithms: ["HS256"] });
    if (payload.timelineItemId !== timelineItemId) return null;
    return payload;
  } catch (err) {
    return null;
  }
}

export async function revokeGuestSession(timelineItemId: string) {
  const cookieStore = await cookies();
  cookieStore.delete(`guest_session_${timelineItemId}`);
}


export async function verifyTimelineAccess(timelineItem: any, action: "VIEW_PUBLIC" | "VIEW_PRIVATE" | "EDIT" = "VIEW_PUBLIC") {
  const session = await getSession();

  if (session) {
    if (session.role === "ADMIN") return true;
    if (timelineItem.ownerId === session.userId || timelineItem.coupleId === session.userId) return true;
  }

  if (action === "EDIT") return false;

  if (timelineItem.visibility === "PUBLIC" && action === "VIEW_PUBLIC") {
    return true;
  }

  // Phase 19: Chapter logic
  let weddingId = timelineItem.id;
  if (timelineItem.type !== "WEDDING" && timelineItem.familyId) {
    const weddingTimelineItem = await prisma.timelineItem.findFirst({
      where: { familyId: timelineItem.familyId, type: "WEDDING" }
    });
    if (weddingTimelineItem) {
      weddingId = weddingTimelineItem.id;
    } else {
      return false; // Cannot verify without a parent wedding
    }
  }

  const guestSession = await getGuestSession(weddingId);
  if (guestSession) {
    // Phase 19: Check Audience if it's a chapter
    if (timelineItem.type !== "WEDDING") {
      const audience = timelineItem.audience || "ALL_GUESTS";
      if (audience !== "ALL_GUESTS") {
        if (!guestSession.guestId) return false; // Generic password guests cannot see restricted chapters
        
        if (audience === "SELECTED_GUESTS") {
          const selected = await prisma.chapterSelectedGuest.findUnique({
            where: {
              timelineItemId_guestId: {
                timelineItemId: timelineItem.id,
                guestId: String(guestSession.guestId)
              }
            }
          });
          if (!selected) return false;
        } else {
          // It's a category like FAMILY, FRIENDS, CLOSE_FRIENDS
          if (guestSession.category !== audience) {
            return false;
          }
        }
      }
    }

    // SECURITY PATCH: Revocation Check
    if (guestSession.guestId) {
      // It's a token-based guest. Verify they haven't been revoked.
      const guest = await prisma.guest.findUnique({
        where: { id: String(guestSession.guestId) },
        select: { hasAccess: true }
      });
      if (!guest || !guest.hasAccess) {
        return false;
      }
      return true;
    } else {
      // It's a password-based generic guest. Verify the password hasn't changed.
      // Note: for chapters, we must compare against the WEDDING password hash!
      const weddingTimelineItem = timelineItem.type !== "WEDDING" 
        ? await prisma.timelineItem.findUnique({ where: { id: weddingId }, select: { passwordHash: true }})
        : timelineItem;

      if (guestSession.pwdVer !== weddingTimelineItem?.passwordHash) {
        return false;
      }
      return true;
    }
  }

  return false;
}
