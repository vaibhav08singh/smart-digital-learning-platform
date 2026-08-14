import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Anchor Turbopack to this project so it ignores stray files in parent dirs.
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // YouTube thumbnails used by the Resource Hub video search.
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
};

export default nextConfig;
