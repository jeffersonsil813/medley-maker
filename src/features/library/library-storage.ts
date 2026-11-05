import { isMusicalKey, SONG_SECTION_TYPES, type Song } from "./song-types";

export const LIBRARY_STORAGE_KEY = "medley-maker:song-library";
export const LIBRARY_STORAGE_VERSION = 1;
export const EMPTY_LIBRARY_SNAPSHOT = "__medley-maker-empty-library__";
export const STORAGE_ACCESS_ERROR_SNAPSHOT = "__medley-maker-storage-error__";

type StoredLibrary = {
  version: typeof LIBRARY_STORAGE_VERSION;
  songs: Song[];
};

function isSong(value: unknown): value is Song {
  if (!value || typeof value !== "object") return false;

  const song = value as Partial<Song>;
  return (
    typeof song.id === "string" &&
    typeof song.title === "string" &&
    typeof song.artist === "string" &&
    isMusicalKey(song.originalKey) &&
    typeof song.createdAt === "string" &&
    typeof song.updatedAt === "string" &&
    Array.isArray(song.sections) &&
    song.sections.every(
      (section) =>
        !!section &&
        typeof section.id === "string" &&
        typeof section.type === "string" &&
        SONG_SECTION_TYPES.includes(section.type as (typeof SONG_SECTION_TYPES)[number]) &&
        typeof section.content === "string" &&
        Number.isInteger(section.position),
    )
  );
}

export function readLibrarySongs(): Song[] {
  const snapshot = getLibrarySnapshot();
  const result = parseLibrarySnapshot(snapshot);
  if (result.error) throw new Error(result.error);
  return result.songs;
}

export function getLibrarySnapshot() {
  try {
    return window.localStorage.getItem(LIBRARY_STORAGE_KEY) ?? EMPTY_LIBRARY_SNAPSHOT;
  } catch {
    return STORAGE_ACCESS_ERROR_SNAPSHOT;
  }
}

export function parseLibrarySnapshot(snapshot: string | null) {
  if (snapshot === null) {
    return { songs: [] as Song[], error: null, isLoaded: false };
  }

  if (snapshot === STORAGE_ACCESS_ERROR_SNAPSHOT) {
    return {
      songs: [] as Song[],
      error: "Não foi possível acessar o armazenamento local deste navegador.",
      isLoaded: true,
    };
  }

  if (snapshot === EMPTY_LIBRARY_SNAPSHOT) {
    return { songs: [] as Song[], error: null, isLoaded: true };
  }

  try {
    const parsed: unknown = JSON.parse(snapshot);
    if (!parsed || typeof parsed !== "object") throw new Error("Invalid library data");

    const library = parsed as Partial<StoredLibrary>;
    if (
      library.version !== LIBRARY_STORAGE_VERSION ||
      !Array.isArray(library.songs) ||
      !library.songs.every(isSong)
    ) {
      throw new Error("Unsupported library data");
    }

    return { songs: library.songs, error: null, isLoaded: true };
  } catch {
    return {
      songs: [] as Song[],
      error:
        "Não foi possível ler a biblioteca salva neste navegador. Os dados foram preservados; não faça alterações até verificar o armazenamento local.",
      isLoaded: true,
    };
  }
}

const listeners = new Set<() => void>();

export function subscribeToLibrary(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function writeLibrarySongs(songs: Song[]) {
  const library: StoredLibrary = {
    version: LIBRARY_STORAGE_VERSION,
    songs,
  };

  window.localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(library));
  listeners.forEach((listener) => listener());
}
