"use client";

import { DashboardIcon } from "@/components/dashboard/dashboard-icons";
import { ChordProView } from "@/features/library/components/chordpro-view";
import type { Medley } from "../medley-types";

type MedleyPreviewProps = {
  title: string;
  description: string;
  items: Medley["items"];
  onBack: () => void;
  onSave: () => void;
  canSave: boolean;
  isSaving: boolean;
};

export function MedleyPreview({ title, description, items, onBack, onSave, canSave, isSaving }: MedleyPreviewProps) {
  const orderedItems = [...items].sort((first, second) => first.position - second.position);

  return (
    <section className="mx-auto max-w-3xl rounded-[24px] border border-white/[0.08] bg-[#111512] p-5 sm:p-8">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-xs text-[#a2aba2] hover:text-white">
          <DashboardIcon name="chevron-right" size={15} className="rotate-180" /> Voltar ao editor
        </button>
        <button type="button" onClick={onSave} disabled={!canSave || isSaving} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#d3b486] px-4 text-xs font-semibold text-[#16140f] transition hover:bg-[#e2c69b] disabled:cursor-not-allowed disabled:opacity-50">
          <DashboardIcon name="check" size={15} /> {isSaving ? "Salvando…" : "Salvar medley"}
        </button>
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#9a896b]">Pré-visualização</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#edf0eb]">{title || "Medley sem título"}</h1>
      {description && <p className="mt-2 text-sm leading-6 text-[#929b92]">{description}</p>}
      <div className="my-7 h-px bg-white/[0.08]" />
      {orderedItems.length === 0 ? (
        <p className="py-10 text-center text-sm text-[#899188]">Adicione trechos para visualizar seu medley.</p>
      ) : (
        <ol className="space-y-7">
          {orderedItems.map((item, index) => (
            <li key={item.id} className="border-b border-white/[0.06] pb-6 last:border-0">
              <div className="mb-3 flex items-baseline gap-2">
                <span className="font-mono text-[10px] text-[#9a896b]">{String(index + 1).padStart(2, "0")}</span>
                <h2 className="text-sm font-semibold text-[#e5e9e3]">{item.songTitleSnapshot}</h2>
                <span className="text-xs text-[#838d83]">· {item.sectionNameSnapshot}</span>
              </div>
              <p className="mb-3 pl-7 text-[10px] text-[#6f796f]">{item.songArtistSnapshot} · Tom original {item.originalKeySnapshot}</p>
              <div className="pl-7"><ChordProView content={item.contentSnapshot} /></div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
