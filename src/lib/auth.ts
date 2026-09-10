import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET || "super-secret-key-for-wedding-platform-mvp-local-only";
const key = new TextEncoder().encode(secretKey);

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
  cookieStore.set("session", session, { expires, httpOnly: true, path: "/" });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  try {
    return await decrypt(session);
  } catch (err) {
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
