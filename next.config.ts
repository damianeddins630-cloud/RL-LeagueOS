import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep WASM replay parser external for Node.js serverless on Vercel
  serverExternalPackages: ["@rlrml/subtr-actor"],
};

export default nextConfig;
