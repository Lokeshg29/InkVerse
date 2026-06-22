"use client"

import { useEffect, useMemo, useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import { useAuth } from "@/context/AuthContext";
import { getMyBookings, MyBookingItem } from "@/lib/api";

function statusStyles(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-500/10 text-yellow-300 border-yellow-500/30";
    case "confirmed":
      return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
    case "completed":
      return "bg-sky-500/10 text-sky-300 border-sky-500/30";
    case "cancelled":
      return "bg-red-500/10 text-red-300 border-red-500/30";
    default:
      return "bg-ink-black/70 text-ink-muted border-ink-border";
  }
}

export default function MyBookingsPage() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<MyBookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let active = true;

    async function loadBookings() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getMyBookings(token);
        if (!active) return;
        setBookings(response.data);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to load bookings.");
      } finally {
        if (active) setIsLoading(false);
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

  return (
    <RequireAuth>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-ink-muted">Booking management</p>
          <h1 className="text-4xl font-semibold tracking-tight text-ink-cream sm:text-5xl">
            Your bookings
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-ink-muted">
            Track your appointments, review tattoo details, and monitor your booking status in one place.
          </p>
        </div>

        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-ink-border bg-ink-surface p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-ink-muted">Upcoming booking</p>
                  <h2 className="mt-3 text-2xl font-semibold text-ink-cream">Next appointment</h2>
                </div>
                <p className="text-sm text-ink-muted">Always stay in the loop.</p>
              </div>

              {isLoading ? (
                <div className="mt-8 space-y-4">
                  <div className="h-6 w-1/3 rounded-full bg-ink-surface/70" />
                  <div className="h-4 w-2/3 rounded-full bg-ink-surface/70" />
                  <div className="mt-4 h-40 rounded-[2rem] bg-ink-surface/70" />
                </div>
              ) : nextBooking ? (
                <div className="mt-8 rounded-[2rem] border border-ink-border bg-ink-black/70 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-ink-muted">{nextBooking.tattoo.title}</p>
                      <h3 className="mt-3 text-2xl font-semibold text-ink-cream">{nextBooking.artist.name}</h3>
                    </div>
                    <span className={`rounded-full border px-3 py-2 text-xs font-semibold tracking-[0.22em] ${statusStyles(nextBooking.status)}`}>
                      {nextBooking.status}
                    </span>
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl border border-ink-border bg-ink-surface p-5">
                      <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">Date</p>
                      <p className="mt-2 text-sm text-ink-cream">{new Date(nextBooking.date).toLocaleDateString()}</p>
                    </div>
                    <div className="rounded-3xl border border-ink-border bg-ink-surface p-5">
                      <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">Time</p>
                      <p className="mt-2 text-sm text-ink-cream">{nextBooking.timeSlot}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-8 rounded-[2rem] border border-ink-border bg-ink-black/70 p-6 text-sm text-ink-muted">
                  You have no upcoming bookings.
                </div>
              )}
            </div>

            <div className="rounded-[2rem] border border-ink-border bg-ink-surface p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-ink-muted">History</p>
                  <h2 className="mt-3 text-2xl font-semibold text-ink-cream">All bookings</h2>
                </div>
                <p className="text-sm text-ink-muted">Sorted newest first.</p>
              </div>

              {isLoading ? (
                <div className="mt-8 space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-40 rounded-[2rem] bg-ink-surface/70" />
                  ))}
                </div>
              ) : error ? (
                <div className="mt-8 rounded-[2rem] border border-red-900/30 bg-red-950/20 p-6 text-sm text-red-200">
                  {error}
                </div>
              ) : bookings.length === 0 ? (
                <div className="mt-8 rounded-[2rem] border border-ink-border bg-ink-black/70 p-6 text-sm text-ink-muted">
                  No bookings yet. Book your first tattoo to see it here.
                </div>
              ) : (
                <div className="mt-8 space-y-5">
                  {bookings.map((booking) => (
                    <article key={booking._id} className="rounded-[2rem] border border-ink-border bg-ink-black/70 p-6">
                      <div className="grid gap-6 lg:grid-cols-[0.95fr_0.5fr]">
                        <div className="flex items-center gap-4">
                          <div className="relative h-28 w-28 overflow-hidden rounded-[2rem] bg-ink-surface">
                            <img
                              src={booking.tattoo.imageUrl}
                              alt={booking.tattoo.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm uppercase tracking-[0.28em] text-ink-muted">{booking.tattoo.title}</p>
                            <h3 className="mt-2 text-xl font-semibold text-ink-cream">{booking.artist.name}</h3>
                            <p className="mt-2 text-sm text-ink-muted">{new Date(booking.date).toLocaleDateString()} · {booking.timeSlot}</p>
                          </div>
                        </div>
                        <div className="flex items-start justify-end">
                          <span className={`rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.22em] ${statusStyles(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </RequireAuth>
  );
}
