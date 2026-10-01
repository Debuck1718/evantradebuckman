import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname, "../.."),
  },

  images: {
    // Showcase dashboard mockups are authored as vector SVG assets.
    // Allow them through the image optimizer with a strict CSP so the
    // SVGs cannot execute scripts when served from this origin.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;