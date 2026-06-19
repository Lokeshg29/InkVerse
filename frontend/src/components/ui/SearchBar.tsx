/**
 * ============================================================
 * src/components/ui/SearchBar.tsx
 * ============================================================
 *
 * A controlled text input for searching tattoos/artists.
 * "Controlled" means React's state IS the source of truth for
 * the input's value - we pass `value` AND `onChange` so the
 * parent page decides what happens as the user types.
 */

"use client";

export default function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted">
        <SearchIcon />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-ink-border bg-ink-surface py-3 pl-12 pr-4 text-sm text-ink-cream placeholder:text-ink-muted focus:border-ink-crimson focus:outline-none"
      />
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
