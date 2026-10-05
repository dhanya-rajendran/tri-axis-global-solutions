import type { ContentBlock } from "@/types/common";

/** Renders CMS-style content blocks with editorial typography. */
export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-5 text-[16px] leading-[1.8] text-ink">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading":
            return (
              <h2 key={i} className="pt-4 font-serif text-2xl font-medium text-navy sm:text-[1.75rem]">
                {b.text}
              </h2>
            );
          case "list":
            return (
              <ul key={i} className="space-y-2.5 pl-1">
                {b.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote key={i} className="border-l-2 border-gold pl-6 font-serif text-xl text-navy italic">
                <p>{b.text}</p>
                {b.cite && <cite className="mt-2 block font-sans text-sm text-muted not-italic">— {b.cite}</cite>}
              </blockquote>
            );
          default:
            return <p key={i}>{b.text}</p>;
        }
      })}
    </div>
  );
}
