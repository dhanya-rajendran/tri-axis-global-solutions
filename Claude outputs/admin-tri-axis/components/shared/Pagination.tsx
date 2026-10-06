import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pagination({ page, pageSize, total, searchParams }: { page: number; pageSize: number; total: number; searchParams: Record<string, string | string[] | undefined> }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const href = (p: number) => {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) if (typeof v === "string" && k !== "page") q.set(k, v);
    if (p > 1) q.set("page", String(p));
    const s = q.toString();
    return s ? `?${s}` : "?";
  };
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  return (
    <div className="text-muted-foreground flex items-center justify-between gap-4 px-1 pt-4 text-sm">
      <p>
        {from}–{to} of {total}
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild disabled={page <= 1} className={page <= 1 ? "pointer-events-none opacity-50" : ""}>
          <Link href={href(page - 1)} aria-label="Previous page">
            <ChevronLeft /> Prev
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild className={page >= pages ? "pointer-events-none opacity-50" : ""}>
          <Link href={href(page + 1)} aria-label="Next page">
            Next <ChevronRight />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function parsePage(v: string | string[] | undefined) {
  const n = Number(Array.isArray(v) ? v[0] : v);
  return Number.isInteger(n) && n > 0 ? n : 1;
}
