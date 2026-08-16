import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(appRoot, "../..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only apply custom tracing root if not on Vercel, or scope it properly 
  // so Vercel's bundler doesn't look for package.json inside .next/
  outputFileTracingRoot: process.env.VERCEL ? appRoot : repoRoot,
  turbopack: {
    root: repoRoot,
  },
};

export default nextConfig;