"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DashboardIcon } from "@/components/dashboard/dashboard-icons";
import type { Song, SongSection } from "@/features/library/song-types";
import { createMedleyItem, type Medley, type MedleyTransposition } from "../medley-types";
import { getSuggestedMedleyTitle, reorderMedleyItem, reorderSongGroup } from "../medley-utils";
import { MedleyPreview } from "./medley-preview";
import { MedleySequence } from "./medley-sequence";
import { SongPicker } from "./song-picker";
import { DeleteMedleyDialog } from "./delete-medley-dialog";

type MedleyEditorProps = {
  songs: Song[];
  initialMedley?: Medley;
  canWrite: boolean;
  storageError: string | null;
  onSave: (input: Pick<Medley, "title" | "description" | "items"> & { transposition?: MedleyTransposition }) => Medley | null;
  onDelete: () => boolean;
};

export function MedleyEditor({ songs, initialMedley, canWrite, storageError, onSave, onDelete }: MedleyEditorProps) {
  const router = useRouter();
  const [customTitle, setCustomTitle] = useState(initialMedley?.title ?? "");
  const [hasCustomTitle, setHasCustomTitle] = useState(Boolean(initialMedley));
  const [description, setDescription] = useState(initialMedley?.description ?? "");
  const [items, setItems] = useState(initialMedley?.items ?? []);
  const [transposition, setTransposition] = useState<MedleyTransposition | null>(initialMedley?.transposition ?? null);
  const [isPreview, setIsPreview] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const isEditing = Boolean(initialMedley);
  const title = hasCustomTitle ? customTitle : getSuggestedMedleyTitle(items);

  function addSection(song: Song, section: SongSection) {
    setItems((current) => [...current, createMedleyItem(song, section, current.length)]);
    setFeedback(null);
  }

  function save(nextTransposition = transposition) {
    if (!title.trim()) {
      setFeedback("Informe um nome para o medley.");
      setIsPreview(false);
      return false;
    }
    if (items.length === 0) {
      setFeedback("Adicione pelo menos um trecho antes de salvar.");
      setIsPreview(false);
      return false;
    }
    setIsSaving(true);
    const saved = onSave({ title: title.trim(), description: description.trim(), items: items.map((item, position) => ({ ...item, position })), ...(nextTransposition ? { transposition: nextTransposition } : {}) });
    setIsSaving(false);
    if (!saved) {
      setFeedback("Não foi possível salvar. Verifique o armazenamento do navegador e tente novamente.");
      return false;
    }
    const status = isEditing ? "updated" : "created";
    router.replace(`/medleys?saved=${status}&title=${encodeURIComponent(saved.title)}`);
    return true;
  }

  function applyTransposition(next: MedleyTransposition) {
    if (initialMedley) return save(next);
    setTransposition(next);
    return true;
  }

  function confirmDelete() {
    if (onDelete()) {
      router.replace("/medleys");
      return;
    }

    setIsDeleteDialogOpen(false);
    setFeedback("Não foi possível excluir o medley. Verifique o armazenamento do navegador e tente novamente.");
  }

  if (isPreview) {
    return <MedleyPreview title={title} description={description} items={items} onBack={() => setIsPreview(false)} appliedTransposition={transposition} isSaved={Boolean(initialMedley)} canApplyTransposition={canWrite} onApplyTransposition={applyTransposition} />;
  }

  return (
    <div>
      <header className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <Link href="/medleys" className="mb-4 inline-flex items-center gap-1.5 text-[11px] text-[#858f85] transition hover:text-[#d6b98c]"><DashboardIcon name="chevron-right" size={13} className="rotate-180" /> Meus medleys</Link>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#9a896b]">{isEditing ? "Editar medley" : "Novo arranjo"}</p>
          <h1 className="text-3xl font-semibold tracking-[-0.045em] text-[#edf0eb] sm:text-[38px]">{isEditing ? "Ajuste sua sequência" : "Monte seu medley"}</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#879188]">Escolha as seções da biblioteca e organize cada trecho na ordem desejada.</p>
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          {initialMedley && (
            <button type="button" onClick={() => setIsDeleteDialogOpen(true)} disabled={!canWrite} className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-red-300/15 bg-red-400/[0.06] px-4 text-xs font-medium text-red-200 transition hover:bg-red-400/[0.12] disabled:cursor-not-allowed disabled:opacity-50">
              <DashboardIcon name="trash" size={15} /> Excluir medley
            </button>
          )}
          <button type="button" onClick={() => setIsPreview(true)} className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.025] px-4 text-xs font-medium text-[#d0d7cf] transition hover:border-[#c9a875]/25 hover:bg-[#c9a875]/[0.05]"><DashboardIcon name="eye" size={16} /> Pré-visualizar</button>
        </div>
      </header>

      {storageError && <p role="alert" className="mb-4 rounded-xl border border-amber-300/15 bg-amber-300/[0.05] px-4 py-3 text-xs leading-5 text-amber-100">{storageError}</p>}
      {feedback && <p role="status" className="mb-4 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-xs text-[#c8d0c7]">{feedback}</p>}

      <section className="mb-5 rounded-[22px] border border-white/[0.075] bg-[#111512] p-4 sm:p-5">
        <div className="mb-4"><p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7c867d]">Detalhes</p><h2 className="text-base font-semibold text-[#edf0eb]">Identifique seu medley</h2></div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-xs font-medium text-[#aeb6ad]">
            Nome <span className="text-[#d6b98c]">*</span>
            <input
              value={title}
              onChange={(event) => {
                setCustomTitle(event.target.value);
                setHasCustomTitle(true);
              }}
              maxLength={100}
              placeholder="Ex.: Celebração e esperança"
              className="mt-2 h-11 w-full rounded-xl border border-white/[0.08] bg-[#0b0e0c] px-3.5 text-sm text-[#e5e9e3] outline-none placeholder:text-[#687168] focus:border-[#c9a875]/45"
            />
            {!isEditing && (
              <span className="mt-2 block text-[10px] font-normal leading-5 text-[#788278]">
                Sugerido pelas músicas escolhidas; você pode editar quando quiser.
              </span>
            )}
          </label>
          <label className="block text-xs font-medium text-[#aeb6ad]">Descrição <span className="text-[#707a71]">(opcional)</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={500} rows={2} placeholder="Uma observação sobre este arranjo" className="mt-2 w-full resize-y rounded-xl border border-white/[0.08] bg-[#0b0e0c] px-3.5 py-3 text-sm text-[#e5e9e3] outline-none placeholder:text-[#687168] focus:border-[#c9a875]/45" /></label>
        </div>
      </section>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <SongPicker songs={songs} items={items} canSelect={canWrite} onAdd={addSection} />
        <MedleySequence
          items={items}
          onMoveItem={(itemId, direction) => setItems((current) => reorderMedleyItem(current, itemId, direction))}
          onRemoveItem={(itemId) => setItems((current) => current.filter((item) => item.id !== itemId).map((item, position) => ({ ...item, position })))}
          onMoveSong={(songId, direction) => setItems((current) => reorderSongGroup(current, songId, direction))}
          onRemoveSong={(songId) => setItems((current) => current.filter((item) => item.sourceSongId !== songId).map((item, position) => ({ ...item, position })))}
        />
      </div>

      <div className="mt-5 flex flex-col-reverse justify-end gap-2 sm:flex-row">
        <Link href="/medleys" className="inline-flex h-11 items-center justify-center rounded-xl border border-white/[0.08] px-5 text-xs font-medium text-[#a3aca3] transition hover:bg-white/[0.04]">Cancelar</Link>
        <button type="button" onClick={() => save()} disabled={!canWrite || isSaving} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#d3b486] px-5 text-xs font-semibold text-[#16140f] transition hover:bg-[#e2c69b] disabled:cursor-not-allowed disabled:opacity-50"><DashboardIcon name="check" size={15} />{isSaving ? "Salvando…" : "Salvar medley"}</button>
      </div>
      {isDeleteDialogOpen && initialMedley && (
        <DeleteMedleyDialog
          medley={initialMedley}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
