import type { MusicalKey, Song, SongSection } from "@/features/library/song-types";
import type { AccidentalPreference } from "@/features/transposition/transposition-engine";
import { SONG_SECTION_LABELS } from "@/features/library/song-types";

export type MedleyItem = {
  id: string;
  sourceSongId: string;
  sourceSectionId: string;
  songTitleSnapshot: string;
  songArtistSnapshot: string;
  originalKeySnapshot: MusicalKey;
  sectionType: SongSection["type"];
  sectionNameSnapshot: string;
  contentSnapshot: string;
  position: number;
};

export type Medley = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  items: MedleyItem[];
  transposition?: MedleyTransposition;
};

export type MedleyTransposition = {
  referenceKey: MusicalKey;
  targetKey: MusicalKey;
  notation: AccidentalPreference;
};

export type MedleyInput = Pick<Medley, "title" | "description" | "items"> & {
  transposition?: MedleyTransposition;
};

export function createMedleyItem(song: Song, section: SongSection, position: number): MedleyItem {
  return {
    id: `item-${globalThis.crypto.randomUUID()}`,
    sourceSongId: song.id,
    sourceSectionId: section.id,
    songTitleSnapshot: song.title,
    songArtistSnapshot: song.artist,
    originalKeySnapshot: song.originalKey,
    sectionType: section.type,
    sectionNameSnapshot: SONG_SECTION_LABELS[section.type],
    contentSnapshot: section.content,
    position,
  };
}
