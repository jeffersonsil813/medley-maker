import type { MedleyItem } from "./medley-types";

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
