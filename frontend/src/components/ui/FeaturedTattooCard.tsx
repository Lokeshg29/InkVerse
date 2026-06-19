/**
 * ============================================================
 * src/components/ui/FeaturedTattooCard.tsx
 * ============================================================
 *
 * A photo card styled like a camera viewfinder - corner brackets,
 * a "REC" recording indicator, fake coordinates, and a caption.
 * Purely decorative/atmospheric for the homepage hero.
 */

import Image from "next/image";

export default function FeaturedTattooCard({
  imageUrl,
  title,
  subtitle,
}: {
  imageUrl: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="group relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg border border-ink-border">
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        sizes="(max-width: 768px) 100vw, 400px"
      />

      {/* Dark gradient at the bottom so caption text stays readable
          over a busy photo background */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      {/* Corner brackets - four small L-shaped marks, viewfinder style */}
      <span className="absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-ink-cyan" />
      <span className="absolute right-3 top-3 h-4 w-4 border-r-2 border-t-2 border-ink-cyan" />
      <span className="absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-ink-cyan" />
      <span className="absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-ink-cyan" />

      {/* Top-left: REC indicator with a softly pulsing dot */}
      <div className="absolute left-3 top-6 flex items-center gap-1.5 pl-1 text-[10px] tracking-widest text-ink-cyan">
        <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-ink-crimson-bright" />
        REC
      </div>

      {/* Bottom: caption */}
      <div className="absolute bottom-6 left-6 right-6">
        <p className="font-display text-lg">{title}</p>
        <p className="mt-1 text-[11px] uppercase tracking-wide text-ink-muted">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
