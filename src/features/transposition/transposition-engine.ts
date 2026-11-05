import { parseChordPro } from "../library/chordpro.ts";
import type { MusicalKey, Song } from "../library/song-types.ts";
import type { MedleyItem } from "../medleys/medley-types.ts";

export type AccidentalPreference = "sharp" | "flat" | "auto";

const SHARP_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const FLAT_NOTES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const NOTE_PITCHES: Record<string, number> = {
  C: 0, "B#": 0, "Dbb": 0,
  "C#": 1, Db: 1,
  D: 2, "C##": 2, Ebb: 2,
  "D#": 3, Eb: 3,
  E: 4, Fb: 4, "D##": 4,
  F: 5, "E#": 5,
  "F#": 6, Gb: 6, "E##": 6,
  G: 7, "F##": 7,
  "G#": 8, Ab: 8,
  A: 9, "G##": 9, Bbb: 9,
  "A#": 10, Bb: 10,
  B: 11, Cb: 11, "A##": 11,
};

const CHORD_SUFFIX_PATTERN = /^(?:(?:maj|min|m|M|dim|aug|sus(?:2|4)?|add\d+|°|ø)?\d*(?:sus(?:2|4)?|add\d+)?(?:\((?:[#b]?\d+|sus(?:2|4)?|add\d+)(?:,[#b]?\d+)*\))*)$/;
const CHORD_SYMBOL_PATTERN = /^([A-G])([#b]?)(.*?)(?:\/([A-G])([#b]?))?$/;
const KEY_PATTERN = /^([A-G])([#b]?)(m?)$/;

export function getSemitoneInterval(fromKey: string, toKey: string) {
  const fromPitch = getPitchClass(fromKey);
  const toPitch = getPitchClass(toKey);
  if (fromPitch === null || toPitch === null) {
    throw new Error(`Tonalidade inválida: ${fromPitch === null ? fromKey : toKey}`);
  }

  let interval = toPitch - fromPitch;
  if (interval > 6) interval -= 12;
  if (interval < -6) interval += 12;
  return interval;
}

export function transposeChord(
  chord: string,
  semitones: number,
  preference: AccidentalPreference = "auto",
  targetKey?: string,
) {
  if (!Number.isInteger(semitones)) throw new Error("O intervalo de transposição deve ser inteiro.");
  const match = CHORD_SYMBOL_PATTERN.exec(chord);
  if (!match) return chord;

  const [, rootLetter, rootAccidental, suffix, bassLetter, bassAccidental] = match;
  if (!CHORD_SUFFIX_PATTERN.test(suffix)) return chord;
  if (!isKnownNote(`${rootLetter}${rootAccidental}`)) return chord;
  if (bassLetter && !isKnownNote(`${bassLetter}${bassAccidental ?? ""}`)) return chord;
  if (semitones % 12 === 0) return chord;

  const spelling = resolvePreference(preference, targetKey, semitones);
  const root = transposeNote(`${rootLetter}${rootAccidental}`, semitones, spelling);
  const bass = bassLetter
    ? `/${transposeNote(`${bassLetter}${bassAccidental ?? ""}`, semitones, spelling)}`
    : "";

  return `${root}${suffix}${bass}`;
}

export function transposeChordPro(
  content: string,
  semitones: number,
  preference: AccidentalPreference = "auto",
  targetKey?: string,
) {
  if (!Number.isInteger(semitones)) throw new Error("O intervalo de transposição deve ser inteiro.");
  if (semitones % 12 === 0 || content.length === 0) return content;

  return parseChordPro(content)
    .map((part) =>
      part.type === "chord"
        ? `[${transposeChord(part.value, semitones, preference, targetKey)}]`
        : part.value,
    )
    .join("");
}

export type SongTranspositionPreview = {
  sourceKey: MusicalKey;
  targetKey: MusicalKey;
  semitones: number;
  song: Song;
};

/** Returns a transposed copy. The Song supplied by the library is never modified. */
export function previewSongTransposition(
  song: Song,
  targetKey: MusicalKey,
  preference: AccidentalPreference = "auto",
): SongTranspositionPreview {
  const semitones = getSemitoneInterval(song.originalKey, targetKey);
  return {
    sourceKey: song.originalKey,
    targetKey,
    semitones,
    song: {
      ...song,
      originalKey: targetKey,
      sections: song.sections.map((section) => ({
        ...section,
        content: transposeChordPro(section.content, semitones, preference, targetKey),
      })),
    },
  };
}

export type TransposedMedleyPreviewItem = {
  source: MedleyItem;
  content: string;
  transposedKey: string;
};

export type MedleyTranspositionPreview = {
  sourceKey: MusicalKey | null;
  targetKey: MusicalKey;
  semitones: number;
  items: TransposedMedleyPreviewItem[];
};

/** Transposes every item from its immutable snapshot using one interval anchored to the first item. */
export function previewMedleyTransposition(
  items: readonly MedleyItem[],
  targetKey: MusicalKey,
  preference: AccidentalPreference = "auto",
  savedReferenceKey?: MusicalKey,
): MedleyTranspositionPreview {
  const orderedItems = [...items].sort((first, second) => first.position - second.position);
  const sourceKey = savedReferenceKey ?? orderedItems[0]?.originalKeySnapshot ?? null;
  const semitones = sourceKey === null ? 0 : getSemitoneInterval(sourceKey, targetKey);

  return {
    sourceKey,
    targetKey,
    semitones,
    items: orderedItems.map((item) => ({
      source: item,
      content: transposeChordPro(item.contentSnapshot, semitones, preference, targetKey),
      transposedKey: transposeKeyName(item.originalKeySnapshot, semitones, preference, targetKey),
    })),
  };
}

function getPitchClass(noteOrKey: string): number | null {
  const match = KEY_PATTERN.exec(noteOrKey);
  if (!match) return null;
  const pitch = NOTE_PITCHES[`${match[1]}${match[2]}`];
  return pitch === undefined ? null : pitch;
}

function isKnownNote(note: string) {
  return Object.hasOwn(NOTE_PITCHES, note);
}

function resolvePreference(preference: AccidentalPreference, targetKey: string | undefined, semitones: number) {
  if (preference !== "auto") return preference;
  if (targetKey?.includes("b")) return "flat";
  if (targetKey?.includes("#")) return "sharp";
  return semitones < 0 ? "flat" : "sharp";
}

function transposeNote(note: string, semitones: number, preference: Exclude<AccidentalPreference, "auto">) {
  const pitch = NOTE_PITCHES[note];
  if (pitch === undefined) return note;
  const transposedPitch = ((pitch + semitones) % 12 + 12) % 12;
  return (preference === "flat" ? FLAT_NOTES : SHARP_NOTES)[transposedPitch];
}

function transposeKeyName(
  key: MusicalKey,
  semitones: number,
  preference: AccidentalPreference,
  targetKey: MusicalKey,
) {
  const match = KEY_PATTERN.exec(key);
  if (!match) return key;
  const spelling = resolvePreference(preference, targetKey, semitones);
  return `${transposeNote(`${match[1]}${match[2]}`, semitones, spelling)}${match[3]}`;
}
