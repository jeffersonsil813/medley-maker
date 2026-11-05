import type { Metadata } from "next";
import { MedleyBuilderClient } from "@/features/medleys/components/medley-builder-client";
import { MedleyWorkspaceShell } from "@/features/medleys/components/medley-workspace-shell";

export const metadata: Metadata = {
  title: "Criar medley | Medley Maker",
  description: "Combine trechos da sua biblioteca em uma sequência personalizada.",
};

export default function NewMedleyPage() {
  return <MedleyWorkspaceShell><MedleyBuilderClient /></MedleyWorkspaceShell>;
}
