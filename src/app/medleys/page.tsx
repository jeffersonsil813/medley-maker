import type { Metadata } from "next";
import { MedleyListClient } from "@/features/medleys/components/medley-list-client";
import { MedleyWorkspaceShell } from "@/features/medleys/components/medley-workspace-shell";

export const metadata: Metadata = {
  title: "Meus medleys | Medley Maker",
  description: "Encontre e edite os medleys salvos no Medley Maker.",
};

export default function MedleysPage() {
  return (
    <MedleyWorkspaceShell>
      <MedleyListClient />
    </MedleyWorkspaceShell>
  );
}
