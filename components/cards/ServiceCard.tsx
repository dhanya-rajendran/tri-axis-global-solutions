import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import type { Service } from "@/types/service";

export function ServiceCard({ service }: { service: Service }) {
  const href = `/services/${service.slug}`;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-white transition-[box-shadow,transform] duration-300 ease-premium hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(7,27,54,0.35)]">
      <div className="relative aspect-[25/16] overflow-hidden bg-surface-muted">
        <Image
          src={service.image.src}
          alt={service.image.alt}
          fill
          sizes="(min-width: 1280px) 290px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <Icon name={service.icon} className="size-6 text-teal" />
        <h3 className="mt-4 font-serif text-xl leading-snug font-medium text-navy">
          <Link href={href} className="after:absolute after:inset-0">
            {service.title}
          </Link>
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">{service.summary}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[13px] font-semibold text-teal-dark transition-colors group-hover:text-navy">
          {service.ctaLabel}
          <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
