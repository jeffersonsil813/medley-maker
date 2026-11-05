"use client";

import { useMemo, useState } from "react";
import { DashboardIcon } from "@/components/dashboard/dashboard-icons";
import { ChordProView } from "@/features/library/components/chordpro-view";
import { SONG_SECTION_LABELS, type Song } from "@/features/library/song-types";
import { previewSongTransposition, type AccidentalPreference } from "../transposition-engine";
import { TranspositionControls, type TranspositionKeyOption } from "./transposition-controls";

type SongTranspositionPanelProps = {
  song: Song;
  keyOptions: TranspositionKeyOption[];
};

export function SongTranspositionPanel({ song, keyOptions }: SongTranspositionPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [targetKey, setTargetKey] = useState<Song["originalKey"] | "">("");
  const [notation, setNotation] = useState<AccidentalPreference>("auto");
  const preview = useMemo(
    () => targetKey ? previewSongTransposition(song, targetKey, notation) : null,
    [notation, song, targetKey],
  );

  return (
    <section className="mb-5 overflow-hidden rounded-2xl border border-white/[0.075] bg-[#101411]">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-white/[0.025] sm:px-5"
      >
        <span>
          <span className="block text-xs font-semibold text-[#e1e6df]">Prévia de transposição</span>
          <span className="mt-1 block text-[10px] text-[#7d877e]">Experimente outro tom sem alterar a música original.</span>
        </span>
        <DashboardIcon name={isOpen ? "chevron-up" : "chevron-down"} size={16} className="shrink-0 text-[#8d978e]" />
      </button>

      {isOpen && (
        <div className="border-t border-white/[0.06] p-4 sm:p-5">
          <TranspositionControls
            sourceKey={song.originalKey}
            targetKey={targetKey}
            notation={notation}
            keyOptions={keyOptions}
            onTargetKeyChange={setTargetKey}
            onNotationChange={setNotation}
          />
          {preview ? (
            <div className="mt-4 space-y-3" aria-live="polite">
              {preview.song.sections.length === 0 ? (
                <p className="rounded-xl border border-white/[0.07] bg-[#0b0e0c] p-4 text-xs text-[#899188]">Esta música ainda não tem seções para transpor.</p>
              ) : preview.song.sections.map((section, index) => (
                <section key={section.id} className="rounded-xl border border-white/[0.07] bg-[#0b0e0c] p-3.5 sm:p-4">
                  <div className="mb-2.5 flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-lg bg-white/[0.05] text-[10px] font-semibold text-[#9aa39a]">{String(index + 1).padStart(2, "0")}</span>
                    <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#bfc7be]">{SONG_SECTION_LABELS[section.type]}</h3>
                  </div>
                  <ChordProView content={section.content} />
                </section>
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-xl border border-dashed border-white/[0.08] px-4 py-5 text-center text-xs text-[#798279]">Selecione um tom para ver a cifra transposta.</p>
          )}
        </div>
      )}
    </section>
  );
}
