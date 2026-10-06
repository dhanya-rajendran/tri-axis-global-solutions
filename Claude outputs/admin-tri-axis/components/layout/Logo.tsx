export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg viewBox="0 0 40 36" className="h-7 w-8 shrink-0" aria-hidden>
        <path d="M20 2 38 34H28.5L20 18.5 11.5 34H2Z" fill="var(--gold)" />
        <path d="M20 18.5 28.5 34h-17Z" fill={light ? "#fff" : "var(--primary)"} />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={`font-serif text-base font-semibold tracking-[0.06em] ${light ? "text-white" : "text-primary"}`}>TRIAXIS</span>
        <span className={`mt-1 text-[8px] font-semibold tracking-[0.28em] ${light ? "text-white/60" : "text-muted-foreground"}`}>ADMIN CONSOLE</span>
      </span>
    </span>
  );
}
