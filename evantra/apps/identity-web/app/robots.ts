import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const isWorkspace = process.env.EVANTRA_APP_SURFACE === "workspace";
  const baseUrl = isWorkspace
    ? "https://workspace.evantradebuckman.com"
    : "https://identity.evantradebuckman.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register", "/security", "/terms", "/workers"],
        disallow: ["/api/", "/oauth/authorize", "/oauth/consent"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
