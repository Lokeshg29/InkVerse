import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow next/image to load and optimize images from these
    // external sources. Without this, Next.js blocks external
    // image domains by default for security - you must explicitly
    // allow each one you use.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
      },
    ],
  },
};

export default nextConfig;
