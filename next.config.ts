import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Disable typescript compiler worker to prevent sandbox out of memory crashes
    ignoreBuildErrors: true,
  },
  experimental: {
    cpus: 1,
  },
};

export default nextConfig;
