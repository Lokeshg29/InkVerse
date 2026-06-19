"use client";

/**
 * ============================================================
 * src/components/ui/FilterPills.tsx
 * ============================================================
 *
 * A horizontal row of selectable pill buttons (All, Traditional,
 * Anime, ...). Exactly one can be active at a time. The parent
 * page owns which one is selected (passed in as `selected`) and
 * is told when the user picks a new one (via `onSelect`).
 */

export default function FilterPills({
  options,
  selected,
  onSelect,
}: {
  options: readonly string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = option === selected;
        return (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "border-ink-crimson bg-ink-crimson text-ink-cream"
                : "border-ink-border text-ink-muted hover:border-ink-cream/30 hover:text-ink-cream"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
