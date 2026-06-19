"use client";

/**
 * ============================================================
 * src/components/ui/TattooCard.tsx
 * ============================================================
 *
 * A single tattoo card for the Gallery (and later, Book and
 * Favorites) pages: image, style badge, favorite heart button,
 * title, artist name, style label below.
 *
 * "use client" is needed because the heart button has its own
 * local state (favorited or not) and an onClick handler.
 */

import Image from "next/image";
import { useState } from "react";
import { Tattoo } from "@/lib/types";

export default function TattooCard({ tattoo }: { tattoo: Tattoo }) {
  // Local-only favorite state for now (Phase 5 = no backend yet).
  // In Phase 6, this will be replaced by a real API call that
  // saves the favorite to the logged-in user's account.
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <div className="group overflow-hidden rounded-lg border border-ink-border bg-ink-surface transition-colors hover:border-ink-cream/30">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={tattoo.imageUrl}
          alt={tattoo.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Style badge - top left */}
        <span className="absolute left-3 top-3 rounded-full bg-ink-black/80 px-3 py-1 text-[11px] font-medium tracking-wide text-ink-cream">
          {tattoo.style}
        </span>

        {/* Favorite heart button - top right */}
        <button
          onClick={(e) => {
            // Stop the click from also triggering a parent link
            // navigation, in case this card is ever wrapped in a Link.
            e.preventDefault();
            setIsFavorited(!isFavorited);
          }}
          aria-label={
            isFavorited ? "Remove from favorites" : "Add to favorites"
          }
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-ink-black/80 text-ink-cream transition-colors hover:bg-ink-black"
        >
          <HeartIcon filled={isFavorited} />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-display text-base">{tattoo.title}</h3>
        <p className="mt-1 text-sm text-ink-muted">
          by {tattoo.artist.name} · {tattoo.style}
        </p>
      </div>
    </div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      className={filled ? "text-ink-crimson-bright" : ""}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
