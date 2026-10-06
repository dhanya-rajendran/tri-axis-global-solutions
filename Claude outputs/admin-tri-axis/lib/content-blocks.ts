import type { ContentBlock } from "@/db/schema";
import type { ContentBlockForm } from "@/lib/validators";

/** Form blocks → stored blocks (lists are one item per line). */
export function toContentBlocks(blocks: ContentBlockForm[]): ContentBlock[] {
  return blocks
    .filter((b) => b.text.trim())
    .map((b) => {
      if (b.type === "list") return { type: "list", items: b.text.split("\n").map((l) => l.replace(/^[-•*]\s*/, "").trim()).filter(Boolean) };
      if (b.type === "quote") return { type: "quote", text: b.text, ...(b.cite ? { cite: b.cite } : {}) };
      return { type: b.type, text: b.text };
    });
}

/** Stored blocks → form blocks. */
export function fromContentBlocks(blocks: ContentBlock[] | null | undefined): ContentBlockForm[] {
  return (blocks ?? []).map((b) => (b.type === "list" ? { type: "list", text: b.items.join("\n") } : { type: b.type, text: b.text, ...(b.type === "quote" && b.cite ? { cite: b.cite } : {}) }));
}
