"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Mail, Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { isActivePath } from "@/lib/nav";
import { cn } from "@/lib/utils";
import type { NavItem, NavLink } from "@/types/navigation";

interface MobileMenuProps {
  items: NavItem[];
  ctas: { findJob: NavLink; hireTalent: NavLink };
  email: string;
}

export function MobileMenu({ items, ctas, email }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a,button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      // Simple focus trap
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled])");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          (toggle ?? last).focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          toggle?.focus();
        }
      }
    };
    const mq = window.matchMedia("(min-width: 1024px)");
    const onResize = () => mq.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onResize);
      toggle?.focus();
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="relative z-[60] -mr-2 inline-flex size-11 items-center justify-center rounded-control text-navy"
      >
        {open ? <X className="size-6" strokeWidth={1.5} /> : <Menu className="size-6" strokeWidth={1.5} />}
      </button>

      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        hidden={!open}
        className="fixed inset-x-0 top-header bottom-0 z-50 overflow-y-auto overscroll-contain bg-white motion-safe:animate-fade-up"
      >
        <div className="flex min-h-full flex-col px-5 pt-4 pb-8 sm:px-8">
          <nav aria-label="Mobile">
            <ul className="divide-y divide-line border-b border-line">
              {items.map((item) => {
                const active = isActivePath(pathname, item.href);
                if (!item.children) {
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn("flex items-center justify-between py-4 font-serif text-[22px]", active ? "text-teal-dark" : "text-navy")}
                        aria-current={pathname === item.href ? "page" : undefined}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }
                const isExpanded = expanded === item.href;
                return (
                  <li key={item.href}>
                    <button
                      type="button"
                      className={cn("flex w-full items-center justify-between py-4 text-left font-serif text-[22px]", active ? "text-teal-dark" : "text-navy")}
                      aria-expanded={isExpanded}
                      onClick={() => setExpanded(isExpanded ? null : item.href)}
                    >
                      {item.label}
                      <ChevronDown aria-hidden className={cn("size-5 text-muted transition-transform", isExpanded && "rotate-180")} strokeWidth={1.5} />
                    </button>
                    {isExpanded && (
                      <ul className="mb-4 space-y-1 border-l-2 border-gold pl-4">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link href={child.href} className="block py-2 text-[15px] text-ink hover:text-navy">
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <ButtonLink href={ctas.findJob.href} variant="outline" size="lg" arrow>
              {ctas.findJob.label}
            </ButtonLink>
            <ButtonLink href={ctas.hireTalent.href} variant="primary" size="lg" arrow>
              {ctas.hireTalent.label}
            </ButtonLink>
          </div>

          <div className="mt-auto pt-10">
            <p className="eyebrow text-muted">Get in touch</p>
            <a href={`mailto:${email}`} className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-navy">
              <Mail aria-hidden className="size-4 text-teal" strokeWidth={1.5} /> {email}
            </a>
            <div className="mt-4">
              <ButtonLink href="/contact" variant="secondary" size="md" arrow>
                Contact us
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
