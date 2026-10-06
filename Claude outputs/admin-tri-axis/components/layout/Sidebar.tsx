"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { navigation } from "./nav";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({ role, newEnquiries }: { role: "admin" | "editor"; newEnquiries: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const nav = (
    <nav aria-label="Admin" className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
      {navigation.map((group, gi) => {
        const items = group.items.filter((i) => !i.adminOnly || role === "admin");
        if (!items.length) return null;
        return (
          <div key={gi}>
            {group.title && <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.16em] text-white/40 uppercase">{group.title}</p>}
            <ul className="space-y-0.5">
              {items.map((item) => {
                const active = isActive(pathname, item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                        active ? "bg-white/10 font-medium text-white" : "text-sidebar-foreground/75 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <Icon className={cn("size-4 shrink-0", active ? "text-gold" : "text-white/50")} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge === "newEnquiries" && newEnquiries > 0 && (
                        <span className="bg-gold text-primary rounded-full px-1.5 py-0.5 text-[10px] font-bold">{newEnquiries}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      <button
        type="button"
        className="fixed top-3 left-3 z-50 inline-flex size-10 items-center justify-center rounded-md border bg-white shadow-sm lg:hidden"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} aria-hidden />}
      <aside
        className={cn(
          "bg-sidebar fixed inset-y-0 left-0 z-40 flex w-64 flex-col transition-transform duration-200 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center border-b border-white/10 px-5">
          <Link href="/" aria-label="Dashboard home">
            <Logo light />
          </Link>
        </div>
        {nav}
      </aside>
    </>
  );
}
