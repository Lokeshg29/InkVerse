/**
 * ============================================================
 * src/lib/types.ts
 * ============================================================
 *
 * Shared TypeScript types for InkVerse's data shapes. These
 * intentionally MIRROR our backend Mongoose schemas (Tattoo,
 * Artist, Booking) from Phase 2, so that when we connect to the
 * real API in Phase 6, the data shape already matches - we just
 * swap the SOURCE of the data, not its shape.
 */

export const TATTOO_STYLES = [
  "All",
  "Traditional",
  "Anime",
  "Japanese",
  "Realism",
  "Tribal",
  "Geometric",
  "Minimalist",
  "Blackwork",
  "Watercolor",
] as const;

// TypeScript trick: deriving a TYPE from the array of VALUES above.
// This means TattooStyle can ONLY ever be one of those exact strings -
// if you typo "Tradtional" anywhere, TypeScript flags it immediately.
export type TattooStyle = (typeof TATTOO_STYLES)[number];

export interface Artist {
  id: string;
  name: string;
  bio: string;
  photoUrl: string;
  location: string;
  rating: number;
  specialties: string[];
  experienceYears: number;
}

export interface Tattoo {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  style: TattooStyle;
  price: number;
  artist: Pick<Artist, "id" | "name">; // only need id + name for display
  tags: string[];
}
