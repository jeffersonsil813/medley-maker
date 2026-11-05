"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DashboardIcon } from "@/components/dashboard/dashboard-icons";
import { normalizeMedleySearch } from "../medley-utils";
import { SONG_SECTION_LABELS, type Song, type SongSection } from "@/features/library/song-types";
import type { MedleyItem } from "../medley-types";

type SongPickerProps = {
  songs: Song[];
  items: MedleyItem[];
  canSelect: boolean;
  onAdd: (song: Song, section: SongSection) => void;
};

function getSectionExcerpt(content: string) {
  return content
    .replace(/\[[^\]]+\]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 92);
}

export function SongPicker({ songs, items, canSelect, onAdd }: SongPickerProps) {
  const [query, setQuery] = useState("");
  const [expandedSongIds, setExpandedSongIds] = useState<Set<string>>(() => new Set());
  const normalizedQuery = normalizeMedleySearch(query);
  const filteredSongs = useMemo(
    () =>
      songs.filter((song) =>
        normalizeMedleySearch(`${song.title} ${song.artist}`).includes(normalizedQuery),
      ),
    [normalizedQuery, songs],
  );

  function toggleSong(songId: string) {
    setExpandedSongIds((current) => {
      const next = new Set(current);
      if (next.has(songId)) next.delete(songId);
      else next.add(songId);
      return next;
    });
  }

  return (
    <section aria-labelledby="song-picker-heading" className="rounded-[22px] border border-white/[0.075] bg-[#111512] p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7c867d]">
            Passo 1
          </p>
          <h2 id="song-picker-heading" className="text-base font-semibold tracking-[-0.025em] text-[#edf0eb]">
            Adicione trechos
          </h2>
        </div>
        <span className="flex size-9 items-center justify-center rounded-xl bg-[#c9a875]/[0.08] text-[#d6b98c]">
          <DashboardIcon name="library" size={17} />
        </span>
      </div>

      <label className="relative mb-3 block">
        <span className="sr-only">Pesquisar músicas pelo título ou artista</span>
        <DashboardIcon
          name="search"
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#738075]"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Pesquisar músicas"
          className="h-10 w-full rounded-xl border border-white/[0.08] bg-[#0b0e0c] pl-9 pr-3 text-xs text-[#e5e9e3] outline-none transition placeholder:text-[#687168] focus:border-[#c9a875]/45"
        />
      </label>

      {!canSelect && (
        <p role="alert" className="mb-3 rounded-xl border border-amber-300/15 bg-amber-300/[0.05] px-3 py-2.5 text-xs leading-5 text-amber-100">
          A biblioteca não está disponível. Os trechos já adicionados continuam editáveis.
        </p>
      )}

      {songs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/[0.1] px-4 py-6 text-center">
          <p className="text-xs leading-5 text-[#899188]">
            Cadastre músicas na biblioteca antes de adicioná-las a um medley.
          </p>
          <Link href="/biblioteca" className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#d6b98c] hover:text-[#ebd3ad]">
            Ir para a biblioteca
            <DashboardIcon name="arrow-up-right" size={13} />
          </Link>
        </div>
      ) : filteredSongs.length === 0 ? (
        <p className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-6 text-center text-xs text-[#899188]">
          Nenhuma música corresponde à pesquisa.
        </p>
      ) : (
        <div className="max-h-[620px] space-y-2 overflow-y-auto pr-1">
          {filteredSongs.map((song) => {
            const expanded = expandedSongIds.has(song.id);
            const selectedCount = items.filter((item) => item.sourceSongId === song.id).length;
            const orderedSections = [...song.sections].sort((first, second) => first.position - second.position);

            return (
              <article key={song.id} className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#0c100d]">
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => toggleSong(song.id)}
                  className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition hover:bg-white/[0.035]"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.045] text-[#aab2aa]">
                    <DashboardIcon name="music" size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-[#e5e9e3]">{song.title}</span>
                    <span className="mt-0.5 block truncate text-[11px] text-[#7f8980]">{song.artist}</span>
                  </span>
                  {selectedCount > 0 && (
                    <span className="rounded-full border border-[#c9a875]/15 bg-[#c9a875]/[0.07] px-2 py-1 text-[10px] font-medium text-[#d6b98c]">
                      {selectedCount} {selectedCount === 1 ? "trecho" : "trechos"}
                    </span>
                  )}
                  <DashboardIcon name={expanded ? "chevron-up" : "chevron-down"} size={16} className="shrink-0 text-[#788178]" />
                </button>

                {expanded && (
                  <div className="space-y-2 border-t border-white/[0.06] p-2.5">
                    {orderedSections.length === 0 ? (
                      <p className="px-2 py-3 text-xs text-[#798279]">Esta música não tem seções cadastradas.</p>
                    ) : (
                      orderedSections.map((section) => (
                        <div key={section.id} className="flex items-center gap-3 rounded-lg bg-white/[0.025] px-3 py-2.5">
                          <span className="min-w-0 flex-1">
                            <span className="block text-xs font-medium text-[#cbd2ca]">
                              {SONG_SECTION_LABELS[section.type]}
                            </span>
                            <span className="mt-1 block truncate font-mono text-[10px] text-[#727d73]">
                              {getSectionExcerpt(section.content) || "Sem letra cadastrada"}
                            </span>
                          </span>
                          <button
                            type="button"
                            disabled={!canSelect}
                            onClick={() => onAdd(song, section)}
                            aria-label={`Adicionar ${SONG_SECTION_LABELS[section.type]} de ${song.title}`}
                            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-white/[0.1] px-2.5 text-[10px] font-medium text-[#d6b98c] transition hover:border-[#c9a875]/30 hover:bg-[#c9a875]/[0.07] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <DashboardIcon name="plus" size={13} />
                            Adicionar
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
