import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve /public images as-is (they're already web-sized).
    // Re-enable optimization later if needed.
    unoptimized: true,
  },
};

export default nextConfig;
