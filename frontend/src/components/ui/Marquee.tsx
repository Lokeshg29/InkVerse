"use client";

/**
 * ============================================================
 * src/components/ui/Marquee.tsx
 * ============================================================
 *
 * A horizontally scrolling strip of style names (e.g. "BLACKWORK",
 * "FINELINE"), separated by small diamond dots. Hovering a word
 * highlights it with a crimson pill background - matching the
 * reference design's interactive marquee.
 *
 * "use client" is required because hover-tracking state
 * (which word is currently hovered) needs React state + events.
 */

import { useState } from "react";

export default function Marquee({ words }: { words: string[] }) {
  return (
    <div className="overflow-hidden border-y border-ink-border bg-ink-surface py-5">
      <div className="flex w-max animate-marquee">
        <MarqueeContent words={words} />
        <MarqueeContent words={words} />
      </div>
    </div>
  );
}

function MarqueeContent({ words }: { words: string[] }) {
  // Track which word (by its unique key) is currently hovered.
  // We store a composite key "repeatIndex-wordIndex" since the
  // same word list repeats multiple times in the strip.
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  return (
    <div className="flex shrink-0 items-center gap-8 pr-8">
      {Array.from({ length: 3 }).map((_, repeatIndex) =>
        words.map((word, wordIndex) => {
          const key = `${repeatIndex}-${wordIndex}`;
          const isHovered = hoveredKey === key;

          return (
            <div key={key} className="flex shrink-0 items-center gap-8">
              <span
                onMouseEnter={() => setHoveredKey(key)}
                onMouseLeave={() => setHoveredKey(null)}
                className={`cursor-default rounded-full px-4 py-1.5 font-display text-lg tracking-wide transition-colors sm:text-xl ${
                  isHovered
                    ? "bg-ink-crimson text-ink-cream"
                    : "text-ink-cream"
                }`}
              >
                {word}
              </span>
              <span
                className={`h-1.5 w-1.5 shrink-0 rotate-45 ${
                  wordIndex % 2 === 0 ? "bg-ink-crimson-bright" : "bg-ink-cyan"
                }`}
              />
            </div>
          );
        })
      )}
    </div>
  );
}
