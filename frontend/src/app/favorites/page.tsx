"use client"

import { useEffect } from "react";
import Link from "next/link";
import RequireAuth from "@/components/auth/RequireAuth";
import TattooCard from "@/components/ui/TattooCard";
import { useAuth } from "@/context/AuthContext";

export default function FavoritesPage() {
  const {
    favoriteTattoos,
    favoritesLoaded,
    loadFavorites,
    loading,
  } = useAuth();

  useEffect(() => {
    if (!favoritesLoaded && !loading) {
      loadFavorites().catch((err) => console.error(err));
    }
  }, [favoritesLoaded, loading, loadFavorites]);

  const isLoading = loading || !favoritesLoaded;

  return (
    <RequireAuth>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.35em] text-ink-muted">Favorites</p>
          <h1 className="mt-3 text-4xl font-bold">Saved ink stories</h1>
          <p className="mt-4 max-w-2xl text-sm text-ink-muted">
            Your saved tattoo ideas and preferred artists appear here so you can pick the next session with confidence.
          </p>
        </div>

        {isLoading ? (
          <div className="rounded-[2rem] border border-red-900/30 bg-ink-surface/70 p-12 text-center">
            <p className="text-sm text-ink-muted">Loading your favorites…</p>
          </div>
        ) : favoriteTattoos.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {favoriteTattoos.map((tattoo) => (
              <TattooCard key={tattoo.id} tattoo={tattoo} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-ink-border bg-ink-surface/80 p-12 text-center">
            <p className="text-sm text-ink-muted">No favorites yet.</p>
            <Link
              href="/gallery"
              className="mt-6 inline-flex rounded-md bg-ink-cream px-6 py-3 text-sm font-semibold text-ink-black transition hover:bg-ink-cream/90"
            >
              Explore the gallery
            </Link>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}
