export default function SpecialtyBadge({
  specialty,
}: {
  specialty: string;
}) {
  return (
    <span className="inline-flex rounded-full border border-ink-border bg-ink-black/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-ink-muted transition-colors duration-300 group-hover:border-ink-crimson/30 group-hover:bg-ink-crimson/10 group-hover:text-ink-cream">
      {specialty}
    </span>
  );
}
