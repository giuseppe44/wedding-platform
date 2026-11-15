import crypto from "crypto";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export function getJwtSecretKey(): Uint8Array {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 16) {
    return new TextEncoder().encode(process.env.JWT_SECRET);
  }
  const serverEntropy =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.DATABASE_URL ||
    process.env.DIRECT_URL;
  if (serverEntropy) {
    const derived = crypto
      .createHmac("sha256", "gentiluna-jwt-signing-key-v1")
      .update(serverEntropy)
      .digest("hex");
    return new TextEncoder().encode(derived);
  }
  return new TextEncoder().encode("dev-only-local-fallback-jwt-key-change-in-prod");
}

const key = getJwtSecretKey();

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(payload.expires ? new Date(payload.expires) : "1 day from now")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function setSession(userId: string, role: string, rememberMe: boolean = false) {
  const days = rememberMe ? 30 : 1;
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, role, expires });
  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  try {
    return await decrypt(session);
  } catch {
    return null;
  }
}

export async function requireAuth(allowedRoles: string[]) {
  const session = await getSession();
  if (!session || !allowedRoles.includes(session.role)) {
    throw new Error("Non autorizzato");
  }
  return session;
}
