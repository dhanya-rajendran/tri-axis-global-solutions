import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Brand logo: the circular TAG emblem plus a readable wordmark.
 * The emblem's own small text is not legible at header size, so the company
 * name is repeated as live text next to it (also good for accessibility/SEO).
 */
export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const light = tone === "light";
  return (
    <Link href="/" aria-label="TriAxis Global Solutions FZE — home" className={cn("group inline-flex items-center gap-3", className)}>
      <Image
        src="/images/logo-tag-sm.png"
        width={160}
        height={160}
        alt=""
        loading="eager"
        className="size-12 shrink-0 rounded-full drop-shadow-sm transition-transform duration-300 group-hover:scale-105 sm:size-14"
      />
      <span className="flex flex-col leading-none">
        <span className={cn("font-serif text-[18px] font-semibold tracking-[0.02em] sm:text-[20px]", light ? "text-white" : "text-navy")}>
          TriAxis <span className={light ? "text-gold" : "text-gold-dark"}>Global</span>
        </span>
        <span className={cn("mt-1.5 text-[8px] font-semibold tracking-[0.3em] sm:text-[8.5px]", light ? "text-white/70" : "text-muted")}>
          SOLUTIONS FZE
        </span>
      </span>
    </Link>
  );
}
