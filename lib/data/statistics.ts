import type { Statistic } from "@/types/statistic";

/**
 * Trust statistics. Values marked `placeholder: true` render as "[000]+" and
 * MUST be replaced with verified figures before launch (Phase 2: admin-managed).
 */
export const statistics: Statistic[] = [
  { id: "stat-businesses", value: "000", suffix: "+", label: "Businesses served", placeholder: true, order: 1 },
  { id: "stat-placed", value: "000", suffix: "+", label: "Professionals placed", placeholder: true, order: 2 },
  { id: "stat-years", value: "12", label: "Years of experience", highlight: true, order: 3 },
  { id: "stat-industries", value: "10", suffix: "+", label: "Industries served", highlight: true, order: 4 },
];
