import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { images } from "@/lib/data/images";
import type { Service } from "@/types/service";

/** Featured recruitment block — driven by the recruitment Service record. */
export function RecruitmentFeature({ service }: { service: Service }) {
  return (
    <section aria-labelledby="recruitment-feature-title" className="py-20 lg:py-28">
      <Container>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1fr_1.15fr_0.95fr] lg:gap-10">
          <div className="reveal flex flex-col justify-center rounded-card bg-navy p-8 text-white sm:p-10">
            <p className="eyebrow text-gold">Recruitment &amp; Talent</p>
            <h2 id="recruitment-feature-title" className="mt-5 font-serif text-[2rem] leading-tight font-medium text-white sm:text-[2.25rem]">
              Recruitment &amp;
              <br /> Talent Solutions
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-white/75">
              From specialist professionals to leadership talent, TriAxis helps businesses build teams that drive growth.
            </p>
            <div className="mt-8">
              <ButtonLink href={`/services/${service.slug}`} variant="primary" arrow>
                Explore Recruitment Solutions
              </ButtonLink>
            </div>
          </div>

          <ul className="reveal flex flex-col justify-center divide-y divide-line">
            {service.offerings.map((o) => (
              <li key={o.title} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0 lg:py-5">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-line text-teal">
                  <Icon name={o.icon} className="size-[18px]" />
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold text-navy">{o.title}</h3>
                  <p className="mt-1 text-sm text-muted">{o.description}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="reveal relative min-h-80 overflow-hidden rounded-card bg-surface-muted md:col-span-2 lg:col-span-1">
            <Image
              src={images.recruitmentFeature.src}
              alt={images.recruitmentFeature.alt}
              fill
              sizes="(min-width: 1024px) 380px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
