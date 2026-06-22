"use client"

import Image from "next/image";
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useParams } from "next/navigation";
import RequireAuth from "@/components/auth/RequireAuth";
import { useAuth } from "@/context/AuthContext";
import { createBooking, getTattooById, TattooApiItem, TattooResponse } from "@/lib/api";

export default function BookingDetailsPage() {
    const params = useParams();
    const { user, token } = useAuth();
    const id = params?.id as string | undefined;
    const [tattoo, setTattoo] = useState<TattooApiItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);
    const [formData, setFormData] = useState({
        name: user?.name ?? "",
        email: user?.email ?? "",
        date: minDate,
        time: "12:00",
        notes: "",
    });

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
                setError(err instanceof Error ? err.message : "Unable to load tattoo details.");
            })
            .finally(() => {
                if (active) setIsLoading(false);
            });

        return () => {
            active = false;
        };
    }, [id]);

    function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    }

    function validateForm() {
        if (!formData.name.trim() || !formData.email.trim() || !formData.date || !formData.time) {
            setError("Please complete all required booking details.");
            return false;
        }

        const chosenDate = new Date(formData.date);
        const today = new Date(minDate);

        if (chosenDate < today) {
            setError("Preferred date cannot be in the past.");
            return false;
        }

        setError(null);
        return true;
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!validateForm()) return;
        if (!token || !tattoo) {
            setError("Authentication and tattoo details are required to book an appointment.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const tattooId = tattoo._id ?? tattoo.id;
            const artistId = tattoo.artist._id ?? tattoo.artist.id;

            if (!tattooId || !artistId) {
                setError("Booking failed because the tattoo or artist ID is missing.");
                return;
            }

            await createBooking(
                {
                    tattoo: tattooId,
                    artist: artistId,
                    date: formData.date,
                    timeSlot: formData.time,
                    notes: formData.notes,
                },
                token
            );
            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to submit booking. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    const price = tattoo?.price ?? 0;
    const deposit = Math.round(price * 0.3);
    const bookingDuration = "2 hours";

    return (
        <RequireAuth>
            <div className="mx-auto max-w-7xl px-6 py-16">
                <div className="mb-10 space-y-3">
                    <p className="text-sm uppercase tracking-[0.35em] text-ink-muted">Premium booking</p>
                    <h1 className="text-4xl font-semibold tracking-tight text-ink-cream sm:text-5xl">
                        Confirm your tattoo session.
                    </h1>
                    <p className="max-w-3xl text-sm leading-7 text-ink-muted">
                        Pick your preferred date, time, and notes to reserve a premium InkVerse appointment.
                    </p>
                </div>

                {isLoading ? (
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
                            <div className="rounded-[2rem] border border-red-900/30 bg-ink-surface/70 p-6" />
                        </div>
                    </div>
                ) : error || !tattoo ? (
                    <div className="rounded-[2rem] border border-red-900/30 bg-ink-surface p-10 text-center">
                        <h1 className="text-3xl font-semibold">Unable to load booking details</h1>
                        <p className="mt-4 text-sm text-ink-muted">{error ?? "This tattoo could not be found."}</p>
                    </div>
                ) : (
                    <div className="grid gap-10 xl:grid-cols-[1.7fr_0.9fr]">
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

                                    <div className="space-y-3">
                                        <h2 className="text-4xl font-semibold tracking-tight text-ink-cream">
                                            {tattoo.title}
                                        </h2>
                                        <p className="text-sm uppercase tracking-[0.35em] text-ink-muted">
                                            by {tattoo.artist.name}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[2rem] border border-ink-border bg-ink-surface p-8">
                                <h3 className="text-xl font-semibold text-ink-cream">Tattoo summary</h3>
                                <p className="mt-4 text-sm leading-7 text-ink-muted">
                                    Reserve this premium design with your preferred date, time, and studio notes.
                                </p>

                                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-3xl border border-red-900/30 bg-ink-black/60 p-5">
                                        <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">Style</p>
                                        <p className="mt-2 text-sm text-ink-cream">{tattoo.style}</p>
                                    </div>
                                    <div className="rounded-3xl border border-red-900/30 bg-ink-black/60 p-5">
                                        <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">Artist</p>
                                        <p className="mt-2 text-sm text-ink-cream">{tattoo.artist.name}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="space-y-8">
                            <form
                                onSubmit={handleSubmit}
                                className="rounded-[2rem] border border-red-900/40 bg-ink-surface p-8 shadow-[0_18px_80px_-50px_rgba(178,59,59,0.65)]"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm uppercase tracking-[0.3em] text-ink-muted">Booking form</p>
                                        <h2 className="mt-3 text-2xl font-semibold text-ink-cream">Reserve your session</h2>
                                    </div>
                                    <span className="rounded-full border border-ink-border bg-ink-black/60 px-3 py-2 text-xs uppercase tracking-[0.24em] text-ink-muted">
                                        {success ? "Confirmed" : "New request"}
                                    </span>
                                </div>

                                {success && (
                                    <div className="mt-6 rounded-3xl border border-ink-border bg-ink-black/70 p-5 text-sm text-ink-cream">
                                        <p className="font-semibold text-ink-cream">Booking request sent.</p>
                                        <p className="mt-2 text-ink-muted">
                                            We received your preferred session details. A member of InkVerse will confirm availability shortly.
                                        </p>
                                    </div>
                                )}

                                <div className="mt-8 space-y-6">
                                    <label className="block text-sm text-ink-muted">
                                        <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-ink-muted">Name</span>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Your full name"
                                            className="mt-2 w-full rounded-3xl border border-ink-border bg-ink-black/70 px-4 py-3 text-sm text-ink-cream outline-none transition focus:border-ink-crimson"
                                            required
                                        />
                                    </label>

                                    <label className="block text-sm text-ink-muted">
                                        <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-ink-muted">Email</span>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="you@example.com"
                                            className="mt-2 w-full rounded-3xl border border-ink-border bg-ink-black/70 px-4 py-3 text-sm text-ink-cream outline-none transition focus:border-ink-crimson"
                                            required
                                        />
                                    </label>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <label className="block text-sm text-ink-muted">
                                            <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-ink-muted">Preferred Date</span>
                                            <input
                                                type="date"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleChange}
                                                min={minDate}
                                                className="mt-2 w-full rounded-3xl border border-ink-border bg-ink-black/70 px-4 py-3 text-sm text-ink-cream outline-none transition focus:border-ink-crimson"
                                                required
                                            />
                                        </label>

                                        <label className="block text-sm text-ink-muted">
                                            <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-ink-muted">Preferred Time</span>
                                            <input
                                                type="time"
                                                name="time"
                                                value={formData.time}
                                                onChange={handleChange}
                                                className="mt-2 w-full rounded-3xl border border-ink-border bg-ink-black/70 px-4 py-3 text-sm text-ink-cream outline-none transition focus:border-ink-crimson"
                                                required
                                            />
                                        </label>
                                    </div>

                                    <label className="block text-sm text-ink-muted">
                                        <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-ink-muted">Notes</span>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleChange}
                                            rows={5}
                                            placeholder="Share your inspiration, placement preferences, or any studio notes."
                                            className="mt-2 w-full rounded-3xl border border-ink-border bg-ink-black/70 px-4 py-3 text-sm text-ink-cream outline-none transition focus:border-ink-crimson"
                                        />
                                    </label>
                                </div>

                                {error && (
                                    <p className="mt-4 rounded-3xl border border-red-700/40 bg-red-900/20 px-4 py-3 text-sm text-red-200">
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-ink-crimson px-6 py-4 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSubmitting ? "Booking appointment..." : "Book Appointment"}
                                </button>
                            </form>

                            <div className="rounded-[2rem] border border-red-900/30 bg-ink-surface p-8">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm uppercase tracking-[0.3em] text-ink-muted">Booking summary</p>
                                        <h2 className="mt-3 text-2xl font-semibold text-ink-cream">Order details</h2>
                                    </div>
                                    <span className="rounded-full border border-ink-border bg-ink-black/60 px-3 py-2 text-xs uppercase tracking-[0.24em] text-ink-muted">
                                        Ready to reserve
                                    </span>
                                </div>

                                <div className="mt-8 space-y-4">
                                    <div className="flex items-center justify-between rounded-3xl border border-ink-border bg-ink-black/60 px-5 py-4">
                                        <p className="text-sm text-ink-muted">Tattoo Price</p>
                                        <p className="text-sm font-semibold text-ink-cream">${price}</p>
                                    </div>
                                    <div className="flex items-center justify-between rounded-3xl border border-ink-border bg-ink-black/60 px-5 py-4">
                                        <p className="text-sm text-ink-muted">Estimated Session Duration</p>
                                        <p className="text-sm font-semibold text-ink-cream">{bookingDuration}</p>
                                    </div>
                                    <div className="flex items-center justify-between rounded-3xl border border-ink-border bg-ink-black/60 px-5 py-4">
                                        <p className="text-sm text-ink-muted">Deposit Required</p>
                                        <p className="text-sm font-semibold text-ink-cream">${deposit}</p>
                                    </div>
                                    <div className="rounded-[2rem] border border-red-900/30 bg-ink-black/70 px-5 py-5">
                                        <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">Total Price</p>
                                        <p className="mt-2 text-3xl font-semibold text-ink-cream">${price}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </RequireAuth>
    );
}
