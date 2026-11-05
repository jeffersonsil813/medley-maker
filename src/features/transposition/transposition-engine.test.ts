import assert from "node:assert/strict";
import test from "node:test";
import {
  getSemitoneInterval,
  previewMedleyTransposition,
  previewSongTransposition,
  transposeChord,
  transposeChordPro,
  type AccidentalPreference,
} from "./transposition-engine.ts";
import type { Song } from "../library/song-types.ts";
import type { MedleyItem } from "../medleys/medley-types.ts";
import { getTranspositionKeyOptions } from "./transposition-options.ts";

const chordCases: Array<[string, number, string, string]> = [
  ["C", 2, "sharp", "D"],
  ["G", 2, "sharp", "A"],
  ["D", 5, "sharp", "G"],
  ["F#m", 2, "sharp", "G#m"],
  ["Bb", 2, "flat", "C"],
  ["C/E", 2, "sharp", "D/F#"],
  ["F#m7", 2, "sharp", "G#m7"],
  ["Bbmaj7", 2, "flat", "Cmaj7"],
];

for (const [chord, interval, preference, expected] of chordCases) {
  test(`transposes ${chord} by ${interval} semitones to ${expected}`, () => {
    assert.equal(transposeChord(chord, interval, preference as AccidentalPreference), expected);
  });
}

test("preserves supported chord qualities while changing only roots and bass", () => {
  const suffixes = ["7", "maj7", "m7", "sus2", "sus4", "add9", "9", "11", "13", "dim", "aug"];
  for (const suffix of suffixes) {
    assert.equal(transposeChord(`C${suffix}`, 2, "sharp"), `D${suffix}`);
  }
  assert.equal(transposeChord("Cdim7/Gb", 2, "sharp"), "Ddim7/G#");
});

test("uses the requested accidental spelling and leaves natural roots readable", () => {
  assert.equal(transposeChord("C", 1, "sharp"), "C#");
  assert.equal(transposeChord("C", 1, "flat"), "Db");
  assert.equal(transposeChord("Bbmaj7", 2, "auto", "C"), "Cmaj7");
  assert.equal(transposeChord("C", -2, "auto", "Bb"), "Bb");
});

test("preserves lyrics and all non-chord ChordPro text byte-for-byte", () => {
  const source = "[G]Quando estou em tua presença\n[ D ]Encontro a minha paz — [texto]";
  const transposed = transposeChordPro(source, 2, "sharp", "A");
  assert.equal(transposed, "[A]Quando estou em tua presença\n[ D ]Encontro a minha paz — [texto]");
});

test("ChordPro parser and engine recognize the supported qualities inside brackets", () => {
  const source = "[F#m7]um [Bbmaj7]dois [C/E]três [Csus2]quatro [Dadd9]cinco [G13]seis";
  const transposed = transposeChordPro(source, 2, "sharp");
  assert.equal(transposed, "[G#m7]um [Cmaj7]dois [D/F#]três [Dsus2]quatro [Eadd9]cinco [A13]seis");
});

test("transposes chords with parenthesized extensions and preserves their notation", () => {
  assert.equal(transposeChord("D9(11)", 2, "sharp"), "E9(11)");
  assert.equal(transposeChord("D7(b9,#11)/F#", 2, "sharp"), "E7(b9,#11)/G#");
  assert.equal(
    transposeChordPro("[D9(11)]Palavra [G7(b9,#11)]texto", 2, "sharp"),
    "[E9(11)]Palavra [A7(b9,#11)]texto",
  );
});

test("calculates the shortest interval between tonal centers", () => {
  assert.equal(getSemitoneInterval("C", "D"), 2);
  assert.equal(getSemitoneInterval("G", "A"), 2);
  assert.equal(getSemitoneInterval("D", "G"), 5);
  assert.equal(getSemitoneInterval("F#m", "G#m"), 2);
  assert.equal(getSemitoneInterval("Bb", "C"), 2);
  assert.equal(getSemitoneInterval("C", "B"), -1);
});

test("song preview transposes a copy without changing the library song", () => {
  const song: Song = {
    id: "song-1",
    title: "Canção de teste",
    artist: "Intérprete",
    originalKey: "G",
    sections: [
      { id: "section-1", type: "verse", content: "[G]Verso\n[D]Linha dois", position: 0 },
      { id: "section-2", type: "chorus", content: "[C]Refrão", position: 1 },
    ],
    createdAt: "2026-11-05T12:00:00.000Z",
    updatedAt: "2026-11-05T12:00:00.000Z",
  };
  const original = structuredClone(song);

  const preview = previewSongTransposition(song, "A", "sharp");

  assert.equal(preview.semitones, 2);
  assert.equal(preview.song.originalKey, "A");
  assert.equal(preview.song.sections[0].content, "[A]Verso\n[E]Linha dois");
  assert.deepEqual(song, original);
  assert.notEqual(preview.song.sections, song.sections);
});

test("medley preview transposes all snapshots in order without changing their metadata or source", () => {
  const items: MedleyItem[] = [
    {
      id: "item-1", sourceSongId: "song-1", sourceSectionId: "section-1",
      songTitleSnapshot: "Primeira", songArtistSnapshot: "Artista 1", originalKeySnapshot: "G",
      sectionType: "verse", sectionNameSnapshot: "Verso", contentSnapshot: "[G]Trecho um", position: 0,
    },
    {
      id: "item-2", sourceSongId: "song-2", sourceSectionId: "section-2",
      songTitleSnapshot: "Segunda", songArtistSnapshot: "Artista 2", originalKeySnapshot: "C",
      sectionType: "chorus", sectionNameSnapshot: "Refrão", contentSnapshot: "[C/E]Trecho dois", position: 1,
    },
  ];
  const original = structuredClone(items);

  const preview = previewMedleyTransposition(items, "A", "sharp");

  assert.equal(preview.sourceKey, "G");
  assert.equal(preview.semitones, 2);
  assert.deepEqual(preview.items.map((item) => item.source.id), ["item-1", "item-2"]);
  assert.deepEqual(preview.items.map((item) => item.content), ["[A]Trecho um", "[D/F#]Trecho dois"]);
  assert.deepEqual(preview.items.map((item) => item.transposedKey), ["A", "D"]);
  assert.deepEqual(items, original);
});

test("repeated previews always calculate from original snapshots and do not accumulate", () => {
  const items: MedleyItem[] = [{
    id: "item-1", sourceSongId: "song-1", sourceSectionId: "section-1",
    songTitleSnapshot: "Canção", songArtistSnapshot: "Artista", originalKeySnapshot: "G",
    sectionType: "verse", sectionNameSnapshot: "Verso", contentSnapshot: "[G]Original [D/F#]Inversão", position: 0,
  }];

  const firstTarget = previewMedleyTransposition(items, "A", "sharp");
  previewMedleyTransposition(items, "D", "flat");
  const repeatedTarget = previewMedleyTransposition(items, "A", "sharp");

  assert.deepEqual(repeatedTarget.items.map((item) => item.content), firstTarget.items.map((item) => item.content));
  assert.equal(items[0].contentSnapshot, "[G]Original [D/F#]Inversão");
});

test("rejects fractional intervals and invalid key names", () => {
  assert.throws(() => transposeChord("C", 1.5), /inteiro/);
  assert.throws(() => getSemitoneInterval("H", "C"), /Tonalidade inválida/);
});

test("restricts destination keys to the source mode when mode changes are disabled", () => {
  const majorOptions = getTranspositionKeyOptions("A", false);
  const minorOptions = getTranspositionKeyOptions("Am", false);

  assert.equal(majorOptions.length, 12);
  assert.ok(majorOptions.every((option) => !option.value.endsWith("m")));
  assert.equal(minorOptions.length, 12);
  assert.ok(minorOptions.every((option) => option.value.endsWith("m")));
  assert.ok(minorOptions.some((option) => option.value === "Bm"));
});
