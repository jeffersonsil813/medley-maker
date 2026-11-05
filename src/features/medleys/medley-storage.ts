import { isMusicalKey, SONG_SECTION_TYPES, type SongSectionType } from "@/features/library/song-types";
import type { Medley, MedleyItem } from "./medley-types";

export const MEDLEY_STORAGE_KEY = "medley-maker:medleys";
export const MEDLEY_STORAGE_VERSION = 1;
const EMPTY_MEDLEY_SNAPSHOT = "__medley-maker-empty-medleys__";
const STORAGE_ACCESS_ERROR_SNAPSHOT = "__medley-maker-medley-storage-error__";

type StoredMedleyLibrary = {
  version: typeof MEDLEY_STORAGE_VERSION;
  medleys: Medley[];
};

function isMedleyItem(value: unknown): value is MedleyItem {
  if (!value || typeof value !== "object") return false;

  const item = value as Partial<MedleyItem>;
  return (
    typeof item.id === "string" &&
    typeof item.sourceSongId === "string" &&
    typeof item.sourceSectionId === "string" &&
    typeof item.songTitleSnapshot === "string" &&
    typeof item.songArtistSnapshot === "string" &&
    isMusicalKey(item.originalKeySnapshot) &&
    typeof item.sectionType === "string" &&
    SONG_SECTION_TYPES.includes(item.sectionType as SongSectionType) &&
    typeof item.sectionNameSnapshot === "string" &&
    typeof item.contentSnapshot === "string" &&
    Number.isInteger(item.position)
  );
}

function isMedley(value: unknown): value is Medley {
  if (!value || typeof value !== "object") return false;

  const medley = value as Partial<Medley>;
  return (
    typeof medley.id === "string" &&
    typeof medley.title === "string" &&
    typeof medley.description === "string" &&
    typeof medley.createdAt === "string" &&
    typeof medley.updatedAt === "string" &&
    Array.isArray(medley.items) &&
    medley.items.every(isMedleyItem)
  );
}

export function getMedleySnapshot() {
  try {
    return window.localStorage.getItem(MEDLEY_STORAGE_KEY) ?? EMPTY_MEDLEY_SNAPSHOT;
  } catch {
    return STORAGE_ACCESS_ERROR_SNAPSHOT;
  }
}

export function parseMedleySnapshot(snapshot: string | null) {
  if (snapshot === null) {
    return { medleys: [] as Medley[], error: null, isLoaded: false };
  }

  if (snapshot === STORAGE_ACCESS_ERROR_SNAPSHOT) {
    return {
      medleys: [] as Medley[],
      error: "Não foi possível acessar o armazenamento de medleys deste navegador.",
      isLoaded: true,
    };
  }

  if (snapshot === EMPTY_MEDLEY_SNAPSHOT) {
    return { medleys: [] as Medley[], error: null, isLoaded: true };
  }

  try {
    const parsed: unknown = JSON.parse(snapshot);
    if (!parsed || typeof parsed !== "object") throw new Error("Invalid medley data");

    const library = parsed as Partial<StoredMedleyLibrary>;
    if (
      library.version !== MEDLEY_STORAGE_VERSION ||
      !Array.isArray(library.medleys) ||
      !library.medleys.every(isMedley)
    ) {
      throw new Error("Unsupported medley data");
    }

    return { medleys: library.medleys, error: null, isLoaded: true };
  } catch {
    return {
      medleys: [] as Medley[],
      error:
        "Não foi possível ler os medleys salvos. Os dados foram preservados e nenhuma alteração será gravada.",
      isLoaded: true,
    };
  }
}

const listeners = new Set<() => void>();

export function subscribeToMedleys(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function writeMedleys(medleys: Medley[]) {
  const library: StoredMedleyLibrary = {
    version: MEDLEY_STORAGE_VERSION,
    medleys,
  };

  window.localStorage.setItem(MEDLEY_STORAGE_KEY, JSON.stringify(library));
  listeners.forEach((listener) => listener());
}
