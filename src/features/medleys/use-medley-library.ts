"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { createLocalId } from "@/features/library/song-types";
import { getMedleySnapshot, parseMedleySnapshot, subscribeToMedleys, writeMedleys } from "./medley-storage";
import type { Medley, MedleyInput } from "./medley-types";

export function useMedleyLibrary() {
  const snapshot = useSyncExternalStore(
    subscribeToMedleys,
    getMedleySnapshot,
    () => null,
  );
  const libraryState = useMemo(() => parseMedleySnapshot(snapshot), [snapshot]);
  const [writeError, setWriteError] = useState<string | null>(null);
  const { medleys, isLoaded } = libraryState;
  const canWrite = isLoaded && !libraryState.error;
  const storageError = libraryState.error ?? writeError;

  const commit = useCallback(
    (nextMedleys: Medley[]) => {
      if (!canWrite) return false;

      try {
        writeMedleys(nextMedleys);
        setWriteError(null);
        return true;
      } catch {
        setWriteError("Não foi possível salvar alterações no armazenamento deste navegador.");
        return false;
      }
    },
    [canWrite],
  );

  const addMedley = useCallback(
    (input: MedleyInput) => {
      const now = new Date().toISOString();
      const medley: Medley = {
        ...input,
        id: createLocalId("medley"),
        createdAt: now,
        updatedAt: now,
      };

      return commit([medley, ...medleys]) ? medley : null;
    },
    [commit, medleys],
  );

  const updateMedley = useCallback(
    (id: string, input: MedleyInput) => {
      const existing = medleys.find((medley) => medley.id === id);
      if (!existing) return null;

      const updated: Medley = {
        ...existing,
        ...input,
        updatedAt: new Date().toISOString(),
      };

      return commit(medleys.map((medley) => (medley.id === id ? updated : medley)))
        ? updated
        : null;
    },
    [commit, medleys],
  );

  return { medleys, isLoaded, canWrite, storageError, addMedley, updateMedley };
}
