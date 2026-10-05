import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="bg-surface-muted">
      <Container className="flex min-h-[60vh] flex-col items-start justify-center py-24">
        <p className="eyebrow text-teal-dark">Error 404</p>
        <h1 className="mt-4 font-serif text-h2 font-medium text-navy">We couldn&apos;t find that page</h1>
        <p className="mt-4 max-w-lg text-muted">The page may have moved, or the job may no longer be available.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" variant="secondary" arrow>
            Back to home
          </ButtonLink>
          <ButtonLink href="/jobs" variant="outline">
            Browse jobs
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
