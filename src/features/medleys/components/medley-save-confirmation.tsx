"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DashboardIcon } from "@/components/dashboard/dashboard-icons";

export function MedleySaveConfirmation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("saved");
  const title = searchParams.get("title");

  if (status !== "created" && status !== "updated") return null;

  const confirmation = status === "created"
    ? `Medley “${title || "sem título"}” criado com sucesso.`
    : `Alterações em “${title || "medley"}” salvas com sucesso.`;

  return (
    <div
      role="status"
      aria-live="polite"
      className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-emerald-300/15 bg-emerald-300/[0.06] px-4 py-3 text-sm text-emerald-100"
    >
      <span className="flex items-center gap-2">
        <DashboardIcon name="check" size={16} />
        {confirmation}
      </span>
      <button
        type="button"
        onClick={() => router.replace("/medleys", { scroll: false })}
        aria-label="Fechar confirmação"
        className="flex size-7 shrink-0 items-center justify-center rounded-lg text-emerald-100/70 transition hover:bg-emerald-100/10 hover:text-emerald-50"
      >
        <DashboardIcon name="x" size={14} />
      </button>
    </div>
  );
}
