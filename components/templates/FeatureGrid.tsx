import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import type { Feature } from "@/types/content";

interface FeatureGridProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  items: Feature[];
  columns?: 3 | 4;
  muted?: boolean;
}

export function FeatureGrid({ id, eyebrow, title, description, items, columns = 4, muted }: FeatureGridProps) {
  return (
    <section id={id} className={cn("py-20 lg:py-24", muted && "bg-surface-muted")}>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} className="reveal" />
        <ul className={cn("mt-12 grid gap-6 sm:grid-cols-2", columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
          {items.map((item) => (
            <li key={item.id} className="reveal rounded-card border border-line bg-white p-7">
              <span className="inline-flex size-11 items-center justify-center rounded-full bg-teal-light text-teal">
                <Icon name={item.icon} className="size-5" />
              </span>
              <h3 className="mt-5 text-base font-semibold text-navy">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
