import { DashboardIcon } from "./dashboard-icons";

export type Medley = {
  id: string;
  title: string;
  songs: string[];
  key: string;
  updatedAt: string;
  artwork: string;
};

const waveformHeights = [12, 20, 29, 17, 35, 24, 42, 27, 15, 31, 45, 20, 34, 14, 26, 38, 19, 31, 12, 24, 40, 18, 29, 14, 34, 21, 42, 16, 27, 12, 32, 19, 39, 24, 14, 30, 44, 18, 27, 13, 35, 21, 31, 16, 40, 24, 12, 28];

export function MedleyCard({ medley }: { medley: Medley }) {
  return (
    <article className="group rounded-[22px] border border-white/[0.075] bg-[#121613] p-3.5 transition duration-300 hover:-translate-y-1 hover:border-[#c9a875]/25 hover:bg-[#151a16] sm:p-4">
      <div
        className={`relative flex h-[128px] overflow-hidden rounded-[16px] ${medley.artwork}`}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(0,0,0,.25),transparent_65%)]" />
        <div className="absolute -right-8 -top-16 size-48 rounded-full border border-white/[0.08]" />
        <div className="absolute -right-1 -top-9 size-36 rounded-full border border-white/[0.09]" />
        <div className="absolute inset-x-4 top-4 flex items-center justify-between">
          <span className="text-[9px] font-semibold uppercase tracking-[0.21em] text-white/70">
            Cifra de medley
          </span>
          <span className="rounded-full border border-white/[0.14] bg-black/15 px-2.5 py-1 text-[10px] font-medium text-white/80 backdrop-blur-sm">
            {medley.songs.length} músicas
          </span>
        </div>
        <div className="absolute inset-x-4 bottom-4 flex h-12 items-center justify-center gap-[3px] opacity-80">
          {waveformHeights.map((height, index) => (
            <span
              key={`${medley.id}-${index}`}
              className="w-[2px] rounded-full bg-white/80 sm:w-[3px]"
              style={{ height }}
            />
          ))}
        </div>
        <div className="absolute bottom-3.5 left-4 flex size-9 items-center justify-center rounded-full border border-white/20 bg-black/15 text-white/90 backdrop-blur-sm">
          <DashboardIcon name="music" size={16} />
        </div>
      </div>

      <div className="px-1 pb-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-semibold tracking-[-0.025em] text-[#edf0eb]">
              {medley.title}
            </h3>
            <p className="mt-1.5 truncate text-xs leading-5 text-[#879087]">
              {medley.songs.join(" · ")}
            </p>
          </div>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#7e887f] transition group-hover:bg-white/[0.06] group-hover:text-[#d6b98c]">
            <DashboardIcon name="chevron-right" size={18} />
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/[0.065] pt-3.5 text-[11px] text-[#778078]">
          <span className="inline-flex items-center gap-1.5">
            <span className="flex size-[19px] items-center justify-center rounded-md bg-[#c9a875]/10 text-[10px] font-semibold text-[#d6b98c]">
              {medley.key}
            </span>
            Tonalidade
          </span>
          <span className="inline-flex items-center gap-1.5">
            <DashboardIcon name="calendar" size={13} />
            {medley.updatedAt}
          </span>
        </div>
      </div>
    </article>
  );
}
