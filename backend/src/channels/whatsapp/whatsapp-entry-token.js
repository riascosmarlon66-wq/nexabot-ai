const ENTRY_TOKEN_PATTERN = /\[NX:(nx_[a-f0-9]{48})\]/i;

export function extractEmbeddedEntryToken(text) {
  if (typeof text !== "string") {
    return { entryToken: undefined, cleanText: text };
  }

  const match = ENTRY_TOKEN_PATTERN.exec(text);
  if (!match) {
    return { entryToken: undefined, cleanText: text.trim() };
  }

  const cleanText = text.replace(match[0], " ").replace(/\s+/g, " ").trim();

  return {
    entryToken: match[1],
    cleanText: cleanText || "Hola"
  };
}

export function buildWhatsAppEntryMessage(entryToken) {
  if (typeof entryToken !== "string" || !ENTRY_TOKEN_PATTERN.test(`[NX:${entryToken}]`)) {
    throw new Error("Entry token inválido");
  }

  return `Hola, quiero información [NX:${entryToken}]`;
}
