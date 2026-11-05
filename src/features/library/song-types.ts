export const SONG_SECTION_TYPES = [
  "intro",
  "verse",
  "pre-chorus",
  "chorus",
  "bridge",
  "ending",
  "other",
] as const;

export type SongSectionType = (typeof SONG_SECTION_TYPES)[number];

export type SongSection = {
  id: string;
  type: SongSectionType;
  content: string;
  position: number;
};

export type MusicalKey =
  | (typeof MAJOR_KEYS)[number]["value"]
  | (typeof MINOR_KEYS)[number]["value"];

export type Song = {
  id: string;
  title: string;
  artist: string;
  originalKey: MusicalKey;
  sections: SongSection[];
  createdAt: string;
  updatedAt: string;
};

export type SongInput = Pick<Song, "title" | "artist" | "originalKey" | "sections">;

export const SONG_SECTION_LABELS: Record<SongSectionType, string> = {
  intro: "Introdução",
  verse: "Verso",
  "pre-chorus": "Pré-refrão",
  chorus: "Refrão",
  bridge: "Ponte",
  ending: "Final",
  other: "Outro",
};

export const MAJOR_KEYS = [
  { value: "C", label: "C · Dó maior" },
  { value: "C#", label: "C♯ / D♭ · Dó sustenido" },
  { value: "D", label: "D · Ré maior" },
  { value: "D#", label: "D♯ / E♭ · Ré sustenido" },
  { value: "E", label: "E · Mi maior" },
  { value: "F", label: "F · Fá maior" },
  { value: "F#", label: "F♯ / G♭ · Fá sustenido" },
  { value: "G", label: "G · Sol maior" },
  { value: "G#", label: "G♯ / A♭ · Sol sustenido" },
  { value: "A", label: "A · Lá maior" },
  { value: "A#", label: "A♯ / B♭ · Lá sustenido" },
  { value: "B", label: "B · Si maior" },
] as const;

export const MINOR_KEYS = [
  { value: "Cm", label: "Cm · Dó menor" },
  { value: "C#m", label: "C♯m / D♭m · Dó sustenido menor" },
  { value: "Dm", label: "Dm · Ré menor" },
  { value: "D#m", label: "D♯m / E♭m · Ré sustenido menor" },
  { value: "Em", label: "Em · Mi menor" },
  { value: "Fm", label: "Fm · Fá menor" },
  { value: "F#m", label: "F♯m / G♭m · Fá sustenido menor" },
  { value: "Gm", label: "Gm · Sol menor" },
  { value: "G#m", label: "G♯m / A♭m · Sol sustenido menor" },
  { value: "Am", label: "Am · Lá menor" },
  { value: "A#m", label: "A♯m / B♭m · Lá sustenido menor" },
  { value: "Bm", label: "Bm · Si menor" },
] as const;

export const ALL_MUSICAL_KEYS = [...MAJOR_KEYS, ...MINOR_KEYS];

export function isMusicalKey(value: unknown): value is MusicalKey {
  return typeof value === "string" && ALL_MUSICAL_KEYS.some((key) => key.value === value);
}

export function createLocalId(prefix: string) {
  return `${prefix}-${globalThis.crypto.randomUUID()}`;
}
