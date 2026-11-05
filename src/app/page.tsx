import Link from "next/link";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { LibraryAccess } from "@/components/dashboard/library-access";
import { DashboardIcon } from "@/components/dashboard/dashboard-icons";
import { RecentMedleys } from "@/features/medleys/components/recent-medleys";

export default function Home() {
  return (
    <div id="inicio" className="min-h-dvh bg-[#0b0e0c]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-40 -top-56 size-[560px] rounded-full bg-[#8d7650]/[0.055] blur-[110px]" />
        <div className="absolute -right-52 top-[30%] size-[500px] rounded-full bg-[#486454]/[0.045] blur-[120px]" />
      </div>

      <div className="relative mx-auto flex min-h-dvh max-w-[1680px] flex-col lg:flex-row">
        <DashboardSidebar />

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1320px] px-4 pb-12 pt-5 sm:px-7 sm:pb-16 sm:pt-8 lg:px-10 lg:pt-10 xl:px-14">
            <header className="flex flex-col gap-6 border-b border-white/[0.065] pb-7 sm:flex-row sm:items-end sm:justify-between sm:gap-8 sm:pb-9">
              <div>
                <p className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.23em] text-[#a78e68] sm:text-[11px]">
                  <span className="size-1.5 rounded-full bg-[#c9a875] shadow-[0_0_12px_#c9a875]" />
                  Seu espaço musical
                </p>
                <h1 className="text-[clamp(1.8rem,4vw,2.7rem)] font-semibold leading-[1.1] tracking-[-0.055em] text-[#f0f2ee]">
                  Bem-vindo ao seu <span className="text-[#d6b98c]">Medley Maker</span>
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#899188] sm:text-[15px]">
                  Um lugar tranquilo para reunir canções e preparar a próxima ministração.
                </p>
              </div>

              <Link
                href="/medleys/novo"
                className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2.5 rounded-xl bg-[#d4b582] px-5 text-sm font-semibold text-[#242016] shadow-[0_8px_28px_rgba(195,160,106,.12)] transition hover:-translate-y-0.5 hover:bg-[#e0c596] sm:w-auto"
              >
                <DashboardIcon name="plus" size={18} />
                Criar novo medley
              </Link>
            </header>

            <RecentMedleys />

            <div className="mt-8 sm:mt-10">
              <LibraryAccess />
            </div>

            <footer className="mt-8 flex items-center justify-center gap-2 border-t border-white/[0.055] pt-5 text-[10px] text-[#596259] sm:mt-10">
              <DashboardIcon name="wave" size={14} />
              <span>Canções que se encontram, em uma só cifra.</span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
