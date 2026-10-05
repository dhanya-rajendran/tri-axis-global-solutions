import { InsightCard } from "@/components/cards/InsightCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Insight } from "@/types/insight";

export function InsightsSection({ insights, title = "Latest insights" }: { insights: Insight[]; title?: string }) {
  return (
    <section aria-labelledby="insights-title" className="py-20 lg:py-28">
      <Container>
        <div className="reveal flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow text-teal-dark">Insights &amp; Resources</p>
            <h2 id="insights-title" className="mt-4 font-serif text-h2 font-medium text-navy">
              {title}
            </h2>
          </div>
          <ButtonLink href="/insights" variant="text" arrow className="self-start sm:self-auto">
            View All Insights
          </ButtonLink>
        </div>
        <ul className="snap-rail mt-10 sm:mt-12 xl:grid-cols-4">
          {insights.map((article) => (
            <li key={article.id}>
              <InsightCard article={article} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
