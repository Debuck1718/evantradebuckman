import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(appRoot, "../..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: repoRoot,
  },
};

export default nextConfig;