import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  as?: "h1" | "h2" | "h3";
  className?: string;
  titleClassName?: string;
  id?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  as: Tag = "h2",
  className,
  titleClassName,
  id,
}: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-2xl", className)}>
      {eyebrow && <p className={cn("eyebrow mb-4", dark ? "text-gold" : "text-teal-dark")}>{eyebrow}</p>}
      <Tag id={id} className={cn("font-serif text-h2 font-medium", dark ? "text-white" : "text-navy", titleClassName)}>
        {title}
      </Tag>
      {description && (
        <div className={cn("mt-5 text-base leading-relaxed", dark ? "text-white/75" : "text-muted")}>{description}</div>
      )}
    </div>
  );
}
