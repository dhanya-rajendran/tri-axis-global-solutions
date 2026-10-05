import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { JobSearch } from "@/components/jobs/JobSearch";
import { images } from "@/lib/data/images";
import type { JobFilterOptions } from "@/types/job";

export function Hero({ jobOptions }: { jobOptions: JobFilterOptions }) {
  return (
    <section aria-labelledby="hero-title" className="relative">
      <div className="relative isolate overflow-hidden bg-navy">
        <Image
          src={images.hero.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[65%_center]"
        />
        {/* Readability treatment: navy wash, stronger on the text side */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/95 via-navy/65 to-navy/10" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-navy/60 to-transparent" />

        <Container className="relative pt-16 pb-44 sm:pt-20 sm:pb-48 lg:pt-24 lg:pb-52">
          <p className="absolute top-8 right-5 hidden text-right text-[10px] leading-[1.9] font-semibold tracking-[0.28em] text-white/70 sm:right-8 md:block lg:right-12">
            UAE BASED
            <br />
            GLOBAL REACH
            <br />
            LASTING IMPACT
          </p>
          <div className="max-w-3xl">
            <p className="eyebrow motion-safe:animate-fade-up text-gold">Connecting Talent, Trade &amp; Technology</p>
            <h1
              id="hero-title"
              className="mt-5 font-serif text-display font-medium text-white motion-safe:animate-fade-up motion-safe:[animation-delay:120ms]"
            >
              <span className="block">The Right Talent.</span>
              <span className="block">The Right Solutions.</span>
              <span className="block text-gold-light italic">The Right Connections.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 motion-safe:animate-fade-up motion-safe:[animation-delay:240ms] sm:text-[17px]">
              We connect businesses with the people, expertise and solutions they need to grow — across the UAE and beyond.
            </p>
          </div>
        </Container>
      </div>

      <Container className="relative z-10 -mt-32 sm:-mt-36">
        <JobSearch options={jobOptions} variant="hero" />
      </Container>
    </section>
  );
}
