import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { EmptyMedleys } from "@/components/dashboard/empty-medleys";
import { LibraryAccess } from "@/components/dashboard/library-access";
import { DashboardIcon } from "@/components/dashboard/dashboard-icons";
import { MedleyCard, type Medley } from "@/components/dashboard/medley-card";

const recentMedleys: Medley[] = [
  {
    id: "casa-adoracao",
    title: "Casa de adoração",
    songs: ["A Casa É Sua", "Lugar Secreto", "Santo Espírito"],
    key: "G",
    updatedAt: "há 2 horas",
    artwork: "bg-[linear-gradient(125deg,#4b5945_0%,#26382e_48%,#18241f_100%)]",
  },
  {
    id: "graca-sobre-graca",
    title: "Graça sobre graça",
    songs: ["Bondade de Deus", "Me Atraiu", "Eu Navegarei"],
    key: "D",
    updatedAt: "ontem",
    artwork: "bg-[linear-gradient(125deg,#6a5144_0%,#493b35_48%,#282522_100%)]",
  },
  {
    id: "tua-presenca",
    title: "Tua presença",
    songs: ["Yeshua", "Pra Sempre", "Que Se Abram os Céus"],
    key: "A",
    updatedAt: "28 out, 2026",
    artwork: "bg-[linear-gradient(125deg,#4b4c69_0%,#323345_48%,#202128_100%)]",
  },
];

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

              <button
                type="button"
                className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2.5 rounded-xl bg-[#d4b582] px-5 text-sm font-semibold text-[#242016] shadow-[0_8px_28px_rgba(195,160,106,.12)] transition hover:-translate-y-0.5 hover:bg-[#e0c596] sm:w-auto"
              >
                <DashboardIcon name="plus" size={18} />
                Criar novo medley
              </button>
            </header>

            <section id="recentes" aria-labelledby="recent-medleys-heading" className="pt-8 sm:pt-10">
              <div className="mb-5 flex items-end justify-between gap-4 sm:mb-6">
                <div>
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.19em] text-[#737d74]">
                    Seu repertório em construção
                  </p>
                  <h2
                    id="recent-medleys-heading"
                    className="text-xl font-semibold tracking-[-0.04em] text-[#edf0eb] sm:text-[22px]"
                  >
                    Medleys recentes
                  </h2>
                </div>
                {recentMedleys.length > 0 && (
                  <span className="mb-0.5 inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5 text-[10px] font-medium text-[#929a92] sm:text-xs">
                    {recentMedleys.length} medleys
                  </span>
                )}
              </div>

              {recentMedleys.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
                  {recentMedleys.map((medley) => (
                    <MedleyCard key={medley.id} medley={medley} />
                  ))}
                </div>
              ) : (
                <EmptyMedleys />
              )}
            </section>

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
