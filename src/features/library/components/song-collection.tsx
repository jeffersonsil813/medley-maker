import { DashboardIcon } from "@/components/dashboard/dashboard-icons";
import { formatUpdatedAt } from "../library-utils";
import type { Song } from "../song-types";

type SongCollectionProps = {
  songs: Song[];
  onView: (song: Song) => void;
  onEdit: (song: Song) => void;
  onDelete: (song: Song) => void;
};

function pluralizeSectionCount(count: number) {
  return `${count} ${count === 1 ? "seção" : "seções"}`;
}

export function SongCollection({ songs, onView, onEdit, onDelete }: SongCollectionProps) {
  return (
    <div className="space-y-3" aria-label="Músicas cadastradas">
      {songs.map((song) => (
        <article
          key={song.id}
          className="group rounded-2xl border border-white/[0.075] bg-[#121613] p-4 transition hover:border-white/[0.12] hover:bg-[#151a16] sm:p-5"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => onView(song)}
              className="flex min-w-0 flex-1 items-center gap-3.5 text-left"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-[15px] border border-[#c9a875]/15 bg-[#c9a875]/[0.07] text-[#d6b98c] transition group-hover:bg-[#c9a875]/[0.12]">
                <DashboardIcon name="music" size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-semibold tracking-[-0.02em] text-[#edf0eb]">
                  {song.title}
                </span>
                <span className="mt-1 block truncate text-xs text-[#899188]">{song.artist}</span>
              </span>
              <span className="hidden text-[#687168] transition group-hover:translate-x-0.5 group-hover:text-[#d6b98c] sm:block">
                <DashboardIcon name="chevron-right" size={17} />
              </span>
            </button>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pl-[58px] text-[11px] text-[#899188] sm:pl-0">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#c9a875]/12 bg-[#c9a875]/[0.055] px-2 py-1.5 font-medium text-[#d6b98c]">
                <DashboardIcon name="music" size={12} />
                {song.originalKey}
              </span>
              <span>{pluralizeSectionCount(song.sections.length)}</span>
              <span className="inline-flex items-center gap-1.5">
                <DashboardIcon name="calendar" size={13} />
                {formatUpdatedAt(song.updatedAt)}
              </span>
            </div>

            <div className="flex items-center gap-1 self-end border-t border-white/[0.06] pt-2 pl-[58px] sm:self-auto sm:border-0 sm:pt-0 sm:pl-0">
              <button
                type="button"
                onClick={() => onEdit(song)}
                aria-label={`Editar ${song.title}`}
                className="flex size-9 items-center justify-center rounded-xl text-[#8a948b] transition hover:bg-white/[0.06] hover:text-[#e7c895]"
              >
                <DashboardIcon name="edit" size={16} />
              </button>
              <button
                type="button"
                onClick={() => onDelete(song)}
                aria-label={`Excluir ${song.title}`}
                className="flex size-9 items-center justify-center rounded-xl text-[#8a7775] transition hover:bg-red-400/[0.09] hover:text-red-200"
              >
                <DashboardIcon name="trash" size={16} />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
