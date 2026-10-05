import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { images } from "@/lib/data/images";
import type { Feature } from "@/types/content";

export function WhyTriAxis({ items }: { items: Feature[] }) {
  return (
    <section id="why-triaxis" aria-labelledby="why-title" className="bg-surface-muted">
      <div className="grid lg:grid-cols-[minmax(0,0.36fr)_minmax(0,1fr)]">
        <div className="relative min-h-72 sm:min-h-96 lg:min-h-full">
          <Image src={images.whyArchitecture.src} alt={images.whyArchitecture.alt} fill sizes="(min-width: 1024px) 36vw, 100vw" className="object-cover" />
        </div>
        <div className="px-5 py-16 sm:px-8 lg:py-24 lg:pr-12 lg:pl-16 xl:pr-[max(3rem,calc((100vw-80rem)/2+3rem))]">
          <p className="eyebrow reveal text-teal-dark">Why TriAxis</p>
          <h2 id="why-title" className="reveal mt-4 font-serif text-h2 font-medium text-navy">
            Why businesses choose TriAxis
          </h2>
          <ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-8 sm:gap-y-10 xl:grid-cols-3">
            {items.map((item) => (
              <li key={item.id} className="reveal border-t border-line pt-6">
                <Icon name={item.icon} className="size-6 text-teal" />
                <h3 className="mt-4 text-[15px] font-semibold text-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
