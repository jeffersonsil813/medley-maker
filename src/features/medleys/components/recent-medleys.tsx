"use client";

import { EmptyMedleys } from "@/components/dashboard/empty-medleys";
import { MedleyCard } from "@/components/dashboard/medley-card";
import { getMedleySongs } from "../medley-utils";
import { useMedleyLibrary } from "../use-medley-library";

const artworkPalettes = [
  "bg-[linear-gradient(125deg,#4b5945_0%,#26382e_48%,#18241f_100%)]",
  "bg-[linear-gradient(125deg,#6a5144_0%,#493b35_48%,#282522_100%)]",
  "bg-[linear-gradient(125deg,#4b4c69_0%,#323345_48%,#202128_100%)]",
];

export function RecentMedleys() {
  const { medleys, isLoaded, storageError } = useMedleyLibrary();
  const recentMedleys = [...medleys]
    .sort((first, second) => Date.parse(second.updatedAt) - Date.parse(first.updatedAt))
    .slice(0, 3);

  return (
    <section id="recentes" aria-labelledby="recent-medleys-heading" className="pt-8 sm:pt-10">
      <div className="mb-5 flex items-end justify-between gap-4 sm:mb-6">
        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.19em] text-[#737d74]">
            Seu repertório em construção
          </p>
          <h2
            id="recent-medleys-heading"
            className="text-xl font-semibold tracking-[-0.04em] text-[#edf0eb] sm:text-[22px]"
          >
            Medleys recentes
          </h2>
        </div>
        {isLoaded && recentMedleys.length > 0 && (
          <span className="mb-0.5 inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5 text-[10px] font-medium text-[#929a92] sm:text-xs">
            {medleys.length} {medleys.length === 1 ? "medley" : "medleys"}
          </span>
        )}
      </div>

      {storageError && (
        <p role="alert" className="mb-4 rounded-xl border border-red-300/15 bg-red-300/[0.06] px-4 py-3 text-xs leading-5 text-red-100">
          {storageError}
        </p>
      )}

      {!isLoaded ? (
        <div role="status" className="rounded-2xl border border-white/[0.07] bg-[#121613] p-8 text-sm text-[#899188]">
          Carregando medleys…
        </div>
      ) : recentMedleys.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
          {recentMedleys.map((medley, index) => (
            <MedleyCard
              key={medley.id}
              medley={{
                id: medley.id,
                title: medley.title,
                songs: getMedleySongs(medley.items).map((item) => item.songTitleSnapshot),
                sectionCount: medley.items.length,
                updatedAt: medley.updatedAt,
                artwork: artworkPalettes[index % artworkPalettes.length],
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyMedleys />
      )}

    </section>
  );
}
