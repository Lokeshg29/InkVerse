"use client"

import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(name, email, password);
    } catch (err: any) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-3xl font-bold">Create account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col">
          <span className="text-sm text-ink-muted">Full name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 rounded-md border px-3 py-2"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-ink-muted">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="mt-1 rounded-md border px-3 py-2"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-ink-muted">Password</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            minLength={6}
            className="mt-1 rounded-md border px-3 py-2"
          />
        </label>

        {error && <div className="text-sm text-ink-crimson">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-md bg-ink-crimson px-4 py-2 text-white"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="mt-4 text-sm text-ink-muted">
          Already have an account?{' '}
          <Link href="/login" className="text-ink-cream underline transition-colors hover:text-white">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
