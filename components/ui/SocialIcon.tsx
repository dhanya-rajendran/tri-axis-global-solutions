import type { SocialPlatform } from "@/types/site";

/** Minimal brand glyphs (lucide-react no longer ships brand icons). */
const paths: Partial<Record<SocialPlatform, string>> = {
  linkedin:
    "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.83v1.54h.06c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.13V21h-4v-5c0-1.2-.02-2.73-1.66-2.73-1.67 0-1.92 1.3-1.92 2.65V21h-4V9.75Z",
  instagram:
    "M12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6Zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2Zm6.1-8.1a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM12 3.6c2.7 0 3 0 4.1.06 2.7.12 4 1.4 4.1 4.1.05 1.06.06 1.38.06 4.07s0 3-.06 4.07c-.12 2.7-1.4 4-4.1 4.1-1.07.05-1.38.06-4.1.06s-3-.01-4.07-.06c-2.72-.12-3.98-1.42-4.1-4.1C3.6 15 3.6 14.7 3.6 12s0-3 .06-4.07c.12-2.7 1.4-3.98 4.1-4.1C8.98 3.6 9.3 3.6 12 3.6ZM12 2C9.3 2 8.94 2 7.88 2.06 4.25 2.23 2.23 4.24 2.06 7.88 2 8.94 2 9.28 2 12s0 3.06.06 4.12c.17 3.63 2.18 5.65 5.82 5.82C8.94 22 9.28 22 12 22s3.06 0 4.12-.06c3.62-.17 5.66-2.18 5.82-5.82.06-1.06.06-1.4.06-4.12s0-3.06-.06-4.12c-.16-3.62-2.18-5.65-5.82-5.82C15.06 2 14.72 2 12 2Z",
  facebook:
    "M13.5 21v-7.5h2.53l.38-2.94H13.5V8.69c0-.85.24-1.43 1.46-1.43h1.55V4.63A20.6 20.6 0 0 0 14.25 4.5c-2.24 0-3.77 1.37-3.77 3.88v2.18H7.95v2.94h2.53V21h3.02Z",
};

export function SocialIcon({ platform, className }: { platform: SocialPlatform; className?: string }) {
  const d = paths[platform];
  if (!d) return null;
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d={d} />
    </svg>
  );
}
