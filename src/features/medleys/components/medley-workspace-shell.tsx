import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

export function MedleyWorkspaceShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#0b0e0c]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-40 -top-56 size-[560px] rounded-full bg-[#8d7650]/[0.055] blur-[110px]" />
        <div className="absolute -right-52 top-[30%] size-[500px] rounded-full bg-[#486454]/[0.045] blur-[120px]" />
      </div>
      <div className="relative mx-auto flex min-h-dvh max-w-[1680px] flex-col lg:flex-row">
        <DashboardSidebar activeItem="medleys" />
        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1320px] px-4 pb-12 pt-5 sm:px-7 sm:pb-16 sm:pt-8 lg:px-10 lg:pt-10 xl:px-14">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
