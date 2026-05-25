import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Suppress workspace root warning
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
