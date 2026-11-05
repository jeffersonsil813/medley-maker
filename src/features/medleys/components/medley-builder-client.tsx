"use client";

import Link from "next/link";
import { DashboardIcon } from "@/components/dashboard/dashboard-icons";
import { useSongLibrary } from "@/features/library/use-song-library";
import { useMedleyLibrary } from "../use-medley-library";
import { MedleyEditor } from "./medley-editor";

export function MedleyBuilderClient({ medleyId }: { medleyId?: string }) {
  const songLibrary = useSongLibrary();
  const medleyLibrary = useMedleyLibrary();
  const isLoaded = songLibrary.isLoaded && medleyLibrary.isLoaded;
  const medley = medleyId ? medleyLibrary.medleys.find((entry) => entry.id === medleyId) : undefined;

  if (!isLoaded) {
    return <div className="rounded-[22px] border border-white/[0.075] bg-[#111512] px-5 py-16 text-center text-sm text-[#899188]">Carregando músicas e medleys…</div>;
  }

  if (medleyId && !medley && !medleyLibrary.storageError) {
    return (
      <div className="rounded-[22px] border border-white/[0.075] bg-[#111512] px-5 py-16 text-center">
        <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-white/[0.04] text-[#9aa39a]"><DashboardIcon name="music" size={20} /></span>
        <h1 className="mt-4 text-lg font-semibold text-[#edf0eb]">Medley não encontrado</h1>
        <p className="mt-2 text-sm text-[#899188]">Ele pode ter sido removido ou este endereço está incorreto.</p>
        <Link href="/medleys" className="mt-5 inline-flex h-10 items-center rounded-xl bg-[#d3b486] px-4 text-xs font-semibold text-[#16140f]">Voltar aos medleys</Link>
      </div>
    );
  }

  return (
    <MedleyEditor
      key={medley?.id ?? "new-medley"}
      songs={songLibrary.songs}
      initialMedley={medley}
      canWrite={songLibrary.canWrite && medleyLibrary.canWrite}
      storageError={songLibrary.storageError ?? medleyLibrary.storageError}
      onSave={(input) => medley ? medleyLibrary.updateMedley(medley.id, input) : medleyLibrary.addMedley(input)}
      onDelete={() => Boolean(medley && medleyLibrary.deleteMedley(medley.id))}
    />
  );
}
