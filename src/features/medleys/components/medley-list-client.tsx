"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Suspense } from "react";
import { DashboardIcon } from "@/components/dashboard/dashboard-icons";
import { EmptyMedleys } from "@/components/dashboard/empty-medleys";
import { MedleyCard } from "@/components/dashboard/medley-card";
import { getCurrentMedleyKey, normalizeMedleySearch } from "../medley-utils";
import type { Medley } from "../medley-types";
import { useMedleyLibrary } from "../use-medley-library";
import { DeleteMedleyDialog } from "./delete-medley-dialog";
import { MedleySaveConfirmation } from "./medley-save-confirmation";

const artworkPalettes = [
  "bg-[linear-gradient(125deg,#4b5945_0%,#26382e_48%,#18241f_100%)]",
  "bg-[linear-gradient(125deg,#6a5144_0%,#493b35_48%,#282522_100%)]",
  "bg-[linear-gradient(125deg,#4b4c69_0%,#323345_48%,#202128_100%)]",
];

export function MedleyListClient() {
  const { medleys, isLoaded, canWrite, storageError, deleteMedley } = useMedleyLibrary();
  const [query, setQuery] = useState("");
  const [medleyPendingDeletion, setMedleyPendingDeletion] = useState<Medley | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  function confirmDeleteMedley() {
    if (!medleyPendingDeletion) return;

    if (deleteMedley(medleyPendingDeletion.id)) {
      setFeedback(`“${medleyPendingDeletion.title}” foi excluído.`);
      setMedleyPendingDeletion(null);
    } else {
      setFeedback("Não foi possível excluir o medley. Verifique o armazenamento do navegador e tente novamente.");
    }
  }

  const filteredMedleys = useMemo(() => {
    const normalizedQuery = normalizeMedleySearch(query);
    const filtered = normalizedQuery
      ? medleys.filter((medley) => normalizeMedleySearch(medley.title).includes(normalizedQuery))
      : medleys;

    return [...filtered].sort(
      (first, second) => Date.parse(second.updatedAt) - Date.parse(first.updatedAt),
    );
  }, [medleys, query]);

  return (
    <>
      <header className="flex flex-col gap-5 border-b border-white/[0.065] pb-7 sm:flex-row sm:items-end sm:justify-between sm:gap-8 sm:pb-9">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a78e68] sm:text-[11px]">
            Seu repertório em construção
          </p>
          <h1 className="text-[clamp(1.8rem,4vw,2.7rem)] font-semibold leading-[1.1] tracking-[-0.055em] text-[#f0f2ee]">
            Meus medleys
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#899188] sm:text-[15px]">
            Organize sequências de músicas e trechos para cada momento.
          </p>
        </div>
        <Link
          href="/medleys/novo"
          className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#d4b582] px-4 text-sm font-semibold text-[#242016] transition hover:-translate-y-0.5 hover:bg-[#e0c596] sm:w-auto"
        >
          <DashboardIcon name="plus" size={17} />
          Criar novo medley
        </Link>
      </header>

      <section aria-labelledby="medley-list-heading" className="pt-7 sm:pt-9">
        <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="medley-list-heading" className="text-lg font-semibold tracking-[-0.035em] text-[#edf0eb]">
              Medleys salvos
            </h2>
            {isLoaded && !storageError && (
              <p className="mt-1.5 text-xs text-[#798279]">
                {medleys.length} {medleys.length === 1 ? "medley salvo" : "medleys salvos"}
              </p>
            )}
          </div>
          <label className="relative block w-full sm:max-w-[360px]">
            <span className="sr-only">Pesquisar medleys pelo nome</span>
            <DashboardIcon
              name="search"
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#738075]"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Pesquisar pelo nome"
              className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#111512] pl-10 pr-3.5 text-sm text-[#e5e9e3] outline-none transition placeholder:text-[#687168] focus:border-[#c9a875]/45 focus:ring-2 focus:ring-[#c9a875]/[0.08]"
            />
          </label>
        </div>

        {storageError && (
          <p role="alert" className="mb-5 rounded-xl border border-red-300/15 bg-red-300/[0.06] px-4 py-3 text-sm leading-6 text-red-100">
            {storageError}
          </p>
        )}

        <Suspense fallback={null}>
          <MedleySaveConfirmation />
        </Suspense>

        {feedback && (
          <p role="status" className="mb-5 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm text-[#c8d0c7]">
            {feedback}
          </p>
        )}

        {!isLoaded ? (
          <div role="status" className="rounded-2xl border border-white/[0.07] bg-[#121613] p-8 text-sm text-[#899188]">
            Carregando medleys…
          </div>
        ) : medleys.length === 0 ? (
          <EmptyMedleys />
        ) : filteredMedleys.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.07] bg-[#121613] px-5 py-10 text-center">
            <h3 className="text-sm font-semibold text-[#e5e9e3]">Nenhum medley encontrado</h3>
            <p className="mt-1.5 text-xs text-[#899188]">Tente pesquisar por outro nome.</p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-4 text-xs font-medium text-[#d6b98c] hover:text-[#ebd3ad]"
            >
              Limpar pesquisa
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
            {filteredMedleys.map((medley, index) => (
              <MedleyCard
                key={medley.id}
                medley={{
                  id: medley.id,
                  title: medley.title,
                  songs: [...new Set(medley.items.map((item) => item.songTitleSnapshot))],
                  currentKey: getCurrentMedleyKey(medley),
                  sectionCount: medley.items.length,
                  updatedAt: medley.updatedAt,
                  artwork: artworkPalettes[index % artworkPalettes.length],
                }}
                onDelete={canWrite ? () => { setFeedback(null); setMedleyPendingDeletion(medley); } : undefined}
              />
            ))}
          </div>
        )}
      </section>
      {medleyPendingDeletion && (
        <DeleteMedleyDialog
          medley={medleyPendingDeletion}
          onClose={() => setMedleyPendingDeletion(null)}
          onConfirm={confirmDeleteMedley}
        />
      )}
    </>
  );
}
