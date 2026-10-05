import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

/** Consistent max-width (1280px) and responsive gutters: 20px → 32px → 48px. */
export function Container({ children, className, as: Tag = "div" }: ContainerProps) {
  return <Tag className={cn("mx-auto w-full max-w-site px-5 sm:px-8 lg:px-12", className)}>{children}</Tag>;
}
