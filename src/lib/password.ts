import crypto from "crypto";

const HASH_PREFIX = "scrypt$";
const KEY_LENGTH = 64;

/**
 * Calcola un hash crittografico sicuro della password usando Node crypto.scryptSync
 * con salt casuale a 128 bit. Formato: `scrypt$<saltHex>$<hashHex>`
 */
export function hashPassword(plainPassword: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(plainPassword, salt, KEY_LENGTH).toString("hex");
  return `${HASH_PREFIX}${salt}$${derivedKey}`;
}

/**
 * Verifica se una stringa memorizzata è già hashata con scrypt.
 */
export function isPasswordHashed(storedValue: string | null | undefined): boolean {
  return Boolean(storedValue && storedValue.startsWith(HASH_PREFIX));
}

/**
 * Verifica una password in modo resistente ai timing attack.
 * Supporta la retrocompatibilità trasparente per eventuali password legacy non ancora migrate,
 * così da non bloccare alcun utente già registrato.
 */
export function verifyPassword(
  plainAttempt: string,
  storedPassword: string | null | undefined
): { valid: boolean; needsRehash: boolean } {
  if (!storedPassword || storedPassword === "hashed_password") {
    return { valid: false, needsRehash: false };
  }

  if (storedPassword.startsWith(HASH_PREFIX)) {
    const parts = storedPassword.split("$");
    if (parts.length !== 3) {
      return { valid: false, needsRehash: false };
    }
    const [, salt, hashHex] = parts;
    try {
      const derivedAttempt = crypto.scryptSync(plainAttempt, salt, KEY_LENGTH);
      const storedBuffer = Buffer.from(hashHex, "hex");
      if (derivedAttempt.length !== storedBuffer.length) {
        return { valid: false, needsRehash: false };
      }
      const match = crypto.timingSafeEqual(derivedAttempt, storedBuffer);
      return { valid: match, needsRehash: false };
    } catch {
      return { valid: false, needsRehash: false };
    }
  }

  // Fallback legacy per password salvate prima della migrazione (verranno ri-hashate al login)
  const a = Buffer.from(plainAttempt, "utf8");
  const b = Buffer.from(storedPassword, "utf8");
  if (a.length !== b.length) {
    return { valid: false, needsRehash: false };
  }
  const legacyMatch = crypto.timingSafeEqual(a, b);
  return { valid: legacyMatch, needsRehash: legacyMatch };
}
