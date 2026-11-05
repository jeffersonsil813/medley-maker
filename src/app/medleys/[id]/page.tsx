import type { Metadata } from "next";
import { Suspense } from "react";
import { MedleyBuilderClient } from "@/features/medleys/components/medley-builder-client";
import { MedleyWorkspaceShell } from "@/features/medleys/components/medley-workspace-shell";

type MedleyPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Editar medley | Medley Maker",
  description: "Visualize e edite os trechos salvos em um medley.",
};

async function MedleyPageContent({ params }: MedleyPageProps) {
  const { id } = await params;
  return <MedleyWorkspaceShell><MedleyBuilderClient medleyId={id} /></MedleyWorkspaceShell>;
}

export default function MedleyPage({ params }: MedleyPageProps) {
  return (
    <Suspense fallback={<MedleyWorkspaceShell><div className="rounded-[22px] border border-white/[0.075] bg-[#111512] px-5 py-16 text-center text-sm text-[#899188]">Carregando medley…</div></MedleyWorkspaceShell>}>
      <MedleyPageContent params={params} />
    </Suspense>
  );
}
