"use client"

import { useEffect, useMemo, useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import TattooCard from "@/components/ui/TattooCard";
import { useAuth } from "@/context/AuthContext";
import { getMyBookings, MyBookingItem } from "@/lib/api";
import { mockTattoos } from "@/lib/mockData";

function DashboardStatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[2rem] border border-red-900/30 bg-ink-surface p-6 shadow-[0_16px_40px_-30px_rgba(178,59,59,0.6)]">
      <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">{label}</p>
      <p className="mt-4 text-4xl font-semibold text-ink-cream">{value}</p>
    </div>
  );
}

function BookingCard({ tattoo, artist, date, status }: { tattoo: string; artist: string; date: string; status: string }) {
  const statusClass =
    status === "Confirmed"
      ? "text-ink-cream bg-ink-black/70"
      : "text-ink-muted bg-ink-black/60";

  return (
    <div className="rounded-[2rem] border border-ink-border bg-ink-surface p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-ink-muted">Upcoming booking</p>
          <h3 className="mt-3 text-xl font-semibold text-ink-cream">{tattoo}</h3>
          <p className="mt-2 text-sm text-ink-muted">Artist: {artist}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold tracking-[0.2em] ${statusClass}`}>
          {status}
        </span>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-ink-muted">
        <span className="rounded-full border border-ink-border px-3 py-2">{date}</span>
        <span className="rounded-full border border-ink-border px-3 py-2">Session 2h</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, favoriteTattoos, favoritesLoaded, logout, token } = useAuth();
  const [bookings, setBookings] = useState<MyBookingItem[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  const favoriteArtistCount = useMemo(
    () => new Set(favoriteTattoos.map((tattoo) => tattoo.artist.name)).size,
    [favoriteTattoos]
  );

  const recentFavorites = favoriteTattoos.length > 0 ? favoriteTattoos.slice(0, 4) : mockTattoos.slice(0, 4);
  const recommendedDesigns = mockTattoos.slice(4, 8);

  useEffect(() => {
    if (!token) return;

    let active = true;

    async function loadBookings() {
      setBookingsLoading(true);
      setBookingsError(null);

      try {
        const response = await getMyBookings(token);
        if (!active) return;
        setBookings(response.data);
      } catch (err) {
        if (!active) return;
        setBookingsError(err instanceof Error ? err.message : "Unable to load bookings.");
      } finally {
        if (active) setBookingsLoading(false);
      }
    }

    loadBookings();

    return () => {
      active = false;
    };
  }, [token]);

  const nextBooking = useMemo(() => {
    const upcoming = bookings
      .filter((booking) => booking.status !== "cancelled")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return upcoming[0] ?? null;
  }, [bookings]);

  const bookingCount = bookings.length;

  function statusStyles(status: string) {
    switch (status) {
      case "pending":
        return "text-amber-300 bg-amber-500/10 border-amber-500/30";
      case "confirmed":
        return "text-emerald-300 bg-emerald-500/10 border-emerald-500/30";
      case "completed":
        return "text-sky-300 bg-sky-500/10 border-sky-500/30";
      case "cancelled":
        return "text-red-300 bg-red-500/10 border-red-500/30";
      default:
        return "text-ink-muted bg-ink-black/70 border-ink-border";
    }
  }

  return (
    <RequireAuth>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.35em] text-ink-muted">Premium dashboard</p>
          <h1 className="mt-3 text-5xl font-semibold tracking-tight text-ink-cream sm:text-6xl">
            {user?.name ? `Welcome back, ${user.name}` : "Welcome back"}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-ink-muted">
            Your tattoo journey in one place — saved looks, upcoming sessions, and curated designs tailored for your next appointment.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.7fr_0.95fr]">
          <div className="space-y-8">
            <div className="grid gap-5 md:grid-cols-3">
              <DashboardStatCard
                label="Saved Tattoos"
                value={favoritesLoaded ? String(favoriteTattoos.length) : "..."}
              />
              <DashboardStatCard label="Bookings" value={bookingsLoading ? "..." : String(bookingCount)} />
              <DashboardStatCard label="Favorite Artists" value={favoritesLoaded ? String(favoriteArtistCount) : "..."} />
            </div>

            <section className="rounded-[2rem] border border-red-900/30 bg-ink-surface p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-ink-muted">Recent Favorites</p>
                  <h2 className="mt-3 text-2xl font-semibold text-ink-cream">Saved looks you love</h2>
                </div>
                <p className="text-sm text-ink-muted">Updated as you favorite new designs.</p>
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {recentFavorites.map((tattoo) => (
                  <TattooCard key={tattoo.id} tattoo={tattoo} />
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-ink-muted">Upcoming Booking</p>
                  <h2 className="mt-3 text-2xl font-semibold text-ink-cream">Next appointment</h2>
                </div>
                <p className="text-sm text-ink-muted">Stay on top of your session.</p>
              </div>

              {bookingsLoading ? (
                <div className="mt-6 rounded-[2rem] border border-ink-border bg-ink-black/70 p-6 text-sm text-ink-muted">
                  Loading upcoming bookings...
                </div>
              ) : nextBooking ? (
                <BookingCard
                  tattoo={nextBooking.tattoo.title}
                  artist={nextBooking.artist.name}
                  date={new Date(nextBooking.date).toLocaleDateString()}
                  status={nextBooking.status}
                />
              ) : (
                <div className="mt-6 rounded-[2rem] border border-ink-border bg-ink-black/70 p-6 text-sm text-ink-muted">
                  You have no upcoming bookings.
                </div>
              )}
            </section>

            <section className="rounded-[2rem] border border-red-900/30 bg-ink-surface p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-ink-muted">Recommended Designs</p>
                  <h2 className="mt-3 text-2xl font-semibold text-ink-cream">Curated for your next project</h2>
                </div>
                <p className="text-sm text-ink-muted">Fresh picks from our gallery.</p>
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {recommendedDesigns.map((tattoo) => (
                  <TattooCard key={tattoo.id} tattoo={tattoo} />
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-red-900/30 bg-ink-surface p-8 shadow-[0_18px_80px_-50px_rgba(178,59,59,0.65)]">
              <p className="text-sm uppercase tracking-[0.3em] text-ink-muted">Profile</p>
              <h2 className="mt-3 text-3xl font-semibold text-ink-cream">{user?.name ?? "Artist"}</h2>
              <p className="mt-2 text-sm text-ink-muted">{user?.email ?? "No email available"}</p>

              <div className="mt-8 space-y-4 rounded-3xl bg-ink-black/70 p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">Member since</p>
                  <p className="mt-2 text-sm text-ink-cream">2025</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">Next session</p>
                  <p className="mt-2 text-sm text-ink-cream">Jul 12, 2026 · Confirmed</p>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="mt-4 w-full rounded-full bg-ink-crimson px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-ink-border bg-ink-surface p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-ink-muted">Activity</p>
              <div className="mt-5 space-y-4 text-sm text-ink-muted">
                <p>• 3 bookings scheduled</p>
                <p>• {favoriteTattoos.length} saved tattoos</p>
                <p>• {favoriteArtistCount} favorite artists</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </RequireAuth>
  );
}
