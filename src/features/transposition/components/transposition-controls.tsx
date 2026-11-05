"use client";

import { DashboardIcon } from "@/components/dashboard/dashboard-icons";
import type { AccidentalPreference } from "../transposition-engine";
import type { MusicalKey } from "@/features/library/song-types";

export type TranspositionKeyOption = {
  value: MusicalKey;
  label: string;
};

type TranspositionControlsProps = {
  sourceKey: MusicalKey;
  targetKey: MusicalKey | "";
  notation: AccidentalPreference;
  keyOptions: TranspositionKeyOption[];
  onTargetKeyChange: (key: MusicalKey | "") => void;
  onNotationChange: (notation: AccidentalPreference) => void;
};

const selectClassName = "mt-2 h-10 w-full rounded-xl border border-white/[0.09] bg-[#0b0e0c] px-3 text-xs text-[#e5e9e3] outline-none focus:border-[#c9a875]/45";

export function TranspositionControls({
  sourceKey,
  targetKey,
  notation,
  keyOptions,
  onTargetKeyChange,
  onNotationChange,
}: TranspositionControlsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="flex items-end">
        <span className="inline-flex h-10 w-full items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 text-xs text-[#a7b0a7]">
          <DashboardIcon name="music" size={14} className="text-[#c9a875]" />
          Tom de origem <strong className="ml-auto font-semibold text-[#e0c99f]">{sourceKey}</strong>
        </span>
      </div>
      <label className="block text-[10px] font-medium uppercase tracking-[0.11em] text-[#899188]">
        Tom de destino
        <select
          value={targetKey}
          onChange={(event) => onTargetKeyChange(event.target.value as MusicalKey | "")}
          className={selectClassName}
        >
          <option value="">Selecione um tom</option>
          {keyOptions.map((key) => (
            <option key={key.value} value={key.value}>{key.label}</option>
          ))}
        </select>
      </label>
      <label className="block text-[10px] font-medium uppercase tracking-[0.11em] text-[#899188]">
        Notação dos acidentes
        <select
          value={notation}
          onChange={(event) => onNotationChange(event.target.value as AccidentalPreference)}
          className={selectClassName}
        >
          <option value="auto">Automática</option>
          <option value="sharp">Sustenidos (#)</option>
          <option value="flat">Bemóis (b)</option>
        </select>
      </label>
    </div>
  );
}
