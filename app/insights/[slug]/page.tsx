import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { InsightCard } from "@/components/cards/InsightCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { ContentBlocks } from "@/components/templates/ContentBlocks";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { getInsightBySlug, getInsights } from "@/lib/services/api";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  return (await getInsights()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getInsightBySlug(slug);
  if (!article) return {};
  return buildMetadata({
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.excerpt,
    path: `/insights/${article.slug}`,
    image: article.image.src,
    type: "article",
    publishedTime: article.publishedAt,
  });
}

export default async function InsightDetailPage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const article = await getInsightBySlug(slug);
  if (!article) notFound();
  const related = (await getInsights()).filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <>
      <article>
        <header className="bg-surface-muted">
          <Container className="pt-12 pb-10 lg:pt-16">
            <Breadcrumbs tone="light" items={[{ label: "Home", href: "/" }, { label: "Insights", href: "/insights" }, { label: article.title }]} />
            <div className="mx-auto mt-10 max-w-3xl text-center">
              <p className="eyebrow text-teal-dark">{article.category.name}</p>
              <h1 className="mt-4 font-serif text-[clamp(2rem,1.4rem+2.4vw,3.25rem)] leading-[1.1] font-medium text-navy">{article.title}</h1>
              <p className="mt-5 text-lg text-muted">{article.excerpt}</p>
              <p className="mt-6 text-sm text-muted">
                {article.author.name} · <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time> · {article.readingMinutes} min read
              </p>
            </div>
          </Container>
        </header>
        <Container>
          <div className="relative mx-auto -mb-4 aspect-[16/8] max-w-5xl translate-y-0 overflow-hidden rounded-card">
            <Image src={article.image.src} alt={article.image.alt} fill priority sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" />
          </div>
          <div className="mx-auto max-w-[68ch] py-14 lg:py-20">
            <ContentBlocks blocks={article.content} />
            {article.download && (
              <div className="mt-10 flex flex-col gap-4 rounded-card bg-navy p-7 text-white sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Download aria-hidden className="size-6 text-gold" strokeWidth={1.5} />
                  <p className="font-serif text-lg">{article.title.split("—")[0].trim()}</p>
                </div>
                <ButtonLink href={article.download.href ?? "/contact"} variant="primary" size="sm" arrow>
                  {article.download.label}
                </ButtonLink>
              </div>
            )}
          </div>
        </Container>
      </article>

      {related.length > 0 && (
        <section className="border-t border-line bg-surface-muted py-16 lg:py-20" aria-labelledby="related-title">
          <Container>
            <h2 id="related-title" className="font-serif text-h3 font-medium text-navy">
              Related insights
            </h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <li key={a.id}>
                  <InsightCard article={a} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
      <FinalCTA />
      <JsonLd
        data={[
          articleJsonLd(article),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Insights", path: "/insights" },
            { name: article.title, path: `/insights/${article.slug}` },
          ]),
        ]}
      />
    </>
  );
}
