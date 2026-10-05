import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { InsightCard } from "@/components/cards/InsightCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/templates/PageHero";
import { Container } from "@/components/ui/Container";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { getInsightCategories, getInsights } from "@/lib/services/api";
import { cn, firstParam, formatDate } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Insights & Resources",
  description: "Career advice, hiring trends, industry outlooks and salary insights for the UAE job market.",
  path: "/insights",
});

export default async function InsightsPage({ searchParams }: PageProps<"/insights">) {
  const sp = await searchParams;
  const categories = await getInsightCategories();
  const requested = firstParam(sp.category);
  const category = categories.find((c) => c.slug === requested);
  const articles = await getInsights({ category: category?.slug });
  const [lead, ...rest] = articles;

  return (
    <>
      <PageHero
        eyebrow="Insights & Resources"
        title={category ? category.name : "Latest insights"}
        description="Practical perspectives on careers, hiring and the UAE market from the TriAxis team."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Insights", href: category ? "/insights" : undefined }, ...(category ? [{ label: category.name }] : [])]}
      />

      <Container className="py-14 lg:py-20">
        <nav aria-label="Insight categories" className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <ul className="flex gap-2 whitespace-nowrap">
            {[{ slug: "", name: "All" }, ...categories].map((c) => {
              const active = (category?.slug ?? "") === c.slug;
              return (
                <li key={c.slug || "all"}>
                  <Link
                    href={c.slug ? `/insights?category=${c.slug}` : "/insights"}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex h-9 items-center rounded-control border px-4 text-[13px] font-medium transition-colors",
                      active ? "border-navy bg-navy text-white" : "border-line text-ink hover:border-navy",
                    )}
                  >
                    {c.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {lead ? (
          <>
            <article className="group relative mt-10 grid overflow-hidden rounded-card border border-line bg-white lg:grid-cols-2">
              <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-96">
                <Image src={lead.image.src} alt={lead.image.alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="flex flex-col justify-center p-8 lg:p-12">
                <p className="eyebrow text-teal-dark">{lead.category.name}</p>
                <h2 className="mt-4 font-serif text-h3 font-medium text-navy">
                  <Link href={`/insights/${lead.slug}`} className="after:absolute after:inset-0">
                    {lead.title}
                  </Link>
                </h2>
                <p className="mt-4 text-muted">{lead.excerpt}</p>
                <p className="mt-6 text-xs text-muted">
                  <time dateTime={lead.publishedAt}>{formatDate(lead.publishedAt)}</time> · {lead.readingMinutes} min read
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-dark group-hover:text-navy">
                  Read article <ArrowRight aria-hidden className="size-4" />
                </span>
              </div>
            </article>
            {rest.length > 0 && (
              <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((a) => (
                  <li key={a.id}>
                    <InsightCard article={a} />
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p className="mt-10 rounded-card border border-dashed border-line p-10 text-center text-muted">No articles in this category yet.</p>
        )}
      </Container>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Insights", path: "/insights" }])} />
    </>
  );
}
