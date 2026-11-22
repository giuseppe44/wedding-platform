import crypto from "crypto";

function getRestaurantSecret(): string {
  const base =
    process.env.JWT_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.DATABASE_URL ||
    process.env.DIRECT_URL ||
    "gentiluna-restaurant-fallback-secret-v1";

  return crypto
    .createHmac("sha256", "gentiluna-restaurant-portal-master-v1")
    .update(base)
    .digest("hex");
}

/**
 * Generates a deterministic HMAC-signed URL-safe access key for a timeline item's
 * Restaurant / Location portal without requiring a schema migration.
 */
export function createRestaurantPortalToken(timelineItemId: string): string {
  return crypto
    .createHmac("sha256", getRestaurantSecret())
    .update(`restaurant-portal:${timelineItemId}`)
    .digest("base64url")
    .slice(0, 28);
}

/**
 * Constant-time verification of a Restaurant / Location portal access key.
 */
export function verifyRestaurantPortalToken(timelineItemId: string, token?: string | null): boolean {
  if (!timelineItemId || !token) return false;
  const expected = createRestaurantPortalToken(timelineItemId);
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(String(token).trim(), "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
