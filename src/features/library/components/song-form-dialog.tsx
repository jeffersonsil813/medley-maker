"use client";

import { useState, type FormEvent } from "react";
import { DashboardIcon } from "@/components/dashboard/dashboard-icons";
import {
  MAJOR_KEYS,
  MINOR_KEYS,
  SONG_SECTION_LABELS,
  SONG_SECTION_TYPES,
  createLocalId,
  isMusicalKey,
  type Song,
  type SongInput,
  type MusicalKey,
  type SongSection,
  type SongSectionType,
} from "../song-types";
import { DialogShell } from "./dialog-shell";

type SongFormDialogProps = {
  song?: Song;
  onClose: () => void;
  onSubmit: (input: SongInput) => boolean;
};

const fieldClassName =
  "mt-2 h-11 w-full rounded-xl border border-white/[0.1] bg-[#0b0e0c] px-3.5 text-sm text-[#e9ede7] outline-none transition placeholder:text-[#626b63] focus:border-[#c9a875]/55 focus:ring-2 focus:ring-[#c9a875]/10";

function createBlankSection(position: number): SongSection {
  return {
    id: createLocalId("section"),
    type: "verse",
    content: "",
    position,
  };
}

export function SongFormDialog({ song, onClose, onSubmit }: SongFormDialogProps) {
  const [title, setTitle] = useState(song?.title ?? "");
  const [artist, setArtist] = useState(song?.artist ?? "");
  const [originalKey, setOriginalKey] = useState<MusicalKey | "">(song?.originalKey ?? "");
  const [sections, setSections] = useState<SongSection[]>(() =>
    song?.sections.length
      ? [...song.sections].sort((a, b) => a.position - b.position)
      : [createBlankSection(0)],
  );
  const [saveError, setSaveError] = useState<string | null>(null);

  function updateSection(id: string, update: Partial<SongSection>) {
    setSections((current) =>
      current.map((section) => (section.id === id ? { ...section, ...update } : section)),
    );
  }

  function addSection() {
    setSections((current) => [...current, createBlankSection(current.length)]);
  }

  function removeSection(id: string) {
    setSections((current) =>
      current
        .filter((section) => section.id !== id)
        .map((section, position) => ({ ...section, position })),
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveError(null);

    if (!isMusicalKey(originalKey)) {
      setSaveError("Selecione um tom original válido.");
      return;
    }

    const saved = onSubmit({
      title: title.trim(),
      artist: artist.trim(),
      originalKey,
      sections: sections.map((section, position) => ({
        ...section,
        content: section.content.trim(),
        position,
      })),
    });

    if (saved) onClose();
    else setSaveError("Não foi possível salvar. Verifique o armazenamento do navegador e tente novamente.");
  }

  return (
    <DialogShell
      title={song ? "Editar música" : "Adicionar música"}
      description={
        song
          ? "Atualize as informações e as seções desta música."
          : "Cadastre os dados da música e organize a letra em seções."
      }
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-5 py-5 sm:px-7 sm:py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-medium text-[#c5ccc4]">
              Título <span className="text-[#d6b98c]">*</span>
              <input
                autoFocus
                required
                maxLength={120}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ex.: A Casa É Sua"
                className={fieldClassName}
              />
            </label>
            <label className="block text-xs font-medium text-[#c5ccc4]">
              Artista ou intérprete <span className="text-[#d6b98c]">*</span>
              <input
                required
                maxLength={120}
                value={artist}
                onChange={(event) => setArtist(event.target.value)}
                placeholder="Ex.: Casa Worship"
                className={fieldClassName}
              />
            </label>
          </div>

          <label className="block max-w-sm text-xs font-medium text-[#c5ccc4]">
            Tom original <span className="text-[#d6b98c]">*</span>
            <select
              required
              value={originalKey}
              onChange={(event) => setOriginalKey(event.target.value as MusicalKey | "")}
              className={fieldClassName}
            >
              <option value="" disabled>
                Selecione o tom
              </option>
              <optgroup label="Tons maiores">
                {MAJOR_KEYS.map((key) => (
                  <option key={key.value} value={key.value}>
                    {key.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Tons menores">
                {MINOR_KEYS.map((key) => (
                  <option key={key.value} value={key.value}>
                    {key.label}
                  </option>
                ))}
              </optgroup>
            </select>
          </label>

          <div className="border-t border-white/[0.07] pt-5">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-[#e8ece6]">Seções musicais</h3>
                <p className="mt-1 text-xs leading-5 text-[#818a82]">
                  Escreva os acordes entre colchetes, junto à letra.
                </p>
              </div>
              <button
                type="button"
                onClick={addSection}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-white/[0.1] px-2.5 text-xs font-medium text-[#cdd3cc] transition hover:border-[#c9a875]/30 hover:bg-white/[0.04]"
              >
                <DashboardIcon name="plus" size={14} />
                <span className="hidden sm:inline">Adicionar seção</span>
                <span className="sm:hidden">Seção</span>
              </button>
            </div>

            <div className="space-y-3.5">
              {sections.map((section, index) => (
                <section
                  key={section.id}
                  aria-label={`Seção ${index + 1}`}
                  className="rounded-2xl border border-white/[0.075] bg-white/[0.02] p-3.5 sm:p-4"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <label className="min-w-0 flex-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#7f8980]">
                      Seção {index + 1}
                      <select
                        aria-label={`Tipo da seção ${index + 1}`}
                        value={section.type}
                        onChange={(event) =>
                          updateSection(section.id, {
                            type: event.target.value as SongSectionType,
                          })
                        }
                        className="mt-1.5 h-10 w-full rounded-lg border border-white/[0.09] bg-[#0b0e0c] px-3 text-sm font-medium normal-case tracking-normal text-[#e2e7e0] outline-none focus:border-[#c9a875]/55"
                      >
                        {SONG_SECTION_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {SONG_SECTION_LABELS[type]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      type="button"
                      onClick={() => removeSection(section.id)}
                      disabled={sections.length <= 1}
                      aria-label={`Remover seção ${index + 1}`}
                      className="mt-5 flex size-9 shrink-0 items-center justify-center rounded-lg text-[#788178] transition hover:bg-red-400/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <DashboardIcon name="trash" size={16} />
                    </button>
                  </div>
                  <textarea
                    aria-label={`Letra e acordes da seção ${index + 1}`}
                    value={section.content}
                    onChange={(event) => updateSection(section.id, { content: event.target.value })}
                    placeholder={'[G]Quando estou em tua presença\n[D]Encontro a minha paz'}
                    rows={4}
                    className="w-full resize-y rounded-xl border border-white/[0.08] bg-[#0b0e0c] px-3.5 py-3 font-mono text-[13px] leading-6 text-[#e3e7e1] outline-none transition placeholder:text-[#5f685f] focus:border-[#c9a875]/45 focus:ring-2 focus:ring-[#c9a875]/[0.08]"
                  />
                  <p className="mt-2 text-[10px] text-[#687168]">
                    Exemplo: <span className="font-mono text-[#c3a77a]">[G] letra da música</span>
                  </p>
                </section>
              ))}
            </div>
          </div>

          {saveError && (
            <p role="alert" className="rounded-xl border border-red-300/15 bg-red-300/[0.06] px-3.5 py-3 text-xs leading-5 text-red-200">
              {saveError}
            </p>
          )}
        </div>

        <footer className="flex flex-col-reverse gap-2 border-t border-white/[0.07] px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl px-4 text-sm font-medium text-[#a4ada4] transition hover:bg-white/[0.05] hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#d4b582] px-4 text-sm font-semibold text-[#242016] transition hover:bg-[#e0c596]"
          >
            <DashboardIcon name="check" size={16} />
            {song ? "Salvar alterações" : "Salvar música"}
          </button>
        </footer>
      </form>
    </DialogShell>
  );
}
