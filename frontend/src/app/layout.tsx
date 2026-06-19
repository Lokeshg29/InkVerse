import type { Metadata } from "next";
import { Archivo_Black, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/**
 * Three fonts, three jobs:
 * - Archivo Black: heavy, bold display font for big headlines
 *   like "The Gallery" or the scrolling marquee text.
 * - Inter: clean, highly readable font for body text, nav links,
 *   buttons - anything functional.
 * - Playfair Display (italic): elegant serif for the tagline
 *   "Where every tattoo tells a story".
 *
 * next/font/google downloads these at BUILD time and self-hosts
 * them - no external request to Google's servers when a real user
 * visits your site, which is faster and more private than a normal
 * <link> tag to Google Fonts.
 */
const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  style: ["italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InkVerse — Where Every Tattoo Tells a Story",
  description:
    "An AI-powered tattoo discovery and studio booking platform. Browse designs, discover artists, and book your next tattoo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivoBlack.variable} ${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink-black text-ink-cream">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
