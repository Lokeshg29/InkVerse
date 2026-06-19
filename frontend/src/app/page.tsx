import Marquee from "@/components/ui/Marquee";
import StatBadge from "@/components/ui/StatBadge";
import FeaturedTattooCard from "@/components/ui/FeaturedTattooCard";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero section */}
      <section className="bg-mesh px-6 py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          {/* Left: the multi-style headline */}
          <div className="animate-fade-in-up">
            <p className="text-xs tracking-[0.3em] text-ink-muted">
              VOL. 01 · ISSUE 002 · EST. 2025
            </p>

            <h1 className="mt-6 flex flex-col font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl">
              <span className="text-outline">EVERY</span>
              <span className="font-tagline text-gradient-shift italic">
                tattoo
              </span>
              <span className="text-ink-crimson-bright text-glow-crimson">
                tells a
              </span>
              <span className="text-ink-cream text-glow-cream">STORY.</span>
            </h1>

            <p className="mt-8 max-w-md text-ink-muted">
              A futurist atlas of ink, makers and AI-curated direction.
              Discover signature designs, book elite artists, and let our
              model translate your story into permanent art.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/gallery"
                className="rounded-md bg-ink-cream px-6 py-3 text-sm font-semibold tracking-wide text-ink-black transition-all hover:-translate-y-0.5 hover:bg-ink-cream/90 hover:shadow-lg hover:shadow-ink-cream/10"
              >
                Enter the atlas →
              </Link>
              <Link
                href="/ai-match"
                className="rounded-md border border-ink-crimson px-6 py-3 text-sm font-semibold tracking-wide text-ink-crimson-bright transition-all hover:-translate-y-0.5 hover:bg-ink-crimson/10 hover:shadow-lg hover:shadow-ink-crimson/20"
              >
                ✦ AI match
              </Link>
            </div>

            {/* Stats row */}
            <div className="mt-12 flex flex-wrap gap-10 border-t border-ink-border pt-8">
              <StatBadge value="12,480" label="DESIGNS" />
              <StatBadge value="320+" label="ARTISTS" />
              <StatBadge value="98%" label="MATCH RATE" />
            </div>
          </div>

          {/* Right: featured tattoo viewfinder card */}
          <div className="flex animate-fade-in-up justify-center [animation-delay:150ms] lg:justify-end">
            <FeaturedTattooCard
              imageUrl="https://images.unsplash.com/photo-1501939387519-cf9c35d4f4eb?w=600"
              title="Crimson Dragon"
              subtitle="Bold linework · Forearm"
            />
          </div>
        </div>
      </section>

      {/* Scrolling marquee banner */}
      <Marquee
        words={[
          "CYBER-SIGIL",
          "SURREALISM",
          "NEO-TRADITIONAL",
          "JAPANESE IREZUMI",
          "BLACKWORK",
          "FINELINE",
        ]}
      />

      {/* Three-up feature row */}
      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-24 sm:grid-cols-3">
        <FeatureCard
          title="Curated gallery"
          description="Browse designs from independent artists worldwide, filtered by style."
        />
        <FeatureCard
          title="Vetted artists"
          description="Every artist is reviewed for craft, reputation, and consistency."
        />
        <FeatureCard
          title="AI-guided matching"
          description="Describe what you want; let AI point you to the right design and artist."
        />
      </section>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-t border-ink-border pt-6">
      <h3 className="font-display text-lg">{title}</h3>
      <p className="mt-2 text-sm text-ink-muted">{description}</p>
    </div>
  );
}
