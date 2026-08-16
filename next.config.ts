import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack requires native bindings unavailable on this platform (WASM only).
  devIndicators: false,
};

export default nextConfig;
