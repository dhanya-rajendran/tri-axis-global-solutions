/** Join class names, ignoring falsy values. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Dubai" });

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(`${iso}T00:00:00+04:00`));
}

export function formatSalary(s: { min: number; max: number; currency: string; period: string }): string {
  const n = new Intl.NumberFormat("en-AE");
  return `${s.currency} ${n.format(s.min)} – ${n.format(s.max)} / ${s.period}`;
}

/** Read a single string value from Next.js searchParams. */
export function firstParam(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v)?.trim() ?? "";
}
