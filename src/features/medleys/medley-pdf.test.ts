import assert from "node:assert/strict";
import test from "node:test";
import { joinMedleyContent } from "./medley-pdf.ts";

test("joins medley snippets in order with a readable gap and keeps chord text", () => {
  assert.equal(
    joinMedleyContent([
      { content: "  [A]Primeira parte\n[E9(11)]Continua  " },
      { content: "\n[F#m7]Segunda parte\n" },
    ]),
    "[A]Primeira parte\n[E9(11)]Continua\n\n[F#m7]Segunda parte",
  );
});

test("skips empty snippets without adding extra gaps", () => {
  assert.equal(
    joinMedleyContent([{ content: "[A]Primeira" }, { content: "  \n " }, { content: "[D]Final" }]),
    "[A]Primeira\n\n[D]Final",
  );
});
