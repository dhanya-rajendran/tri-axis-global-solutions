import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { images } from "@/lib/data/images";
import { headerCtas } from "@/lib/data/navigation";

interface FinalCTAProps {
  eyebrow?: string;
  title?: string;
}

export function FinalCTA({
  eyebrow = "Ready to take the next step?",
  title = "Let's create better opportunities together.",
}: FinalCTAProps) {
  return (
    <section aria-labelledby="cta-title" className="relative isolate overflow-hidden bg-navy">
      <Image src={images.cta.src} alt="" fill sizes="100vw" className="-z-10 object-cover object-bottom" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/95 via-navy/70 to-navy/30" />
      <Container className="flex flex-col gap-8 py-16 md:flex-row md:items-center md:justify-between lg:py-20">
        <div className="reveal">
          <p className="eyebrow text-gold">{eyebrow}</p>
          <h2 id="cta-title" className="mt-4 max-w-xl font-serif text-h2 font-medium text-white italic">
            {title}
          </h2>
        </div>
        <div className="reveal flex flex-col gap-3 sm:flex-row md:shrink-0">
          <ButtonLink href={headerCtas.findJob.href} variant="primary" size="lg" arrow>
            {headerCtas.findJob.label}
          </ButtonLink>
          <ButtonLink href={headerCtas.hireTalent.href} variant="outline-light" size="lg" arrow>
            {headerCtas.hireTalent.label}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
