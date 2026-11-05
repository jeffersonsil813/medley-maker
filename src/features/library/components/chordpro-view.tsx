import { parseChordPro } from "../chordpro";

export function ChordProView({ content }: { content: string }) {
  if (!content.trim()) {
    return <p className="text-sm italic text-[#69736a]">Esta seção ainda não tem letra cadastrada.</p>;
  }

  return (
    <p className="whitespace-pre-wrap break-words font-mono text-[13px] leading-7 text-[#cdd3cc] sm:text-sm">
      {parseChordPro(content).map((part, index) =>
        part.type === "chord" ? (
          <span key={index} className="font-semibold text-[#d9b982]">
            [{part.value}]
          </span>
        ) : (
          <span key={index}>{part.value}</span>
        ),
      )}
    </p>
  );
}
