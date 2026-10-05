import type { Job, JobFilters } from "@/types/job";

/**
 * Pure filtering logic for the local data source. When the admin API exists,
 * filtering moves server-side and this helper is no longer needed.
 */
export function filterJobs(jobs: Job[], filters: JobFilters): Job[] {
  const keyword = filters.keyword?.toLowerCase().trim();
  return jobs
    .filter((job) => job.status === "open")
    .filter((job) => {
      if (keyword) {
        const haystack = [job.title, job.company, job.summary, job.industry, job.location, job.reference, ...job.requirements]
          .join(" ")
          .toLowerCase();
        if (!keyword.split(/\s+/).every((term) => haystack.includes(term))) return false;
      }
      if (filters.location && job.locationSlug !== filters.location) return false;
      if (filters.industry && job.industry !== filters.industry) return false;
      if (filters.type && job.employmentType !== filters.type) return false;
      if (filters.experience && job.experienceLevel !== filters.experience) return false;
      return true;
    })
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.postedAt.localeCompare(a.postedAt));
}
