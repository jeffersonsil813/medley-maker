import type { Metadata } from "next";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { LibraryClient } from "@/features/library/components/library-client";

export const metadata: Metadata = {
  title: "Biblioteca de músicas | Medley Maker",
  description: "Cadastre e organize suas músicas, letras e cifras no Medley Maker.",
};

export default function LibraryPage() {
  return (
    <div className="min-h-dvh bg-[#0b0e0c]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-40 -top-56 size-[560px] rounded-full bg-[#8d7650]/[0.055] blur-[110px]" />
        <div className="absolute -right-52 top-[30%] size-[500px] rounded-full bg-[#486454]/[0.045] blur-[120px]" />
      </div>
      <div className="relative mx-auto flex min-h-dvh max-w-[1680px] flex-col lg:flex-row">
        <DashboardSidebar activeItem="library" />
        <main className="min-w-0 flex-1">
          <LibraryClient />
        </main>
      </div>
    </div>
  );
}
