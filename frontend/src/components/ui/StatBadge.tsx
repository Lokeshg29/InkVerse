/**
 * ============================================================
 * src/components/ui/StatBadge.tsx
 * ============================================================
 *
 * Displays one big number + label, used in the hero stats row
 * (e.g. "12,480 / DESIGNS"). Pure presentation, no state needed.
 */

export default function StatBadge({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div>
      <p className="font-display text-3xl tracking-tight sm:text-4xl">
        {value}
      </p>
      <p className="mt-1 text-xs tracking-[0.2em] text-ink-muted">{label}</p>
    </div>
  );
}
