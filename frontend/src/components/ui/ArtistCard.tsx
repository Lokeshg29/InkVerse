"use client";

import Image from "next/image";
import Link from "next/link";
import SpecialtyBadge from "@/components/ui/SpecialtyBadge";
import { Artist } from "@/lib/types";

export default function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <Link
      href={`/artists/${artist.id}`}
      className="group block overflow-hidden rounded-[2rem] border border-ink-border bg-ink-surface transition duration-300 hover:-translate-y-1 hover:border-ink-crimson/40 hover:shadow-[0_18px_70px_-50px_rgba(178,59,59,0.55)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-ink-black">
        <Image
          src={artist.photoUrl}
          alt={artist.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-black/95 to-transparent px-4 pb-4 pt-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-ink-muted">Artist</p>
          <h3 className="mt-2 font-display text-2xl text-ink-cream">{artist.name}</h3>
        </div>
      </div>

      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm text-ink-muted">{artist.location}</p>
            <p className="text-sm text-ink-cream">{artist.experienceYears} years experience</p>
          </div>
          <div className="rounded-full bg-ink-black/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-ink-cream">
            {artist.rating.toFixed(1)} ★
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {artist.specialties.map((specialty) => (
            <SpecialtyBadge key={specialty} specialty={specialty} />
          ))}
        </div>
      </div>
    </Link>
  );
}
