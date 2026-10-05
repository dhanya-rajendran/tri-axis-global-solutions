import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "outline-light" | "text" | "text-light";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "group/btn inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-premium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:pointer-events-none disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary: "rounded-control bg-gold text-navy hover:bg-gold-light hover:shadow-[0_6px_20px_-8px_rgba(212,166,58,0.7)]",
  secondary: "rounded-control bg-navy text-white hover:bg-navy-700",
  outline: "rounded-control border border-navy/80 text-navy hover:bg-navy hover:text-white",
  "outline-light": "rounded-control border border-white/70 text-white hover:bg-white hover:text-navy",
  text: "text-teal-dark hover:text-navy p-0",
  "text-light": "text-gold-light hover:text-white p-0",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-[15px]",
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
}

function Inner({ children, arrow }: { children: ReactNode; arrow?: boolean }) {
  return (
    <>
      <span>{children}</span>
      {arrow && (
        <ArrowRight aria-hidden className="size-4 shrink-0 transition-transform duration-200 group-hover/btn:translate-x-0.5" strokeWidth={1.75} />
      )}
    </>
  );
}

const classesFor = (variant: ButtonVariant, size: ButtonSize, className?: string) =>
  cn(base, variants[variant], !variant.startsWith("text") && sizes[size], variant.startsWith("text") && "text-sm", className);

type ButtonLinkProps = CommonProps & Omit<ComponentPropsWithoutRef<typeof Link>, "className" | "children">;

/** Link styled as a button — use for navigation. */
export function ButtonLink({ variant = "primary", size = "md", arrow, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={classesFor(variant, size, className)} {...props}>
      <Inner arrow={arrow}>{children}</Inner>
    </Link>
  );
}

type ButtonProps = CommonProps & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

/** Native button — use for actions (form submit, toggles). */
export function Button({ variant = "primary", size = "md", arrow, className, children, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={classesFor(variant, size, className)} {...props}>
      <Inner arrow={arrow}>{children}</Inner>
    </button>
  );
}
