import Link from "next/link";
import { DashboardIcon } from "./dashboard-icons";

export function EmptyMedleys() {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-dashed border-white/[0.12] bg-[#111512] px-5 py-12 text-center sm:px-10 sm:py-16">
      <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-72 -translate-x-1/2 rounded-full bg-[#c9a875]/[0.055] blur-3xl" />
      <div className="relative mx-auto flex size-[68px] items-center justify-center rounded-[22px] border border-[#c9a875]/15 bg-[#c9a875]/[0.08] text-[#d6b98c]">
        <DashboardIcon name="music" size={27} />
        <span className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full border-[3px] border-[#111512] bg-[#c9a875] text-[#151713]">
          <DashboardIcon name="plus" size={12} />
        </span>
      </div>
      <h3 className="relative mt-5 text-lg font-semibold tracking-[-0.025em] text-[#edf0eb]">
        Seu próximo medley começa aqui
      </h3>
      <p className="relative mx-auto mt-2 max-w-md text-sm leading-6 text-[#899188]">
        Reúna canções que combinam com o momento e organize tudo em uma cifra feita para você.
      </p>
      <Link
        href="/medleys/novo"
        className="relative mt-6 inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 text-sm font-medium text-[#e8ebe6] transition hover:border-[#c9a875]/30 hover:bg-white/[0.07]"
      >
        <DashboardIcon name="plus" size={17} />
        Criar meu primeiro medley
      </Link>
    </div>
  );
}
