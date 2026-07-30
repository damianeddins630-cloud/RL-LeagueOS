import type { NextConfig } from "next";
import { join } from "node:path";

const nextConfig: NextConfig = {
  // Keep WASM replay parser external for Node.js serverless on Vercel
  serverExternalPackages: ["@rlrml/subtr-actor"],
  // Ensure the WASM binary is traced into the serverless function bundle on Vercel
  outputFileTracingIncludes: {
    "/*": ["./prisma/vercel.db"],
    "/api/**/*": [
      join("node_modules", "@rlrml", "subtr-actor", "**", "*"),
      "./prisma/vercel.db",
    ],
  },
};

export default nextConfig;
