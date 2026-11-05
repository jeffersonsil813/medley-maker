"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DashboardIcon } from "@/components/dashboard/dashboard-icons";
import { normalizeSearchText } from "../library-utils";
import { useSongLibrary } from "../use-song-library";
import type { SongInput } from "../song-types";
import { DeleteSongDialog } from "./delete-song-dialog";
import { LibraryEmptyState } from "./library-empty-state";
import { SongCollection } from "./song-collection";
import { SongDetailsDialog } from "./song-details-dialog";
import { SongFormDialog } from "./song-form-dialog";

type DialogState =
  | { type: "create" }
  | { type: "view" | "edit" | "delete"; songId: string }
  | null;

export function LibraryClient() {
  const { songs, isLoaded, canWrite, storageError, addSong, updateSong, deleteSong } =
    useSongLibrary();
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState<DialogState>(null);
  const [feedback, setFeedback] = useState("");

  const activeSong =
    dialog && dialog.type !== "create"
      ? songs.find((song) => song.id === dialog.songId)
      : undefined;

  const visibleSongs = useMemo(() => {
    const normalizedQuery = normalizeSearchText(query);
    const filtered = normalizedQuery
      ? songs.filter((song) =>
          normalizeSearchText(`${song.title} ${song.artist}`).includes(normalizedQuery),
        )
      : songs;

    return [...filtered].sort(
      (first, second) => Date.parse(second.updatedAt) - Date.parse(first.updatedAt),
    );
  }, [query, songs]);

  useEffect(() => {
    if (!feedback) return;

    const timeoutId = window.setTimeout(() => setFeedback(""), 3500);
    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  function handleSave(input: SongInput) {
    const saved =
      dialog?.type === "edit" && activeSong
        ? updateSong(activeSong.id, input)
        : dialog?.type === "create"
          ? addSong(input)
          : false;

    if (saved) {
      setFeedback(dialog?.type === "edit" ? "Alterações salvas." : "Música adicionada à biblioteca.");
      setDialog(null);
    }

    return saved;
  }

  function handleDelete() {
    if (activeSong && deleteSong(activeSong.id)) {
      setDialog(null);
      setFeedback("Música excluída da biblioteca.");
    }
  }

  const addButton = (
    <button
      type="button"
      onClick={() => setDialog({ type: "create" })}
      disabled={!canWrite}
      className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#d4b582] px-4 text-sm font-semibold text-[#242016] transition hover:-translate-y-0.5 hover:bg-[#e0c596] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
    >
      <DashboardIcon name="plus" size={17} />
      Adicionar música
    </button>
  );

  return (
    <>
      <div className="mx-auto w-full max-w-[1320px] px-4 pb-12 pt-5 sm:px-7 sm:pb-16 sm:pt-8 lg:px-10 lg:pt-10 xl:px-14">
        <header className="flex flex-col gap-5 border-b border-white/[0.065] pb-7 sm:flex-row sm:items-end sm:justify-between sm:gap-8 sm:pb-9">
          <div>
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#899188] transition hover:text-[#d6b98c]"
            >
              <span className="rotate-180">
                <DashboardIcon name="chevron-right" size={15} />
              </span>
              Visão geral
            </Link>
            <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a78e68] sm:text-[11px]">
              <DashboardIcon name="library" size={14} />
              Seu repertório
            </p>
            <h1 className="text-[clamp(1.8rem,4vw,2.7rem)] font-semibold leading-[1.1] tracking-[-0.055em] text-[#f0f2ee]">
              Biblioteca de músicas
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#899188] sm:text-[15px]">
              Suas canções, cifras e seções organizadas em um só lugar.
            </p>
          </div>
          <div className="sm:pb-0.5">{addButton}</div>
        </header>

        <section aria-labelledby="library-list-heading" className="pt-7 sm:pt-9">
          <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="library-list-heading"
                className="text-lg font-semibold tracking-[-0.035em] text-[#edf0eb]"
              >
                Suas músicas
              </h2>
              {isLoaded && !storageError && (
                <p className="mt-1.5 text-xs text-[#798279]">
                  {songs.length} {songs.length === 1 ? "música cadastrada" : "músicas cadastradas"}
                </p>
              )}
            </div>

            <label className="relative block w-full sm:max-w-[360px]">
              <span className="sr-only">Pesquisar por título ou artista</span>
              <DashboardIcon
                name="search"
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#738075]"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Pesquisar por título ou artista"
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#111512] pl-10 pr-3.5 text-sm text-[#e5e9e3] outline-none transition placeholder:text-[#687168] focus:border-[#c9a875]/45 focus:ring-2 focus:ring-[#c9a875]/[0.08]"
              />
            </label>
          </div>

          {storageError && (
            <p
              role="alert"
              className="mb-5 rounded-xl border border-red-300/15 bg-red-300/[0.06] px-4 py-3 text-sm leading-6 text-red-100"
            >
              {storageError}
            </p>
          )}

          {feedback && (
            <p
              role="status"
              aria-live="polite"
              className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-300/15 bg-emerald-300/[0.06] px-4 py-3 text-sm text-emerald-100"
            >
              <DashboardIcon name="check" size={16} />
              {feedback}
            </p>
          )}

          {!isLoaded ? (
            <div role="status" className="rounded-2xl border border-white/[0.07] bg-[#121613] p-8 text-sm text-[#899188]">
              Carregando biblioteca…
            </div>
          ) : !canWrite ? (
            <div className="rounded-2xl border border-white/[0.07] bg-[#121613] px-5 py-10 text-center">
              <h3 className="text-sm font-semibold text-[#e5e9e3]">Biblioteca indisponível</h3>
              <p className="mt-1.5 text-xs text-[#899188]">
                Os dados existentes foram preservados e nenhuma alteração será gravada.
              </p>
            </div>
          ) : songs.length === 0 ? (
            <LibraryEmptyState
              onAdd={() => setDialog({ type: "create" })}
              disabled={!canWrite}
            />
          ) : visibleSongs.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.07] bg-[#121613] px-5 py-10 text-center">
              <span className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-white/[0.04] text-[#899188]">
                <DashboardIcon name="search" size={19} />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-[#e5e9e3]">Nenhuma música encontrada</h3>
              <p className="mt-1.5 text-xs text-[#899188]">
                Tente pesquisar por outro título ou artista.
              </p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="mt-4 text-xs font-medium text-[#d6b98c] hover:text-[#ebd3ad]"
              >
                Limpar pesquisa
              </button>
            </div>
          ) : (
            <SongCollection
              songs={visibleSongs}
              onView={(song) => setDialog({ type: "view", songId: song.id })}
              onEdit={(song) => setDialog({ type: "edit", songId: song.id })}
              onDelete={(song) => setDialog({ type: "delete", songId: song.id })}
            />
          )}
        </section>

        <footer className="mt-8 flex items-center justify-center gap-2 border-t border-white/[0.055] pt-5 text-[10px] text-[#596259] sm:mt-10">
          <DashboardIcon name="wave" size={14} />
          <span>Canções que se encontram, em uma só cifra.</span>
        </footer>
      </div>

      {dialog?.type === "create" && (
        <SongFormDialog onClose={() => setDialog(null)} onSubmit={handleSave} />
      )}
      {dialog?.type === "edit" && activeSong && (
        <SongFormDialog
          key={activeSong.id}
          song={activeSong}
          onClose={() => setDialog(null)}
          onSubmit={handleSave}
        />
      )}
      {dialog?.type === "view" && activeSong && (
        <SongDetailsDialog
          song={activeSong}
          onClose={() => setDialog(null)}
          onEdit={() => setDialog({ type: "edit", songId: activeSong.id })}
        />
      )}
      {dialog?.type === "delete" && activeSong && (
        <DeleteSongDialog
          song={activeSong}
          onClose={() => setDialog(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
