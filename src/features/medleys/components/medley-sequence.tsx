"use client";

import { DashboardIcon } from "@/components/dashboard/dashboard-icons";
import { ChordProView } from "@/features/library/components/chordpro-view";
import { getMedleySongs } from "../medley-utils";
import type { MedleyItem } from "../medley-types";

type MedleySequenceProps = {
  items: MedleyItem[];
  onMoveItem: (itemId: string, direction: -1 | 1) => void;
  onRemoveItem: (itemId: string) => void;
  onMoveSong: (songId: string, direction: -1 | 1) => void;
  onRemoveSong: (songId: string) => void;
};

export function MedleySequence({
  items,
  onMoveItem,
  onRemoveItem,
  onMoveSong,
  onRemoveSong,
}: MedleySequenceProps) {
  const orderedItems = [...items].sort((first, second) => first.position - second.position);
  const songs = getMedleySongs(orderedItems);

  return (
    <section aria-labelledby="sequence-heading" className="rounded-[22px] border border-white/[0.075] bg-[#111512] p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7c867d]">
            Passo 2
          </p>
          <h2 id="sequence-heading" className="text-base font-semibold tracking-[-0.025em] text-[#edf0eb]">
            Sequência do medley
          </h2>
        </div>
        <span className="rounded-full border border-white/[0.08] bg-white/[0.025] px-2.5 py-1.5 text-[10px] font-medium text-[#929a92]">
          {orderedItems.length} {orderedItems.length === 1 ? "trecho" : "trechos"}
        </span>
      </div>

      {songs.length > 0 && (
        <div className="mb-4 rounded-xl border border-white/[0.06] bg-[#0c100d] p-3">
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#768078]">
            Músicas na sequência
          </p>
          <div className="space-y-1.5">
            {songs.map((song, index) => {
              const songItems = orderedItems.filter((item) => item.sourceSongId === song.sourceSongId);
              const firstSongItem = songItems[0];

              return (
                <div key={song.sourceSongId} className="flex min-w-0 items-center gap-2 rounded-lg px-1 py-1.5">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-[10px] font-semibold text-[#9da69d]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-medium text-[#d3d9d2]">
                      {song.songTitleSnapshot}
                    </span>
                    <span className="block text-[10px] text-[#727d73]">
                      {songItems.length} {songItems.length === 1 ? "trecho" : "trechos"}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onMoveSong(song.sourceSongId, -1)}
                    disabled={index === 0}
                    aria-label={`Mover ${song.songTitleSnapshot} para cima`}
                    className="flex size-7 shrink-0 items-center justify-center rounded-lg text-[#899188] transition hover:bg-white/[0.06] hover:text-[#e7c895] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <DashboardIcon name="chevron-up" size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onMoveSong(song.sourceSongId, 1)}
                    disabled={index === songs.length - 1}
                    aria-label={`Mover ${song.songTitleSnapshot} para baixo`}
                    className="flex size-7 shrink-0 items-center justify-center rounded-lg text-[#899188] transition hover:bg-white/[0.06] hover:text-[#e7c895] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <DashboardIcon name="chevron-down" size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveSong(song.sourceSongId)}
                    aria-label={`Remover ${song.songTitleSnapshot} e seus trechos`}
                    title={`Remover ${song.songTitleSnapshot} do medley`}
                    className="flex size-7 shrink-0 items-center justify-center rounded-lg text-[#8a7775] transition hover:bg-red-400/[0.09] hover:text-red-200"
                  >
                    <DashboardIcon name="trash" size={14} />
                  </button>
                  <span className="sr-only">Seção de origem: {firstSongItem.sectionNameSnapshot}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {orderedItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/[0.09] px-4 py-8 text-center">
          <span className="mx-auto flex size-10 items-center justify-center rounded-xl bg-white/[0.04] text-[#8d978e]">
            <DashboardIcon name="music" size={18} />
          </span>
          <p className="mt-3 text-xs font-medium text-[#c6cec5]">Sua sequência está vazia</p>
          <p className="mt-1 text-[11px] leading-5 text-[#778078]">
            Escolha uma música e adicione as seções que deseja usar.
          </p>
        </div>
      ) : (
        <ol className="space-y-2.5">
          {orderedItems.map((item, index) => (
            <li key={item.id} className="rounded-xl border border-white/[0.07] bg-[#0c100d] p-3.5">
              <div className="flex items-start gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-[#c9a875]/15 bg-[#c9a875]/[0.07] text-[10px] font-semibold text-[#d6b98c]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-medium text-[#a4ada4]">
                    {item.songTitleSnapshot} <span className="text-[#586158">·</span> {item.sectionNameSnapshot}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-[#6f796f]">
                    {item.songArtistSnapshot} <span className="text-[#555f56">·</span> tom {item.originalKeySnapshot}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => onMoveItem(item.id, -1)}
                    disabled={index === 0}
                    aria-label={`Mover trecho ${index + 1} para cima`}
                    className="flex size-7 items-center justify-center rounded-lg text-[#899188] transition hover:bg-white/[0.06] hover:text-[#e7c895] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <DashboardIcon name="chevron-up" size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onMoveItem(item.id, 1)}
                    disabled={index === orderedItems.length - 1}
                    aria-label={`Mover trecho ${index + 1} para baixo`}
                    className="flex size-7 items-center justify-center rounded-lg text-[#899188] transition hover:bg-white/[0.06] hover:text-[#e7c895] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <DashboardIcon name="chevron-down" size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    aria-label={`Remover trecho ${index + 1}: ${item.sectionNameSnapshot} de ${item.songTitleSnapshot}`}
                    className="flex size-7 items-center justify-center rounded-lg text-[#8a7775] transition hover:bg-red-400/[0.09] hover:text-red-200"
                  >
                    <DashboardIcon name="x" size={14} />
                  </button>
                </div>
              </div>
              <div className="mt-3 border-t border-white/[0.055] pt-2.5 pl-10">
                <div className="max-h-[68px] overflow-hidden [mask-image:linear-gradient(to_bottom,black,transparent)]">
                  <ChordProView content={item.contentSnapshot} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
