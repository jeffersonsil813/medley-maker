import { DashboardIcon } from "./dashboard-icons";

const libraryLines = [20, 35, 25, 44, 31, 52, 29, 42, 22, 38, 50, 27, 42, 32, 20, 45, 29, 38, 24];

export function LibraryAccess() {
  return (
    <section
      id="biblioteca"
      aria-labelledby="library-heading"
      className="relative isolate overflow-hidden rounded-[24px] border border-white/[0.075] bg-[#121613]"
    >
      <div className="absolute -right-20 -top-32 -z-10 size-80 rounded-full bg-[#b79766]/[0.08] blur-[80px]" />
      <div className="grid items-center gap-7 p-5 sm:p-7 md:grid-cols-[1fr_auto] md:gap-10 md:p-9">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a875]/15 bg-[#c9a875]/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#d3b88d]">
            <DashboardIcon name="library" size={13} />
            Seu repertório
          </span>
          <h2
            id="library-heading"
            className="mt-4 text-xl font-semibold tracking-[-0.035em] text-[#edf0eb] sm:text-2xl"
          >
            Biblioteca de músicas
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-6 text-[#899188]">
            Acesse suas canções e encontre as que podem se transformar em um novo medley.
          </p>
          <a
            href="#biblioteca"
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.035] px-3.5 text-xs font-medium text-[#dce1da] transition hover:border-[#c9a875]/25 hover:bg-white/[0.07]"
          >
            Acessar biblioteca
            <DashboardIcon name="arrow-up-right" size={15} />
          </a>
        </div>

        <div aria-hidden="true" className="relative hidden h-[132px] w-[254px] items-center justify-center sm:flex">
          <div className="absolute right-6 top-2 size-[122px] rounded-full border border-white/[0.09] bg-[radial-gradient(circle_at_50%_50%,#282a24_0_8%,#141713_9%_43%,#1f211b_44%_46%,#111410_47%_100%)] shadow-[0_18px_45px_rgba(0,0,0,.25)]">
            <div className="absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d6b98c]/20 bg-[#c9a875]/10" />
            <div className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d6b98c]/60" />
          </div>
          <div className="absolute bottom-4 left-2 flex h-10 items-center gap-[3px] opacity-65">
            {libraryLines.map((height, index) => (
              <span
                key={index}
                className="w-[3px] rounded-full bg-[#c9a875]"
                style={{ height }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
