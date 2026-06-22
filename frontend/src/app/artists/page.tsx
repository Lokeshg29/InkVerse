"use client";

import { useEffect, useState } from "react";
import ArtistCard from "@/components/ui/ArtistCard";
import { getArtists } from "@/lib/api";
import { Artist } from "@/lib/types";

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadArtists() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getArtists();
        const normalizedArtists: Artist[] = response.data.map((artist) => ({
          ...artist,
          id: artist._id ?? artist.id,
        }));

        setArtists(normalizedArtists);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load artists. Please try again."
        );
        setArtists([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadArtists();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
          studio roster
        </p>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl">
          Discover the <span className="text-ink-crimson-bright">artists</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-ink-muted">
          Browse trusted tattoo experts, their specialty styles, and the
          experience that makes each artist unforgettable.
        </p>
      </div>

      {error ? (
        <div className="mt-10 rounded-[2rem] border border-ink-border bg-ink-surface px-8 py-8 text-center text-sm text-ink-crimson-bright">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="mt-16 rounded-[2rem] border border-ink-border bg-ink-surface px-8 py-16 text-center text-sm text-ink-muted">
          Loading artists...
        </div>
      ) : artists.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-[2rem] border border-ink-border bg-ink-surface px-8 py-16 text-center text-sm text-ink-muted">
          No artists available right now. Check back later.
        </div>
      )}
    </div>
  );
}
