import type { ReactNode } from "react";
export function TableCard({ children }: { children: ReactNode }) {
  return <div className="overflow-hidden rounded-xl border bg-white shadow-xs">{children}</div>;
}
