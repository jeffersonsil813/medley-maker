import { jsPDF } from "jspdf";

type MedleyPdfItem = {
  content: string;
};

export function joinMedleyContent(items: readonly MedleyPdfItem[]) {
  return items
    .map((item) => item.content.trim())
    .filter(Boolean)
    .join("\n\n");
}

export function downloadMedleyPdf(
  title: string,
  targetKey: string,
  items: MedleyPdfItem[],
) {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(151, 126, 83);
  pdf.text("MEDLEY MAKER  /  CIFRA DO MEDLEY", margin, y);
  y += 12;

  pdf.setFontSize(22);
  pdf.setTextColor(30, 35, 31);
  const titleLines = pdf.splitTextToSize(title || "Medley sem título", contentWidth);
  pdf.text(titleLines, margin, y);
  y += titleLines.length * 9 + 2;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(54, 61, 55);
  pdf.text(`Tom do medley: ${targetKey}`, margin, y);
  y += 7;

  pdf.setDrawColor(210, 195, 168);
  pdf.setLineWidth(0.5);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 9;

  const ensureSpace = (height: number) => {
    if (y + height <= pageHeight - margin) return;
    pdf.addPage();
    y = margin;
  };

  const continuousContent = joinMedleyContent(items);

  for (const sourceLine of continuousContent.split(/\r?\n/)) {
    const wrappedLines = pdf.splitTextToSize(sourceLine || " ", contentWidth);
    for (const line of wrappedLines) {
      ensureSpace(5.5);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10.5);
      pdf.setCharSpace(0);
      pdf.setTextColor(42, 48, 43);
      pdf.text(line, margin, y);
      y += 5.3;
    }
  }

  const totalPages = pdf.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    pdf.setPage(page);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(130, 137, 131);
    pdf.text(`${page} / ${totalPages}`, pageWidth - margin, pageHeight - 9, { align: "right" });
  }

  const filename = (title || "medley")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  pdf.save(`${filename || "medley"}.pdf`);
}
