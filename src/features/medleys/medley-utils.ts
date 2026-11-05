import type { Medley, MedleyItem } from "./medley-types";

export function normalizeMedleySearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

export function reorderMedleyItem(items: MedleyItem[], itemId: string, direction: -1 | 1) {
  const currentIndex = items.findIndex((item) => item.id === itemId);
  const nextIndex = currentIndex + direction;

  if (currentIndex < 0 || nextIndex < 0 || nextIndex >= items.length) return items;

  const reordered = [...items];
  [reordered[currentIndex], reordered[nextIndex]] = [reordered[nextIndex], reordered[currentIndex]];
  return reordered.map((item, position) => ({ ...item, position }));
}

export function reorderSongGroup(items: MedleyItem[], songId: string, direction: -1 | 1) {
  const groups = [...new Set(items.map((item) => item.sourceSongId))];
  const currentIndex = groups.indexOf(songId);
  const nextIndex = currentIndex + direction;

  if (currentIndex < 0 || nextIndex < 0 || nextIndex >= groups.length) return items;

  [groups[currentIndex], groups[nextIndex]] = [groups[nextIndex], groups[currentIndex]];

  return groups
    .flatMap((groupId) => items.filter((item) => item.sourceSongId === groupId))
    .map((item, position) => ({ ...item, position }));
}

export function getMedleySongs(items: MedleyItem[]) {
  return [...new Map(items.map((item) => [item.sourceSongId, item])).values()];
}

export function getSuggestedMedleyTitle(items: MedleyItem[]) {
  const orderedItems = [...items].sort((first, second) => first.position - second.position);
  const uniqueSongs = new Map<string, string>();

  for (const item of orderedItems) {
    if (!uniqueSongs.has(item.sourceSongId)) {
      uniqueSongs.set(item.sourceSongId, item.songTitleSnapshot);
    }
  }

  return [...uniqueSongs.values()].join(" + ");
}

export function getCurrentMedleyKey(medley: Pick<Medley, "items" | "transposition">) {
  if (medley.transposition) return medley.transposition.targetKey;

  return [...medley.items]
    .sort((first, second) => first.position - second.position)[0]
    ?.originalKeySnapshot ?? null;
}
