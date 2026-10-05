"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { isActivePath } from "@/lib/nav";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/navigation";

export function DesktopNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Close menus on route change.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(null);
  }

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const enter = (i: number) => {
    clearTimeout(closeTimer.current);
    setOpen(i);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 120);
  };

  const itemClass = (active: boolean) =>
    cn(
      "relative inline-flex h-header items-center gap-1 whitespace-nowrap text-[13px] font-medium tracking-[0.01em] transition-colors duration-200 xl:text-[13.5px]",
      "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-300 after:ease-premium",
      active ? "text-navy after:scale-x-100" : "text-ink/85 hover:text-navy hover:after:scale-x-100",
    );

  return (
    <nav ref={navRef} aria-label="Main" className="hidden lg:block">
      <ul className="flex items-center gap-4 xl:gap-6">
        {items.map((item, i) => {
          const active = isActivePath(pathname, item.href);
          if (!item.children) {
            return (
              <li key={item.href}>
                <Link href={item.href} className={itemClass(active)} aria-current={pathname === item.href ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            );
          }
          const isOpen = open === i;
          const panelId = `nav-panel-${i}`;
          return (
            <li key={item.href} className="relative" onMouseEnter={() => enter(i)} onMouseLeave={leave}>
              <button
                type="button"
                className={itemClass(active)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                {item.label}
                <ChevronDown aria-hidden className={cn("size-3.5 transition-transform duration-200", isOpen && "rotate-180")} />
              </button>
              <div
                id={panelId}
                className={cn(
                  "absolute top-full left-1/2 z-50 w-80 -translate-x-1/2 pt-0 transition-[opacity,transform] duration-200 ease-premium",
                  isOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
                )}
              >
                <ul className="rounded-b-card border border-t-2 border-line border-t-gold bg-white p-2 shadow-[0_24px_48px_-24px_rgba(7,27,54,0.35)]">
                  {item.children.map((child) => {
                    const childActive = pathname === child.href;
                    return (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className={cn(
                            "block rounded-sm px-3 py-2.5 transition-colors hover:bg-surface-muted focus-visible:bg-surface-muted",
                            childActive && "bg-surface-muted",
                          )}
                          aria-current={childActive ? "page" : undefined}
                        >
                          <span className="block text-[13.5px] font-semibold text-navy">{child.label}</span>
                          {child.description && <span className="mt-0.5 block text-xs text-muted">{child.description}</span>}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
