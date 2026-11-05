"use client";

import { DashboardIcon } from "@/components/dashboard/dashboard-icons";
import { ChordProView } from "@/features/library/components/chordpro-view";
import type { MusicalKey } from "@/features/library/song-types";
import { TranspositionControls } from "@/features/transposition/components/transposition-controls";
import { getTranspositionKeyOptions } from "@/features/transposition/transposition-options";
import { previewMedleyTransposition, type AccidentalPreference } from "@/features/transposition/transposition-engine";
import { useState } from "react";
import type { Medley, MedleyTransposition } from "../medley-types";

type MedleyPreviewProps = {
  title: string;
  description: string;
  items: Medley["items"];
  onBack: () => void;
  appliedTransposition: MedleyTransposition | null;
  isSaved: boolean;
  canApplyTransposition: boolean;
  onApplyTransposition: (transposition: MedleyTransposition) => boolean;
};

export function MedleyPreview({
  title,
  description,
  items,
  onBack,
  appliedTransposition,
  isSaved,
  canApplyTransposition,
  onApplyTransposition,
}: MedleyPreviewProps) {
  const referenceKey = appliedTransposition?.referenceKey ?? [...items]
    .sort((first, second) => first.position - second.position)[0]?.originalKeySnapshot ?? null;
  const currentTargetKey = appliedTransposition?.targetKey ?? referenceKey;
  const currentNotation = appliedTransposition?.notation ?? "auto";
  const [targetKey, setTargetKey] = useState<MusicalKey | "">(currentTargetKey ?? "");
  const [notation, setNotation] = useState<AccidentalPreference>(currentNotation);
  const [feedback, setFeedback] = useState<string | null>(null);
  const orderedItems = [...items].sort((first, second) => first.position - second.position);
  const transposedPreview = targetKey && referenceKey
    ? previewMedleyTransposition(items, targetKey, notation, referenceKey)
    : null;

  function applyTransposition() {
    if (!referenceKey || !targetKey) return;

    const applied = onApplyTransposition({ referenceKey, targetKey, notation });
    setFeedback(
      applied
        ? isSaved
          ? `Transposição aplicada e salva em ${targetKey}.`
          : `Prévia em ${targetKey} aplicada ao rascunho. Volte ao editor para salvar o medley.`
        : "Não foi possível aplicar a transposição. Verifique o armazenamento local e tente novamente.",
    );
  }

  function cancelPendingTransposition() {
    setTargetKey(currentTargetKey ?? "");
    setNotation(currentNotation);
    setFeedback("Alteração pendente descartada.");
  }

  return (
    <section className="mx-auto max-w-3xl rounded-[24px] border border-white/[0.08] bg-[#111512] p-5 sm:p-8">
      <div className="mb-7 flex flex-wrap items-center gap-3">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-xs text-[#a2aba2] hover:text-white">
          <DashboardIcon name="chevron-right" size={15} className="rotate-180" /> Voltar ao editor
        </button>
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#9a896b]">Pré-visualização</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#edf0eb]">{title || "Medley sem título"}</h1>
      {description && <p className="mt-2 text-sm leading-6 text-[#929b92]">{description}</p>}
      <div className="my-7 h-px bg-white/[0.08]" />
      <section className="mb-7 rounded-2xl border border-white/[0.075] bg-[#0c100d] p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-[#e1e6df]">Transpor o medley</h2>
            <p className="mt-1 text-[11px] leading-5 text-[#7d877e]">
              Tom atual: <strong className="font-semibold text-[#dec79e]">{currentTargetKey ?? "—"}</strong>
              {appliedTransposition && <span> · transposição aplicada</span>}
            </p>
          </div>
        </div>
        {referenceKey ? (
          <>
            <TranspositionControls
              sourceKey={referenceKey}
              targetKey={targetKey}
              notation={notation}
              keyOptions={getTranspositionKeyOptions(referenceKey, false)}
              onTargetKeyChange={(key) => { setTargetKey(key); setFeedback(null); }}
              onNotationChange={(nextNotation) => { setNotation(nextNotation); setFeedback(null); }}
            />
            <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={cancelPendingTransposition} className="inline-flex h-9 items-center justify-center rounded-lg border border-white/[0.08] px-3 text-[11px] font-medium text-[#a3aca3] transition hover:bg-white/[0.04]">
                Cancelar alteração
              </button>
              <button type="button" onClick={applyTransposition} disabled={!canApplyTransposition || !targetKey} className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#d3b486] px-3.5 text-[11px] font-semibold text-[#16140f] transition hover:bg-[#e2c69b] disabled:cursor-not-allowed disabled:opacity-45">
                <DashboardIcon name="check" size={14} /> {isSaved ? "Aplicar ao medley" : "Aplicar no rascunho"}
              </button>
            </div>
          </>
        ) : (
          <p className="rounded-xl border border-dashed border-white/[0.08] px-4 py-5 text-center text-xs text-[#798279]">Adicione um trecho para definir o tom de referência do medley.</p>
        )}
        {feedback && <p role="status" className="mt-3 text-[11px] leading-5 text-[#b7c0b6]">{feedback}</p>}
        <p className="mt-3 text-[10px] leading-5 text-[#737d74]">Os snapshots originais são preservados; cada prévia é calculada a partir deles.</p>
      </section>
      {orderedItems.length === 0 ? (
        <p className="py-10 text-center text-sm text-[#899188]">Adicione trechos para visualizar seu medley.</p>
      ) : (
        <ol className="space-y-7">
          {orderedItems.map((item, index) => {
            const transposedItem = transposedPreview?.items.find((entry) => entry.source.id === item.id);
            return (
            <li key={item.id} className="border-b border-white/[0.06] pb-6 last:border-0">
              <div className="mb-3 flex items-baseline gap-2">
                <span className="font-mono text-[10px] text-[#9a896b]">{String(index + 1).padStart(2, "0")}</span>
                <h2 className="text-sm font-semibold text-[#e5e9e3]">{item.songTitleSnapshot}</h2>
                <span className="text-xs text-[#838d83]">· {item.sectionNameSnapshot}</span>
              </div>
              <p className="mb-3 pl-7 text-[10px] text-[#6f796f]">{item.songArtistSnapshot} · Tom {transposedItem?.transposedKey ?? item.originalKeySnapshot}</p>
              <div className="pl-7"><ChordProView content={transposedItem?.content ?? item.contentSnapshot} /></div>
            </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
