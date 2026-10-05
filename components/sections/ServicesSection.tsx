import { ServiceCard } from "@/components/cards/ServiceCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Service } from "@/types/service";

export function ServicesSection({ services, showAllLink = true }: { services: Service[]; showAllLink?: boolean }) {
  return (
    <section aria-labelledby="services-title" className="bg-surface-muted py-20 lg:py-28">
      <Container>
        <div className="reveal grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="eyebrow text-teal-dark">Our Services</p>
            <h2 id="services-title" className="mt-4 font-serif text-h2 font-medium text-navy">
              Solutions that move
              <br className="hidden sm:block" /> businesses forward
            </h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-md text-muted">
              From recruitment and workforce solutions to procurement, trading and e-commerce, we provide end-to-end business
              solutions for sustainable growth.
            </p>
            {showAllLink && (
              <ButtonLink href="/services" variant="text" arrow className="mt-4">
                Explore All Services
              </ButtonLink>
            )}
          </div>
        </div>
        <ul className="snap-rail mt-10 sm:mt-12 xl:grid-cols-4">
          {services.map((service) => (
            <li key={service.id}>
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
