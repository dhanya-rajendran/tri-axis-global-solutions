import { TestimonialCard } from "@/components/cards/TestimonialCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import type { Statistic } from "@/types/statistic";
import type { Testimonial } from "@/types/testimonial";

export function TrustSection({ statistics, testimonial }: { statistics: Statistic[]; testimonial?: Testimonial }) {
  return (
    <section aria-labelledby="trust-title" className="relative overflow-hidden bg-navy py-20 text-white lg:py-24">
      <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 size-[32rem] rounded-full border border-white/5" />
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-[24rem] rounded-full border border-white/5" />
      <Container className="relative grid gap-12 lg:grid-cols-[1fr_1.1fr_1fr] lg:items-center lg:gap-12">
        <div className="reveal">
          <h2 id="trust-title" className="max-w-sm font-serif text-h2 font-medium text-white">
            Trusted by businesses &amp;&nbsp;professionals
          </h2>
          <p className="mt-5 max-w-sm text-white/70">
            We build long-term relationships between candidates and industry leaders.
          </p>
          <ButtonLink href="/employers" variant="primary" arrow className="mt-8">
            Partner With Us
          </ButtonLink>
        </div>

        <dl className="reveal grid grid-cols-2 gap-x-6 gap-y-10 border-y border-white/10 py-10 lg:border-y-0 lg:border-l lg:py-0 lg:pl-12">
          {statistics.map((s) => (
            <div key={s.id} className="flex flex-col-reverse">
              <dt className="mt-2 text-[13px] text-white/65">{s.label}</dt>
              <dd className={cn("font-serif text-[2.5rem] leading-none font-medium sm:text-5xl", s.highlight ? "text-gold-light" : "text-white")}>
                {s.placeholder ? `[${s.value}]` : s.value}
                {s.suffix}
              </dd>
            </div>
          ))}
        </dl>

        {testimonial && (
          <div className="reveal">
            <TestimonialCard testimonial={testimonial} />
          </div>
        )}
      </Container>
    </section>
  );
}
