import Link from "next/link";
import { ArrowRight, Briefcase, Building, CalendarDays, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { Job } from "@/types/job";

interface JobCardProps {
  job: Job;
  industryName?: string;
  typeLabel?: string;
}

export function JobCard({ job, industryName, typeLabel }: JobCardProps) {
  return (
    <article className="group relative flex flex-col gap-5 rounded-card border border-line bg-white p-6 transition-[border-color,box-shadow] duration-300 ease-premium hover:border-navy/30 hover:shadow-[0_18px_40px_-28px_rgba(7,27,54,0.45)] sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          {industryName && <Badge tone="teal">{industryName}</Badge>}
          {job.featured && <Badge tone="gold">Featured</Badge>}
        </div>
        <h3 className="mt-3 font-serif text-xl font-medium text-navy">
          <Link href={`/jobs/${job.slug}`} className="after:absolute after:inset-0 group-hover:text-teal-dark">
            {job.title}
          </Link>
        </h3>
        <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-muted">
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Company</dt>
            <Building aria-hidden className="size-3.5" strokeWidth={1.5} />
            <dd>{job.company}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Location</dt>
            <MapPin aria-hidden className="size-3.5" strokeWidth={1.5} />
            <dd>{job.location}, UAE</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Employment type</dt>
            <Briefcase aria-hidden className="size-3.5" strokeWidth={1.5} />
            <dd>{typeLabel ?? job.employmentType}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Posted</dt>
            <CalendarDays aria-hidden className="size-3.5" strokeWidth={1.5} />
            <dd>
              <time dateTime={job.postedAt}>{formatDate(job.postedAt)}</time>
            </dd>
          </div>
        </dl>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-teal-dark group-hover:text-navy">
        View Job <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </article>
  );
}
