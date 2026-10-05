import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { Industry } from "@/types/industry";

export function IndustryCard({ industry }: { industry: Industry }) {
  return (
    <Link
      href={`/industries/${industry.slug}`}
      className="group flex h-full min-h-32 flex-col items-center justify-center gap-3 rounded-card border border-line bg-white px-3 py-6 text-center transition-[border-color,box-shadow,background-color] duration-300 ease-premium hover:border-navy hover:bg-navy hover:shadow-[0_16px_32px_-20px_rgba(7,27,54,0.6)] focus-visible:border-navy"
    >
      <Icon name={industry.icon} className="size-7 text-navy transition-colors duration-300 group-hover:text-gold" />
      <span className="text-[13px] leading-snug font-medium text-ink transition-colors duration-300 group-hover:text-white">
        {industry.shortName ?? industry.name}
      </span>
    </Link>
  );
}
