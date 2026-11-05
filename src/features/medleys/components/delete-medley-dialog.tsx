"use client";

import { DashboardIcon } from "@/components/dashboard/dashboard-icons";
import { DialogShell } from "@/features/library/components/dialog-shell";
import type { Medley } from "../medley-types";

type DeleteMedleyDialogProps = {
  medley: Medley;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteMedleyDialog({ medley, onClose, onConfirm }: DeleteMedleyDialogProps) {
  return (
    <DialogShell
      title="Excluir medley?"
      description="Esta ação remove o medley salvo neste navegador."
      onClose={onClose}
    >
      <div className="px-5 py-5 sm:px-7">
        <p className="text-sm leading-6 text-[#c0c8bf]">
          <span className="font-semibold text-[#eef1ec]">{medley.title}</span>
        </p>
        <p className="mt-2 text-xs leading-5 text-[#818a82]">
          As músicas originais da biblioteca não serão afetadas.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl px-4 text-sm font-medium text-[#a4ada4] transition hover:bg-white/[0.05] hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-300/15 bg-red-400/[0.11] px-4 text-sm font-semibold text-red-200 transition hover:bg-red-400/[0.18]"
          >
            <DashboardIcon name="trash" size={15} />
            Excluir medley
          </button>
        </div>
      </div>
    </DialogShell>
  );
}
