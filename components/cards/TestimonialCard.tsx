import { Quote } from "lucide-react";
import type { Testimonial } from "@/types/testimonial";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="relative h-full rounded-card bg-white p-7 text-ink shadow-[0_24px_48px_-24px_rgba(0,0,0,0.5)] sm:p-8">
      <Quote aria-hidden className="size-8 fill-gold text-gold" strokeWidth={1} />
      <blockquote className="mt-5 font-serif text-lg leading-relaxed text-navy">
        <p>{testimonial.placeholder ? `[${testimonial.quote}]` : `“${testimonial.quote}”`}</p>
      </blockquote>
      <figcaption className="mt-6 border-t border-line pt-4 text-sm">
        <span className="block font-semibold text-navy">{testimonial.name}</span>
        <span className="text-muted">
          {testimonial.role} · {testimonial.company}
        </span>
      </figcaption>
    </figure>
  );
}
