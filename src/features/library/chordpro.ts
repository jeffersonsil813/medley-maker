export type ChordProPart =
  | { type: "text"; value: string }
  | { type: "chord"; value: string };

// Covers common chord roots, qualities, extensions, and slash bass notes.
const CHORD_PATTERN = /\[((?:[A-G](?:#|b)?)(?:(?:maj|min|m|M|dim|aug|sus(?:2|4)?|add\d+|°|ø)?\d*(?:sus(?:2|4)?|add\d+)?)(?:\/[A-G](?:#|b)?)?)\]/g;

export function parseChordPro(content: string): ChordProPart[] {
  const parts: ChordProPart[] = [];
  let cursor = 0;

  for (const match of content.matchAll(CHORD_PATTERN)) {
    const matchIndex = match.index ?? 0;

    if (matchIndex > cursor) {
      parts.push({ type: "text", value: content.slice(cursor, matchIndex) });
    }

    parts.push({ type: "chord", value: match[1] });
    cursor = matchIndex + match[0].length;
  }

  if (cursor < content.length) {
    parts.push({ type: "text", value: content.slice(cursor) });
  }

  return parts;
}

export function extractChordSymbols(content: string) {
  return parseChordPro(content)
    .filter((part): part is Extract<ChordProPart, { type: "chord" }> => part.type === "chord")
    .map((part) => part.value);
}
