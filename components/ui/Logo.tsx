import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Interim wordmark + mark (original geometric "tri-axis" glyph).
 * Replace the inline SVG with the approved brand logo file when available.
 */
export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const light = tone === "light";
  return (
    <Link href="/" aria-label="TriAxis Global Solutions — home" className={cn("group inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 40 36" className="h-8 w-9 shrink-0" aria-hidden>
        <path d="M20 2 38 34H28.5L20 18.5 11.5 34H2Z" className="fill-gold" />
        <path d="M20 18.5 28.5 34h-17Z" className={light ? "fill-white" : "fill-navy"} />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={cn("font-serif text-[19px] font-semibold tracking-[0.06em]", light ? "text-white" : "text-navy")}>TRIAXIS</span>
        <span className={cn("mt-1 text-[7.5px] font-semibold tracking-[0.32em]", light ? "text-white/70" : "text-muted")}>GLOBAL SOLUTIONS</span>
      </span>
    </Link>
  );
}
