"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTattooById, TattooApiItem, TattooResponse } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function TattooDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { token, favoriteIds, addFavorite, removeFavorite } = useAuth();
  const id = params?.id as string | undefined;
  const [tattoo, setTattoo] = useState<TattooApiItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const isFavorited = tattoo ? favoriteIds.includes(tattoo.id) : false;

  useEffect(() => {
    if (!id) {
      setError("Tattoo not found.");
      setIsLoading(false);
      return;
    }

    let active = true;
    setIsLoading(true);
    setError(null);

    getTattooById(id)
      .then((response: TattooResponse) => {
        if (!active) return;
        const normalizedTattoo: TattooApiItem = {
          ...response.data,
          id: response.data._id ?? response.data.id,
        } as TattooApiItem;

        setTattoo(normalizedTattoo);
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load this tattoo. Please try again."
        );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  async function handleFavorite() {
    if (!tattoo) return;
    if (!token) {
      router.push("/login");
      return;
    }

    setIsUpdating(true);
    try {
      if (isFavorited) {
        await removeFavorite(tattoo.id);
      } else {
        await addFavorite(tattoo);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-[420px] rounded-[2rem] bg-ink-surface/70 border border-red-900/30" />
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              <div className="h-10 w-3/5 rounded-full bg-ink-surface/70" />
              <div className="h-8 w-1/4 rounded-full bg-ink-surface/70" />
              <div className="h-3 w-full rounded-full bg-ink-surface/70" />
              <div className="h-3 w-full rounded-full bg-ink-surface/70" />
              <div className="h-3 w-4/5 rounded-full bg-ink-surface/70" />
            </div>
            <div className="rounded-[2rem] border border-red-900/30 bg-ink-surface/70 p-6">
              <div className="h-10 w-2/3 rounded-full bg-ink-surface/70" />
              <div className="mt-6 h-12 w-full rounded-full bg-ink-surface/70" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tattoo) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-[2rem] border border-red-900/30 bg-ink-surface p-10 text-center">
          <h1 className="text-3xl font-semibold">Tattoo not found</h1>
          <p className="mt-4 text-sm text-ink-muted">
            We couldn’t find that design. Try browsing the gallery or check a different tattoo link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-[1.7fr_0.9fr]">
        <section className="space-y-8">
          <div className="overflow-hidden rounded-[2rem] border border-red-900/40 bg-ink-surface shadow-[0_20px_80px_-45px_rgba(178,59,59,0.6)]">
            <div className="relative aspect-[4/3] sm:aspect-[16/9]">
              <Image
                src={tattoo.imageUrl}
                alt={tattoo.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 900px"
              />
            </div>
            <div className="space-y-4 p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-red-900/40 bg-ink-black/80 px-4 py-2 text-xs uppercase tracking-[0.32em] text-ink-cream">
                  {tattoo.style}
                </span>
                <span className="rounded-full bg-ink-black/80 px-4 py-2 text-xs font-semibold text-ink-cream">
                  ${tattoo.price.toFixed(0)}
                </span>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <h1 className="text-4xl font-semibold tracking-tight text-ink-cream">
                    {tattoo.title}
                  </h1>
                  <p className="text-sm uppercase tracking-[0.35em] text-ink-muted">
                    by {tattoo.artist.name}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleFavorite}
                  disabled={isUpdating}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold transition ${
                    isFavorited
                      ? "border-red-700 bg-ink-black text-ink-crimson-bright"
                      : "border-ink-border bg-ink-black text-ink-cream hover:border-red-700"
                  }`}
                >
                  <HeartIcon filled={isFavorited} />
                  {isFavorited ? "Favorited" : "Add to favorites"}
                </button>
              </div>

              {tattoo.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tattoo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-red-900/40 bg-ink-black/80 px-3 py-1 text-xs uppercase tracking-[0.22em] text-ink-cream"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-ink-border bg-ink-surface p-8">
            <h2 className="text-2xl font-semibold">Details</h2>
            <p className="mt-4 text-sm leading-7 text-ink-muted">
              {tattoo.description}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-red-900/30 bg-ink-black/60 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">Style</p>
                <p className="mt-2 text-sm text-ink-cream">{tattoo.style}</p>
              </div>
              <div className="rounded-3xl border border-red-900/30 bg-ink-black/60 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">Artist</p>
                <p className="mt-2 text-sm text-ink-cream">{tattoo.artist.name}</p>
                <p className="mt-1 text-sm text-ink-muted">Trusted studio specialist.</p>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-red-900/40 bg-ink-surface p-8 shadow-[0_18px_80px_-50px_rgba(178,59,59,0.65)]">
            <p className="text-xs uppercase tracking-[0.32em] text-ink-muted">Price</p>
            <p className="mt-3 text-4xl font-semibold text-ink-cream">
              ${tattoo.price.toFixed(0)}
            </p>

            <button
              type="button"
              onClick={handleFavorite}
              disabled={isUpdating}
              className={`mt-6 flex w-full items-center justify-center gap-3 rounded-full border px-4 py-3 text-sm font-semibold transition ${
                isFavorited
                  ? "border-red-700 bg-ink-black text-ink-crimson-bright"
                  : "border-ink-border bg-ink-black text-ink-cream hover:border-red-700"
              }`}
            >
              <HeartIcon filled={isFavorited} />
              {isFavorited ? "Favorited" : "Favorite this tattoo"}
            </button>

            <button
              type="button"
              onClick={() => {
                if (!tattoo) return;
                router.push(`/booking/${tattoo._id ?? tattoo.id}`);
              }}
              className="mt-4 w-full rounded-full bg-ink-crimson px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Book This Tattoo
            </button>
          </div>

          <div className="rounded-[2rem] border border-ink-border bg-ink-surface p-8">
            <h3 className="text-xl font-semibold">Artist Info</h3>
            <p className="mt-4 text-sm text-ink-muted">
              {tattoo.artist.name} brings curated style, technical precision, and bold visual storytelling to every piece.
            </p>
            <p className="mt-4 text-sm text-ink-cream">Ready for your next session.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="18"
      height="18"
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
