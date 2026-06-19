/**
 * ============================================================
 * src/components/layout/Footer.tsx
 * ============================================================
 *
 * The shared footer shown on every page: tagline on the left,
 * Explore and Account link columns, copyright line at the bottom.
 *
 * No "use client" needed here - this component has no state or
 * event handlers, so it can stay a Server Component (the default).
 * Server Components are slightly more efficient since their code
 * never has to be sent to the browser as JavaScript.
 */

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-ink-border">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Tagline column */}
          <div>
            <p className="font-tagline text-2xl italic leading-snug text-ink-cream">
              Where every tattoo
              <br />
              tells a story.
            </p>
            <p className="mt-4 max-w-xs text-sm text-ink-muted">
              An atlas of ink, artists and AI-curated direction. Built for
              collectors and first-timers alike.
            </p>
          </div>

          {/* Explore links */}
          <div>
            <h3 className="font-display text-sm tracking-wide">Explore</h3>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-ink-muted">
              <li>
                <Link href="/gallery" className="hover:text-ink-cream">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/artists" className="hover:text-ink-cream">
                  Artists
                </Link>
              </li>
              <li>
                <Link href="/ai-match" className="hover:text-ink-cream">
                  AI Match
                </Link>
              </li>
            </ul>
          </div>

          {/* Account links */}
          <div>
            <h3 className="font-display text-sm tracking-wide">Account</h3>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-ink-muted">
              <li>
                <Link href="/login" className="hover:text-ink-cream">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-ink-cream">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-ink-border pt-6 text-xs text-ink-muted sm:flex-row sm:items-center">
          <span>&copy; {new Date().getFullYear()} INK/VERSE</span>
        </div>
      </div>
    </footer>
  );
}
