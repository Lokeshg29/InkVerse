"use client"

import { useMemo, useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import { matchAiTattoo, AiMatchResult } from "@/lib/api";

export default function AiMatchPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<AiMatchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const selected = event.target.files?.[0] ?? null;
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setError("Please upload an image to analyze.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await matchAiTattoo(file);
      setResult(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze image.");
    } finally {
      setIsLoading(false);
    }
  }

  const elementChips = useMemo(() => {
    return result?.elements.map((item) => (
      <span key={item} className="rounded-full border border-ink-border bg-ink-black/70 px-3 py-1 text-xs uppercase tracking-[0.24em] text-ink-muted">
        {item}
      </span>
    ));
  }, [result]);

  return (
    <RequireAuth>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-ink-muted">AI tattoo matching</p>
          <h1 className="text-4xl font-semibold tracking-tight text-ink-cream sm:text-5xl">
            InkVerse AI Match
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-ink-muted">
            Upload your inspiration image and let InkVerse recommend tattoos and artists that match the style and energy.
          </p>
        </div>

        <div className="grid gap-10 xl:grid-cols-[1.4fr_0.8fr]">
          <section className="space-y-8">
            <form onSubmit={handleSubmit} className="rounded-[2rem] border border-ink-border bg-ink-surface p-8 shadow-[0_18px_80px_-50px_rgba(178,59,59,0.4)]">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-ink-muted">Upload image</p>
                  <h2 className="mt-3 text-2xl font-semibold text-ink-cream">Analyze tattoo inspiration</h2>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-ink-crimson px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
                  disabled={isLoading}
                >
                  {isLoading ? "Analyzing..." : "Analyze image"}
                </button>
              </div>

              <div className="mt-8 space-y-6">
                <label className="block text-sm text-ink-muted">
                  <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-ink-muted">Upload your reference image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full rounded-3xl border border-ink-border bg-ink-black/70 px-4 py-3 text-sm text-ink-cream outline-none transition focus:border-ink-crimson"
                  />
                </label>

                {preview && (
                  <div className="rounded-[2rem] border border-ink-border bg-ink-black/70 p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-ink-muted">Preview</p>
                    <img src={preview} alt="Uploaded preview" className="mt-4 h-auto w-full rounded-[1.5rem] object-cover" />
                  </div>
                )}

                {error && (
                  <div className="rounded-[2rem] border border-red-900/30 bg-red-950/20 p-4 text-sm text-red-200">
                    {error}
                  </div>
                )}
              </div>
            </form>

            {result && (
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-ink-border bg-ink-surface p-8">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-[2rem] border border-ink-border bg-ink-black/70 p-6">
                      <p className="text-xs uppercase tracking-[0.28em] text-ink-muted">Style</p>
                      <p className="mt-3 text-xl font-semibold text-ink-cream">{result.style}</p>
                    </div>
                    <div className="rounded-[2rem] border border-ink-border bg-ink-black/70 p-6">
                      <p className="text-xs uppercase tracking-[0.28em] text-ink-muted">Complexity</p>
                      <p className="mt-3 text-xl font-semibold text-ink-cream">{result.complexity}</p>
                    </div>
                    <div className="rounded-[2rem] border border-ink-border bg-ink-black/70 p-6">
                      <p className="text-xs uppercase tracking-[0.28em] text-ink-muted">Color type</p>
                      <p className="mt-3 text-xl font-semibold text-ink-cream">{result.colorType}</p>
                    </div>
                    <div className="rounded-[2rem] border border-ink-border bg-ink-black/70 p-6">
                      <p className="text-xs uppercase tracking-[0.28em] text-ink-muted">Elements</p>
                      <div className="mt-3 flex flex-wrap gap-2">{elementChips}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-ink-border bg-ink-surface p-8">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-ink-muted">Recommendations</p>
                      <h2 className="mt-3 text-2xl font-semibold text-ink-cream">Recommended tattoos</h2>
                    </div>
                    <p className="text-sm text-ink-muted">Based on detected style and elements.</p>
                  </div>

                  <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {result.recommendedTattoos.map((tattoo) => (
                      <article key={tattoo._id} className="overflow-hidden rounded-[2rem] border border-ink-border bg-ink-black/70">
                        <div className="relative aspect-[4/3]">
                          <img
                            src={tattoo.imageUrl}
                            alt={tattoo.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="p-5">
                          <p className="text-xs uppercase tracking-[0.28em] text-ink-muted">{tattoo.style}</p>
                          <h3 className="mt-3 text-lg font-semibold text-ink-cream">{tattoo.title}</h3>
                          <p className="mt-2 text-sm text-ink-muted">${tattoo.price?.toFixed(0) ?? '—'}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-ink-border bg-ink-surface p-8">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-ink-muted">Recommendations</p>
                      <h2 className="mt-3 text-2xl font-semibold text-ink-cream">Recommended artists</h2>
                    </div>
                    <p className="text-sm text-ink-muted">Artists matching this tattoo style.</p>
                  </div>

                  <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {result.recommendedArtists.map((artist) => (
                      <article key={artist._id} className="rounded-[2rem] border border-ink-border bg-ink-black/70 p-5">
                        <div className="flex items-start gap-4">
                          <div className="h-16 w-16 overflow-hidden rounded-[1.5rem] bg-ink-surface">
                            <img
                              src={artist.photoUrl}
                              alt={artist.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-ink-cream">{artist.name}</h3>
                            <p className="mt-1 text-sm text-ink-muted">{artist.location}</p>
                          </div>
                        </div>
                        <div className="mt-5 flex flex-wrap gap-2">
                          {artist.specialties.slice(0, 4).map((specialty) => (
                            <span key={specialty} className="rounded-full border border-ink-border bg-ink-black/70 px-3 py-1 text-xs text-ink-muted">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-ink-border bg-ink-surface p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-ink-muted">Premium AI match</p>
              <h2 className="mt-3 text-2xl font-semibold text-ink-cream">How it works</h2>
              <p className="mt-4 text-sm leading-7 text-ink-muted">
                Upload an image of the style you love, and InkVerse will analyze it using advanced vision AI to recommend tattoo designs and artists that fit your aesthetic.
              </p>
            </div>

            <div className="rounded-[2rem] border border-ink-border bg-ink-surface p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-ink-muted">Tips</p>
              <ul className="mt-5 space-y-3 text-sm text-ink-muted">
                <li>• Use a clear image with strong lines or colors.</li>
                <li>• Prefer full tattoo references or mood boards.</li>
                <li>• The AI looks for style, color type, and elements.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </RequireAuth>
  );
}
