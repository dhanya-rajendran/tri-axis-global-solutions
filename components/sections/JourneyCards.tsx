import Image from "next/image";
import { Briefcase, Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { images } from "@/lib/data/images";
import { headerCtas } from "@/lib/data/navigation";

const journeys = [
  {
    key: "employers",
    eyebrow: "For Employers",
    title: "I'm looking for talent",
    description: "Find qualified professionals who can help your business grow.",
    cta: { label: "Hire Talent", href: headerCtas.hireTalent.href },
    image: images.journeyEmployers,
    Icon: Users,
  },
  {
    key: "candidates",
    eyebrow: "For Candidates",
    title: "I'm looking for a job",
    description: "Explore opportunities that match your skills, experience and aspirations.",
    cta: { label: "Find Jobs", href: "/jobs" },
    image: images.journeyCandidates,
    Icon: Briefcase,
  },
];

export function JourneyCards() {
  return (
    <section aria-labelledby="journey-title" className="pt-16 pb-20 lg:pt-24 lg:pb-28">
      <Container className="grid gap-10 lg:grid-cols-[0.8fr_2fr] lg:gap-14">
        <div className="reveal">
          <p className="eyebrow text-teal-dark">Your Journey</p>
          <h2 id="journey-title" className="mt-4 font-serif text-h2 font-medium text-navy">
            What brings
            <br className="hidden lg:block" /> you here?
          </h2>
          <p className="mt-5 max-w-sm text-muted">
            Whether you are building a team or your next career move, we&apos;ll point you in the right direction.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {journeys.map(({ key, eyebrow, title, description, cta, image, Icon }) => (
            <article
              key={key}
              className="reveal group flex flex-col overflow-hidden rounded-card border border-line bg-white transition-shadow duration-300 hover:shadow-[0_24px_48px_-28px_rgba(7,27,54,0.45)]"
            >
              <div className="relative aspect-[3/2] overflow-hidden bg-surface-muted">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                />
              </div>
              <div className="relative flex flex-1 flex-col px-6 pt-10 pb-7 sm:px-7">
                <span className="absolute -top-6 left-6 inline-flex size-12 items-center justify-center rounded-full border border-line bg-white text-teal sm:left-7">
                  <Icon aria-hidden className="size-5" strokeWidth={1.5} />
                </span>
                <p className="eyebrow text-teal-dark">{eyebrow}</p>
                <h3 className="mt-2 font-serif text-h3 font-medium text-navy">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>
                <div className="mt-auto pt-6">
                  <ButtonLink href={cta.href} variant="secondary" size="sm" arrow>
                    {cta.label}
                  </ButtonLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
