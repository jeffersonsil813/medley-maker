"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import {
  getLibrarySnapshot,
  parseLibrarySnapshot,
  subscribeToLibrary,
  writeLibrarySongs,
} from "./library-storage";
import { createLocalId, type Song, type SongInput } from "./song-types";

export function useSongLibrary() {
  const snapshot = useSyncExternalStore(
    subscribeToLibrary,
    getLibrarySnapshot,
    () => null,
  );
  const libraryState = useMemo(() => parseLibrarySnapshot(snapshot), [snapshot]);
  const [writeError, setWriteError] = useState<string | null>(null);
  const { songs, isLoaded } = libraryState;
  const canWrite = isLoaded && !libraryState.error;
  const storageError = libraryState.error ?? writeError;

  const commitSongs = useCallback(
    (nextSongs: Song[]) => {
      if (!canWrite) return false;

      try {
        writeLibrarySongs(nextSongs);
        setWriteError(null);
        return true;
      } catch {
        setWriteError("Não foi possível salvar as alterações no armazenamento deste navegador.");
        return false;
      }
    },
    [canWrite],
  );

  const addSong = useCallback(
    (input: SongInput) => {
      const now = new Date().toISOString();
      const song: Song = {
        ...input,
        id: createLocalId("song"),
        createdAt: now,
        updatedAt: now,
      };

      return commitSongs([song, ...songs]);
    },
    [commitSongs, songs],
  );

  const updateSong = useCallback(
    (id: string, input: SongInput) => {
      const existingSong = songs.find((song) => song.id === id);
      if (!existingSong) return false;

      const updatedSong: Song = {
        ...existingSong,
        ...input,
        updatedAt: new Date().toISOString(),
      };

      return commitSongs(songs.map((song) => (song.id === id ? updatedSong : song)));
    },
    [commitSongs, songs],
  );

  const deleteSong = useCallback(
    (id: string) => commitSongs(songs.filter((song) => song.id !== id)),
    [commitSongs, songs],
  );

  return {
    songs,
    isLoaded,
    canWrite,
    storageError,
    addSong,
    updateSong,
    deleteSong,
  };
}
