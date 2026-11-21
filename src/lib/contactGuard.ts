/**
 * Filtro anti-disintermediazione e protezione contatti per la Live Chat
 * e i moduli di contatto interni di GentiLuna.
 * Impedisce lo scambio di numeri di telefono, email private, link esterni e handle social.
 */

export interface ContactGuardResult {
  hasPrivateContact: boolean;
  reasons: string[];
  sanitizedText: string;
}

const EMAIL_REGEX =
  /([a-zA-Z0-9._%+-]+\s*(?:@|\[at\]|\(at\)|\bchiocciola\b)\s*[a-zA-Z0-9.-]+\s*(?:\.|\[dot\]|\(dot\)|\bpunto\b)\s*[a-zA-Z]{2,})/gi;

// Sequenze di 8+ cifre (con spazi, trattini, punti o prefissi +39 / 0039)
const PHONE_REGEX = /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?){2,5}\d{2,4}/g;

// Link esterni, domini e social
const URL_REGEX =
  /(?:https?:\/\/|www\.)[^\s]+|\b[a-z0-9-]+\.(?:it|com|net|org|eu|art|io|me|co|info|biz|studio|photo)\b(?:\/[^\s]*)?/gi;

const SOCIAL_REGEX =
  /(?:\b(?:whatsapp|wa\.me|instagram|insta|ig|facebook|fb|telegram|t\.me|tiktok|linkedin)\b(?:\s*[:=-]?\s*@?[a-zA-Z0-9._-]+)?|@[a-zA-Z0-9._]{3,})/gi;

export function inspectAndSanitizeMessage(text: string): ContactGuardResult {
  const input = String(text || "");
  const reasons: string[] = [];
  let sanitized = input;

  if (EMAIL_REGEX.test(input)) {
    reasons.push("indirizzo email");
    sanitized = sanitized.replace(EMAIL_REGEX, "[contatto protetto da GentiLuna]");
  }

  // Controllo numeri di telefono (almeno 8 cifre effettive nel match)
  const phoneMatches = input.match(PHONE_REGEX) || [];
  let foundPhone = false;
  for (const match of phoneMatches) {
    const digitsOnly = match.replace(/\D/g, "");
    // Esclude date come 11/04/2027 (8 cifre con slash) o anni (4 cifre)
    const looksLikeDate = /^\d{1,2}[./-]\d{1,2}[./-]\d{2,4}$/.test(match.trim());
    if (digitsOnly.length >= 8 && !looksLikeDate) {
      foundPhone = true;
      sanitized = sanitized.split(match).join("[numero protetto da GentiLuna]");
    }
  }
  if (foundPhone) {
    reasons.push("numero di telefono");
  }

  // Reset regex lastIndex before test
  URL_REGEX.lastIndex = 0;
  if (URL_REGEX.test(input)) {
    // Consenti link interni a gentiluna.com
    const nonGentiLunaUrls = (input.match(URL_REGEX) || []).filter(
      (u) => !u.toLowerCase().includes("gentiluna.com")
    );
    if (nonGentiLunaUrls.length > 0) {
      reasons.push("link o sito web esterno");
      for (const u of nonGentiLunaUrls) {
        sanitized = sanitized.split(u).join("[link esterno protetto da GentiLuna]");
      }
    }
  }

  SOCIAL_REGEX.lastIndex = 0;
  if (SOCIAL_REGEX.test(input)) {
    reasons.push("riferimento WhatsApp/Social");
    sanitized = sanitized.replace(SOCIAL_REGEX, "[contatto protetto da GentiLuna]");
  }

  return {
    hasPrivateContact: reasons.length > 0,
    reasons: Array.from(new Set(reasons)),
    sanitizedText: sanitized,
  };
}
