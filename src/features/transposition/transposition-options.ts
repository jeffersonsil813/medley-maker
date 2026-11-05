import { ALL_MUSICAL_KEYS, type MusicalKey } from "../library/song-types.ts";
import type { TranspositionKeyOption } from "./components/transposition-controls";

export function getTranspositionKeyOptions(
  sourceKey: MusicalKey,
  allowModeChange: boolean,
): TranspositionKeyOption[] {
  const sourceIsMinor = sourceKey.endsWith("m");
  return ALL_MUSICAL_KEYS
    .filter((key) => allowModeChange || key.value.endsWith("m") === sourceIsMinor)
    .map((key) => ({ value: key.value, label: key.label }));
}
