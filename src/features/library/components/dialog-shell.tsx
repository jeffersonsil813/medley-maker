"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { DashboardIcon } from "@/components/dashboard/dashboard-icons";

type DialogShellProps = {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
};

export function DialogShell({ title, description, onClose, children }: DialogShellProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;

    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      aria-modal="true"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl border-0 bg-transparent p-0 text-inherit backdrop:bg-black/75 backdrop:backdrop-blur-sm"
    >
      <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-[22px] border border-white/[0.1] bg-[#111512] shadow-[0_30px_100px_rgba(0,0,0,.55)]">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-5 border-b border-white/[0.07] bg-[#111512]/95 px-5 py-5 backdrop-blur sm:px-7">
          <div>
            <h2 id={titleId} className="text-lg font-semibold tracking-[-0.025em] text-[#eef1ec]">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="mt-1.5 text-sm leading-5 text-[#899188]">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] text-[#899188] transition hover:bg-white/[0.06] hover:text-white"
          >
            <DashboardIcon name="x" size={17} />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
