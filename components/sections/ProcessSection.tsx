import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import type { ProcessStep } from "@/types/content";

export function ProcessSection({ steps }: { steps: ProcessStep[] }) {
  return (
    <section aria-labelledby="process-title" className="py-20 lg:py-28">
      <Container>
        <p className="eyebrow reveal text-teal-dark">Our Process</p>
        <h2 id="process-title" className="reveal mt-4 max-w-2xl font-serif text-h2 font-medium text-navy">
          A smarter way to build your workforce
        </h2>

        <ol className="mt-14 grid gap-0 lg:grid-cols-6 lg:gap-6">
          {steps.map((step, i) => {
            const last = i === steps.length - 1;
            return (
              <li key={step.id} className="reveal relative flex gap-5 pb-10 last:pb-0 lg:block lg:pb-0">
                {/* Connector: vertical on mobile, horizontal on desktop */}
                {!last && (
                  <span
                    aria-hidden
                    className="absolute top-11 bottom-0 left-[1.375rem] w-px bg-line lg:top-[1.375rem] lg:right-[-1.5rem] lg:bottom-auto lg:left-14 lg:h-px lg:w-auto"
                  />
                )}
                <span
                  className={cn(
                    "relative z-10 inline-flex size-11 shrink-0 items-center justify-center rounded-full font-serif text-sm font-semibold",
                    last ? "bg-gold text-navy ring-4 ring-gold/20" : "bg-navy text-white",
                  )}
                >
                  {step.number}
                </span>
                <div className="pt-2 lg:pt-6">
                  <h3 className="text-base font-semibold text-navy">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
