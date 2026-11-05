import Link from "next/link";
import { DashboardIcon, type DashboardIconName } from "./dashboard-icons";

const navigationItems: {
  href: string;
  icon: DashboardIconName;
  label: string;
  key: "overview" | "medleys" | "library";
}[] = [
  { href: "/", icon: "grid", label: "Visão geral", key: "overview" },
  { href: "/medleys", icon: "music", label: "Meus medleys", key: "medleys" },
  { href: "/biblioteca", icon: "library", label: "Biblioteca", key: "library" },
];

function BrandMark() {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-[#c9a875]/20 bg-[#c9a875]/10 text-[#d6b98c]">
      <DashboardIcon name="wave" size={21} />
    </span>
  );
}

function NavigationLinks({
  compact = false,
  activeItem,
}: {
  compact?: boolean;
  activeItem: "overview" | "medleys" | "library";
}) {
  return (
    <nav
      aria-label="Navegação principal"
      className={compact ? "flex min-w-max items-center gap-1" : "grid gap-1.5"}
    >
      {navigationItems.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          aria-current={item.key === activeItem ? "page" : undefined}
          className={[
            "group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors",
            compact ? "px-3 py-2.5" : "",
            item.key === activeItem
              ? "bg-white/[0.07] text-[#f3eee4] shadow-[inset_2px_0_0_#c9a875]"
              : "text-[#8c958d] hover:bg-white/[0.045] hover:text-[#e9ece7]",
          ].join(" ")}
        >
          <DashboardIcon
            name={item.icon}
            size={18}
            className={item.key === activeItem ? "text-[#d6b98c]" : "text-[#778078] group-hover:text-[#b9c2ba]"}
          />
          <span className={compact ? "text-xs sm:text-sm" : ""}>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

export function DashboardSidebar({
  activeItem = "overview",
}: {
  activeItem?: "overview" | "medleys" | "library";
}) {
  return (
    <>
      <aside className="sticky top-0 hidden h-dvh w-[252px] shrink-0 flex-col border-r border-white/[0.065] bg-[#0d100e] px-5 py-7 lg:flex">
        <Link href="/" className="mb-12 flex items-center gap-3 px-1">
          <BrandMark />
          <span>
            <span className="block text-[15px] font-semibold tracking-[-0.03em] text-[#f0f2ee]">
              medley maker
            </span>
            <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-[#798279]">
              música em harmonia
            </span>
          </span>
        </Link>

        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#626b63]">
          Seu espaço
        </p>
        <NavigationLinks activeItem={activeItem} />

        <div className="mt-auto rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
          <span className="mb-3 flex size-8 items-center justify-center rounded-xl bg-[#c9a875]/10 text-[#d6b98c]">
            <DashboardIcon name="sparkle" size={16} />
          </span>
          <p className="text-sm font-medium text-[#d9ded8]">Feito para momentos de adoração</p>
          <p className="mt-1.5 text-xs leading-5 text-[#838c84]">
            Um espaço para organizar as canções que fazem parte da sua comunidade.
          </p>
        </div>
        <p className="mt-5 px-1 text-[11px] text-[#5f685f]">Medley Maker · 2026</p>
      </aside>

      <div className="border-b border-white/[0.065] bg-[#0d100e] px-4 py-4 sm:px-7 lg:hidden">
        <div className="flex items-center gap-3">
          <BrandMark />
          <span>
            <span className="block text-sm font-semibold tracking-[-0.03em] text-[#f0f2ee]">
              medley maker
            </span>
            <span className="block text-[9px] font-medium uppercase tracking-[0.2em] text-[#798279]">
              música em harmonia
            </span>
          </span>
        </div>
        <div className="mt-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <NavigationLinks compact activeItem={activeItem} />
        </div>
      </div>
    </>
  );
}
