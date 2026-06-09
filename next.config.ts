import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // three.js ships untranspiled ESM; let Next transpile it for the server build.
  transpilePackages: ["three"],
  // pin the tracing root to this project (a stray lockfile lives in $HOME)
  outputFileTracingRoot: __dirname,
};

export default nextConfig;

// enables Cloudflare bindings (and Upstash env vars) during `next dev`
initOpenNextCloudflareForDev();
