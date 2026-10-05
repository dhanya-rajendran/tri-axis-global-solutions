import Image from "next/image";
import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { images } from "@/lib/data/images";
import type { ImageAsset } from "@/types/common";

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs: Crumb[];
  image?: ImageAsset;
  children?: ReactNode;
}

/** Standard inner-page hero with breadcrumb, single H1 and optional actions. */
export function PageHero({ eyebrow, title, description, breadcrumbs, image = images.pageHero, children }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-navy">
      <Image src={image.src} alt="" fill priority sizes="100vw" className="-z-10 object-cover object-bottom" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/85 to-navy/40" />
      <Container className="py-14 sm:py-16 lg:py-20">
        <Breadcrumbs items={breadcrumbs} />
        <div className="mt-8 max-w-3xl">
          {eyebrow && <p className="eyebrow text-gold">{eyebrow}</p>}
          <h1 className="mt-4 font-serif text-[clamp(2.125rem,1.5rem+2.4vw,3.5rem)] leading-[1.08] font-medium text-white">{title}</h1>
          {description && <div className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-[17px]">{description}</div>}
          {children && <div className="mt-8 flex flex-col gap-3 sm:flex-row">{children}</div>}
        </div>
      </Container>
    </section>
  );
}
