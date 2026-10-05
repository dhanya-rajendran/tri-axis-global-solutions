import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "teal" | "gold" | "navy" | "neutral";
const tones: Record<Tone, string> = {
  teal: "bg-teal-light text-teal-dark",
  gold: "bg-gold/15 text-gold-dark",
  navy: "bg-navy text-white",
  neutral: "bg-surface-muted text-ink",
};

export function Badge({ children, tone = "neutral", className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-[11px] font-semibold tracking-wide", tones[tone], className)}>
      {children}
    </span>
  );
}
