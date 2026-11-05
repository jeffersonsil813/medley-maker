"use client";

import { DashboardIcon } from "@/components/dashboard/dashboard-icons";
import { formatUpdatedAt } from "../library-utils";
import { SONG_SECTION_LABELS, type Song } from "../song-types";
import { ChordProView } from "./chordpro-view";
import { DialogShell } from "./dialog-shell";
import { SongTranspositionPanel } from "@/features/transposition/components/song-transposition-panel";
import { getTranspositionKeyOptions } from "@/features/transposition/transposition-options";

type SongDetailsDialogProps = {
  song: Song;
  onClose: () => void;
  onEdit: () => void;
};

export function SongDetailsDialog({ song, onClose, onEdit }: SongDetailsDialogProps) {
  const orderedSections = [...song.sections].sort((a, b) => a.position - b.position);

  return (
    <DialogShell title={song.title} description={song.artist} onClose={onClose}>
      <div className="px-5 py-5 sm:px-7 sm:py-6">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#c9a875]/15 bg-[#c9a875]/[0.07] px-2.5 py-1.5 text-xs font-medium text-[#d9b982]">
            <DashboardIcon name="music" size={14} />
            Tom original: {song.originalKey}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5 text-xs text-[#899188]">
            <DashboardIcon name="calendar" size={13} />
            Atualizada em {formatUpdatedAt(song.updatedAt)}
          </span>
        </div>

        <SongTranspositionPanel
          song={song}
          keyOptions={getTranspositionKeyOptions(song.originalKey, false)}
        />

        <div className="space-y-3">
          {orderedSections.map((section, index) => (
            <section
              key={section.id}
              className="rounded-2xl border border-white/[0.075] bg-[#0c100d] p-4 sm:p-5"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-lg bg-white/[0.05] text-[10px] font-semibold text-[#a8b0a8]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#bfc7be]">
                  {SONG_SECTION_LABELS[section.type]}
                </h3>
              </div>
              <ChordProView content={section.content} />
            </section>
          ))}
          {orderedSections.length === 0 && (
            <p className="rounded-xl border border-white/[0.07] bg-[#0c100d] p-4 text-sm text-[#899188]">
              Nenhuma seção foi adicionada a esta música.
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#d4b582] px-4 text-sm font-semibold text-[#242016] transition hover:bg-[#e0c596]"
          >
            <DashboardIcon name="edit" size={15} />
            Editar música
          </button>
        </div>
      </div>
    </DialogShell>
  );
}
