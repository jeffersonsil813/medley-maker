"use client";

import { DashboardIcon } from "@/components/dashboard/dashboard-icons";

export function LibraryEmptyState({
  onAdd,
  disabled = false,
}: {
  onAdd: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-dashed border-white/[0.12] bg-[#111512] px-5 py-12 text-center sm:px-10 sm:py-16">
      <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-72 -translate-x-1/2 rounded-full bg-[#c9a875]/[0.055] blur-3xl" />
      <div className="relative mx-auto flex size-[68px] items-center justify-center rounded-[22px] border border-[#c9a875]/15 bg-[#c9a875]/[0.08] text-[#d6b98c]">
        <DashboardIcon name="library" size={27} />
        <span className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full border-[3px] border-[#111512] bg-[#c9a875] text-[#151713]">
          <DashboardIcon name="plus" size={12} />
        </span>
      </div>
      <h2 className="relative mt-5 text-lg font-semibold tracking-[-0.025em] text-[#edf0eb]">
        Sua biblioteca começa com uma canção
      </h2>
      <p className="relative mx-auto mt-2 max-w-md text-sm leading-6 text-[#899188]">
        Cadastre músicas com seus acordes e organize cada uma em seções para encontrar tudo com facilidade.
      </p>
      <button
        type="button"
        onClick={onAdd}
        disabled={disabled}
        className="relative mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#d4b582] px-4 text-sm font-semibold text-[#242016] transition hover:bg-[#e0c596] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <DashboardIcon name="plus" size={17} />
        Cadastrar primeira música
      </button>
    </div>
  );
}
