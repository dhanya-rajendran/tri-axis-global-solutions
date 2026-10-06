import { Container } from "@/components/ui/Container";
import { JobSearch } from "@/components/jobs/JobSearch";
import { images } from "@/lib/data/images";
import type { JobFilterOptions } from "@/types/job";

/**
 * Homepage hero: the TAG brand banner (text is part of the artwork, so the
 * page's H1 is provided as visually-hidden text for search engines and screen
 * readers), followed by the floating job search.
 */
export function Hero({ jobOptions }: { jobOptions: JobFilterOptions }) {
  const { desktop, mobile } = images.heroBanner;
  return (
    <section aria-labelledby="hero-title" className="relative bg-navy">
      <h1 id="hero-title" className="sr-only">
        TriAxis Global Solutions — recruitment agency in Dubai and the UAE for technology, cybersecurity, AI, ELV, engineering
        and corporate leadership roles
      </h1>

      <picture>
        <source media="(max-width: 767px)" srcSet={mobile.src} width={mobile.width} height={mobile.height} />
        <img
          src={desktop.src}
          width={desktop.width}
          height={desktop.height}
          alt={desktop.alt}
          fetchPriority="high"
          decoding="async"
          className="block aspect-[16/9] h-auto w-full object-cover md:aspect-[8/3]"
        />
      </picture>

      <div className="bg-white">
        <Container className="relative z-10 -mt-6 sm:-mt-12 lg:-mt-20">
          <JobSearch options={jobOptions} variant="hero" />
        </Container>
      </div>
    </section>
  );
}
