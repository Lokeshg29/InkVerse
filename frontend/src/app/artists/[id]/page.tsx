"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SpecialtyBadge from "@/components/ui/SpecialtyBadge";
import { getArtistById } from "@/lib/api";
import { Artist } from "@/lib/types";

export default function ArtistDetailPage() {
  const params = useParams();

  const artistId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : undefined;

  const [artist, setArtist] = useState<Artist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!artistId) {
      setError("Artist not found.");
      setIsLoading(false);
      return;
    }

    async function loadArtist() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getArtistById(artistId!);

        const normalizedArtist: Artist = {
        ...response.data,
         id: response.data._id || response.data.id || "",
        };

        setArtist(normalizedArtist);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load artist profile. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadArtist();
  }, [artistId]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-[2rem] border border-ink-border bg-ink-surface px-8 py-16 text-center text-sm text-ink-muted">
          Loading artist profile...
        </div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-[2rem] border border-ink-border bg-ink-surface px-8 py-16 text-center text-sm text-ink-crimson-bright">
          {error || "Artist profile could not be found."}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-[420px_minmax(0,1fr)] lg:items-start">
        <div className="overflow-hidden rounded-[2rem] border border-ink-border bg-ink-surface shadow-[0_40px_120px_-90px_rgba(0,0,0,0.8)]">
          <div className="relative aspect-[4/5] w-full">
            <Image
              src={artist.photoUrl}
              alt={artist.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 420px"
            />
          </div>
          <div className="space-y-5 p-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
                Artist profile
              </p>
              <h1 className="mt-4 font-display text-4xl text-ink-cream">
                {artist.name}
              </h1>
            </div>

            <div className="space-y-4 text-sm text-ink-muted">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-ink-muted">
                  Location
                </p>
                <p className="mt-2 text-ink-cream">{artist.location}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-ink-border bg-ink-black/70 px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-ink-muted">
                    Rating
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-ink-cream">
                    {artist.rating.toFixed(1)} ★
                  </p>
                </div>
                <div className="rounded-3xl border border-ink-border bg-ink-black/70 px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-ink-muted">
                    Experience
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-ink-cream">
                    {artist.experienceYears} years
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <section className="rounded-[2rem] border border-ink-border bg-ink-surface p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
              About
            </p>
            <p className="mt-5 text-sm leading-7 text-ink-cream">
              {artist.bio}
            </p>
          </section>

          <section className="rounded-[2rem] border border-ink-border bg-ink-surface p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
              Specialties
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {artist.specialties.length > 0 ? (
                artist.specialties.map((specialty) => (
                  <SpecialtyBadge key={specialty} specialty={specialty} />
                ))
              ) : (
                <span className="rounded-full border border-ink-border bg-ink-black/60 px-3 py-1 text-xs uppercase tracking-[0.24em] text-ink-muted">
                  No specialties listed
                </span>
              )}
            </div>
          </section>
        </div>
      </div>

      <section className="mt-10 rounded-[2rem] border border-ink-border bg-ink-surface p-8 text-sm text-ink-muted">
        <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
          Artist portfolio
        </p>
        <p className="mt-4 text-ink-cream">
          Artist portfolio coming soon.
        </p>
      </section>
    </div>
  );
}
