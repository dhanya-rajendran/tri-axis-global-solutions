import { IndustryCard } from "@/components/cards/IndustryCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Industry } from "@/types/industry";

export function IndustriesSection({ industries, showAllLink = true }: { industries: Industry[]; showAllLink?: boolean }) {
  return (
    <section aria-labelledby="industries-title" className="pb-20 lg:pb-28">
      <Container>
        <div className="reveal flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow text-teal-dark">Industry Expertise</p>
            <h2 id="industries-title" className="mt-4 font-serif text-h2 font-medium text-navy">
              Industry expertise across
              <br className="hidden sm:block" /> key sectors
            </h2>
          </div>
          {showAllLink && (
            <ButtonLink href="/industries" variant="text" arrow className="self-start sm:self-auto">
              Explore All Industries
            </ButtonLink>
          )}
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {industries.map((industry) => (
            <li key={industry.id} className="reveal">
              <IndustryCard industry={industry} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
