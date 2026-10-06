import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/templates/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { formatDate } from "@/lib/utils";
import type { LegalDocument } from "@/types/content";

export function LegalPage({ doc }: { doc: LegalDocument & { isDraft?: boolean } }) {
  const path = `/${doc.slug}`;
  return (
    <>
      <PageHero
        title={doc.title}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: doc.title }]}
        description={<p>Last updated {formatDate(doc.updatedAt)}</p>}
      />
      <Container className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl">
          {doc.isDraft !== false && (
            <p className="rounded-card border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-ink">
              Draft for review — this policy must be approved by legal counsel before publication.
            </p>
          )}
          <p className="mt-8 text-lg leading-relaxed text-ink">{doc.intro}</p>
          {doc.sections.map((s, i) => (
            <section key={s.heading} className="mt-10" aria-labelledby={`legal-${i}`}>
              <h2 id={`legal-${i}`} className="font-serif text-2xl font-medium text-navy">
                {i + 1}. {s.heading}
              </h2>
              {s.paragraphs.map((p) => (
                <p key={p} className="mt-3 leading-relaxed text-ink">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </Container>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: doc.title, path }])} />
    </>
  );
}
