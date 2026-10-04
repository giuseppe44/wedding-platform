export interface DietaryData {
  allergies: string[];
  notes: string;
}

export function parseDietary(raw: string | null | undefined): DietaryData {
  if (!raw) return { allergies: [], notes: "" };
  
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return {
        allergies: Array.isArray(parsed.allergies) ? parsed.allergies : [],
        notes: typeof parsed.notes === "string" ? parsed.notes : ""
      };
    }
  } catch (e) {
    // If it's not JSON, it's legacy plain text. Map it safely to notes.
    return { allergies: [], notes: raw };
  }
  
  return { allergies: [], notes: raw }; // Fallback
}

export function stringifyDietary(data: DietaryData): string {
  // Only store JSON if there are actual allergies, otherwise just store the notes string 
  // to keep the DB clean and fully backward compatible.
  if (data.allergies.length === 0) {
    return data.notes || "";
  }
  return JSON.stringify({
    allergies: data.allergies,
    notes: data.notes || ""
  });
}
