"use client";

/**
 * ============================================================
 * src/components/layout/Navbar.tsx
 * ============================================================
 *
 * The shared navigation bar shown on every page. Matches the
 * design reference: logo on the left, nav links in the center,
 * favorites icon + "BOOK / SIGN IN" button on the right.
 *
 * "use client" is required because this component uses useState
 * (for the mobile menu) and usePathname (to highlight the active
 * link) - both only work in the browser, not on the server.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

// Defining our nav links as data, not hardcoded JSX, means adding
// a new page later is just adding one line to this array.
const NAV_LINKS = [
  { label: "Gallery", href: "/gallery" },
  { label: "Favorites", href: "/favorites" },
  { label: "Artists", href: "/artists" },
  { label: "AI Match", href: "/ai-match" },
];

export default function Navbar() {
  // usePathname() returns the CURRENT URL path, e.g. "/gallery".
  // We use this to highlight whichever nav link matches where the
  // user currently is.
  const pathname = usePathname();

  // State for the mobile hamburger menu - starts closed.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user } = useAuth();
  const navLinks = user
    ? [...NAV_LINKS, { label: "Bookings", href: "/bookings" }]
    : NAV_LINKS;

  return (
    <header className="sticky top-0 z-50 border-b border-ink-border bg-ink-black/95 backdrop-blur-sm">
      {/* Thin status bar - studio status, issue info, current date */}
      <div className="hidden items-center justify-between border-b border-ink-border px-6 py-2 text-[11px] tracking-wide text-ink-muted sm:flex">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-ink-crimson-bright" />
          STUDIO ONLINE
        </span>
        <span>EST. 2025 · VOL. 01 · INK ATLAS</span>
        <span>
          {new Date().toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>

      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-crimson text-sm font-bold text-ink-cream shadow-[0_0_0_0_rgba(178,59,59,0.4)] transition-shadow hover:shadow-[0_0_16px_2px_rgba(178,59,59,0.4)]">
            IV
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg tracking-tight">
              INK/VERSE
            </span>
            <span className="text-[10px] tracking-[0.2em] text-ink-muted">
              TATTOO · ATLAS
            </span>
          </span>
        </Link>

        {/* Desktop nav links - hidden on small screens */}
        <ul className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-ink-crimson text-ink-cream"
                      : "text-ink-muted hover:text-ink-cream"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side: favorites icon + auth button */}
        <AuthButtons />

        {/* Mobile hamburger button - only visible on small screens */}
        <button
          className="text-ink-cream md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <MenuIcon />
        </button>
      </nav>

      {/* Mobile menu - only renders when isMobileMenuOpen is true */}
      {isMobileMenuOpen && (
        <div className="border-t border-ink-border px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-sm font-medium text-ink-cream"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <AuthMobileLinks onClose={() => setIsMobileMenuOpen(false)} />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

function AuthButtons() {
  const { user, logout } = useAuth();

  if (user) {
    return (
      <div className="hidden items-center gap-4 md:flex">
        <Link href="/favorites" aria-label="View favorites" className="text-ink-muted transition-colors hover:text-ink-cream">
          <HeartIcon />
        </Link>
        <Link href="/dashboard" className="text-ink-muted hover:text-ink-cream">
          Dashboard
        </Link>
        <button onClick={() => logout()} className="rounded-md border border-ink-cream/20 px-4 py-2 text-xs font-semibold tracking-wide text-ink-cream transition-colors hover:bg-ink-cream hover:text-ink-black">
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-4 md:flex">
      <Link href="/favorites" aria-label="View favorites" className="text-ink-muted transition-colors hover:text-ink-cream">
        <HeartIcon />
      </Link>
      <Link href="/login" className="rounded-md border border-ink-cream/20 px-4 py-2 text-xs font-semibold tracking-wide text-ink-cream transition-colors hover:bg-ink-cream hover:text-ink-black">
        BOOK / SIGN IN
      </Link>
    </div>
  );
}

// Small inline SVG icons - simple enough not to need an icon library.
function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function AuthMobileLinks({ onClose }: { onClose: () => void }) {
  const { user, logout } = useAuth();

  if (user) {
    return (
      <div className="flex flex-col gap-3">
        <Link
          href="/dashboard"
          onClick={onClose}
          className="block rounded-md border border-ink-cream/20 px-4 py-2 text-center text-sm font-semibold text-ink-cream transition-colors hover:bg-ink-cream hover:text-ink-black"
        >
          Dashboard
        </Link>
        <button
          type="button"
          onClick={() => {
            logout();
            onClose();
          }}
          className="block rounded-md border border-ink-cream/20 px-4 py-2 text-center text-sm font-semibold text-ink-cream transition-colors hover:bg-ink-cream hover:text-ink-black"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      onClick={onClose}
      className="mt-2 block rounded-md border border-ink-cream/20 px-4 py-2 text-center text-xs font-semibold tracking-wide text-ink-cream transition-colors hover:bg-ink-cream hover:text-ink-black"
    >
      BOOK / SIGN IN
    </Link>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
