import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Insight } from "@/types/insight";

export function InsightCard({ article }: { article: Insight }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-white transition-shadow duration-300 hover:shadow-[0_20px_40px_-26px_rgba(7,27,54,0.4)]">
      <div className="relative aspect-[25/16] overflow-hidden bg-surface-muted">
        <Image
          src={article.image.src}
          alt={article.image.alt}
          fill
          sizes="(min-width: 1280px) 290px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-sm bg-white px-2 py-1 text-[11px] font-semibold text-navy">
          {article.category.name}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-sans text-[15px] leading-snug font-semibold text-navy">
          <Link href={`/insights/${article.slug}`} className="after:absolute after:inset-0 group-hover:text-teal-dark">
            {article.title}
          </Link>
        </h3>
        <div className="mt-auto flex items-center justify-between pt-5 text-xs">
          <time dateTime={article.publishedAt} className="text-muted">
            {formatDate(article.publishedAt)}
          </time>
          <span className="inline-flex items-center gap-1 font-semibold text-teal-dark group-hover:text-navy">
            Read More <ArrowRight aria-hidden className="size-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
