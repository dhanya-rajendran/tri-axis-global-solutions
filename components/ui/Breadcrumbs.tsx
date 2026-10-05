import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items, tone = "dark", className }: { items: Crumb[]; tone?: "dark" | "light"; className?: string }) {
  const onDark = tone === "dark";
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className={cn("flex flex-wrap items-center gap-1.5 text-xs", onDark ? "text-white/65" : "text-muted")}>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link href={item.href} className={cn("transition-colors", onDark ? "hover:text-gold-light" : "hover:text-navy")}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={onDark ? "text-white" : "text-navy"}>
                  {item.label}
                </span>
              )}
              {!last && <ChevronRight aria-hidden className="size-3 opacity-60" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
